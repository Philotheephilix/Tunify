"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrivyProvider, usePrivy, User } from "@privy-io/react-auth";
import Hyperspeed from "@/components/ui/race";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function LoginPageParent() {
  return (
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
      <LoginPage />
    </PrivyProvider>
  );
}

function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, login, logout, user } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && user) {
      registerArtist(user);
      router.push("/admin/dashboard");
    }
  }, [ready, authenticated, user]);

  const registerArtist = async (user: any) => {
    try {
      const res = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user:user,wallet: user.wallet.address }),
      });

      const data = await res.json();
      console.log("Artist Registration:", data);
    } catch (error) {
      console.error("Error registering artist:", error);
    }
  };

  const isLoginPage = pathname === "/admin/login";

  return (
    <>
      {isLoginPage && (
        <>
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => {},
              onSlowDown: () => {},
              distortion: "turbulentDistortion",
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 4,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 20,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0xffffff,
                brokenLines: 0xffffff,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3,
              },
            }}
          />

          <div className="min-h-screen flex items-center flex-col justify-evenly bg-black">
            <h1 className="text-7xl font-bold text-gray-300">Tunify</h1>
            <Card className="w-full max-w-xs relative bg-transparent p-4 text-center">
              {ready && authenticated ? (
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="rounded-xl h-16 w-40 text-3xl font-bold"
                >
                  Log Out
                </Button>
              ) : (
                <Button
                  onClick={login}
                  variant="default"
                  className="rounded-xl h-16 w-40 text-3xl font-bold"
                >
                  Log In
                </Button>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
