"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-white)' }}>
      {/* Header */}
      <header style={{
        padding: '1rem 5rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)'
            }}>
              C+
            </div>
            <span style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: 'var(--color-gray-900)'
            }}>
              Capta+
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
            >
              Entrar
            </Button>
            <Button onClick={() => router.push("/login")}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '8rem 5rem',
        display: 'flex',
        gap: '4rem',
        alignItems: 'center',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'var(--color-blue-50)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            color: 'var(--color-primary)'
          }}>
            Novidade: IA para Análise de Editais
          </div>
          
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--color-gray-900)',
            marginBottom: '1.5rem'
          }}>
            Transforme a busca por recursos em{' '}
            <span style={{ color: 'var(--color-primary)' }}>resultados reais</span>
          </h1>
          
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-gray-600)',
            marginBottom: '2rem',
            lineHeight: 1.625
          }}>
            O Capta+ centraliza, analisa e recomenda os editais ideais para sua instituição pública,
            aumentando suas chances de aprovação.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Button size="lg" onClick={() => router.push("/login")}>
              Criar conta gratuita
              <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
            </Button>
            <Button variant="outline" size="lg">
              Ver demonstração
            </Button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['A', 'B', 'C', 'D'].map((letter) => (
                <div key={letter} style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  border: '2px solid var(--color-white)',
                  backgroundColor: 'var(--color-gray-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  color: 'var(--color-gray-600)'
                }}>
                  {letter}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
              +2.000 instituições cadastradas
            </p>
          </div>
        </div>
        
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              backgroundColor: 'var(--color-gray-50)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              minHeight: '300px'
            }}>
              {/* Dashboard Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ height: '4rem', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)' }}></div>
                <div style={{ height: '4rem', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)' }}></div>
              </div>
              <div style={{ height: '8rem', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 5rem',
        backgroundColor: 'var(--color-gray-50)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: '1rem'
          }}>
            Tudo o que você precisa para captar mais
          </h2>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-gray-600)',
            maxWidth: '672px',
            margin: '0 auto'
          }}>
            Nossa plataforma combina tecnologia avançada com uma interface intuitiva para simplificar a gestão de editais.
          </p>
        </div>
        
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {[
            {
              title: 'Busca Inteligente',
              description: 'Algoritmos que varrem diários oficiais e portais de convênios para encontrar oportunidades compatíveis com seu perfil.'
            },
            {
              title: 'Conformidade Garantida',
              description: 'Checklists automáticos e validação de requisitos para garantir que sua instituição atenda a todas as exigências.'
            },
            {
              title: 'Alertas em Tempo Real',
              description: 'Receba notificações instantâneas sobre novos editais, prazos e retificações importantes.'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '2rem',
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'var(--color-blue-50)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Check style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-primary)' }} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                color: 'var(--color-gray-900)',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-gray-600)',
                lineHeight: 1.625
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '5rem 5rem',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {[
            { value: '+15.000', label: 'Editais Monitorados' },
            { value: 'R$ 2.5B', label: 'Recursos Mapeados' },
            { value: '2.300', label: 'Instituições Ativas' },
            { value: '85%', label: 'Taxa de Sucesso' }
          ].map((stat, index) => (
            <div key={index}>
              <div style={{
                fontSize: '2.25rem',
                fontWeight: 700,
                color: 'var(--color-gray-900)',
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-gray-600)'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 5rem',
        backgroundColor: 'var(--color-gray-900)',
        color: 'var(--color-white)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Button size="lg" onClick={() => router.push("/login")} style={{ marginBottom: '2rem' }}>
            Quero fazer parte dessa transformação
          </Button>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            Transformando recursos em realidade
          </h2>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-gray-300)',
            maxWidth: '672px',
            margin: '0 auto'
          }}>
            Veja como o Capta+ ajuda a viabilizar projetos que impactam diretamente a vida dos cidadãos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 5rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)'
            }}>
              C+
            </div>
            <span style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: 'var(--color-gray-900)'
            }}>
              Capta+
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {['Sobre', 'Funcionalidades', 'Preços', 'Suporte'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-gray-600)',
                  textDecoration: 'none'
                }}
              >
                {link}
              </a>
            ))}
          </nav>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-600)'
          }}>
            © 2024 Capta Plus Tecnologia.
          </p>
        </div>
      </footer>
    </div>
  )
}
