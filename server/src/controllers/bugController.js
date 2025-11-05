import Bug from '../models/Bug.js';
import { validationResult } from 'express-validator';

// Debugging utility
const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

export const getBugs = async (req, res, next) => {
  try {
    debugLog('Fetching bugs with query:', req.query);
    
    const { status, priority, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const bugs = await Bug.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Bug.countDocuments(query);
    
    res.json({
      bugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

export const getBug = async (req, res, next) => {
  try {
    debugLog('Fetching bug by ID:', req.params.id);
    
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (error) {
    next(error);
  }
};

export const createBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debugLog('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    debugLog('Creating new bug:', req.body);
    
    const bug = new Bug(req.body);
    await bug.save();
    
    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

export const updateBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    debugLog('Updating bug:', { id: req.params.id, updates: req.body });
    
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json(bug);
  } catch (error) {
    next(error);
  }
};

export const deleteBug = async (req, res, next) => {
  try {
    debugLog('Deleting bug:', req.params.id);
    
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const searchBugs = async (req, res, next) => {
  try {
    const { q } = req.query;
    debugLog('Searching bugs with query:', q);
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const bugs = await Bug.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    
    res.json(bugs);
  } catch (error) {
    next(error);
  }
};