"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import VideoInput from "@/components/VideoInput";
import VideoList from "@/components/VideoList";
import ChatBox from "@/components/ChatBox";
import { useYouTubeManager } from "@/hooks/useYoutubeManager";

export default function YouTubeComponents() {
  const manager = useYouTubeManager();

  return (
    <div className="md:flex space-x-4 p-4">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Index YouTube Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoInput {...manager} />
          <VideoList videos={manager.videos} />
        </CardContent>
      </Card>

      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Chat with AI about Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatBox {...manager} />
        </CardContent>
      </Card>
    </div>
  );
}
