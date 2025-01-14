import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.get('/profile', protect, (req, res) => {
  res.json({ user: req.user });
});

router.post('/verify', (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    res.status(200).json({ message: 'Token is valid' });
  });
});

export default router;
