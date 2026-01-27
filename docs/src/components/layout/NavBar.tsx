import { Link } from "react-router-dom"

export function NavBar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex h-14 w-full items-center justify-between border-b px-6 md:w-1/2 md:min-w-[600px] md:px-0">
        <Link to="/" className="text-lg font-medium">
          Adrian Darlington
        </Link>
        <ul className="flex items-center gap-4 md:gap-8">
          <li>
            <Link to="/projects" className="text-sm hover:underline md:text-base">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/coursework" className="text-sm hover:underline md:text-base">
              Coursework
            </Link>
          </li>
          <li>
            <Link to="/resume" className="text-sm hover:underline md:text-base">
              Resume
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
