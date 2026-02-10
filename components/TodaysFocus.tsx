'use client';

import { Target, CheckCircle2, Circle, Calendar, X } from 'lucide-react';
import { Task } from '../types/task';
import { PRIORITY_META, STATUS_META } from '../types/task';
import { format } from 'date-fns';

/**
 * TodaysFocus - Display tasks marked for today
 *
 * Core workflow:
 * 1. Morning: Review all tasks
 * 2. Drag/click tasks into "Today's Focus"
 * 3. Work through today's list
 * 4. Mark complete as you go
 *
 * Features:
 * - Shows only focusedToday tasks
 * - Sorted by priority (high → low)
 * - Quick mark done
 * - Remove from today
 * - Count of today's tasks
 *
 * Future enhancements:
 * - Drag & drop reordering
 * - Time estimates
 * - Progress bar (X of Y done)
 * - Completion celebration 🎉
 */

interface TodaysFocusProps {
  tasks: Task[];
  onToggleStatus: (id: string, status: Task['status']) => void;
  onRemoveFromToday: (id: string) => void;
}

export default function TodaysFocus({
  tasks,
  onToggleStatus,
  onRemoveFromToday,
}: TodaysFocusProps) {
  // Filter and sort today's tasks
  const todaysTasks = tasks
    .filter(task => task.focusedToday && task.status !== 'done')
    .sort((a, b) => {
      // Sort by priority: urgent → high → medium → low
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const completedToday = tasks.filter(
    task => task.focusedToday && task.status === 'done'
  ).length;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-7 h-7 text-blue-600" />
          Today's Focus
          <span className="text-sm font-normal text-gray-600">
            ({todaysTasks.length} {todaysTasks.length === 1 ? 'task' : 'tasks'})
          </span>
        </h2>

        {completedToday > 0 && (
          <div className="text-sm text-green-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {completedToday} completed today
          </div>
        )}
      </div>

      {todaysTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No tasks focused for today</p>
          <p className="text-sm">
            Add tasks to "Today's Focus" to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {todaysTasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow"
              style={{
                borderLeftColor:
                  task.priority === 'high'
                    ? '#DC2626'
                    : task.priority === 'medium'
                    ? '#F59E0B'
                    : '#10B981',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() =>
                    onToggleStatus(
                      task.id,
                      task.status === 'todo' ? 'in-progress' : 'done'
                    )
                  }
                  className="mt-1 hover:scale-110 transition-transform"
                  title={task.status === 'todo' ? 'Start task' : 'Mark done'}
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : task.status === 'in-progress' ? (
                    <Circle className="w-6 h-6 text-blue-600 fill-blue-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                <div className="flex-1">
                  {/* Title */}
                  <h3 className="font-medium text-lg mb-1">{task.title}</h3>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className={PRIORITY_META[task.priority].color}>
                      {PRIORITY_META[task.priority].label}
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(task.dueDate, 'MMM d')}
                      </span>
                    )}

                    {task.status === 'in-progress' && (
                      <span className="text-blue-600 font-medium">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove from Today button */}
                <button
                  onClick={() => onRemoveFromToday(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from today"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
