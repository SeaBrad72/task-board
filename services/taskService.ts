import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { CreateTaskSchema, UpdateTaskSchema } from '../utils/validation';

/**
 * TaskService - Data layer abstraction
 *
 * ADR #1: Data Layer Abstraction
 * Decision: Create a service class that abstracts storage implementation
 * Why: Easy to swap localStorage → API later without changing UI code
 * Phase 1: Uses localStorage
 * Phase 2: Will swap to fetch() calls to backend API
 *
 * Security considerations:
 * - Input validation using Zod schemas
 * - localStorage is NOT encrypted (no sensitive data)
 * - Phase 2 will add proper auth + backend security
 */

const STORAGE_KEY = 'task-board-tasks';

class TaskService {
  /**
   * Get all tasks from localStorage
   */
  async getTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Convert date strings back to Date objects
      return parsed.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    // Validate input
    const validated = CreateTaskSchema.parse(input);

    const task: Task = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);

    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updates: Partial<UpdateTaskInput>): Promise<Task> {
    // Validate updates
    const validated = UpdateTaskSchema.parse(updates);

    const tasks = await this.getTasks();
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    tasks[index] = {
      ...tasks[index],
      ...validated,
      updatedAt: new Date(),
    };

    await this.saveTasks(tasks);
    return tasks[index];
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(task => task.id !== id);

    if (filtered.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`);
    }

    await this.saveTasks(filtered);
  }

  /**
   * Toggle task's "focusedToday" status
   */
  async toggleFocusToday(id: string): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return this.updateTask(id, { focusedToday: !task.focusedToday });
  }

  /**
   * Get tasks focused for today
   */
  async getTodaysTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.focusedToday && task.status !== 'done');
  }

  /**
   * Get tasks by project
   */
  async getTasksByProject(project: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.project === project);
  }

  /**
   * Private: Save tasks to localStorage
   */
  private async saveTasks(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  }
}

// Export singleton instance
export const taskService = new TaskService();
