export type ApprovalType = 'Folder' | 'Video' | 'Pdf' | 'Image';
export type ApprovalStatus = 'Pending Review' | 'Approved' | 'Rejected';
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ApprovalItem {
  id: string;
  name: string;
  folderPath: string;
  type: ApprovalType;
  submittedBy: string;
  submittedDate: string;
  status: ApprovalStatus;
  priority: PriorityLevel;
  description: string;
  metadata?: {
    fileSize?: string;
    duration?: string;
    pageCount?: number;
    resolution?: string;
  };
}

export interface QueueSummaryStats {
  total: number;
  pendingCount: number;
  criticalCount: number;
  byType: Record<ApprovalType, number>;
}

