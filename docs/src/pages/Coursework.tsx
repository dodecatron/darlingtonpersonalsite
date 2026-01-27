import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const courses = [
  { id: 1, slug: "course-one", title: "Course One", description: "A brief description of this course." },
  { id: 2, slug: "course-two", title: "Course Two", description: "A brief description of this course." },
  { id: 3, slug: "course-three", title: "Course Three", description: "A brief description of this course." },
  { id: 4, slug: "course-four", title: "Course Four", description: "A brief description of this course." },
  { id: 5, slug: "course-five", title: "Course Five", description: "A brief description of this course." },
  { id: 6, slug: "course-six", title: "Course Six", description: "A brief description of this course." },
]

export function Coursework() {
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
            <BreadcrumbPage>Coursework</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-6 text-2xl font-medium">Coursework</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} to={`/coursework/${course.slug}`}>
            <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
