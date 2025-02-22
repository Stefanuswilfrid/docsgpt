import { NextApiRequest, NextApiResponse } from "next";
import { pinecone } from "../../lib/pineconeClient";
import { OpenAIEmbeddings } from "@langchain/openai"; 
import { OpenAI } from "@langchain/openai"; 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const queryEmbedding = await embeddings.embedQuery(query);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const results = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    const context = results.matches
      .map((match) => match.metadata?.text || "")
      .join("\n\n");

    const openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      modelName: "gpt-3.5-turbo", 
    });

    const response = await openai.invoke(`Context:\n${context}\n\nQuestion: ${query}\nAnswer:`);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
