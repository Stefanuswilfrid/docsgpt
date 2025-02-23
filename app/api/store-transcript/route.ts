import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pineconeClient";

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoId, videoTitle, projectName } = await request.json();
    if (!transcript || !videoId || !projectName) {
      return NextResponse.json({ error: "Missing required fields (transcript, videoId, projectName)" }, { status: 400 });
    }

    console.log(`🚀 Storing transcript for project: ${projectName}, video: ${videoId}`);

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY! });
    const vector = await embeddings.embedDocuments([transcript]);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    await index.upsert([
      {
        id: `project-${projectName}-video-${videoId}`, 
        values: vector[0], 
        metadata: { transcript, videoId, videoTitle, projectName },
      }
    ]);

    return NextResponse.json({ status: 200, message: "Transcript stored successfully!" });
  } catch (error) {
    console.error("❌ Error storing embeddings:", error);
    return NextResponse.json({ error: "Failed to store embeddings" }, { status: 500 });
  }
}
