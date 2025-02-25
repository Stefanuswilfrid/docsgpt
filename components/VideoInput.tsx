import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateNewProject } from "./CreateNewProject";

interface Props {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  handleEnterVideo: () => void;
  isLoading: boolean;
}

export default function VideoInput({ videoUrl, setVideoUrl, handleEnterVideo, isLoading }: Props) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex space-x-2">
        <Input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Enter YouTube URL" />
        <Button onClick={handleEnterVideo} disabled={isLoading}>
          {isLoading ? "Processing..." : "Enter"}
        </Button>
      </div>
      <CreateNewProject/>
      
    </div>
  );
}
