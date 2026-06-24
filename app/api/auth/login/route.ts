import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const VALID_EMAIL = process.env.ADMIN_EMAIL || "bkdadmin@gmail.com";
    const VALID_PASSWORD = process.env.ADMIN_PASSWORD || "bkdadmin@123";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = { email };
    await setSession(user);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
