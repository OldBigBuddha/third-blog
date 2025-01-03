"use client"
import "@/app/styles/global.css"
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="light">
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
          {children}
      </body>
    </html>
  )
}

