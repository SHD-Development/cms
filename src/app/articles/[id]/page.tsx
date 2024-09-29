"use client";

import { useState, useEffect } from "react";
import CommentSection from "@/components/CommentSection";
import ImageModal from "@/components/ImageModal";
import { Card, CardContent, Typography, Skeleton } from "@mui/material";
import { Article, Comment } from "@/types";

function ArticleSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton variant="text" height={60} className="mb-4" />
      <Skeleton variant="rectangular" height={400} className="mb-4" />
      <Card className="bg-gray-800 text-white shadow-xl mb-8">
        <CardContent>
          <Skeleton variant="text" height={100} />
        </CardContent>
      </Card>
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch("/api/admin/check");
        setIsAdmin(response.ok);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    }

    async function fetchData() {
      try {
        const articleResponse = await fetch(`/api/articles/${params.id}`);
        const commentsResponse = await fetch(
          `/api/articles/${params.id}/comments`
        );

        if (!articleResponse.ok) {
          if (articleResponse.status === 404) {
            setError("文章不存在或無法訪問");
          } else {
            throw new Error(
              `Failed to fetch article: ${articleResponse.statusText}`
            );
          }
          return;
        }

        if (!commentsResponse.ok) {
          throw new Error(
            `Failed to fetch comments: ${commentsResponse.statusText}`
          );
        }

        const articleData = await articleResponse.json();
        const commentsData = await commentsResponse.json();

        console.log("Article data:", articleData);
        console.log("Comments data:", commentsData);

        setArticle(articleData.article);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
    fetchData();
  }, [params.id]);

  if (loading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!article) {
    return <div className="container mx-auto p-4 text-center">文章不存在</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {article.content.substring(0, 50)}...
      </h1>
      {isAdmin && article.status !== "approved" && (
        <div className="bg-yellow-600 text-white p-2 mb-4 rounded">
          警告：此文章尚未批准。狀態：{article.status}
        </div>
      )}
      {article.imageUrl && (
        <div className="mb-4 relative h-64 md:h-96 rounded-lg overflow-hidden">
          <ImageModal src={article.imageUrl} alt="Article image" />
        </div>
      )}
      <Card className="bg-gray-800 text-white shadow-xl mb-8">
        <CardContent>
          <Typography variant="body1" component="p" className="mb-4">
            {article.content}
          </Typography>
        </CardContent>
      </Card>
      <CommentSection articleId={article.id} initialComments={comments} />
    </div>
  );
}
