import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Users, Building2, MoreVertical } from "lucide-react"

const membros = [
  {
    nome: "Ana Silva",
    email: "ana.silva@exemplo.gov.br",
    cargo: "Secretária de Planejamento",
    nivel: "Admin",
    status: "Ativo",
  },
  {
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@exemplo.gov.br",
    cargo: "Gestor de Projetos",
    nivel: "Editor",
    status: "Ativo",
  },
  {
    nome: "Mariana Souza",
    email: "mariana.souza@exemplo.gov.br",
    cargo: "Assistente Administrativo",
    nivel: "Leitor",
    status: "Ativo",
  },
  {
    nome: "Roberto Lima",
    email: "roberto.lima@exemplo.gov.br",
    cargo: "Consultor Externo",
    nivel: "Leitor",
    status: "Inativo",
  },
]

export default function UsuariosPage() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="dashboard-title">
              Gestão da Instituição
            </h2>
            <p className="dashboard-subtitle">
              Gerencie sua equipe e mantenha os dados da organização atualizados
            </p>
          </div>
          <Button>
            <UserPlus style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Convidar Novo Usuário
          </Button>
        </div>

        {/* Membros da Equipe */}
        <div className="dashboard-section">
          <div className="flex items-center gap-sm" style={{ marginBottom: '1rem' }}>
            <Users style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-gray-600)' }} />
            <h3 className="dashboard-section-title">Membros da Equipe</h3>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Cargo</th>
                    <th>Nível de Acesso</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {membros.map((membro, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex items-center gap-md">
                          <div style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-gray-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 500,
                            color: 'var(--color-gray-600)'
                          }}>
                            {membro.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {membro.nome}
                            </p>
                            <p className="text-xs text-gray-600">{membro.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-gray-900">
                        {membro.cargo}
                      </td>
                      <td>
                        <Badge variant="default">{membro.nivel}</Badge>
                      </td>
                      <td>
                        <Badge
                          variant={
                            membro.status === "Ativo" ? "success" : "danger"
                          }
                        >
                          {membro.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="ghost" size="sm">
                          <MoreVertical style={{ width: '1rem', height: '1rem' }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Dados da Instituição */}
        <div className="dashboard-section">
          <div className="flex items-center gap-sm" style={{ marginBottom: '1rem' }}>
            <Building2 style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-gray-600)' }} />
            <h3 className="dashboard-section-title">Dados da Instituição</h3>
          </div>

          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div className="flex gap-lg">
                <div style={{
                  width: '8rem',
                  height: '8rem',
                  backgroundColor: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 style={{ width: '3rem', height: '3rem', color: 'var(--color-gray-400)' }} />
                </div>
                <div style={{ 
                  flex: 1, 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      Nome da Instituição
                    </label>
                    <Input
                      defaultValue="Prefeitura Municipal de Exemplo"
                      style={{ height: '2.25rem' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      CNPJ
                    </label>
                    <Input
                      defaultValue="12.345.678/0001-90"
                      style={{ height: '2.25rem' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      Endereço Completo
                    </label>
                    <Input
                      defaultValue="Praça dos Três Poderes, 100 - Centro, Exemplo - SP"
                      style={{ height: '2.25rem' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      Email de Contato Principal
                    </label>
                    <Input
                      defaultValue="contato@exemplo.sp.gov.br"
                      style={{ height: '2.25rem' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 500,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      Telefone
                    </label>
                    <Input defaultValue="(11) 3000-0000" style={{ height: '2.25rem' }} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-md" style={{ marginTop: '1.5rem' }}>
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
