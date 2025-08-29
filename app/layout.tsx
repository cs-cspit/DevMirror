import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import DarkVeil from "@/src/Backgrounds/DarkVeil/DarkVeil";
import NextAuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "DevMirror",
  description: "Created with team",
  generator: "Self",
  icons: {
    icon: "/favicon.ico",       // ✅ standard favicon
    shortcut: "/favicon.ico",
    apple: "/favicon.png",      // ✅ for iOS devices
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Extra fallback (forces favicon load) */}
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <DarkVeil />
        </div>

        {/* NextAuth provider */}
        <NextAuthSessionProvider>
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
