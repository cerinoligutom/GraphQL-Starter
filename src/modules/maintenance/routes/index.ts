import { asyncHandler } from '@/utils';
import express from 'express';
import { healthCheckHandler } from './handlers/health-check.handler';

const router = express.Router();

router.get('/api/v1/maintenance/health-check', asyncHandler(healthCheckHandler));

export const maintenanceRouter = router;
