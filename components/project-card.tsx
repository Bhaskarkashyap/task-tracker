import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ArrowRight, DeleteIcon, Trash } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/types"
import { AnimatedTooltipPreview } from "./AnimatedTooltip"

interface ProjectCardProps {
  project: Project,
  onDelete: (projectId: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {


  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden relative lg:h-60 h-72">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{project.name}</CardTitle>
      
        <CardDescription className="flex items-center text-xs">
          <CalendarDays className="mr-1 h-3 w-3" />
          Created on {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className=" absolute bottom-0 flex justify-between w-full lg:flex-row flex-col gap-y-3  ">
        
        <div className="flex gap-2  justify-between lg:justify-normal  w-full  ">
       <Link href={`/projects/${project._id}`} className="">
          <Button className="" variant="outline">
            View
            <ArrowRight className="ml-1" />
          </Button>
        </Link>
          <div className="justify-end lg:justify-normal ">
          <AnimatedTooltipPreview tip={true} />
          </div>
       </div>
       <div className="w-full lg:w-auto">
  <Button variant="destructive" onClick={() => onDelete(project._id)} className="w-full flex items-center justify-center">
    <Trash  className="text-white" />
  </Button>
</div>

      
      
      </CardFooter>
    </Card>
  )
}
