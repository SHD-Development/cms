"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";

export default function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const response = await fetch("/api/admin/check");
      setIsAdmin(response.ok);
      setLoading(false);
    };
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom color="white">
          評論
        </Typography>
        {[...Array(3)].map((_, index) => (
          <Box key={index} mb={2} p={2} bgcolor="grey.800" borderRadius={1}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))}
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="rectangular" height={56} className="mt-2" />
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newComment.trim()) {
      setError("評論內容不能為空");
      return;
    }

    if (!authorName.trim()) {
      setError("請輸入您的名稱");
      return;
    }

    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, authorName }),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([savedComment, ...comments]);
        setNewComment("");
        setAuthorName("");
      } else {
        setError("評論提交失敗，請稍後再試");
      }
    } catch (err) {
      setError("評論提交時發生錯誤");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/articles/${articleId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        const errorData = await response.json();
        setError(errorData.error || "刪除評論失敗");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("刪除評論時發生錯誤");
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom color="white">
        評論
      </Typography>
      {comments.map((comment) => (
        <Box
          key={comment.id}
          mb={2}
          p={2}
          bgcolor="grey.800"
          borderRadius={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <div>
            <Typography variant="body1" color="white">
              {comment.content}
            </Typography>
            <Typography variant="caption" color="grey.400">
              {comment.authorName} -{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </div>
          {isAdmin && (
            <IconButton
              onClick={() => handleDeleteComment(comment.id)}
              color="error"
            >
              &#x2715; {/* 使用 HTML 實體作為刪除圖標 */}
            </IconButton>
          )}
        </Box>
      ))}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="您的名稱"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          margin="normal"
          error={!!error && !authorName.trim()}
          helperText={error && !authorName.trim() ? "請輸入您的名稱" : ""}
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.7)",
              },
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="添加評論"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          margin="normal"
          error={!!error && !newComment.trim()}
          helperText={error && !newComment.trim() ? "評論內容不能為空" : ""}
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.7)",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          提交評論
        </Button>
      </form>
    </Box>
  );
}
