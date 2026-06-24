import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Verb Master",
  description: "Know the verb. Use the verb."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main className="mx-auto min-h-screen max-w-xl px-5 pb-28 pt-8">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
