import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/jwt"

// Get a specific task
export async function GET(request: Request, { params }: { params: { id: string; taskId: string } }) {
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

    // Validate IDs
    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.taskId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const tasksCollection = db.collection("tasks")

    // Get task
    const task = await tasksCollection.findOne({
      _id: new ObjectId(params.taskId),
      projectId: params.id,
      userId: decoded.userId,
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Convert ObjectId to string
    const formattedTask = {
      ...task,
      _id: task._id.toString(),
    }

    return NextResponse.json(formattedTask)
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Update a task
export async function PATCH(request: Request, { params }: { params: { id: string; taskId: string } }) {
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

    // Validate IDs
    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.taskId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updates = await request.json()
    const { title, description, status, completedAt } = updates

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description

    // Handle status changes and completedAt date
    if (status !== undefined) {
      updateData.status = status

      // If status is changing to completed, set completedAt to now
      if (status === "completed") {
        updateData.completedAt = completedAt || new Date()
      }

      // If status is changing from completed, remove completedAt
      if (status !== "completed") {
        updateData.completedAt = null
      }
    }

    // If completedAt is explicitly provided, use it
    if (completedAt !== undefined) {
      updateData.completedAt = completedAt
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const tasksCollection = db.collection("tasks")

    // Update task
    const result = await tasksCollection.findOneAndUpdate(
      {
        _id: new ObjectId(params.taskId),
        projectId: params.id,
        userId: decoded.userId,
      },
      { $set: updateData },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Convert ObjectId to string
    const updatedTask = {
      ...result,
      _id: result._id.toString(),
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string; taskId: string } }) {
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

    // Validate IDs
    if (!ObjectId.isValid(params.id) || !ObjectId.isValid(params.taskId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const tasksCollection = db.collection("tasks")

    // Delete task
    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(params.taskId),
      projectId: params.id,
      userId: decoded.userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
