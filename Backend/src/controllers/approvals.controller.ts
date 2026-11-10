import { Request, Response, NextFunction } from 'express';
import { ApprovalsService } from '../services/approvals.service';
import { ApprovalStatus, ApprovalType } from '../types/approvals.types';
import { AppError } from '../utils/errors';

export class ApprovalsController {
  private service: ApprovalsService;

  constructor(service?: ApprovalsService) {
    this.service = service || new ApprovalsService();
  }

  public getQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, type, search } = req.query as {
        status?: ApprovalStatus;
        type?: ApprovalType;
        search?: string;
      };

      const items = this.service.getQueue({ status, type, search });
      const stats = this.service.getStats();

      res.status(200).json({
        status: 'success',
        stats,
        count: items.length,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  };

  public getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const item = this.service.getItemById(id || '');

      if (!item) {
        throw new AppError(`Approval item with id "${id}" not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        data: item,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: ApprovalStatus };

      const updated = this.service.updateStatus(id || '', status);

      if (!updated) {
        throw new AppError(`Approval item with id "${id}" not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };
}

