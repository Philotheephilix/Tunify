"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"

export function Player() {
  const { currentTrack, isPlaying, togglePlay } = useAudioPlayer()

  return (
    <div className="w-80 border-l bg-card p-4 flex flex-col gap-4">
      {currentTrack && (
        <>
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <div className="space-y-4">
            <Slider defaultValue={[0]} max={100} step={1} />
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={togglePlay}>
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Slider defaultValue={[100]} max={100} step={1} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

