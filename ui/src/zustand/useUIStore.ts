import { create } from 'zustand';
import type { UIState } from './UIStore.models';

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
