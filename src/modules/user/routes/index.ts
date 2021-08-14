import { asyncHandler } from '@/utils';
import express from 'express';
import { getUserHandler } from './handlers/get-user.handler';
import { getUsersHandler } from './handlers/get-users.handler';

const router = express.Router();

router.get('/api/v1/users', asyncHandler(getUsersHandler));

router.get('/api/v1/users/:userId', asyncHandler(getUserHandler));

export const userRouter = router;
