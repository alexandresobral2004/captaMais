import type { Metadata } from 'next'
import './globals.css'
import '../styles/components.css'

export const metadata: Metadata = {
  title: 'Capta+ - Gestão de Editais',
  description: 'Gestão inteligente de editais e captação de recursos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

