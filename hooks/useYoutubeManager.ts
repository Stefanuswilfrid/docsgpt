import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function useYouTubeManager() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<{ title: string; videoId: string }[]>([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [indexingMessage, setIndexingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedVideos = localStorage.getItem("youtubeVideos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  const handleEnterVideo = async () => {
    if (!videoUrl) return;
    setIsLoading(true);

    try {
      const res = await axios.post("/api/get-transcript", { videoUrl });
      const { transcript, videoId, videoTitle } = res.data;

      await axios.post("/api/store-transcript", { transcript, videoId, videoTitle });

      const newVideo = { title: videoTitle, videoId };
      setVideos((prev) => [...prev, newVideo]);
      localStorage.setItem("youtubeVideos", JSON.stringify([...videos, newVideo]));

      setVideoUrl("");
      setIndexingMessage("Video indexed successfully!");
    } catch (error) {
      console.error("Error processing video:", error);
      setIndexingMessage("Failed to process video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query) return;
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "user", content: query }]);
      const res = await axios.post("/api/query", { query });
      const aiResponse =
        typeof res.data.response === "string" ? res.data.response : "AI Response Error: Unexpected data format.";
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
      setQuery("");
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Failed to get a response from AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearVideos = async () => {
    const confirmClear = window.confirm("Are you sure you want to delete all indexed videos?");
    if (!confirmClear) return;

    try {
      await axios.post("/api/reset-vector-db");
      localStorage.removeItem("youtubeVideos");
      setVideos([]);
      setIndexingMessage("All previous videos have been cleared.");
    } catch (error) {
      console.error(" Error clearing videos:", error);
      setIndexingMessage("Failed to clear videos. Try again.");
    }
  };

  return {
    videoUrl,
    setVideoUrl,
    videos,
    setVideos,
    query,
    setQuery,
    messages,
    setMessages,
    indexingMessage,
    isLoading,
    handleEnterVideo,
    handleQuery,
    handleClearVideos,
  };
}
