import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana Token Price Chart",
  description: "View OHLC price data for Solana tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
