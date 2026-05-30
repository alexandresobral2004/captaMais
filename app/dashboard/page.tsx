import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, AlertCircle, DollarSign, ArrowRight } from "lucide-react"
import { getAllEditais, parseDateString } from "@/lib/db/editais-store"
import Link from "next/link"

export default async function DashboardPage() {
  // Busca editais reais no servidor
  const editaisReais = await getAllEditais();
  
  // Calcula estatísticas dinâmicas
  const totalEditais = editaisReais.length;
  
  // Próximos de vencer (menos de 10 dias)
  const agora = new Date();
  const proximosVencer = editaisReais.filter(edital => {
    const dataFechamento = parseDateString(edital.dataLimite);
    if (!dataFechamento) return false;
    const diffTime = dataFechamento.getTime() - agora.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 10;
  }).length;

  const stats = [
    {
      title: "Editais Mapeados",
      value: String(totalEditais),
      change: `${totalEditais > 0 ? '+' + totalEditais : '0'} ativos`,
      icon: FileText,
    },
    {
      title: "Projetos em Análise",
      value: "5",
      change: "Aguardando",
      icon: Clock,
    },
    {
      title: "Prazos Curtos (≤ 10 dias)",
      value: String(proximosVencer),
      change: "Necessita atenção",
      icon: AlertCircle,
    },
    {
      title: "Total Captado",
      value: "R$ 2.4M",
      change: "+15% ano",
      icon: DollarSign,
    },
  ];

  // Pega os 5 editais mais recentes ou os primeiros da lista
  const ultimosEditais = editaisReais.slice(0, 5);

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Visão Geral</h2>
          <p className="dashboard-subtitle">
            Acompanhe o desempenho de captação da sua instituição em tempo real
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
          <div className="dashboard-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="dashboard-section-title">Últimos Editais Publicados (Abertos)</h3>
            <Link href="/editais">
              <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center' }}>
                Ver Todos
                <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
              </Button>
            </Link>
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
                  {ultimosEditais.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-500)' }}>
                        Nenhum edital ativo no banco de dados. Vá em <Link href="/editais" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Explorar Editais</Link> para realizar a primeira busca.
                      </td>
                    </tr>
                  ) : (
                    ultimosEditais.map((edital) => (
                      <tr key={edital.id}>
                        <td className="text-sm text-gray-900" style={{ fontWeight: 500 }}>
                          {edital.titulo}
                        </td>
                        <td className="text-sm text-gray-600">
                          {edital.orgao}
                        </td>
                        <td className="text-sm text-gray-900">
                          {edital.valor}
                        </td>
                        <td className="text-sm text-gray-600" style={{ color: 'var(--color-warning)', fontWeight: 500 }}>
                          {edital.dataLimite}
                        </td>
                        <td>
                          <Badge variant="success">
                            {edital.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
