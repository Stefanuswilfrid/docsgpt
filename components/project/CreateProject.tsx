"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const CreateProject = ({ setProjectName }: { setProjectName: (name: string) => void }) => {
  const [tempProjectName, setTempProjectName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
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
  }, [setProjectName]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Project Name</AlertDialogTitle>
          <AlertDialogDescription>
            <Input type="text" onChange={handleProjNameChange} onKeyDown={onEnter} placeholder="Enter Project Name" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction disabled={tempProjectName.trim() === ""} onClick={handleSubmit}>
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateProject;
