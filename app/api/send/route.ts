import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pinecone } from "@/lib/pineconeClient";

export async function POST(request: NextRequest) {
  try {
    const { query, projectName } = await request.json();

    if (!query || !projectName) {
      return NextResponse.json(
        { error: "Query and projectName are required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Searching for: ${query} in project: ${projectName}`);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const queryVector = await embeddings.embedDocuments([query]);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const results = await index.query({
      vector: queryVector[0],
      topK: 3,
      includeMetadata: true,
      filter: { projectName },
    });

    const context = results.matches
      .map((match) => match.metadata?.transcript || "")
      .join("\n\n");

    const openai = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

    const response = await openai.call([
      {
        role: "system",
        content: `You're a chill, Gen Z-style AI assistant. Keep responses **short**,  **brief**, **to the point** and **friendly**. Be helpful but not robotic. If the question is off-topic, respond with humor while staying helpful.
    
    Context:
    ${context}
    
    Now, respond in a fun, engaging way:`,
      },
      {
        role: "user",
        content: query,
      },
    ]);

    console.log("AI response:", response.content);

    return NextResponse.json({ response: response.content });
  } catch (error) {
    console.error("❌ Error querying AI:", error);
    return NextResponse.json(
      { error: "Failed to retrieve AI response" },
      { status: 500 }
    );
  }
}
