import { maintenanceController } from '@/controllers';
import express from 'express';
import { asyncHandler } from '@/utils';

const router = express.Router();

router.get('/maintenance/health-check', asyncHandler(maintenanceController.healthCheck));
router.get('/maintenance/pgsql-check', asyncHandler(maintenanceController.pgsqlDbCheck));
router.get('/maintenance/redis-check', asyncHandler(maintenanceController.redisDbCheck));

export const maintenanceRouter = router;
