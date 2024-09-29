"use server";
import { PrismaClient } from "@prisma/client";
import { Article, Comment } from "@/types";
// import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = prisma;
  }
}

export async function getApprovedArticles(): Promise<Article[]> {
  return prisma.article.findMany({
    where: { status: "approved" },
  });
}

export async function submitArticle(
  content: string,
  imageUrl: string
): Promise<string> {
  const article = await prisma.article.create({
    data: {
      content,
      imageUrl: imageUrl || null, // 允許 imageUrl 為空字符串，此時存儲為 null
      status: "pending",
    },
  });
  return article.id;
}

export async function getPendingArticles(): Promise<Article[]> {
  return prisma.article.findMany({
    where: { status: "pending" },
  });
}

export async function approveArticle(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: { status: "approved" },
  });
}

export async function rejectArticle(id: string, reason: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: {
      status: "rejected",
      rejectionReason: reason,
    },
  });
}

export async function getAllArticles(): Promise<Article[]> {
  return prisma.article.findMany();
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await prisma.article.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      console.log(
        `Article with id ${id} not found, it may have been already deleted.`
      );
    } else {
      throw error;
    }
  }
}

export async function addArticle(
  article: Omit<Article, "id" | "createdAt">
): Promise<Article> {
  return prisma.article.create({
    data: article,
  });
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    return article;
  } catch (error) {
    console.error("Error in getArticleById:", error);
    throw error;
  }
}

export async function getCommentsByArticleId(
  articleId: string
): Promise<Comment[]> {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(
  articleId: string,
  content: string,
  authorName: string
): Promise<Comment> {
  return prisma.comment.create({
    data: {
      articleId,
      content,
      authorName,
    },
  });
}

export async function hideArticle(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: { status: "rejected" },
  });
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  return prisma.article.findMany();
}

export async function deleteComment(commentId: string): Promise<void> {
  await prisma.comment.delete({
    where: { id: commentId },
  });
}
