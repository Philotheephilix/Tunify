"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"

const tracks = [
  {
    id: 1,
    title: "Madness (Hello Halo remix)",
    artist: "Drums Soundsystem vs Shade of Clay",
    duration: "2:08",
    waveform: "/placeholder.svg?height=40&width=200",
    cover: "/placeholder.svg?height=40&width=40",
  },
]

export function TrackList() {
  const { playTrack } = useAudioPlayer()

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div key={track.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent group">
          <Avatar className="h-10 w-10">
            <img src={track.cover || "/placeholder.svg"} alt={track.title} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{track.title}</div>
            <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
          </div>
          <img src={track.waveform || "/placeholder.svg"} alt="Audio waveform" className="h-10 w-40 hidden md:block" />
          <div className="text-sm text-muted-foreground">{track.duration}</div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => playTrack(track)}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

