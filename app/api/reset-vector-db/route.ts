import { NextRequest, NextResponse } from "next/server";
import { pinecone } from "@/lib/pineconeClient";

export async function POST(request: NextRequest) {
  try {
    console.log(`🚀 Deleting all indexed videos in Pinecone...`);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    await index.deleteAll({});

    return NextResponse.json({ message: "All indexed videos cleared successfully!" });
  } catch (error) {
    console.error("❌ Error resetting Pinecone:", error);
    return NextResponse.json({ error: "Failed to reset Pinecone" }, { status: 500 });
  }
}
