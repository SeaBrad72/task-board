import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

/**
 * Task Model - Matches Frontend Schema Exactly
 *
 * Day 7 - REST API Backend
 * - In-memory storage (Day 8 will add PostgreSQL)
 * - Schema matches frontend types/task.ts precisely
 * - Zod validation for request/response
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
 * In-Memory Task Storage
 * - Day 7: Uses Map for fast lookups
 * - Day 8: Will replace with PostgreSQL + Prisma
 */
class TaskModel {
  constructor() {
    this.tasks = new Map();
  }

  /**
   * Create a new task
   * @param {Object} taskData - Validated task data
   * @returns {Object} Created task with id, createdAt, updatedAt
   */
  create(taskData) {
    const task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Get all tasks, sorted by creation date (newest first)
   * @returns {Array} All tasks
   */
  findAll() {
    return Array.from(this.tasks.values()).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {Object|null} Task or null if not found
   */
  findById(id) {
    return this.tasks.get(id) || null;
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated task or null if not found
   */
  update(id, updates) {
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
    return updatedTask;
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Object|null} Deleted task or null if not found
   */
  delete(id) {
    const task = this.tasks.get(id);
    if (!task) return null;

    this.tasks.delete(id);
    return task;
  }

  /**
   * Clear all tasks (for testing)
   */
  clear() {
    this.tasks.clear();
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
  _initializeSeedData() {
    this.clear();

    // Seed Task 1: Development task
    this.create({
      title: 'Build REST API endpoints',
      description: 'Implement GET, POST, PUT, DELETE endpoints for tasks',
      project: 'development',
      priority: 'high',
      status: 'in-progress',
      focusedToday: true,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 2: Business task
    this.create({
      title: 'Review quarterly metrics',
      description: 'Analyze Q1 performance and prepare report',
      project: 'business',
      priority: 'medium',
      status: 'todo',
      focusedToday: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 3: Learning task
    this.create({
      title: 'Complete bootcamp Day 7',
      description: 'REST API + JSON with 90%+ test coverage',
      project: 'learning',
      priority: 'urgent',
      status: 'in-progress',
      focusedToday: true,
      dueDate: null
    });
  }
}

// Export singleton instance
export const taskModel = new TaskModel();

// Initialize with seed data for development
if (process.env.NODE_ENV !== 'test') {
  taskModel._initializeSeedData();
}
