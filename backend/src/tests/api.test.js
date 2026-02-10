import request from 'supertest';
import app from '../server.js';
import { taskModel } from '../models/Task.js';

/**
 * Task Board REST API Tests
 *
 * Day 7 - REST API + JSON
 * Goal: 90%+ test coverage
 * Tests all 5 CRUD endpoints + validation + error handling
 */

describe('Task Board REST API', () => {
  // Initialize database before all tests
  beforeAll(async () => {
    await taskModel.initialize();
  });

  // Disconnect from database after all tests
  afterAll(async () => {
    await taskModel.disconnect();
  });

  // Clear and reinitialize data before each test
  beforeEach(async () => {
    await taskModel.clear();
    await taskModel._initializeSeedData();
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBe(3); // 3 seed tasks
    });

    it('should return tasks in descending order by creation date', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      const tasks = res.body.data;
      for (let i = 0; i < tasks.length - 1; i++) {
        const current = new Date(tasks[i].createdAt);
        const next = new Date(tasks[i + 1].createdAt);
        expect(current >= next).toBe(true);
      }
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test description for API validation',
        status: 'todo',
        priority: 'high',
        project: 'development',
        focusedToday: false,
        dueDate: null
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.description).toBe(newTask.description);
      expect(res.body.data.status).toBe(newTask.status);
      expect(res.body.data.project).toBe(newTask.project);
      expect(res.body.data.focusedToday).toBe(newTask.focusedToday);
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');
    });

    it('should create task with minimal data (defaults applied)', async () => {
      const newTask = {
        title: 'Minimal Task'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Minimal Task');
      expect(res.body.data.status).toBe('todo');
      expect(res.body.data.priority).toBe('medium');
      expect(res.body.data.project).toBe('personal');
      expect(res.body.data.focusedToday).toBe(false);
    });

    it('should reject task with empty title', async () => {
      const invalidTask = {
        title: ''
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('ValidationError');
    });

    it('should accept task with urgent priority', async () => {
      const urgentTask = {
        title: 'Urgent Task',
        priority: 'urgent'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(urgentTask);

      expect(res.status).toBe(201);
      expect(res.body.data.priority).toBe('urgent');
    });

    it('should reject task with invalid priority', async () => {
      const invalidTask = {
        title: 'Test Task',
        priority: 'invalid'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });

    it('should reject task with title longer than 200 characters', async () => {
      const invalidTask = {
        title: 'a'.repeat(201)
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      // First create a task
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' });

      const taskId = createRes.body.data.id;

      // Then fetch it
      const res = await request(app).get(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/invalid-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('NotFoundError');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      // Create a task first
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Title' });

      const taskId = createRes.body.data.id;

      // Update the task
      const updates = {
        title: 'Updated Title',
        status: 'done',
        priority: 'low',
        description: 'Updated description'
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.status).toBe('done');
      expect(res.body.data.priority).toBe('low');
      expect(res.body.data.description).toBe('Updated description');
      expect(res.body.data.id).toBe(taskId); // ID should not change
    });

    it('should partially update a task', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original', priority: 'high' });

      const taskId = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'in-progress' }); // Only update status

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Original'); // Should remain unchanged
      expect(res.body.data.status).toBe('in-progress');
      expect(res.body.data.priority).toBe('high'); // Should remain unchanged
    });

    it('should return 404 when updating non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/invalid-id')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('NotFoundError');
    });

    it('should reject invalid update data', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' });

      const taskId = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ priority: 'invalid-priority' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task first
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete' });

      const taskId = createRes.body.data.id;

      // Delete the task
      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);

      // Verify it's actually deleted
      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/invalid-id');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('NotFoundError');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-route');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in response', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Model Methods', () => {
    it('should return task count', async () => {
      expect(await taskModel.count()).toBeGreaterThan(0);
    });

    it('should clear all tasks', async () => {
      await taskModel.clear();
      expect(await taskModel.count()).toBe(0);
      await taskModel._initializeSeedData(); // Restore for other tests
    });
  });

  describe('Validation', () => {
    it('should return validation errors in response', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should create task with valid ISO datetime', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Task with due date',
          dueDate: new Date().toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.data.dueDate).toBeTruthy();
    });

    it('should accept all valid status values', async () => {
      const statuses = ['todo', 'in-progress', 'done'];

      for (const status of statuses) {
        const res = await request(app)
          .post('/api/tasks')
          .send({
            title: `Task with status ${status}`,
            status
          });

        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe(status);
      }
    });

    it('should accept all valid project values', async () => {
      const projects = ['development', 'business', 'personal', 'learning', 'fitness'];

      for (const project of projects) {
        const res = await request(app)
          .post('/api/tasks')
          .send({
            title: `Task for ${project}`,
            project
          });

        expect(res.status).toBe(201);
        expect(res.body.data.project).toBe(project);
      }
    });

    it('should handle focusedToday boolean field', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Focused task',
          focusedToday: true
        });

      expect(res.status).toBe(201);
      expect(res.body.data.focusedToday).toBe(true);
    });

    it('should reject invalid status value', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Task',
          status: 'invalid-status'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });

    it('should reject invalid project value', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Task',
          project: 'invalid-project'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ValidationError');
    });
  });
});
