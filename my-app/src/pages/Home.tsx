import { Link } from "react-router-dom"
import { Github, Linkedin, FileText } from "lucide-react"
import pixeladi from "@/assets/pixaladi.png"
import adiwink from "@/assets/adiwink.png"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const spotlightProjects = [
  { id: 1, slug: "project-one", title: "Project One", description: "A brief description of this project." },
  { id: 2, slug: "project-two", title: "Project Two", description: "A brief description of this project." },
  { id: 3, slug: "project-three", title: "Project Three", description: "A brief description of this project." },
  { id: 4, slug: "project-four", title: "Project Four", description: "A brief description of this project." },
]

const spotlightCourses = [
  { id: 1, slug: "course-one", title: "Course One", description: "A brief description of this course." },
  { id: 2, slug: "course-two", title: "Course Two", description: "A brief description of this course." },
  { id: 3, slug: "course-three", title: "Course Three", description: "A brief description of this course." },
  { id: 4, slug: "course-four", title: "Course Four", description: "A brief description of this course." },
]

export function Home() {
  return (
    <div>
      {/* Profile Section */}
      <div className="flex items-start gap-6">
        <div className="group relative h-40 w-40 flex-shrink-0">
          <img
            src={pixeladi}
            alt="Adrian Darlington"
            className="h-40 w-40 object-cover group-hover:opacity-0"
          />
          <img
            src={adiwink}
            alt="Adrian Darlington winking"
            className="absolute inset-0 h-40 w-40 object-cover opacity-0 group-hover:opacity-100"
          />
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-medium">Adrian Darlington</h1>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:underline">
              <Github className="h-4 w-4" />
              Github
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:underline">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a href="#" className="flex items-center gap-1 text-sm hover:underline">
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* Projects Section */}
      <section className="mb-12">
        <Link to="/projects" className="mb-4 inline-block text-xl font-medium hover:underline">
          Projects
        </Link>
        <Carousel className="w-full">
          <CarouselContent>
            {spotlightProjects.map((project) => (
              <CarouselItem key={project.id} className="basis-1/3">
                <Link to={`/projects/${project.slug}`}>
                  <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                    <div className="mb-3 h-24 w-full rounded bg-gray-200" />
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Coursework Section */}
      <section>
        <Link to="/coursework" className="mb-4 inline-block text-xl font-medium hover:underline">
          Coursework
        </Link>
        <Carousel className="w-full">
          <CarouselContent>
            {spotlightCourses.map((course) => (
              <CarouselItem key={course.id} className="basis-1/3">
                <Link to={`/coursework/${course.slug}`}>
                  <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
