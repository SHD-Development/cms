import { NextResponse } from "next/server";
import { approveArticle } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await approveArticle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API: Error approving article:", error);
    return NextResponse.json(
      { error: "Failed to approve article" },
      { status: 500 }
    );
  }
}
