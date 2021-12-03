import express from 'express';
import controller from '../controllers/user';
import asyncHandler from 'express-async-handler';
import { validateQuery } from '../middleware/validate';

const router = express.Router();

router.get('/:id/posts', validateQuery, asyncHandler(controller.getPostsByUserId));
router.get('/', validateQuery, asyncHandler(controller.getUsers));

export default router;