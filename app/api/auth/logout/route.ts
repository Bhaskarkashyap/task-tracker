import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
    })

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
