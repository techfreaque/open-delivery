import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,
  toggle: (): void => set((state) => ({ isOpen: !state.isOpen })),
}));
