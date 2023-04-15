import { asyncHandler } from '@/utils/index.js';
import express from 'express';
import { getUserHandler } from './handlers/get-user.handler.js';
import { getUsersHandler } from './handlers/get-users.handler.js';

const router = express.Router();

router.get('/api/v1/users', asyncHandler(getUsersHandler));

router.get('/api/v1/users/:userId', asyncHandler(getUserHandler));

export const userRouter = router;
