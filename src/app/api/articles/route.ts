import { NextResponse } from "next/server";
import { getApprovedArticles } from "@/lib/db";

export async function GET() {
  try {
    const articles = await getApprovedArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("API: Error fetching approved articles:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch approved articles: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
