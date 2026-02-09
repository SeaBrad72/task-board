'use client';

import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { Task } from '../types/task';
import QuickCapture from '../components/QuickCapture';
import TodaysFocus from '../components/TodaysFocus';
import TaskList from '../components/TaskList';

/**
 * Main Task Board Application
 *
 * React Concepts Demonstrated:
 * - useState: Managing component state (tasks, loading)
 * - useEffect: Side effects (loading tasks from localStorage)
 * - Component composition: QuickCapture, TodaysFocus, TaskList
 * - Props drilling: Passing data and callbacks to children
 * - Event handlers: onTaskCreated, onToggleStatus, etc.
 *
 * State Management:
 * - All state lives here (single source of truth)
 * - Children receive data via props
 * - Children notify parent via callback props
 * - Parent updates state, React re-renders children
 *
 * Data Flow:
 * 1. Load tasks from localStorage on mount
 * 2. Pass tasks to child components
 * 3. Children call callbacks (onAddToToday, etc.)
 * 4. Parent updates state
 * 5. React re-renders with new data
 * 6. Changes persist to localStorage
 *
 * Phase 2 changes:
 * - Swap taskService.getTasks() to fetch('/api/tasks')
 * - No other changes needed (data layer abstraction!)
 */

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const { taskService } = await import('../services/taskService');
      const loadedTasks = await taskService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handler: Task created
  function handleTaskCreated(task: Task) {
    setTasks(prev => [...prev, task]);
  }

  // Handler: Toggle task status
  async function handleToggleStatus(id: string, status: Task['status']) {
    try {
      const { taskService } = await import('../services/taskService');
      await taskService.updateTask(id, { status });
      await loadTasks(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  }

  // Handler: Add task to Today's Focus
  async function handleAddToToday(id: string) {
    try {
      const { taskService } = await import('../services/taskService');
      await taskService.toggleFocusToday(id);
      await loadTasks();
    } catch (error) {
      console.error('Error adding to today:', error);
      alert('Failed to add task to today');
    }
  }

  // Handler: Remove task from Today's Focus
  async function handleRemoveFromToday(id: string) {
    try {
      const { taskService } = await import('../services/taskService');
      await taskService.toggleFocusToday(id);
      await loadTasks();
    } catch (error) {
      console.error('Error removing from today:', error);
      alert('Failed to remove task from today');
    }
  }

  // Handler: Delete task
  async function handleDeleteTask(id: string) {
    try {
      const { taskService } = await import('../services/taskService');
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            Task Board
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Fast task management for focused work
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Capture - Always at top */}
        <QuickCapture onTaskCreated={handleTaskCreated} />

        {/* Today's Focus - Primary workflow */}
        <TodaysFocus
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onRemoveFromToday={handleRemoveFromToday}
        />

        {/* All Tasks - Grouped by project */}
        <TaskList
          tasks={tasks}
          onAddToToday={handleAddToToday}
          onToggleStatus={handleToggleStatus}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t">
        <p>Task Board v1.0 - Phase 1 (localStorage)</p>
        <p className="text-xs mt-1">
          Built with Next.js, React, TypeScript, Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
