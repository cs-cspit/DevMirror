import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

import DarkVeil from "@/src/Backgrounds/DarkVeil/DarkVeil";
import NextAuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: "100vh", position: "relative", overflow: "auto" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <DarkVeil />
        </div>
        <NextAuthSessionProvider>
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}