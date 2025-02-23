import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function useYouTubeManager(projectName: string | null) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<{ title: string; videoId: string }[]>([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [indexingMessage, setIndexingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectName) {
      const storedVideos = localStorage.getItem(`videos-${projectName}`);
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos));
      }
    }
  }, [projectName]);

  const handleEnterVideo = async () => {
    if (!videoUrl || !projectName) return;
    setIsLoading(true);

    try {
      const res = await axios.post("/api/get-transcript", { videoUrl, projectName });
      const { transcript, videoId, videoTitle } = res.data;

      await axios.post("/api/store-transcript", { transcript, videoId, videoTitle, projectName });

      const newVideo = { title: videoTitle, videoId };
      setVideos((prev) => [...prev, newVideo]);
      localStorage.setItem(`videos-${projectName}`, JSON.stringify([...videos, newVideo]));

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
    if (!query || !projectName) return;
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "user", content: query }]);
      const res = await axios.post("/api/query", { query, projectName });
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

  const handleResetVectorDB = async () => {
    if (!projectName) return;

    const confirmReset = window.confirm("Are you sure you want to reset the AI knowledge base for this project?");
    if (!confirmReset) return;

    try {
      await axios.post("/api/reset-vector-db", { projectName });

      setIndexingMessage("AI knowledge base has been reset.");
    } catch (error) {
      console.error("❌ Error resetting vector database:", error);
      setIndexingMessage("Failed to reset AI knowledge base. Try again.");
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
    handleResetVectorDB,
  };
}
