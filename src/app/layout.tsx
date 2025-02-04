import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/client-layout"; 


export const metadata: Metadata = {
  title: "Tunify",
  description: "Tune in and Listen in a Fair way",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={` antialiased flex h-full`}>
        <ClientLayout>{children}</ClientLayout> {/* Render client component */}
      </body>
    </html>
  );
}
