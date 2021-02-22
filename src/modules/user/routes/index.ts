import { accessTokenHandler } from '@/middlewares';
import { asyncHandler } from '@/utils';
import express from 'express';
import { getUsersHandler } from './handlers/get-users.handler';

const router = express.Router();

router.get('/api/v1/users', accessTokenHandler(), asyncHandler(getUsersHandler));

export const userRouter = router;
