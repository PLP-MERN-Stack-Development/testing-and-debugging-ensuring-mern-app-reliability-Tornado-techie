import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import Bug from '../../src/models/Bug.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bugs API Integration Tests', () => {
  describe('GET /api/bugs', () => {
    it('should return all bugs', async () => {
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
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'This is a new bug description',
        reporter: 'John Doe'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(newBug);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(newBug.title);
    });
  });

  // Add more test cases as needed...
});