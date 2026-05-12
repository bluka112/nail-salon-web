import type { Metadata } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat"
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: 'Elegance Nail & Spa | Naperville Nail Salon',
  description: 'Visit Elegance Nail & Spa at 25 S Washington St, Naperville, IL 60540. Book manicures, pedicures, nail art, and spa services.',
  keywords: 'Elegance Nail and Spa, Naperville nail salon, manicure, pedicure, nail art, spa, beauty',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
