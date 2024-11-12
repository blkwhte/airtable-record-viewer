import type { Metadata } from 'next'
import { inter } from '@/app/ui/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clever Certification Lookup',
  description: 'Clever Certification Lookup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}