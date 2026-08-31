import type { Metadata } from 'next'
import './globals.css'
import '@chassis-ui/react/style.css'

export const metadata: Metadata = {
  title: '@chassis-ui/react Next.js App Router smoke test',
  description: 'Framework integration smoke test — not a real app, see AGENTS.md'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
