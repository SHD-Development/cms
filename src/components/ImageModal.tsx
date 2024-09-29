"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal, Box, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ImageModalProps {
  src: string;
  alt: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        onClick={handleOpen}
        className="cursor-pointer relative w-full h-full group"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="rounded-lg transition-all duration-300 group-hover:brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            點擊放大
          </span>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "relative",
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "90vh",
              bgcolor: "rgba(0, 0, 0, 0.9)",
              boxShadow: 24,
              p: 0,
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1, // 確保按鈕在圖片上層
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <div
              style={{ position: "relative", width: "100%", paddingTop: "60%" }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
