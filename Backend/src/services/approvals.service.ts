import { MOCK_APPROVAL_QUEUE } from '../fixtures/mockQueue';
import { ApprovalItem, ApprovalStatus, ApprovalType, QueueSummaryStats } from '../types/approvals.types';

export class ApprovalsService {
  private queue: ApprovalItem[];

  constructor(initialData: ApprovalItem[] = MOCK_APPROVAL_QUEUE) {
    // Deep clone to allow in-memory updates
    this.queue = JSON.parse(JSON.stringify(initialData));
  }

  public getQueue(filters?: { status?: ApprovalStatus; type?: ApprovalType; search?: string }): ApprovalItem[] {
    let result = [...this.queue];

    if (filters?.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters?.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.submittedBy.toLowerCase().includes(term) ||
          item.folderPath.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    return result;
  }

  public getItemById(id: string): ApprovalItem | undefined {
    return this.queue.find((item) => item.id === id);
  }

  public updateStatus(id: string, status: ApprovalStatus): ApprovalItem | null {
    const item = this.queue.find((i) => i.id === id);
    if (!item) return null;
    item.status = status;
    return item;
  }

  public getStats(): QueueSummaryStats {
    const pendingItems = this.queue.filter((i) => i.status === 'Pending Review');
    const criticalItems = pendingItems.filter((i) => i.priority === 'CRITICAL');

    const byType: Record<ApprovalType, number> = {
      Folder: 0,
      Video: 0,
      Pdf: 0,
      Image: 0,
    };

    for (const item of this.queue) {
      byType[item.type] = (byType[item.type] || 0) + 1;
    }

    return {
      total: this.queue.length,
      pendingCount: pendingItems.length,
      criticalCount: criticalItems.length,
      byType,
    };
  }
}

