"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/check");
        setIsAdmin(response.ok);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        setIsAdmin(false);
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!isAdmin) return null;

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: 0,
        bottom: "auto",
        backgroundColor: isHovered
          ? "rgba(25, 118, 210, 1)"
          : "rgba(25, 118, 210, 0.4)",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          管理員模式
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          登出
        </Button>
      </Toolbar>
    </AppBar>
  );
}
