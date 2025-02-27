import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";



export function CreateNewProject() {
  const handleResetProject = async () => {
    const projectName = localStorage.getItem("projectName");

    localStorage.removeItem("projectName");
    localStorage.removeItem("youtubeVideos"); // Remove indexed videos
    localStorage.removeItem(`videos-${localStorage.getItem("projectName")}`);

    if (!projectName) return;

    try {
      await axios.post("/api/reset-vector-db", { projectName });

      alert("AI knowledge has been base reset. ");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error resetting project:", error);
      alert("Failed to reset project. Try again.");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Create New Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project and uploaded videos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleResetProject}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
