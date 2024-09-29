import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("admin_token");
  return NextResponse.json({ success: true });
}
