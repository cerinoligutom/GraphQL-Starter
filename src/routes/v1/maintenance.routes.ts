import { maintenanceController } from '@app/controllers';
import express from 'express';
import { asyncHandler } from '@app/utils';

const router = express.Router();

router.get('/maintenance/health-check', asyncHandler(maintenanceController.healthCheck));
router.get('/maintenance/pgsql-check', asyncHandler(maintenanceController.pgsqlDbCheck));

export const maintenanceRouter = router;
