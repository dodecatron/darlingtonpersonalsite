import { Outlet } from "react-router-dom"

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-1/2 min-w-[600px] py-12">
        <Outlet />
      </main>
    </div>
  )
}
