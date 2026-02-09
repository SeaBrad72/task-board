/**
 * Integration Tests - Full User Flows
 *
 * These tests verify complete user workflows without mocking.
 * They test the actual behavior users experience.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

describe('Task Board Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock window.confirm to always return true
    global.confirm = jest.fn(() => true);
  });

  describe('Complete Task Workflow', () => {
    it('should allow user to create, view, focus, and complete a task', async () => {
      const user = userEvent.setup();

      // ARRANGE: Render the app
      render(<Home />);

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByText('Task Board')).toBeInTheDocument();
      });

      // ACT: Create a new task
      const taskInput = screen.getByPlaceholderText('What needs to be done?');
      await user.type(taskInput, 'Write integration tests');

      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      // ASSERT: Task appears in the task list
      await waitFor(() => {
        expect(screen.getByText('Write integration tests')).toBeInTheDocument();
      });

      // ACT: Add task to Today's Focus
      const addToTodayButton = screen.getByRole('button', { name: /add to today/i });
      await user.click(addToTodayButton);

      // ASSERT: Task appears in Today's Focus section
      await waitFor(() => {
        // Verify Today's Focus header shows 1 task
        expect(screen.getByText(/Today's Focus/i)).toBeInTheDocument();
        // Task should still be visible with "Today" badge
        expect(screen.getByText('Today')).toBeInTheDocument();
      });

      // ACT & ASSERT: Toggle status through todo → in-progress → done
      // Get status button (may appear multiple times if in focus and all tasks)
      const statusButtons = screen.getAllByRole('button', { name: /mark in-progress/i });
      await user.click(statusButtons[0]);

      // Verify task is now in-progress
      await waitFor(() => {
        const savedData = localStorage.getItem('task-board-tasks');
        const tasks = JSON.parse(savedData!);
        expect(tasks[0].status).toBe('in-progress');
      });

      // Click again to mark as done
      const markDoneButtons = screen.getAllByRole('button', { name: /mark done/i });
      await user.click(markDoneButtons[0]);

      // ASSERT: Task persists in localStorage
      const savedData = localStorage.getItem('task-board-tasks');
      expect(savedData).toBeTruthy();
      const tasks = JSON.parse(savedData!);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Write integration tests');
      expect(tasks[0].status).toBe('done');
    });

    it('should allow user to delete a task', async () => {
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Task Board')).toBeInTheDocument();
      });

      // Create a task
      const taskInput = screen.getByPlaceholderText('What needs to be done?');
      await user.type(taskInput, 'Task to delete');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Verify task exists
      await waitFor(() => {
        expect(screen.getByText('Task to delete')).toBeInTheDocument();
      });

      // Delete the task
      const deleteButton = screen.getByRole('button', { name: /delete task/i });
      await user.click(deleteButton);

      // Verify task is gone
      await waitFor(() => {
        expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
      });
    });

    it('should validate task creation (empty title)', async () => {
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Task Board')).toBeInTheDocument();
      });

      // Try to submit empty task
      const addButton = screen.getByRole('button', { name: /add task/i });

      // Button should be disabled when empty
      expect(addButton).toBeDisabled();

      // Type and delete to test validation
      const taskInput = screen.getByPlaceholderText('What needs to be done?');
      await user.type(taskInput, 'Test');
      expect(addButton).not.toBeDisabled();

      await user.clear(taskInput);
      expect(addButton).toBeDisabled();
    });
  });

  describe('Data Persistence', () => {
    it('should load tasks from localStorage on mount', async () => {
      // Pre-populate localStorage
      const existingTasks = [
        {
          id: 'test-1',
          title: 'Existing Task',
          project: 'development',
          priority: 'high',
          status: 'todo',
          focusedToday: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('task-board-tasks', JSON.stringify(existingTasks));

      // Render the app
      render(<Home />);

      // Verify task loads from localStorage
      await waitFor(() => {
        expect(screen.getByText('Existing Task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Filtering and Sorting', () => {
    it('should create and display tasks in project groups', async () => {
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Task Board')).toBeInTheDocument();
      });

      // Create a task (will use default project: development)
      const taskInput = screen.getByPlaceholderText('What needs to be done?');
      await user.type(taskInput, 'Dev Task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Verify task appears in project group
      await waitFor(() => {
        expect(screen.getByText('Dev Task')).toBeInTheDocument();
        // Verify it's grouped under Development project
        expect(screen.getByText('💻 Development')).toBeInTheDocument();
      });
    });
  });
});
