import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { CreateTaskSchema, UpdateTaskSchema } from '../utils/validation';

/**
 * TaskService - Data layer abstraction
 *
 * ADR #1: Data Layer Abstraction
 * Decision: Create a service class that abstracts storage implementation
 * Why: Easy to swap localStorage → API later without changing UI code
 * Phase 1: Uses localStorage ✅ (Days 5-6)
 * Phase 2: Uses REST API ✅ (Day 7) ← WE ARE HERE
 * Phase 3: Will add PostgreSQL (Day 8)
 *
 * Security considerations:
 * - Input validation using Zod schemas
 * - Backend validates all requests
 * - Future: JWT authentication + authorization
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;

class TaskService {
  /**
   * Handle API errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.data || data;
  }

  /**
   * Convert API date strings to Date objects
   */
  private parseTask(task: any): Task {
    return {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    };
  }

  /**
   * Get all tasks from API
   */
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(API_TASKS_ENDPOINT);
      const tasks = await this.handleResponse<any[]>(response);
      return tasks.map(task => this.parseTask(task));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    try {
      const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`);
      if (response.status === 404) return null;
      const task = await this.handleResponse<any>(response);
      return this.parseTask(task);
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    // Validate input client-side
    const validated = CreateTaskSchema.parse(input);

    try {
      const response = await fetch(API_TASKS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      });

      const task = await this.handleResponse<any>(response);
      return this.parseTask(task);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updates: Partial<UpdateTaskInput>): Promise<Task> {
    // Validate updates client-side
    const validated = UpdateTaskSchema.parse(updates);

    try {
      const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      });

      const task = await this.handleResponse<any>(response);
      return this.parseTask(task);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });

      await this.handleResponse<any>(response);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
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
   * Get tasks focused for today (client-side filter)
   */
  async getTodaysTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.focusedToday && task.status !== 'done');
  }

  /**
   * Get tasks by project (client-side filter)
   */
  async getTasksByProject(project: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.project === project);
  }
}

// Export singleton instance
export const taskService = new TaskService();
