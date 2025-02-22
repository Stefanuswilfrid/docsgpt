import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  handleEnterVideo: () => void;
  handleClearVideos: () => void;
  isLoading: boolean;
}

export default function VideoInput({ videoUrl, setVideoUrl, handleEnterVideo, handleClearVideos, isLoading }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Enter YouTube URL" />
        <Button onClick={handleEnterVideo} disabled={isLoading}>
          {isLoading ? "Processing..." : "Index"}
        </Button>
      </div>
      <Button onClick={handleClearVideos} className="w-full mt-2 bg-red-500 text-white">
        <Trash2 className="h-4 w-4 mr-2" /> Clear Previous Videos
      </Button>
    </div>
  );
}
