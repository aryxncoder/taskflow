import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import requireAuth from '../middleware/auth.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || name.length > 50) {
      return res.status(400).json({ message: 'Name is required (max 50 characters).' });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({ message: 'Password must be 6 to 72 characters.' });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'That email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ token: createToken(user._id), user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    const passwordMatches = user && (await bcrypt.compare(password, user.password));
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ token: createToken(user._id), user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'Account not found. Please log in again.' });
    }
    res.json({ user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
