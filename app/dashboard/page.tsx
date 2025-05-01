"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { UserNav } from "@/components/user-nav"
import type { Project } from "@/lib/types"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
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

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    fetchProjects()
  }, [ router])

  const handleCreateProject = async (projectData: { name: string; description: string }) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }
  
      const newProject = await response.json()
      
     
      setProjects([newProject, ...projects])
  
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      })
  
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      })
    }
  }
  

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete project")
      }
  
      setProjects(projects.filter((project) => project._id !== projectId))
  
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      })
    }
  }
  

  const canCreateProject = projects.length < 4

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10  ">
       
        <Navbar user={user} projectLength = {canCreateProject} setDialog={setIsDialogOpen} />
        
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-gray-200 dark:bg-gray-700" />
                <CardContent className="h-32 mt-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center pt-72 flex-col items-center text-center">
            <div className="flex flex-col gap-2">
              <div>No projects yet</div>
              <p className="text-muted-foreground">Create your first project to get started</p>
            </div>
           
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} onDelete={handleDeleteProject} />
            ))}
          </div>
        )}

        {!canCreateProject && projects.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
            You have reached the maximum limit of 4 projects.
          </div>
        )}
      </main>

      <CreateProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateProject} />
    </div>
  )
}
