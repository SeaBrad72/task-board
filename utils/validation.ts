import { z } from 'zod';

/**
 * Zod validation schemas for task data
 *
 * Security: Input validation prevents malicious data
 * - Title: 1-200 characters (prevents empty or excessively long titles)
 * - Description: Max 1000 characters
 * - Enum validation for project, priority, status
 * - Date validation for dueDate
 */

export const TaskProjectSchema = z.enum(['development', 'business', 'personal', 'learning']);
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'done']);

export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  project: TaskProjectSchema,
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  dueDate: z.date().optional(),
  focusedToday: z.boolean(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

// Type guards
export function isValidProject(value: unknown): boolean {
  return TaskProjectSchema.safeParse(value).success;
}

export function isValidPriority(value: unknown): boolean {
  return TaskPrioritySchema.safeParse(value).success;
}

export function isValidStatus(value: unknown): boolean {
  return TaskStatusSchema.safeParse(value).success;
}
