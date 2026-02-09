'use client';

import { useState } from 'react';
import { Zap, Plus } from 'lucide-react';
import { Task, TaskProject, TaskPriority } from '../types/task';
import { PROJECT_META, PRIORITY_META } from '../types/task';

/**
 * QuickCapture - Fast task input form
 *
 * ADHD-optimized: Minimal friction, fast capture
 * - Auto-focus on title input
 * - Smart defaults (medium priority, personal project, todo status)
 * - Keyboard shortcuts (Enter to submit)
 * - Clear immediately after submit
 * - Optional due date (not required)
 *
 * Future enhancements (Phase 3):
 * - Natural language parsing ("Buy milk tomorrow at 3pm")
 * - Voice input
 * - Global keyboard shortcut (Cmd+K to open)
 */

interface QuickCaptureProps {
  onTaskCreated: (task: Task) => void;
}

export default function QuickCapture({ onTaskCreated }: QuickCaptureProps) {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState<TaskProject>('personal');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return; // Don't submit empty tasks
    }

    setIsSubmitting(true);

    try {
      // Import taskService dynamically to avoid SSR issues
      const { taskService } = await import('../services/taskService');

      const task = await taskService.createTask({
        title: title.trim(),
        project,
        priority,
        status: 'todo',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        focusedToday: false, // Default: not focused
      });

      onTaskCreated(task);

      // Clear form
      setTitle('');
      setDueDate('');
      // Keep project and priority (likely to create similar tasks)
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        Quick Add Task
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title Input - Auto-focus, most important */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          {/* Compact Options Row */}
          <div className="flex flex-wrap gap-3">
            {/* Project Select */}
            <div className="flex-1 min-w-[150px]">
              <select
                value={project}
                onChange={(e) => setProject(e.target.value as TaskProject)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {Object.entries(PROJECT_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.emoji} {meta.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div className="flex-1 min-w-[120px]">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {Object.entries(PRIORITY_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.emoji} {meta.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="flex-1 min-w-[150px]">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
      </form>

      {/* Character count hint */}
      {title.length > 150 && (
        <p className="text-sm text-gray-500 mt-2">
          {200 - title.length} characters remaining
        </p>
      )}
    </div>
  );
}
