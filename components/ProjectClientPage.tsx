// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import type { Project, Task } from "@/lib/types"
// import { toast } from "@/hooks/use-toast"

// export function ProjectClientPage({ id }: { id: string }) {
//   const router = useRouter()
//   const [project, setProject] = useState<Project | null>(null)
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [user, setUser] = useState<{ name: string; email: string } | null>(null)

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch("/api/auth/me")
//         if (!response.ok) {
//           router.push("/login")
//           return
//         }
//         const userData = await response.json()
//         setUser(userData)
//       } catch (error) {
//         router.push("/login")
//       }
//     }

//     const fetchProject = async () => {
//       try {
//         const response = await fetch(`/api/projects/${id}`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch project")
//         }
//         const data = await response.json()
//         setProject(data)
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load project",
//           variant: "destructive",
//         })
//         router.push("/dashboard")
//       }
//     }

//     const fetchTasks = async () => {
//       try {
//         const response = await fetch(`/api/projects/${id}/tasks`)
//         if (!response.ok) {
//           throw new Error("Failed to fetch tasks")
//         }
//         const data = await response.json()
//         setTasks(data)
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load tasks",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     checkAuth()
//     fetchProject()
//     fetchTasks()
//   }, [id, router])


// }
