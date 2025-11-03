import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  // Navbar state
  isNavbarExpanded: boolean;
  toggleNavbar: () => void;
  setNavbarExpanded: (expanded: boolean) => void;

  // Ticket selection state
  selectedTicketId: string | undefined;
  setSelectedTicketId: (id: string | undefined) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Navbar
      isNavbarExpanded: true,
      toggleNavbar: () => set((state) => ({ isNavbarExpanded: !state.isNavbarExpanded })),
      setNavbarExpanded: (expanded) => set({ isNavbarExpanded: expanded }),

      // Ticket selection
      selectedTicketId: undefined,
      setSelectedTicketId: (id) => set({ selectedTicketId: id }),
    }),
    {
      name: 'ui-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только состояние navbar, не тикет (тикет сбрасывается при перезагрузке)
      partialize: (state) => ({ isNavbarExpanded: state.isNavbarExpanded }),
      // IMPORTANT: skip hydration on server, we'll do it manually on client
      skipHydration: true,
    }
  )
);
