import express from 'express';
import controller from '../controllers/auth';
import asyncHandler from "express-async-handler"
import { validateAuth } from '../middleware/validate';

const router = express.Router();

router.post('/login', validateAuth, asyncHandler(controller.login));
router.post('/register', validateAuth, asyncHandler(controller.register));

export default router;