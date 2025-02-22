import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";

interface Props {
  videos: { title: string; videoId: string }[];
}

export default function VideoList({ videos }: Props) {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {videos.map((video, index) => (
        <div key={index} className="flex items-center space-x-2 py-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>{video.title}</span>
        </div>
      ))}
    </ScrollArea>
  );
}
