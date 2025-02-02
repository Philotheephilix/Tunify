'use client'
import { Button } from "@/components/ui/button"
import { Home, Library, ListMusic, Plus, Search } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import SearchWindow from "@/app/search/page"
import { useState } from "react"
import { Track } from "@/hooks/use-audio-player"


export function Sidebar() {
  const [playlistName,setPlaylistName]=useState("");
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  function addPlaylist(): void {
    const existingList = JSON.parse(localStorage.getItem('playlistList') || '[]');
    existingList.push(playlistName);
    localStorage.setItem('playlistList', JSON.stringify(existingList));
    localStorage.setItem(playlistName,JSON.stringify(selectedTracks))
  }

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
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <span>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Playlist
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create New Playlist</AlertDialogTitle>
                      <Input type="text" placeholder="Enter Playlist Name" value={playlistName} onChange={(e)=>{setPlaylistName(e.target.value)}} />
                      <SearchWindow
                        checked={true}
                        onSelectionChange={(selectedTracks) => setSelectedTracks(selectedTracks)}
                      />
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={addPlaylist}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/myplaylists">
                <ListMusic className="mr-2 h-4 w-4" />
                My Playlists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

