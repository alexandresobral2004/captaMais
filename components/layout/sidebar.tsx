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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-sm">
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
            fontWeight: 'bold'
          }}>
            C+
          </div>
          <h1 className="text-xl font-bold text-gray-900">Capta</h1>
          <span className="text-blue-600 font-bold">+</span>
        </div>
        <p className="text-sm text-gray-600 mt-md">Gestão de Editais</p>
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
              className={cn("nav-item", isActive && "active")}
            >
              <Icon style={{ width: '1rem', height: '1rem' }} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="bg-gray-50 rounded-lg p-md">
          <p className="text-sm font-medium text-gray-900">Plano Governamental</p>
          <p className="text-xs text-gray-600 mt-xs">Vence em: 15 dias</p>
        </div>
      </div>
    </div>
  )
}
