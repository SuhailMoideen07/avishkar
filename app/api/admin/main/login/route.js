import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const MAIN_ADMIN = {
  username: process.env.MAIN_ADMIN_USERNAME,
  password: process.env.MAIN_ADMIN_PASSWORD,
};

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (
      username !== MAIN_ADMIN.username ||
      password !== MAIN_ADMIN.password
    ) {
      return NextResponse.json(
        { message: "Invalid main admin credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { role: "main-admin" },
      process.env.MAIN_ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Main admin login successful",
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
