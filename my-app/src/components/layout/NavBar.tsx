import { Link } from "react-router-dom"

export function NavBar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex h-14 w-1/2 min-w-[600px] items-center justify-between border-b">
        <Link to="/" className="text-lg font-medium">
          Adrian Darlington
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link to="/projects" className="hover:underline">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/coursework" className="hover:underline">
              Coursework
            </Link>
          </li>
          <li>
            <Link to="/resume" className="hover:underline">
              Resume
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
