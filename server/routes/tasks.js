import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import requireAuth from '../middleware/auth.js';

const router = Router();
const STATUSES = ['Pending', 'Completed'];

router.use(requireAuth);

function validateTaskInput(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.title !== undefined) {
    const title = String(body.title || '').trim();
    if (!title || title.length > 100) {
      return { error: 'Title is required (max 100 characters).' };
    }
    data.title = title;
  }

  if (body.description !== undefined) {
    const description = String(body.description || '').trim();
    if (description.length > 500) {
      return { error: 'Description must be 500 characters or fewer.' };
    }
    data.description = description;
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return { error: 'Status must be Pending or Completed.' };
    }
    data.status = body.status;
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === '') {
      data.dueDate = null;
    } else {
      const dueDate = new Date(body.dueDate);
      if (Number.isNaN(dueDate.getTime())) {
        return { error: 'Due date is not a valid date.' };
      }
      data.dueDate = dueDate;
    }
  }

  return { data };
}

function requireValidId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id.' });
  }
  next();
}

router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status !== undefined) {
      if (!STATUSES.includes(req.query.status)) {
        return res.status(400).json({ message: 'Status filter must be Pending or Completed.' });
      }
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { data, error } = validateTaskInput(req.body);
    if (error) return res.status(400).json({ message: error });

    const task = await Task.create({ ...data, user: req.userId });
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireValidId, async (req, res, next) => {
  try {
    const { data, error } = validateTaskInput(req.body, { partial: true });
    if (error) return res.status(400).json({ message: error });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      data,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireValidId, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
