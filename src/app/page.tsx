"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@mui/material";

function ArticlesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <Skeleton variant="rectangular" height={200} />
          <div className="p-4">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">最新文章</h1>
        <Link
          href="/submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          投稿文章
        </Link>
      </div>
      {loading ? (
        <ArticlesSkeleton />
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          目前還沒有已批准的文章。
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/articles/${article.id}`}
              key={article.id}
              className="block"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {article.imageUrl ? (
                  <div className="relative h-48">
                    <Image
                      src={article.imageUrl}
                      alt={article.content.substring(0, 20)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {article.content.substring(0, 50)}...
                  </h2>
                  <p className="text-gray-400 text-sm">
                    發布於: {new Date(article.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
