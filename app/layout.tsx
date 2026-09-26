import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VocAZ — Ekosistem Karier Vokasi Terpadu',
  description:
    'VocAZ connects vocational high school students with verified portfolios, industry credentials, and career opportunities — all in one trusted ecosystem.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-surface font-body text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}