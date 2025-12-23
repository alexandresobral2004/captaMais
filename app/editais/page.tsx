import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowRight } from "lucide-react"

const editais = [
  {
    titulo: "Modernização de Bibliotecas Públicas",
    orgao: "Ministério da Cultura",
    valor: "R$ 500.000,00",
    dataLimite: "14/11/2023",
    status: "Inscrições Abertas",
    descricao: "Recursos destinados à renovação de acervo e infraestrutura",
  },
  {
    titulo: "Pavimentação de Vias Rurais",
    orgao: "Ministério do Desenvolvimento Regional",
    valor: "R$ 1.200.000,00",
    dataLimite: "19/11/2023",
    status: "Prorrogado",
    descricao: "Programa de apoio à infraestrutura viária em áreas rurais",
  },
  {
    titulo: "Inclusão Digital nas Escolas",
    orgao: "Ministério da Educação",
    valor: "R$ 300.000,00",
    dataLimite: "09/11/2023",
    status: "Em Análise",
    descricao: "Aquisição de tablets e notebooks para alunos da rede pública",
  },
]

export default function EditaisPage() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div>
          <h2 className="dashboard-title">Explorar Editais</h2>
          <p className="dashboard-subtitle">
            Encontre oportunidades de captação abertas em todo o país
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-sm">
                  <Filter style={{ width: '1rem', height: '1rem' }} />
                  <CardTitle style={{ fontSize: 'var(--font-size-lg)' }}>Filtros</CardTitle>
                </div>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="filters-section">
                  <label className="filters-section-title">Busca Rápida</label>
                  <div style={{ position: 'relative' }}>
                    <Search style={{
                      position: 'absolute',
                      left: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0.875rem',
                      height: '0.875rem',
                      color: 'var(--color-gray-400)'
                    }} />
                    <Input
                      type="text"
                      placeholder="Palavra-chave..."
                      style={{ paddingLeft: '2rem' }}
                    />
                  </div>
                </div>

                <div className="filters-section">
                  <label className="filters-section-title">Área de Interesse</label>
                  <div className="checkbox-group">
                    {["Saúde", "Educação", "Cultura", "Infraestrutura", "Esporte"].map(
                      (area) => (
                        <label key={area} className="checkbox-item">
                          <input type="checkbox" />
                          {area}
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="filters-section">
                  <label className="filters-section-title">Tipo de Instituição</label>
                  <div className="checkbox-group">
                    {["Federal", "Estadual", "Privada", "ONG"].map((tipo) => (
                      <label key={tipo} className="checkbox-item">
                        <input type="checkbox" />
                        {tipo}
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Aplicar Filtros</Button>
              </CardContent>
            </Card>
          </div>

          {/* Editais Grid */}
          <div style={{ flex: 1 }}>
            <div className="editais-grid">
              {editais.map((edital, index) => (
                <Card key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                      <Badge
                        variant={
                          edital.status === "Inscrições Abertas"
                            ? "success"
                            : edital.status === "Prorrogado"
                            ? "warning"
                            : "default"
                        }
                      >
                        {edital.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <svg
                          style={{ width: '1rem', height: '1rem' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </div>
                    <CardTitle style={{ fontSize: 'var(--font-size-lg)', lineHeight: 1.2 }}>
                      {edital.titulo}
                    </CardTitle>
                    <p className="text-sm text-gray-600" style={{ marginTop: '0.25rem' }}>{edital.orgao}</p>
                  </CardHeader>
                  <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p className="text-sm text-gray-600 line-clamp-3" style={{ marginBottom: '1rem' }}>
                      {edital.descricao}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium">{edital.valor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Data Limite:</span>
                        <span className="font-medium">{edital.dataLimite}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Ver Projetos de Referência
                      <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
