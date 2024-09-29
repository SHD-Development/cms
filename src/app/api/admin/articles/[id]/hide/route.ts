import { NextResponse } from "next/server";
import { hideArticle } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await hideArticle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API: Error hiding article:", error);
    return NextResponse.json(
      { error: "Failed to hide article" },
      { status: 500 }
    );
  }
}
