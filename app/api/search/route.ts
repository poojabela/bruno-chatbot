import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { getEmbedding, generateResponse } from "@/app/lib/openai";
import { sql, cosineDistance, desc, gt } from "drizzle-orm";
import { documents } from "@/app/db/schema";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const lastMessage = messages[messages.length - 1];

    // Get embedding for the query
    const queryEmbedding = await getEmbedding(lastMessage.content);

    // Perform semantic search

    const similarity = sql<number>`1 - (${cosineDistance(
      documents.content_embeddings,
      queryEmbedding
    )})`;

    const searchResults = await db.query.documents.findMany({
      columns: {
        content: true,
      },
      where: gt(similarity, 0.5),
      orderBy: desc(similarity),
      limit: 5,
    });

    const context = searchResults.map((r) => r.content).join("\n\n");

    return generateResponse(messages, context);
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      { error: "Failed to process search" },
      { status: 500 }
    );
  }
}
