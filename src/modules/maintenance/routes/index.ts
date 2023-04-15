import { asyncHandler } from '@/utils/index.js';
import express from 'express';
import { healthCheckHandler } from './handlers/health-check.handler.js';

const router = express.Router();

router.get('/api/v1/maintenance/health-check', asyncHandler(healthCheckHandler));

export const maintenanceRouter = router;
