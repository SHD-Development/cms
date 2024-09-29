import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const adminToken = cookies().get("admin_token");

  if (adminToken && adminToken.value === "true") {
    return NextResponse.json({ isAdmin: true });
  } else {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}
