import { Router } from 'express';
import { approvalsRouter } from './approvals.routes';
import { assistantRouter } from './assistant.routes';
import { getHealth } from '../controllers/health.controller';

const router = Router();

router.get('/health', getHealth);
router.use('/approvals', approvalsRouter);
router.use('/assistant', assistantRouter);

export const apiRouter = router;

