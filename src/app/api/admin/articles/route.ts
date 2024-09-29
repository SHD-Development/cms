import { NextResponse } from "next/server";
import { getAllArticlesForAdmin } from "@/lib/db";

export async function GET() {
  try {
    const articles = await getAllArticlesForAdmin();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("API: Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
