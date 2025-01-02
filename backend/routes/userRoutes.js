import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  registerUser,
  authUser,
  getUserTemplates, 
  getUserForms,
  getUsers,
  blockUser,
  unblockUser,
  logout,
  getCurrentUser
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected routes
router.get('/templates', protect, getUserTemplates);
router.get('/forms', protect, getUserForms);
router.get('/all', protect, getUsers);
router.patch('/:id/block', protect, blockUser);
router.patch('/:id/unblock', protect, unblockUser);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);

export default router;
