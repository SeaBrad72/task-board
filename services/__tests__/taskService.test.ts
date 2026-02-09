/**
 * Unit tests for taskService
 *
 * Testing localStorage operations:
 * - getTasks: Load tasks from localStorage
 * - createTask: Create and save new task
 * - updateTask: Update existing task
 * - deleteTask: Remove task
 * - toggleFocusToday: Toggle focusedToday flag
 */

import { taskService } from '../taskService';
import { Task } from '../../types/task';

describe('TaskService', () => {
  // Create a fresh mock storage object for each test
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset storage
    mockStorage = {};

    // Mock localStorage methods
    Storage.prototype.getItem = jest.fn((key: string) => mockStorage[key] || null);
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
    });
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete mockStorage[key];
    });
    Storage.prototype.clear = jest.fn(() => {
      mockStorage = {};
    });
  });

  describe('getTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await taskService.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should load tasks from localStorage', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(mockTasks);

      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Test Task');
    });

    it('should handle invalid JSON in localStorage', async () => {
      mockStorage['task-board-tasks'] = 'invalid json';

      const tasks = await taskService.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should parse dates correctly', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          dueDate: '2024-12-25T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(mockTasks);

      const tasks = await taskService.getTasks();
      expect(tasks[0].dueDate).toBeInstanceOf(Date);
      expect(tasks[0].createdAt).toBeInstanceOf(Date);
    });
  });

  describe('createTask', () => {
    it('should create a new task with valid input', async () => {
      const input = {
        title: 'New Task',
        project: 'development' as const,
        priority: 'medium' as const,
        status: 'todo' as const,
        focusedToday: false,
      };

      const task = await taskService.createTask(input);

      expect(task.id).toBeDefined();
      expect(task.title).toBe('New Task');
      expect(task.project).toBe('development');
      expect(mockStorage['task-board-tasks']).toBeDefined();
    });

    it('should trim whitespace from title', async () => {
      const input = {
        title: '  Whitespace Task  ',
        project: 'business' as const,
        priority: 'low' as const,
        status: 'todo' as const,
        focusedToday: false,
      };

      const task = await taskService.createTask(input);
      expect(task.title).toBe('Whitespace Task');
    });

    it('should validate input and reject invalid data', async () => {
      const invalidInput = {
        title: '', // Empty title should fail
        project: 'development' as const,
        priority: 'medium' as const,
        status: 'todo' as const,
        focusedToday: false,
      };

      await expect(taskService.createTask(invalidInput)).rejects.toThrow();
    });

    it('should handle optional dueDate', async () => {
      const input = {
        title: 'Task with due date',
        project: 'personal' as const,
        priority: 'high' as const,
        status: 'todo' as const,
        focusedToday: false,
        dueDate: new Date('2024-12-25'),
      };

      const task = await taskService.createTask(input);
      expect(task.dueDate).toBeInstanceOf(Date);
    });
  });

  describe('updateTask', () => {
    it('should update task status', async () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Test Task',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(existingTasks);

      const updated = await taskService.updateTask('1', { status: 'done' });

      expect(updated.status).toBe('done');
    });

    it('should throw error for non-existent task', async () => {
      await expect(
        taskService.updateTask('non-existent', { status: 'done' })
      ).rejects.toThrow('Task with id non-existent not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Task 1',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Task 2',
          project: 'business',
          priority: 'medium',
          status: 'todo',
          focusedToday: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(existingTasks);

      await taskService.deleteTask('1');

      const savedTasks = JSON.parse(mockStorage['task-board-tasks']);
      expect(savedTasks).toHaveLength(1);
      expect(savedTasks[0].id).toBe('2');
    });
  });

  describe('toggleFocusToday', () => {
    it('should toggle focusedToday from false to true', async () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Test Task',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(existingTasks);

      const updated = await taskService.toggleFocusToday('1');

      expect(updated.focusedToday).toBe(true);
    });

    it('should toggle focusedToday from true to false', async () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Test Task',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockStorage['task-board-tasks'] = JSON.stringify(existingTasks);

      const updated = await taskService.toggleFocusToday('1');

      expect(updated.focusedToday).toBe(false);
    });
  });
});
