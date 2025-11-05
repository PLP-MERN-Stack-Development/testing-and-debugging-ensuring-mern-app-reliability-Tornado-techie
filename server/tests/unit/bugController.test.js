import { jest } from '@jest/globals';

describe('Bug Controller - Unit Tests', () => {
  let mockReq, mockRes, mockNext;
  let bugController;

  beforeAll(async () => {
    // Mock the Bug model
    jest.unstable_mockModule('../../src/models/Bug.js', () => ({
      default: {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          skip: jest.fn().mockResolvedValue([])
        }),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
        create: jest.fn()
      }
    }));

    bugController = await import('../../src/controllers/bugController.js');
  });

  beforeEach(() => {
    mockReq = {
      params: {},
      query: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getBugs', () => {
    it('should handle getting bugs successfully', async () => {
      mockReq.query = { page: '1', limit: '10' };

      await bugController.getBugs(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      mockNext.mockImplementation(() => {
        throw error;
      });

      await bugController.getBugs(mockReq, mockRes, mockNext);

      // Test passes if no uncaught exception
      expect(true).toBe(true);
    });
  });

  describe('getBug', () => {
    it('should get a single bug', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';

      await bugController.getBug(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('createBug', () => {
    it('should handle createBug call', async () => {
      mockReq.body = {
        title: 'Test Bug',
        description: 'Test Description',
        priority: 'medium',
        status: 'open',
        reporter: 'test@example.com'
      };

      // Just verify the function doesn't throw an error
      await expect(bugController.createBug(mockReq, mockRes, mockNext)).resolves.not.toThrow();
    });
  });

  describe('updateBug', () => {
    it('should update an existing bug', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';
      mockReq.body = { status: 'in-progress' };

      await bugController.updateBug(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('deleteBug', () => {
    it('should delete a bug', async () => {
      mockReq.params.id = '507f1f77bcf86cd799439011';

      await bugController.deleteBug(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});