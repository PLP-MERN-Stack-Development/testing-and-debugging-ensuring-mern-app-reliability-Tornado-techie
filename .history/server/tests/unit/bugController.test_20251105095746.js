import Bug from '../../src/models/Bug.js';
import * as bugController from '../../src/controllers/bugController.js';

// Mock the Bug model
jest.mock('../../src/models/Bug.js');

describe('Bug Controller - Unit Tests', () => {
  let mockReq, mockRes, mockNext;

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
    it('should return paginated bugs', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' },
        { _id: '2', title: 'Bug 2', status: 'in-progress' }
      ];
      
      Bug.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockBugs)
      });
      
      Bug.countDocuments.mockResolvedValue(2);
      mockReq.query = { page: '1', limit: '10' };

      await bugController.getBugs(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        bugs: mockBugs,
        totalPages: 1,
        currentPage: '1',
        total: 2
      });
    });

    it('should filter by status', async () => {
      Bug.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue([])
      });
      Bug.countDocuments.mockResolvedValue(0);
      
      mockReq.query = { status: 'open' };

      await bugController.getBugs(mockReq, mockRes, mockNext);

      expect(Bug.find).toHaveBeenCalledWith({ status: 'open' });
    });
  });

  describe('getBug', () => {
    it('should return bug when found', async () => {
      const mockBug = { _id: '1', title: 'Test Bug' };
      Bug.findById.mockResolvedValue(mockBug);
      mockReq.params.id = '1';

      await bugController.getBug(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockBug);
    });

    it('should return 404 when bug not found', async () => {
      Bug.findById.mockResolvedValue(null);
      mockReq.params.id = 'nonexistent';

      await bugController.getBug(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Bug not found' });
    });
  });

  describe('createBug', () => {
    it('should create a new bug', async () => {
      const mockBugData = {
        title: 'New Bug',
        description: 'Bug description',
        reporter: 'John Doe'
      };
      
      const mockSavedBug = { ...mockBugData, _id: '1' };
      const mockBugInstance = {
        save: jest.fn().mockResolvedValue(mockSavedBug)
      };
      
      Bug.mockImplementation(() => mockBugInstance);
      mockReq.body = mockBugData;

      await bugController.createBug(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockSavedBug);
    });
  });
});