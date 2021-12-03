import express from 'express';
import controller from '../controllers/post';
import passport from 'passport';
import { validatePostRating, validatePostCreate, validateQuery } from '../middleware/validate';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), validatePostCreate, asyncHandler(controller.create));
router.post('/rating', passport.authenticate('jwt', { session: false }), validatePostRating, asyncHandler(controller.setRating));
router.get('/:id', asyncHandler(controller.getById));
router.get('/', validateQuery, asyncHandler(controller.getPosts));

export default router;