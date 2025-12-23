import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileX, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProjetosPage() {
  return (
    <MainLayout>
      <div className="empty-state">
        <Card className="empty-state-content">
          <CardContent>
            <div className="empty-state-icon">
              <FileX style={{ width: '2.5rem', height: '2.5rem', color: 'var(--color-gray-400)' }} />
            </div>
            <h2 className="empty-state-title">
              Projetos Aprovados
            </h2>
            <p className="empty-state-description">
              Esta funcionalidade está em desenvolvimento. Em breve você poderá
              acompanhar todos os seus projetos aprovados aqui.
            </p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Voltar para o Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
