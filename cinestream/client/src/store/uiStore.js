import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Global UI state managed with Zustand.
 * Handles cross-cutting UI concerns that don't belong in React context.
 */
const useUIStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ── Search ──────────────────────────────────────────
        searchQuery: '',
        setSearchQuery: (query) => set({ searchQuery: query }),
        clearSearch: () => set({ searchQuery: '' }),

        // ── Player Preferences ───────────────────────────────
        playerVolume: 1,
        playerMuted: false,
        playerAutoplay: true,
        setPlayerVolume: (volume) => set({ playerVolume: volume }),
        setPlayerMuted: (muted) => set({ playerMuted: muted }),
        togglePlayerMuted: () => set((state) => ({ playerMuted: !state.playerMuted })),
        setPlayerAutoplay: (autoplay) => set({ playerAutoplay: autoplay }),

        // ── UI Preferences ───────────────────────────────────
        prefersReducedMotion: false,
        setPrefersReducedMotion: (val) => set({ prefersReducedMotion: val }),

        // ── Modal State ──────────────────────────────────────
        activeModal: null,
        modalData: null,
        openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
        closeModal: () => set({ activeModal: null, modalData: null }),

        // ── Sidebar / Nav ────────────────────────────────────
        isSidebarOpen: false,
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        closeSidebar: () => set({ isSidebarOpen: false }),

        // ── Notification Banner ──────────────────────────────
        banner: null,
        showBanner: (message, type = 'info', duration = 5000) => {
          set({ banner: { message, type, id: Date.now() } });
          if (duration > 0) {
            setTimeout(() => {
              if (get().banner) set({ banner: null });
            }, duration);
          }
        },
        dismissBanner: () => set({ banner: null }),
      }),
      {
        name: 'cinestream-ui',
        // Only persist player preferences and UI preferences
        partialize: (state) => ({
          playerVolume: state.playerVolume,
          playerMuted: state.playerMuted,
          playerAutoplay: state.playerAutoplay,
          prefersReducedMotion: state.prefersReducedMotion,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

export default useUIStore;
