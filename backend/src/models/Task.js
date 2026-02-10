import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

/**
 * Task Model - PostgreSQL + Prisma
 *
 * Day 8 Upgrade - PostgreSQL Database Persistence
 * - Prisma ORM for type-safe database operations
 * - PostgreSQL for production-ready data storage
 * - Schema matches frontend types/task.ts precisely
 * - Zod validation for request/response
 * - Full ACID compliance and proper transactions
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
 * PostgreSQL Task Storage via Prisma
 * - Production-ready database persistence
 * - Type-safe queries with Prisma Client
 * - Automatic timestamps (createdAt, updatedAt)
 * - ACID transactions and data integrity
 */
class TaskModel {
  constructor() {
    this.prisma = new PrismaClient();
    this.isInitialized = false;
  }

  /**
   * Initialize the model (ensure database connection)
   * Call this once on server startup
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Test database connection
      await this.prisma.$connect();
      console.log('[TaskModel] Connected to PostgreSQL database');
      this.isInitialized = true;

      // Initialize seed data if empty (development only)
      const count = await this.prisma.task.count();
      if (count === 0 && process.env.NODE_ENV !== 'test') {
        await this._initializeSeedData();
      }
    } catch (error) {
      console.error('[TaskModel] Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database (cleanup)
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }

  /**
   * Create a new task
   * @param {Object} taskData - Validated task data
   * @returns {Promise<Object>} Created task with id, createdAt, updatedAt
   */
  async create(taskData) {
    const task = await this.prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || null,
        project: taskData.project,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        focusedToday: taskData.focusedToday
      }
    });

    // Convert dates to ISO strings for API consistency
    return this._formatTask(task);
  }

  /**
   * Get all tasks, sorted by creation date (newest first)
   * @returns {Promise<Array>} All tasks
   */
  async findAll() {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return tasks.map(task => this._formatTask(task));
  }

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>} Task or null if not found
   */
  async findById(id) {
    const task = await this.prisma.task.findUnique({
      where: { id }
    });

    return task ? this._formatTask(task) : null;
  }

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated task or null if not found
   */
  async update(id, updates) {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: {
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.project !== undefined && { project: updates.project }),
          ...(updates.priority !== undefined && { priority: updates.priority }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.dueDate !== undefined && {
            dueDate: updates.dueDate ? new Date(updates.dueDate) : null
          }),
          ...(updates.focusedToday !== undefined && { focusedToday: updates.focusedToday })
        }
      });

      return this._formatTask(task);
    } catch (error) {
      // Prisma throws if record not found
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>} Deleted task or null if not found
   */
  async delete(id) {
    try {
      const task = await this.prisma.task.delete({
        where: { id }
      });

      return this._formatTask(task);
    } catch (error) {
      // Prisma throws if record not found
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Clear all tasks (for testing)
   */
  async clear() {
    await this.prisma.task.deleteMany();
  }

  /**
   * Get task count (for testing)
   */
  async count() {
    return await this.prisma.task.count();
  }

  /**
   * Format task for API response
   * Convert Date objects to ISO strings
   * @private
   */
  _formatTask(task) {
    return {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : null
    };
  }

  /**
   * Initialize seed data for development and testing
   */
  async _initializeSeedData() {
    await this.clear();

    // Seed Task 1: Development task
    await this.create({
      title: 'Build REST API endpoints',
      project: 'development',
      priority: 'high',
      status: 'done',
      focusedToday: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 2: Database persistence
    await this.create({
      title: 'Migrate to PostgreSQL + Prisma',
      project: 'development',
      priority: 'high',
      status: 'in-progress',
      focusedToday: true,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Seed Task 3: Learning task
    await this.create({
      title: 'Complete bootcamp Day 8',
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
