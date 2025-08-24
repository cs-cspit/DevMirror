import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import DarkVeil from "@/src/Backgrounds/DarkVeil/DarkVeil";
import NextAuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
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
