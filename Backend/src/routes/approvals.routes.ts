import { Router } from 'express';
import { ApprovalsController } from '../controllers/approvals.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { QueryApprovalsSchema, UpdateApprovalStatusSchema } from '../schemas/approvals.schema';

const router = Router();
const controller = new ApprovalsController();

router.get('/', validateRequest({ query: QueryApprovalsSchema }), controller.getQueue);
router.get('/:id', controller.getItemById);
router.patch('/:id/status', validateRequest({ body: UpdateApprovalStatusSchema }), controller.updateStatus);

export const approvalsRouter = router;

