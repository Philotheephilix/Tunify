"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PrivyProvider } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import Hyperspeed from '@/components/ui/race';
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function LoginPageParent(){
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
      }} children={<LoginPage/>}  >
    
  </PrivyProvider>
  )
}

function LoginPage() {
  const router = useRouter(); 
  const { ready, authenticated, login, logout } = usePrivy();
  useEffect(()=>{
    if(ready && authenticated){
      router.push('/admin/dashboard')
    }
  })
  return (
    <><Hyperspeed
      effectOptions={{
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
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
          shoulderLines: 0xFFFFFF,
          brokenLines: 0xFFFFFF,
          leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
          rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
          sticks: 0x03B3C3,
        }
      }} />

        <div className="min-h-screen flex items-center flex-col justify-evenly bg-black">
          <h1 className="text-7xl font-bold text-gray-300 "
          >Tunify</h1>
          <Card className="w-full w-max relative bg-gray-900 border-gray-800 ">
            {ready && authenticated ? (
              <Button onClick={logout} variant="destructive" className="rounded-xl h-16 w-40 text-3xl font-bold">
                Log Out
              </Button>
            ) : (
              <Button onClick={login} variant="default" className="rounded-xl h-16 w-40 text-3xl font-bold">Log In</Button>
            )}
          </Card>
        </div>
      </> 
  )
}

