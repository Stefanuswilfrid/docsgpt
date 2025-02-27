import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|\/v\/|\/e\/|watch\?v=|\/watch\?feature=player_embedded&v=|youtu\.be\/|\/shorts\/|\/live\/|\/watch\?t=[0-9]+&v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();
    if (!videoUrl) return NextResponse.json({ error: "Video URL is required" }, { status: 400 });

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

    console.log(` Fetching transcript for: ${videoId}`);

    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      console.error(" No transcript available for this video:", err);
      return NextResponse.json({ error: "No transcript available for this video." }, { status: 400 });
    }

    const extractedText = transcript.map((entry) => entry.text).join(" ");

    const { data } = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const videoTitle = data.title;

    return NextResponse.json({ status: 200, transcript: extractedText, videoId, videoTitle });
  } catch (error) {
    console.error(" Error fetching transcript:", error);
    return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
  }
}
