import { create } from "zustand";

export type Tab = "training" | "match";
export type TrainingMode = "sprint" | "marathon" | "zen";
export type MatchMode = "bullet" | "blitz" | "rapid";
export type SearchState = "idle" | "searching" | "found";

interface AppState {
  tab: Tab;
  setTab: (tab: Tab) => void;

  trainingMode: TrainingMode;
  setTrainingMode: (mode: TrainingMode) => void;

  matchMode: MatchMode;
  setMatchMode: (mode: MatchMode) => void;

  search: SearchState;
  startSearch: () => void;
  cancelSearch: () => void;
  resetSearch: () => void;
}

// Mock matchmaking delay lives outside the store so it never gets serialized.
let searchTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set) => ({
  tab: "training",
  setTab: (tab) => set({ tab }),

  trainingMode: "sprint",
  setTrainingMode: (trainingMode) => set({ trainingMode }),

  matchMode: "blitz",
  setMatchMode: (matchMode) => set({ matchMode }),

  search: "idle",
  startSearch: () => {
    if (searchTimer) clearTimeout(searchTimer);
    set({ search: "searching" });
    searchTimer = setTimeout(() => set({ search: "found" }), 2800);
  },
  cancelSearch: () => {
    if (searchTimer) clearTimeout(searchTimer);
    set({ search: "idle" });
  },
  resetSearch: () => set({ search: "idle" }),
}));
