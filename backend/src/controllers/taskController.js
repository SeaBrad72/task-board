import { taskModel, TaskSchema, TaskUpdateSchema } from '../models/Task.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const taskController = {
  // GET /api/tasks - Get all tasks
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await taskModel.findAll();
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/tasks/:id - Get single task
  getTaskById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await taskModel.findById(id);

      if (!task) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/tasks - Create new task
  createTask: async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = TaskSchema.parse(req.body);

      // Create task
      const task = await taskModel.create(validatedData);

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        next(new ValidationError('Invalid task data', error.errors));
      } else {
        next(error);
      }
    }
  },

  // PUT /api/tasks/:id - Update task
  updateTask: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Check if task exists
      const existingTask = await taskModel.findById(id);
      if (!existingTask) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }

      // Validate update data
      const validatedData = TaskUpdateSchema.parse(req.body);

      // Update task
      const updatedTask = await taskModel.update(id, validatedData);

      res.json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully'
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        next(new ValidationError('Invalid update data', error.errors));
      } else {
        next(error);
      }
    }
  },

  // DELETE /api/tasks/:id - Delete task
  deleteTask: async (req, res, next) => {
    try {
      const { id } = req.params;

      const deletedTask = await taskModel.delete(id);

      if (!deletedTask) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }

      res.json({
        success: true,
        data: deletedTask,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
