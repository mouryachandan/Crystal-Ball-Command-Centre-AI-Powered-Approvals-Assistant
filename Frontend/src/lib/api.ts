import { ApprovalItem, QueueStats } from '../types/approvals';
import {
  StructuredSummary,
  GroundedHelpResult,
  TeachStepResult,
  DynamicGreeting,
} from '../types/assistant';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}/api${endpoint}`;

    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch (err: unknown) {
      console.warn(`API call failed for ${endpoint}:`, err);
      throw err;
    }
  }

  // Approvals endpoints
  async getApprovals(): Promise<{ count: number; stats: QueueStats; data: ApprovalItem[] }> {
    const res = await fetch(`${BASE_URL}/api/approvals`);
    if (!res.ok) throw new Error('Failed to load approvals queue');
    return res.json();
  }

  async updateStatus(id: string, status: 'Approved' | 'Rejected'): Promise<ApprovalItem> {
    return this.request<ApprovalItem>(`/approvals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Assistant endpoints
  async getSummary(language = 'en'): Promise<StructuredSummary> {
    return this.request<StructuredSummary>('/assistant/summary', {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
  }

  async getHelp(question: string): Promise<GroundedHelpResult> {
    return this.request<GroundedHelpResult>('/assistant/help', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  async getTeach(currentStep: number, userQuestion?: string): Promise<TeachStepResult> {
    return this.request<TeachStepResult>('/assistant/teach', {
      method: 'POST',
      body: JSON.stringify({ currentStep, userQuestion }),
    });
  }

  async getGreeting(operatorName = 'Operator'): Promise<DynamicGreeting> {
    return this.request<DynamicGreeting>('/assistant/greeting', {
      method: 'POST',
      body: JSON.stringify({ operatorName }),
    });
  }
}

export const api = new ApiClient();

