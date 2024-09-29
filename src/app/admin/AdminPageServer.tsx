import { getAllArticles } from "@/lib/db";

export async function AdminPageServer() {
  try {
    const articles = await getAllArticles();
    console.log("Server: Fetched articles:", articles);
    return { articles };
  } catch (error) {
    console.error("Server: Error fetching articles:", error);
    throw error;
  }
}
