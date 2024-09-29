import { NextResponse } from "next/server";
import { getArticleById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminToken = cookies().get("admin_token");
  const isAdmin = adminToken && adminToken.value === "true";

  try {
    const article = await getArticleById(params.id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    if (!isAdmin && article.status !== "approved") {
      return NextResponse.json(
        { error: "Article not available" },
        { status: 404 }
      );
    }
    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
