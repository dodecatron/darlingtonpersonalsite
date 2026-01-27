import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const projects = [
  { id: 1, slug: "project-one", title: "Project One", description: "A brief description of this project." },
  { id: 2, slug: "project-two", title: "Project Two", description: "A brief description of this project." },
  { id: 3, slug: "project-three", title: "Project Three", description: "A brief description of this project." },
  { id: 4, slug: "project-four", title: "Project Four", description: "A brief description of this project." },
  { id: 5, slug: "project-five", title: "Project Five", description: "A brief description of this project." },
  { id: 6, slug: "project-six", title: "Project Six", description: "A brief description of this project." },
]

export function Projects() {
  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-6 text-2xl font-medium">Projects</h1>

      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.slug}`}>
            <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <div className="mb-3 h-24 w-full rounded bg-gray-200" />
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
