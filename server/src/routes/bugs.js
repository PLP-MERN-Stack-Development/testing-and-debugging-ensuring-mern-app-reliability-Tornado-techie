import express from 'express';
import {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  searchBugs
} from '../controllers/bugController.js';
import { validateBug, validateBugUpdate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getBugs);
router.get('/search', searchBugs);
router.get('/:id', getBug);
router.post('/', validateBug, createBug);
router.put('/:id', validateBugUpdate, updateBug);
router.delete('/:id', deleteBug);

export default router;