import { create } from "zustand";

interface ProjectState {
  projectName: string;
  setProjectName: (name: string) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projectName: localStorage.getItem("projectName") || "",
  setProjectName: (name) => {
    localStorage.setItem("projectName", name);
    set({ projectName: name });
  },
}));

export default useProjectStore;
