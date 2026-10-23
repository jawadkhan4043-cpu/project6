import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScriptSafe Student Lab",
  description:
    "A fictional prescription-record review simulator for pharmacy students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}