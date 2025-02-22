import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pinecone } from "@/lib/pineconeClient";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    console.log(`🔍 Searching across all videos for: ${query}`);

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
    const queryVector = await embeddings.embedDocuments([query]);

    //  Query Pinecone to search across ALL videos
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const results = await index.query({ vector: queryVector[0], topK: 5, includeMetadata: true });

    const context = results.matches
      .map((match) => {
        const title = match.metadata?.videoTitle || "Unknown Video";
        return `**${title}**:\n${match.metadata?.transcript || ""}`;
      })
      .join("\n\n");

    console.log("🔍 Retrieved Context:", context.slice(0, 500)); // Debugging

    const openai = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

    const messages = [
      new SystemMessage(`You are an AI assistant. Use the following context from multiple YouTube videos to answer the user's question, answer briefly please:\n\n${context}`),
      new HumanMessage(query),
    ];

    const response = await openai.call(messages);

    console.log("🤖 OpenAI Raw Response:", response);

    let textResponse = "";
    if (typeof response === "string") {
      textResponse = response;
    } else if (Array.isArray(response) && response.length > 0) {
      textResponse = response[0].content || "⚠️ AI did not return a valid text response.";
    } else if (response?.content) {
      textResponse = response.content;
    } else {
      textResponse = "⚠️ Unexpected response format from AI.";
    }

    return NextResponse.json({ response: textResponse });
  } catch (error) {
    console.error("❌ Error querying Pinecone:", error);
    return NextResponse.json({ error: "Failed to retrieve data" }, { status: 500 });
  }
}
