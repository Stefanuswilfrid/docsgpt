"use client";

import { useEffect, useState } from "react";
import { ProjectDialog } from "./ProjectDialog";
import useProjectStore from "@/store/useProjectStore";

const CreateProjectModal = () => {
  const { setProjectName } = useProjectStore(); 

  const [tempProjectName, setTempProjectName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formattedName = tempProjectName.trim() + "-" + Date.now();
    if (tempProjectName.trim() === "") return;

    localStorage.setItem("projectName", formattedName);
    setProjectName(formattedName); // ✅ Pass project name to parent component

    setOpen(false);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tempProjectName !== "") {
      handleSubmit();
    }
  };

  const handleProjNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProjectName(e.target.value);
  };

  useEffect(() => {
    const storedProject = localStorage.getItem("projectName");
    if (storedProject) {
      setProjectName(storedProject);
    } else {
      setOpen(true);
    }
  }, []);

  return (
    <ProjectDialog
    className="sm:max-w-lg"
    open={open}
    withoutOkButton
    onClose={()=>{
      setOpen(false);
    }}
    >
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
      <p className="font-medium">Create a project name : </p>
      <div className="relative">
          <input
            className="bg-transparent pl-3 pr-10 py-2 rounded-md border border-subtle ring-offset-white ring-smoke focus:ring-offset-2 focus:ring-2 text-secondary focus:text-black transition-shadow duration-200 placeholder:text-colors-secondary focus:outline-none w-full"
            type="text"
            placeholder="Project Name"
            required
            onChange={handleProjNameChange}
          />


          <div className="mt-2 flex justify-end ">
              <button
              disabled={tempProjectName.trim() === ""}
              onClick={handleSubmit}
                type="submit"
                className="block bg-zinc-50 rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-3 py-1.5"
              >
                Ok

              </button>
          </div>
        </div>
      </form>
    </ProjectDialog>

  );
};

export default CreateProjectModal;
