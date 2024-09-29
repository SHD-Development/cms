import { Article } from "@/types";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt="Article image"
          width={300}
          height={200}
        />
      )}
      <div className="p-4">
        <p className="text-white text-lg font-semibold mb-2 line-clamp-3">
          {article.content}
        </p>
        <p className="text-sm text-gray-400">
          發布於: {article.createdAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
