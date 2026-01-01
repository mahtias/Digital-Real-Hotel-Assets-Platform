import { Router } from 'express';
import {
  register,
  login,
  getProfile,
} from '../controllers/authController';

import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();


// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 }),
    //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

// NEW: Current user route
router.get('/me', authenticate, getProfile);

export default router;
