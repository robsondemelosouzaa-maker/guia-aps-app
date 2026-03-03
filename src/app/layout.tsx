import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Guia APS – Enfermeiro Digital',
    description: 'Sistema auxiliar de apoio à decisão clínica para profissionais de enfermagem na Atenção Primária à Saúde.',
    keywords: ['APS', 'enfermagem', 'atenção primária', 'CIAP-2', 'UBS'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#10B981" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            </head>
            <body>{children}</body>
        </html>
    )
}
