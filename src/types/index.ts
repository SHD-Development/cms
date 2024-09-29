export interface Article {
  id: string;
  content: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  rejectionReason?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  content: string;
  authorName: string;
  createdAt: Date;
}
