"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return isHomePage ? (
    <div className="flex-1">{children}</div>
  ) : (
    <>
      <Sidebar />
      <div className="flex-1">{children}</div>
      <Player />
    </>
  );
}
