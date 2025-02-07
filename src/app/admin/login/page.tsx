"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PrivyProvider } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // This is a mock authentication. In a real app, you'd validate against a backend.
    if (username === "admin" && password === "password") {
      router.push("/admin/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }
  const { ready, authenticated, user, login, logout } = usePrivy();
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full w-max bg-gray-900 border-gray-800">
        {ready && authenticated ? (
            <Button onClick={logout} variant="destructive" className="rounded-xl h-16 w-40 text-3xl font-bold">
              Log Out
            </Button> 
        ) : (
          <Button onClick={login} variant="default"  className="rounded-xl h-16 w-40 text-3xl font-bold" >Log In</Button>
        )}
      </Card>
    </div>
    </PrivyProvider> 
  )
}

