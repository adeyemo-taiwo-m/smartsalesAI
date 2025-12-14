import { create } from "zustand";
import { User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";

interface AppState {
  user: User | null;
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setUser: (user: User | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  login: () => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null, // Start logged out
  sidebarOpen: true,
  theme: "light",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  login: () => set({ user: MOCK_USERS[0] }), // Mock login as first user
  logout: () => set({ user: null }),
}));
