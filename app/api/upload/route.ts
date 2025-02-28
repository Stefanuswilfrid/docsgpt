import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pineconeClient";

export async function POST(request: NextRequest) {
  try {
    const { transcript, projectName, pdfFileName } = await request.json();
    if (!transcript || !projectName || !pdfFileName) {
      return NextResponse.json({ error: "Missing required fields (transcript, projectName, pdfFileName)" }, { status: 400 });
    }

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY! });
    const vector = await embeddings.embedDocuments([transcript]);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    await index.upsert([
      {
        id: `project-${projectName}-pdf-${pdfFileName}`,  
        values: vector[0], 
        metadata: { transcript, pdfFileName, projectName },  
      }
    ]);

    return NextResponse.json({ status: 200, message: "PDF transcript stored successfully!" });
  } catch (error) {
    console.error("Error storing embeddings:", error);
    return NextResponse.json({ error: "Failed to store embeddings" }, { status: 500 });
  }
}
