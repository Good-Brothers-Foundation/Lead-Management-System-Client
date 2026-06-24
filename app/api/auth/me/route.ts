import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({
      success: false,
      user: null,
    });
  }
  return NextResponse.json({
    success: true,
    user,
  });
}
export const dynamic = "force-dynamic";
