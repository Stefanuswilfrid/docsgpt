import { NextRequest, NextResponse } from "next/server";
import { pinecone } from "@/lib/pineconeClient";

export async function POST(request: NextRequest) {
  try {
    const { projectName } = await request.json();
    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    console.log(`🗑 Resetting vector database for project: ${projectName}`);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    await index.deleteAll();

    return NextResponse.json({ status: 200, message: "AI knowledge base reset successfully!" });
  } catch (error) {
    console.error("❌ Error resetting vector database:", error);
    return NextResponse.json({ error: "Failed to reset vector database" }, { status: 500 });
  }
}
