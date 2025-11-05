import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import Bug from '../../src/models/Bug.js';

let mongoServer;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bugs API Integration Tests', () => {
  describe('GET /api/bugs', () => {
    it('should return all bugs', async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          reporter: 'John Doe'
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          reporter: 'Jane Smith'
        }
      ]);

      const res = await request(app).get('/api/bugs');

      expect(res.status).toBe(200);
      expect(res.body.bugs).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should filter bugs by status', async () => {
      await Bug.create([
        {
          title: 'Open Bug',
          description: 'Description',
          status: 'open',
          reporter: 'John Doe'
        },
        {
          title: 'In Progress Bug',
          description: 'Description',
          status: 'in-progress',
          reporter: 'Jane Smith'
        }
      ]);

      const res = await request(app).get('/api/bugs?status=open');

      expect(res.status).toBe(200);
      expect(res.body.bugs).toHaveLength(1);
      expect(res.body.bugs[0].status).toBe('open');
    });

    it('should paginate results', async () => {
      // Create multiple bugs
      const bugs = [];
      for (let i = 0; i < 15; i++) {
        bugs.push({
          title: `Bug ${i}`,
          description: `Description ${i}`,
          reporter: `User ${i}`
        });
      }
      await Bug.insertMany(bugs);

      const page1 = await request(app).get('/api/bugs?page=1&limit=10');
      const page2 = await request(app).get('/api/bugs?page=2&limit=10');

      expect(page1.status).toBe(200);
      expect(page2.status).toBe(200);
      expect(page1.body.bugs).toHaveLength(10);
      expect(page2.body.bugs).toHaveLength(5);
      expect(page1.body.totalPages).toBe(2);
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'This is a new bug description',
        priority: 'high',
        reporter: 'John Doe',
        stepsToReproduce: ['Step 1', 'Step 2'],
        expectedBehavior: 'Should work',
        actualBehavior: 'Does not work',
        environment: {
          os: 'Windows 10',
          browser: 'Chrome',
          device: 'Desktop'
        },
        tags: ['ui', 'critical']
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(newBug);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(newBug.title);
      expect(res.body.description).toBe(newBug.description);
      expect(res.body.priority).toBe(newBug.priority);
      expect(res.body.reporter).toBe(newBug.reporter);
      expect(res.body.status).toBe('open'); // Default value
    });

    it('should return 400 for invalid bug data', async () => {
      const invalidBug = {
        // Missing required fields
        description: 'Missing title'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for title too long', async () => {
      const invalidBug = {
        title: 'A'.repeat(101), // Too long
        description: 'Valid description',
        reporter: 'John Doe'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/bugs/:id', () => {
    it('should return a bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        reporter: 'John Doe'
      });

      const res = await request(app).get(`/api/bugs/${bug._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(bug._id.toString());
      expect(res.body.title).toBe('Test Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/bugs/invalid-id');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update a bug', async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original Description',
        reporter: 'John Doe'
      });

      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.description).toBe('Updated Description');
      expect(res.body.status).toBe('in-progress');
    });

    it('should return 404 when updating non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete a bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'This bug will be deleted',
        reporter: 'John Doe'
      });

      const res = await request(app).delete(`/api/bugs/${bug._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Bug deleted successfully');

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 when deleting non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/bugs/search', () => {
    it('should search bugs by query', async () => {
      await Bug.create([
        {
          title: 'Login bug',
          description: 'Cannot login to system',
          reporter: 'John Doe'
        },
        {
          title: 'Dashboard issue',
          description: 'Dashboard not loading',
          reporter: 'Jane Smith'
        }
      ]);

      const res = await request(app).get('/api/bugs/search?q=login');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toContain('Login');
    });

    it('should return 400 for empty search query', async () => {
      const res = await request(app).get('/api/bugs/search?q=');

      expect(res.status).toBe(400);
    });
  });
});