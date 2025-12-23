import { Sidebar } from "./sidebar"
import { TopBar } from "./topbar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  )
}
