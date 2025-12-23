"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validar usuário de teste
    if (email === "teste@teste.com" && password === "123456") {
      // Login bem-sucedido
      router.push("/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1rem' 
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 'bold',
              fontSize: 'var(--font-size-lg)'
            }}>
              C+
            </div>
            <h1 style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: 700, 
              color: 'var(--color-gray-900)' 
            }}>
              Capta
            </h1>
            <span style={{ 
              color: 'var(--color-primary)', 
              fontWeight: 700, 
              fontSize: 'var(--font-size-3xl)' 
            }}>
              +
            </span>
          </div>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Gestão inteligente de editais e captação de recursos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ textAlign: 'center' }}>Acesse sua conta</CardTitle>
            <CardDescription style={{ textAlign: 'center' }}>
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 500, 
                  color: 'var(--color-gray-700)',
                  marginBottom: '0.25rem',
                  display: 'block'
                }}>
                  Email corporativo
                </label>
                <Input
                  type="email"
                  placeholder="nome@instituicao.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '0.25rem'
                }}>
                  <label style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    fontWeight: 500, 
                    color: 'var(--color-gray-700)' 
                  }}>
                    Senha
                  </label>
                  <button
                    type="button"
                    style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-red-50)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-danger)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>

            <div style={{ 
              position: 'relative', 
              margin: '1.5rem 0'
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center' 
              }}>
                <div style={{ 
                  width: '100%', 
                  borderTop: '1px solid var(--color-gray-300)' 
                }}></div>
              </div>
              <div style={{ 
                position: 'relative', 
                display: 'flex', 
                justifyContent: 'center', 
                fontSize: 'var(--font-size-xs)', 
                textTransform: 'uppercase' 
              }}>
                <span style={{ 
                  backgroundColor: 'var(--color-white)', 
                  padding: '0 0.5rem', 
                  color: 'var(--color-gray-500)' 
                }}>
                  Ou continue com
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter>
            <p style={{ 
              fontSize: 'var(--font-size-xs)', 
              color: 'var(--color-gray-500)', 
              textAlign: 'center', 
              width: '100%' 
            }}>
              Protegido por reCAPTCHA e sujeito à Política de Privacidade
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
