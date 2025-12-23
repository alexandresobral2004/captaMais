import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, AlertCircle, DollarSign, ArrowRight } from "lucide-react"

const stats = [
  {
    title: "Editais Novos",
    value: "12",
    change: "+2 hoje",
    icon: FileText,
  },
  {
    title: "Projetos em Análise",
    value: "5",
    change: "Aguardando",
    icon: Clock,
  },
  {
    title: "Prazo Próximo",
    value: "3",
    change: "Vencem em 48h",
    icon: AlertCircle,
  },
  {
    title: "Total Captado",
    value: "R$ 2.4M",
    change: "+15% ano",
    icon: DollarSign,
  },
]

const editais = [
  {
    titulo: "Modernização de Bibliotecas Públicas",
    orgao: "Ministério da Cultura",
    valor: "R$ 500.000,00",
    dataLimite: "14/11/2023",
    status: "Aberto",
  },
  {
    titulo: "Pavimentação de Vias Rurais",
    orgao: "Ministério do Desenvolvimento Regional",
    valor: "R$ 1.200.000,00",
    dataLimite: "19/11/2023",
    status: "Prorrogado",
  },
  {
    titulo: "Inclusão Digital nas Escolas",
    orgao: "Ministério da Educação",
    valor: "R$ 300.000,00",
    dataLimite: "09/11/2023",
    status: "Em Análise",
  },
  {
    titulo: "Construção de Quadras Poliesportivas",
    orgao: "Secretaria de Esportes",
    valor: "R$ 450.000,00",
    dataLimite: "30/11/2023",
    status: "Aberto",
  },
  {
    titulo: "Apoio à Saúde da Família",
    orgao: "Ministério da Saúde",
    valor: "R$ 750.000,00",
    dataLimite: "24/11/2023",
    status: "Aberto",
  },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Visão Geral</h2>
          <p className="dashboard-subtitle">
            Acompanhe o desempenho de captação da sua instituição
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingBottom: '0.5rem'
                }}>
                  <CardTitle style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-gray-600)' }}>
                    {stat.title}
                  </CardTitle>
                  <Icon style={{ width: '1rem', height: '1rem', color: 'var(--color-gray-400)' }} />
                </CardHeader>
                <CardContent>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{stat.value}</div>
                  <p className="text-xs text-gray-600" style={{ marginTop: '0.25rem' }}>{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Editais Table */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">Últimos Editais Publicados</h3>
            <Button variant="outline" size="sm">
              Ver Todos
              <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Órgão</th>
                    <th>Valor Estimado</th>
                    <th>Data Limite</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {editais.map((edital, index) => (
                    <tr key={index}>
                      <td className="text-sm text-gray-900">
                        {edital.titulo}
                      </td>
                      <td className="text-sm text-gray-600">
                        {edital.orgao}
                      </td>
                      <td className="text-sm text-gray-900">
                        {edital.valor}
                      </td>
                      <td className="text-sm text-gray-600">
                        {edital.dataLimite}
                      </td>
                      <td>
                        <Badge
                          variant={
                            edital.status === "Aberto"
                              ? "success"
                              : edital.status === "Prorrogado"
                              ? "warning"
                              : "default"
                          }
                        >
                          {edital.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
