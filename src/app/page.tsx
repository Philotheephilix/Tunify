import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        <MainContent />
        <Player />
      </div>
    </div>
  )
}

