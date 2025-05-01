"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { TaskCard } from "@/components/task-card"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { UserNav } from "@/components/user-nav"
import type { Project, Task } from "@/lib/types"
import Navbar from "@/components/navbar"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    params.then((resolved) => setId(resolved.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        router.push("/login")
      }
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch project")
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${id}/tasks`)
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    fetchProject()
    fetchTasks()
  }, [id, router])

  const handleCreateTask = async (taskData: { title: string; description: string }) => {
    if (!id) return

    try {
      const response = await fetch(`/api/projects/${id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create task")
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])

      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!id) return

    try {
      const response = await fetch(`/api/projects/${id}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update task")
      }

      const updatedTask = await response.json()
      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)))

      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return

    try {
      const response = await fetch(`/api/projects/${id}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete task")
      }

      setTasks(tasks.filter((task) => task._id !== taskId))

      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10">
        {/* <Navbar user={user} /> */}
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6">
         <div className="flex justify-between">
         <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Task
            </Button>
         </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{project?.name || "Loading..."}</h1>
           
          </div>
          {/* {project?.description && <p className="text-muted-foreground mt-2">{project.description}</p>} */}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </Card>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex justify-center pt-72 flex-col items-center text-center">
            <div className="flex flex-col gap-2">
              <div>No Task yet</div>
              <p className="text-muted-foreground">Create your first Task to get started</p>
            </div>
           
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={(updates) => handleUpdateTask(task._id, updates)}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </div>
        )}
      </main>

      <CreateTaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateTask} />
    </div>
  )
}
