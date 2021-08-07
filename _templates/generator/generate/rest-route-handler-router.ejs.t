---
to: '<%= locals.restRouteHandler ? `src/modules/${h.changeCase.param(locals.module?.name)}/routes/index.ts` : null %>'
unless_exists: true
---
import { asyncHandler } from '@/utils';
import express from 'express';

const router = express.Router();

// TODO: Define routes here

export const <%= h.changeCase.camel(locals.module?.name) %>Router = router;
