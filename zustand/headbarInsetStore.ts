import { create } from "zustand";

const useHeadbarInsetStore = create((set) => ({
  headerTitles: [],
  setHeaderTitles: (content) => set({ headerTitles: content }),
  clearHeaderTitles: () => set({ headerTitles: [] }),
}));

export default useHeadbarInsetStore;
