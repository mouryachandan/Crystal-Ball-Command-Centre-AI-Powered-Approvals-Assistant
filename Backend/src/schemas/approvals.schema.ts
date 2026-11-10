import { z } from 'zod';

export const ApprovalTypeSchema = z.enum(['Folder', 'Video', 'Pdf', 'Image']);
export const ApprovalStatusSchema = z.enum(['Pending Review', 'Approved', 'Rejected']);
export const PriorityLevelSchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const ApprovalItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  folderPath: z.string(),
  type: ApprovalTypeSchema,
  submittedBy: z.string(),
  submittedDate: z.string(),
  status: ApprovalStatusSchema,
  priority: PriorityLevelSchema,
  description: z.string(),
  metadata: z
    .object({
      fileSize: z.string().optional(),
      duration: z.string().optional(),
      pageCount: z.number().optional(),
      resolution: z.string().optional(),
    })
    .optional(),
});

export const QueryApprovalsSchema = z.object({
  status: ApprovalStatusSchema.optional(),
  type: ApprovalTypeSchema.optional(),
  search: z.string().optional(),
});

export const UpdateApprovalStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  reason: z.string().min(3).optional(),
});

