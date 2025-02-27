import { hash } from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignUpForm;
    const { name, email, password, role = "customer" } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Return user without password
    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
