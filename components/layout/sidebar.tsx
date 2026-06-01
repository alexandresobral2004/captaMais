"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FileText, 
  CheckCircle, 
  Users, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/editais", label: "Meus Editais", icon: FileText },
  { href: "/projetos", label: "Projetos Aprovados", icon: CheckCircle },
  { href: "/usuarios", label: "Usuários da Instituição", icon: Users },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

interface SidebarProps {
  mobileOnClose?: () => void;
}

export function Sidebar({ mobileOnClose }: SidebarProps) {
  const pathname = usePathname()

  const handleNavClick = () => {
    if (mobileOnClose) {
      mobileOnClose();
    }
  };

  return (
    <div className={cn(
      "sidebar",
      // No modo mobile (dentro do drawer), o sidebar não precisa de altura fixa
      // pois o container do drawer já controla isso
      mobileOnClose && "h-full min-h-full"
    )}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            C+
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Capta</h1>
          <span className="text-blue-600 font-bold dark:text-blue-400">+</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Gestão de Editais</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "nav-item",
                isActive && "active"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Plano Governamental</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vence em: 15 dias</p>
        </div>
      </div>
    </div>
  )
}