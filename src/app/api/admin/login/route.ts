import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set("admin_token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
}
