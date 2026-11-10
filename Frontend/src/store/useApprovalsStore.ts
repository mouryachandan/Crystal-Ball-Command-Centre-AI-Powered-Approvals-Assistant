import { create } from 'zustand';
import { ApprovalItem, ApprovalType, ApprovalStatus, QueueStats } from '../types/approvals';
import { MOCK_APPROVAL_QUEUE } from '../fixtures/mockQueue';
import { api } from '../lib/api';

interface ApprovalsState {
  items: ApprovalItem[];
  selectedItem: ApprovalItem | null;
  stats: QueueStats | null;
  viewMode: 'queue' | 'hierarchy';
  searchQuery: string;
  filterType: ApprovalType | 'All';
  filterStatus: ApprovalStatus | 'All';
  isLoading: boolean;
  error: string | null;
  isMobileDetailOpen: boolean;
  isMobileSidebarOpen: boolean;

  // Actions
  fetchQueue: () => Promise<void>;
  selectItem: (item: ApprovalItem) => void;
  setViewMode: (mode: 'queue' | 'hierarchy') => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: ApprovalType | 'All') => void;
  updateStatus: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
  setIsMobileDetailOpen: (open: boolean) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
}

export const useApprovalsStore = create<ApprovalsState>((set, get) => ({
  items: MOCK_APPROVAL_QUEUE,
  selectedItem: MOCK_APPROVAL_QUEUE[0] || null,
  stats: {
    total: 4,
    pendingCount: 4,
    criticalCount: 1,
    byType: {
      Folder: 1,
      Video: 1,
      Pdf: 1,
      Image: 1,
    },
  },
  viewMode: 'queue',
  searchQuery: '',
  filterType: 'All',
  filterStatus: 'All',
  isLoading: false,
  error: null,
  isMobileDetailOpen: false,
  isMobileSidebarOpen: false,

  fetchQueue: async () => {
    try {
      const response = await api.getApprovals();
      if (response && response.data && response.data.length > 0) {
        set({
          items: response.data,
          stats: response.stats,
          selectedItem: get().selectedItem || response.data[0] || null,
          isLoading: false,
        });
      }
    } catch (err: unknown) {
      console.warn('Backend not yet reachable; using seeded mock approvals queue', err);
      // Keep seeded mock queue active so the UI is never empty!
      set({
        items: MOCK_APPROVAL_QUEUE,
        selectedItem: get().selectedItem || MOCK_APPROVAL_QUEUE[0],
        isLoading: false,
      });
    }
  },

  selectItem: (item: ApprovalItem) => set({ selectedItem: item, isMobileDetailOpen: true }),
  setViewMode: (mode: 'queue' | 'hierarchy') => set({ viewMode: mode }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilterType: (type: ApprovalType | 'All') => set({ filterType: type }),
  setIsMobileDetailOpen: (open: boolean) => set({ isMobileDetailOpen: open }),
  setIsMobileSidebarOpen: (open: boolean) => set({ isMobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  updateStatus: async (id: string, status: 'Approved' | 'Rejected') => {
    // Optimistic in-memory update so buttons always work instantly!
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status: status === 'Approved' ? 'Approved' : 'Rejected' } : item
      ),
      selectedItem:
        state.selectedItem?.id === id
          ? { ...state.selectedItem, status: status === 'Approved' ? 'Approved' : 'Rejected' }
          : state.selectedItem,
    }));

    // Sync with backend if available
    try {
      await api.updateStatus(id, status);
    } catch (err: unknown) {
      console.warn('Backend status sync skipped, updated in UI store', err);
    }
  },
}));
