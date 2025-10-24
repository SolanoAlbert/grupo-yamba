// ✅ SIEMPRE usa este template desde el inicio
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tu App",
  description: "Descripción",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}