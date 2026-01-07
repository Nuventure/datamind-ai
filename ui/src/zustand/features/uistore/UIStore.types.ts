export interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}
