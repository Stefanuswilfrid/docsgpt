import { useState, useEffect } from "react";
import axios from "axios";

export default function YouTubeChat() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<{ title: string; videoId: string }[]>([]);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const storedVideos = localStorage.getItem("youtubeVideos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  const handleEnterVideo = async () => {
    if (!videoUrl) return;

    try {
      const res = await axios.post("/api/get-transcript", { videoUrl });
      const transcript = res.data.transcript;
      const videoId = res.data.videoId;
      const videoTitle = res.data.videoTitle;

      await axios.post("/api/store-transcript", { transcript, videoId, videoTitle });

      const newVideo = { title: videoTitle, videoId };
      setVideos((prev) => [...prev, newVideo]);
      localStorage.setItem("youtubeVideos", JSON.stringify([...videos, newVideo]));

      setVideoUrl("");
    } catch (error) {
      console.error("❌ Error processing video:", error);
    }
  };

  const handleQuery = async () => {
    if (!query) return;
  
    try {
      const res = await axios.post("/api/query", { query });
  
      let textResponse = "";
      if (typeof res.data.response === "string") {
        textResponse = res.data.response;
      } else {
        textResponse = "⚠️ AI Response Error: Unexpected data format.";
        console.error("⚠️ Unexpected response format:", res.data.response);
      }
  
      setResponse(textResponse);
    } catch (error) {
      console.error("❌ API Error:", error);
      setResponse("⚠️ Failed to get a response from AI.");
    }
  };
  

  return (
    <div className="flex w-full p-6 space-x-6">
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Enter YouTube Video</h2>
        <input 
          type="text" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
          placeholder="Enter YouTube URL" 
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={handleEnterVideo} 
          className="w-full mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Enter
        </button>

        <h3 className="mt-4 text-md font-semibold">Stored Videos:</h3>
        <ul className="mt-2 space-y-2">
          {videos.map((video, index) => (
            <li key={index} className="p-2 border rounded bg-white">
              🎥 {video.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>
        <p className="text-gray-700 mb-2">Ask questions about all stored videos!</p>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Ask AI a question about the videos..." 
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={handleQuery} 
          className="w-full mt-2 p-2 bg-green-500 text-white rounded"
        >
          Ask AI
        </button>

        {response && (
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <h3 className="font-semibold">AI Response:</h3>
            <p className="text-gray-700">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
