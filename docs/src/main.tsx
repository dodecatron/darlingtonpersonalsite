import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

// Handle GitHub Pages 404 redirect
function RedirectHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const redirect = sessionStorage.getItem("redirect")
    if (redirect) {
      sessionStorage.removeItem("redirect")
      navigate(redirect, { replace: true })
    }
  }, [navigate])
  return null
}
import "./index.css"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Projects } from "./pages/Projects"
import { ProjectDetail } from "./pages/ProjectDetail"
import { Coursework } from "./pages/Coursework"
import { CourseDetail } from "./pages/CourseDetail"
import { Resume } from "./pages/Resume"
import { KMap } from "./pages/KMap"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="coursework" element={<Coursework />} />
          <Route path="coursework/:slug" element={<CourseDetail />} />
          <Route path="resume" element={<Resume />} />
          <Route path="kmap" element={<KMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
