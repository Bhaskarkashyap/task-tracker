import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const cookieStore = await cookies(); // ✅ Await the cookies() promise
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id: projectId } = params;

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection("projects");
    const tasksCollection = db.collection("tasks");

    const project = await projectsCollection.findOne({
      _id: new ObjectId(projectId),
      userId: decoded.userId,
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const tasks = await tasksCollection
      .find({ projectId, userId: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedTasks = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const cookieStore = await cookies(); // ✅ Await the cookies() promise
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id: projectId } = params;

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 });
    }

    const { title, description, status = "todo" } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: "Task title is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const projectsCollection = db.collection("projects");
    const tasksCollection = db.collection("tasks");

    const project = await projectsCollection.findOne({
      _id: new ObjectId(projectId),
      userId: decoded.userId,
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const now = new Date();
    const completedAt = status === "completed" ? now : null;

    const result = await tasksCollection.insertOne({
      title,
      description: description || "",
      status,
      projectId,
      userId: decoded.userId,
      createdAt: now,
      updatedAt: now,
      completedAt,
    });

    const newTask = {
      _id: result.insertedId.toString(),
      title,
      description: description || "",
      status,
      projectId,
      userId: decoded.userId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      completedAt: completedAt ? completedAt.toISOString() : null,
    };

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
