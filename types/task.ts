/**
 * Core Task interface for the task management system
 *
 * Phase 1: Basic task properties with localStorage persistence
 * Phase 2: Will add userId, backend sync
 * Phase 3: Will add AI features (aiParsed, aiSuggestions)
 * Phase 4: Will add collaboration (projectId, assignedTo, comments)
 */

export type TaskProject = 'development' | 'business' | 'personal' | 'learning';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  // Core fields (Phase 1)
  id: string;
  title: string;
  description?: string;
  project: TaskProject;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  focusedToday: boolean; // ⭐ Key feature for "Today's Focus"
  createdAt: Date;
  updatedAt: Date;
}

// Helper type for creating new tasks (omit generated fields)
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// Helper type for updating tasks (all fields optional except id)
export type UpdateTaskInput = Partial<Omit<Task, 'id'>> & { id: string };

// Project display metadata
export const PROJECT_META: Record<TaskProject, { label: string; emoji: string }> = {
  development: { label: 'Development', emoji: '💻' },
  business: { label: 'Business', emoji: '💼' },
  personal: { label: 'Personal', emoji: '🏠' },
  learning: { label: 'Learning', emoji: '📚' },
};

// Priority display metadata
export const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: 'High', color: 'text-red-600' },
  medium: { label: 'Medium', color: 'text-yellow-600' },
  low: { label: 'Low', color: 'text-green-600' },
};

// Status display metadata
export const STATUS_META: Record<TaskStatus, { label: string; emoji: string }> = {
  todo: { label: 'To Do', emoji: '⬜' },
  'in-progress': { label: 'In Progress', emoji: '🔄' },
  done: { label: 'Done', emoji: '✅' },
};
