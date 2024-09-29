"use client";

import { useState, useRef } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { handleSubmit } from "../actions";

export default function SubmitPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [articleId, setArticleId] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content) {
      setSnackbarMessage("請填寫內容");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    try {
      const result = await handleSubmit(formData);
      if (result.success) {
        setSnackbarMessage("文章提交成功");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setArticleId(result.articleId);
      } else {
        setSnackbarMessage(result.error || "提交失敗，請稍後再試");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setSnackbarMessage("提交過程中發生錯誤，請稍後再試");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">提交新文章</h1>
      <form
        onSubmit={onSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6"
      >
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="文章內容"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
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
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            name="image"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {image ? "更改圖片" : "選擇圖片"}
          </button>
          {image && (
            <p className="mt-2 text-sm text-gray-300">
              已選擇文件: {image.name}
            </p>
          )}
        </div>
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {submitting ? "提交中..." : "提交"}
        </Button>
      </form>
      {articleId && (
        <div className="mt-4 p-4 bg-green-800 rounded-lg">
          <p className="text-white">
            文章提交成功！您的文章識別碼是：{articleId}
          </p>
          <p className="text-white mt-2">
            您可以使用此連結查看文章狀態：
            <a
              href={`/check/${articleId}`}
              className="text-blue-300 hover:underline"
            >
              /check/{articleId}
            </a>
          </p>
        </div>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
