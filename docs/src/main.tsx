import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Projects } from "./pages/Projects"
import { ProjectDetail } from "./pages/ProjectDetail"
import { Coursework } from "./pages/Coursework"
import { CourseDetail } from "./pages/CourseDetail"
import { Resume } from "./pages/Resume"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="coursework" element={<Coursework />} />
          <Route path="coursework/:slug" element={<CourseDetail />} />
          <Route path="resume" element={<Resume />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
