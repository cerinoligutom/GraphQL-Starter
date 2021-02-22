import { asyncHandler } from '@/utils';
import express from 'express';
import { healthCheckHandler } from './handlers/health-check.handler';
import { pgsqlCheckHandler } from './handlers/pgsql-check.handler';
import { redisCheckHandler } from './handlers/redis-check.handler';

const router = express.Router();

router.get('/api/v1/maintenance/health-check', asyncHandler(healthCheckHandler));
router.get('/api/v1/maintenance/pgsql-check', asyncHandler(pgsqlCheckHandler));
router.get('/api/v1/maintenance/redis-check', asyncHandler(redisCheckHandler));

export const maintenanceRouter = router;
