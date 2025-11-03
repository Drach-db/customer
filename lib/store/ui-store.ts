import { create } from 'zustand';

interface UIState {
  // Navbar state
  isNavbarExpanded: boolean;
  toggleNavbar: () => void;
  setNavbarExpanded: (expanded: boolean) => void;

  // Ticket selection state
  selectedTicketId: string | undefined;
  setSelectedTicketId: (id: string | undefined) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Navbar
  isNavbarExpanded: true,
  toggleNavbar: () => set((state) => ({ isNavbarExpanded: !state.isNavbarExpanded })),
  setNavbarExpanded: (expanded) => set({ isNavbarExpanded: expanded }),

  // Ticket selection
  selectedTicketId: undefined,
  setSelectedTicketId: (id) => set({ selectedTicketId: id }),
}));
