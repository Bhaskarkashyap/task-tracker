import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/jwt"

// Get a specific project
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Validate project ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 })
    }

    // Get project from database
    const client = await clientPromise
    const db = client.db()
    const projectsCollection = db.collection("projects")

    const project = await projectsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: decoded.userId,
    })

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Convert ObjectId to string
    const formattedProject = {
      ...project,
      _id: project._id.toString(),
    }

    return NextResponse.json(formattedProject)
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Update a project
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const { params } = context
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Validate project ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 })
    }

    const { name, description } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Project name is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const projectsCollection = db.collection("projects")

    // Update project
    const result = await projectsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id), userId: decoded.userId },
      {
        $set: {
          name,
          description: description || "",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Convert ObjectId to string
    const updatedProject = {
      ...result,
      _id: result._id.toString(),
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Delete a project


export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    // ✅ Extract params safely here
    const projectId = context.params.id

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const projectsCollection = db.collection("projects")
    const tasksCollection = db.collection("tasks")

    const result = await projectsCollection.deleteOne({
      _id: new ObjectId(projectId),
      userId: decoded.userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    await tasksCollection.deleteMany({
      projectId,
      userId: decoded.userId,
    })

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

