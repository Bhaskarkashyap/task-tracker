import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/jwt"

// Get all projects for the authenticated user
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const projectsCollection = db.collection("projects")

    const projects = await projectsCollection
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedProjects = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
    }))

    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Create a new project
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Project name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const projectsCollection = db.collection("projects")

    const projectCount = await projectsCollection.countDocuments({ userId: decoded.userId })
    if (projectCount >= 4) {
      return NextResponse.json({ message: "You can only have up to 4 projects" }, { status: 400 })
    }

    const now = new Date()
    const result = await projectsCollection.insertOne({
      name,
      description: description || "",
      userId: decoded.userId,
      createdAt: now,
      updatedAt: now,
    })

    const newProject = {
      _id: result.insertedId.toString(),
      name,
      description: description || "",
      userId: decoded.userId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
