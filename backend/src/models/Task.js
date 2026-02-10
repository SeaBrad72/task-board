import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Task Model - Matches Frontend Schema Exactly
 *
 * Day 8 - File-Based Persistence
 * - JSON file storage for data persistence across restarts
 * - Async operations matching database patterns
 * - Schema matches frontend types/task.ts precisely
 * - Zod validation for request/response
 * - Migration path to PostgreSQL/Prisma ready
 */

// Zod validation schema - matches frontend TaskProject, TaskPriority, TaskStatus
export const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().optional(),
  project: z.enum(['development', 'business', 'personal', 'learning', 'fitness']).default('personal'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  dueDate: z.string().datetime().optional().nullable(),
  focusedToday: z.boolean().default(false)
});

// Schema for partial updates (all fields optional)
export const TaskUpdateSchema = TaskSchema.partial();

/**
 * File-Based Task Storage
 * - Day 8: JSON file persistence
 * - Async operations (matches database pattern)
 * - Easy migration to PostgreSQL later
 */
class TaskModel {
  constructor() {
    this.tasks = new Map();
    this.dataFile = path.join(__dirname, '../../data/tasks.json');
    this.isInitialized = false;
  }

  /**
   * Load tasks from file on startup
   * @private
   */
  async _loadFromFile() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dataFile);
      await fs.mkdir(dataDir, { recursive: true });

      // Try to read existing file
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const tasks = JSON.parse(data);

      // Populate Map from loaded data
      this.tasks.clear();
      tasks.forEach(task => {
        this.tasks.set(task.id, task);
      });

      console.log(`[TaskModel] Loaded ${tasks.length} tasks from ${this.dataFile}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet - that's fine
        console.log('[TaskModel] No existing data file, starting fresh');
      } else {
        console.error('[TaskModel] Error loading data:', error);
      }
    }
  }

  /**
   * Save tasks to file after every change
   * @private
   */
  async _saveToFile() {
    try {
      const tasks = Array.from(this.tasks.values());
      await fs.writeFile(this.dataFile, JSON.stringify(tasks, null, 2), 'utf-8');
    } catch (error) {
      console.error('[TaskModel] Error saving data:', error);
      throw new Error('Failed to persist task data');
    }
  }

  /**
   * Initialize the model (load from file)
   * Call this once on server startup
   */
  async initialize() {
    if (this.isInitialized) return;

    await this._loadFromFile();
    this.isInitialized = true;

    // Initialize seed data if empty (development only)
    if (this.tasks.size === 0 && process.env.NODE_ENV !== 'test') {
      await this._initializeSeedData();
    }
  }

  /**
   * Create a new task
   * @param {Object} taskData - Validated task data
   * @returns {Promise<Object>} Created task with id, createdAt, updatedAt
   */
  async create(taskData) {
    const task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(task.id, task);
    await this._saveToFile();
    return task;
  }

  /**
   * Get all tasks, sorted by creation date (newest first)
   * @returns {Promise<Array>} All tasks
   */
  async findAll() {
    return Array.from(this.tasks.values()).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>} Task or null if not found
   */
  async findById(id) {
    return this.tasks.get(id) || null;
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated task or null if not found
   */
  async update(id, updates) {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = {
      ...task,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: task.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString()
    };

    this.tasks.set(id, updatedTask);
    await this._saveToFile();
    return updatedTask;
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>} Deleted task or null if not found
   */
  async delete(id) {
    const task = this.tasks.get(id);
    if (!task) return null;

    this.tasks.delete(id);
    await this._saveToFile();
    return task;
  }

  /**
   * Clear all tasks (for testing)
   */
  async clear() {
    this.tasks.clear();
    await this._saveToFile();
  }

  /**
   * Get task count (for testing)
   */
  count() {
    return this.tasks.size;
  }

  /**
   * Initialize seed data for development and testing
   */
  async _initializeSeedData() {
    await this.clear();

    // Seed Task 1: Development task
    await this.create({
      title: 'Build REST API endpoints',
      description: 'Implement GET, POST, PUT, DELETE endpoints for tasks',
      project: 'development',
      priority: 'high',
      status: 'done',
      focusedToday: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 2: Add file persistence
    await this.create({
      title: 'Add file-based persistence',
      description: 'Implement JSON file storage for task data',
      project: 'development',
      priority: 'high',
      status: 'in-progress',
      focusedToday: true,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 3: Learning task
    await this.create({
      title: 'Complete bootcamp Day 8',
      description: 'Database persistence with async patterns',
      project: 'learning',
      priority: 'urgent',
      status: 'in-progress',
      focusedToday: true,
      dueDate: null
    });

    console.log('[TaskModel] Initialized with 3 seed tasks');
  }
}

// Export singleton instance
export const taskModel = new TaskModel();
