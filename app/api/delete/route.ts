import { pinecone } from "@/lib/pineconeClient"; // Import the Pinecone client
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pdfFileName, projectName } = await req.json(); 

  try {
    if (!pdfFileName || !projectName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

    const vectorId = `project-${projectName}-pdf-${pdfFileName}`;
    console.log(vectorId)
    await index.deleteOne(vectorId );

    return NextResponse.json({ message: `File ${pdfFileName} deleted from Pinecone successfully` });
  } catch (error) {
    console.error("Error deleting file from Pinecone:", error);
    return NextResponse.json({ error: "Failed to delete file from Pinecone" }, { status: 500 });
  }
}

