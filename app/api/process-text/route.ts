"use server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, fileUrl } = await request.json();

    console.log("📝 Storing Extracted Text:", text.slice(0, 500));


    return NextResponse.json({ status: 200, message: "Text stored successfully!" });
  } catch (error) {
    console.error("❌ Error processing text:", error);
    return NextResponse.json({ error: "Failed to store text" }, { status: 500 });
  }
}
