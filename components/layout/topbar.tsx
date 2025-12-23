"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, User, Settings, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    // Limpar qualquer sessão/autenticação aqui se necessário
    router.push("/")
  }

  return (
    <div className="topbar">
      {/* Search */}
      <div style={{ flex: 1, maxWidth: '24rem', position: 'relative' }}>
        <Search style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-gray-400)',
          width: '1rem',
          height: '1rem'
        }} />
        <Input
          type="text"
          placeholder="Buscar editais, projetos ou usuários..."
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-lg">
        <Button variant="ghost" size="sm" style={{ position: 'relative' }}>
          <Bell style={{ width: '1rem', height: '1rem' }} />
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: 'var(--color-danger)',
            borderRadius: 'var(--radius-full)'
          }}></span>
        </Button>
        <div style={{ height: '2rem', width: '1px', backgroundColor: 'var(--color-gray-200)' }}></div>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-md"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <p className="text-sm font-medium text-gray-900">
                Prefeitura Municipal de Exemplo
              </p>
              <p className="text-xs text-gray-600">Gestor Administrativo</p>
            </div>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-gray-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-gray-600)' }} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '3rem',
              right: 0,
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '14rem',
              overflow: 'hidden',
              zIndex: 20
            }}>
              <button
                onClick={() => {
                  router.push("/configuracoes")
                  setIsMenuOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-700)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings style={{ width: '1rem', height: '1rem' }} />
                <span>Alterar dados</span>
              </button>
              <div style={{
                height: '1px',
                backgroundColor: 'var(--border-color)',
                margin: '0.25rem 0'
              }}></div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
