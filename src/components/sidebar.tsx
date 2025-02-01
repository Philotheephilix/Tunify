import { Button } from "@/components/ui/button"
import { Home, Library, ListMusic, Plus, Search } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Tunify</h1>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/library">
                <Library className="mr-2 h-4 w-4" />
                Your Library
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              Your Playlists
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

