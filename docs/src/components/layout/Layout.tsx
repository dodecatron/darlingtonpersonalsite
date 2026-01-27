import { Outlet } from "react-router-dom"

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full px-6 py-8 md:w-1/2 md:min-w-[600px] md:px-0 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
