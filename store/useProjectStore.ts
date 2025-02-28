import { create } from "zustand";

interface ProjectState {
  projectName: string;
  setProjectName: (name: string) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projectName: "",
  setProjectName: (name) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("projectName", name); 
    }
    set({ projectName: name });
  },
}));

if (typeof window !== "undefined" && window.localStorage) {
  useProjectStore.setState({
    projectName: localStorage.getItem("projectName") || "",
  });
}

export default useProjectStore;
