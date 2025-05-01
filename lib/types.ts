export interface User {
  _id: string
  name: string
  email: string
  country: string
  createdAt: string
}

export interface Project {
  _id: string
  name: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: string
  title: string
  description: string
  status: string
  projectId: string
  userId: string
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
