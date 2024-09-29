"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import Image from "next/image";
import { Article } from "@/types";

export default function CheckArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "已批准";
      case "rejected":
        return "已拒絕";
      default:
        return "審核中";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error || "文章不存在或加載失敗"}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="max-w-2xl w-full mx-4 bg-gray-800 text-white shadow-xl">
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="text-center"
          >
            文章狀態
          </Typography>
          {article.imageUrl && (
            <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl}
                alt="Article image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div className="space-y-2">
            <Typography variant="body1">
              <strong>文章ID:</strong> {article.id}
            </Typography>
            <Typography variant="body1">
              <strong>內容:</strong> {article.content.substring(0, 100)}...
            </Typography>
            <Typography variant="body1">
              <strong>狀態:</strong>{" "}
              <span className={`font-bold ${getStatusColor(article.status)}`}>
                {getStatusText(article.status)}
              </span>
            </Typography>
            {article.status === "rejected" && article.rejectionReason && (
              <Typography variant="body1">
                <strong>拒絕原因:</strong> {article.rejectionReason}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>提交時間:</strong>{" "}
              {new Date(article.createdAt).toLocaleString()}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
