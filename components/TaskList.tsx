'use client';

import { ListTodo, CheckCircle2, Circle, Calendar, Target, Trash2, Plus } from 'lucide-react';
import { Task, TaskProject } from '../types/task';
import { PROJECT_META, PRIORITY_META, STATUS_META } from '../types/task';
import { format } from 'date-fns';

/**
 * TaskList - Display all tasks grouped by project
 *
 * Features:
 * - Group tasks by project (Development, Business, Personal, Learning)
 * - Show task count per project
 * - Quick "Add to Today" button
 * - Status toggle (todo → in-progress → done)
 * - Delete task
 * - Collapsible project sections
 *
 * Future enhancements:
 * - Drag & drop between projects
 * - Inline editing
 * - Bulk actions
 * - Archive completed tasks
 */

interface TaskListProps {
  tasks: Task[];
  onAddToToday: (id: string) => void;
  onToggleStatus: (id: string, status: Task['status']) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  onAddToToday,
  onToggleStatus,
  onDeleteTask,
}: TaskListProps) {
  // Group tasks by project
  const tasksByProject = tasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = [];
    }
    acc[task.project].push(task);
    return acc;
  }, {} as Record<TaskProject, Task[]>);

  // Sort tasks within each project by priority
  Object.keys(tasksByProject).forEach(project => {
    tasksByProject[project as TaskProject].sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  });

  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    if (currentStatus === 'todo') return 'in-progress';
    if (currentStatus === 'in-progress') return 'done';
    return 'todo'; // done → todo (cycle)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ListTodo className="w-7 h-7 text-gray-700" />
        All Tasks
      </h2>

      {Object.keys(PROJECT_META).map(projectKey => {
        const project = projectKey as TaskProject;
        const projectTasks = tasksByProject[project] || [];
        const meta = PROJECT_META[project];

        if (projectTasks.length === 0) {
          return null; // Don't show empty projects
        }

        return (
          <div key={project} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">{meta.emoji}</span>
              {meta.label}
              <span className="text-sm font-normal text-gray-500">
                ({projectTasks.length})
              </span>
            </h3>

            <div className="space-y-3">
              {projectTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Status checkbox */}
                  <button
                    onClick={() => onToggleStatus(task.id, getNextStatus(task.status))}
                    className="hover:scale-110 transition-transform mt-0.5"
                    title={`Mark ${getNextStatus(task.status)}`}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in-progress' ? (
                      <Circle className="w-5 h-5 text-blue-600 fill-blue-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h4
                      className={`font-medium mb-1 ${
                        task.status === 'done' ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

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
                        <span className="text-blue-600">In Progress</span>
                      )}

                      {task.focusedToday && (
                        <span className="text-indigo-600 font-medium flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          Today
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {!task.focusedToday && task.status !== 'done' && (
                      <button
                        onClick={() => onAddToToday(task.id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                        title="Add to Today's Focus"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Today
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Delete this task?')) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No tasks yet</p>
          <p className="text-sm">
            Use the Quick Add form above to create your first task
          </p>
        </div>
      )}
    </div>
  );
}
