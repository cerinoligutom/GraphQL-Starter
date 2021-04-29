import { asyncHandler } from '@/utils';
import express from 'express';
import { getUsersHandler } from './handlers/get-users.handler';

const router = express.Router();

router.get('/api/v1/users', asyncHandler(getUsersHandler));

export const userRouter = router;
