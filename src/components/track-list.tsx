"use client"
import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal, Check } from "lucide-react"
import { Track, useAudioPlayer } from "@/hooks/use-audio-player"

interface TrackListProps {
  tab: "default" | "featured" | "recent"
  tracks: Track[]
  onSelect?: (track: Track) => void
  selectedTracks?: Track[]
}

export function TrackList({ tab, tracks, onSelect, selectedTracks = [] }: TrackListProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    setProgress,
    setMilestone,
    setAudioElement
  } = useAudioPlayer()

  useEffect(() => {
    if (audioRef.current) setAudioElement(audioRef.current)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const progress = audio.currentTime / audio.duration
      setProgress(progress)

      if (progress >= 0.3) setMilestone("thirty", true)
      if (progress >= 0.6) setMilestone("sixty", true)
    }

    const handleEnded = () => {
      setMilestone("completed", true)
      setProgress(0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioUrl) return
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl
    }
    if (isPlaying) {
      audio.play().catch((err) => console.error("Playback error:", err))
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  const sortedTracks = tab === "featured" 
    ? [...tracks].sort((a, b) => b.popularity - a.popularity) 
    : tracks

  return (
    <div className="w-full overflow-x-auto pb-4">
      <audio ref={audioRef} />
      <div className="flex gap-4 px-4">
        {sortedTracks.map((track) => {
          const isSelected = selectedTracks.some((t) => t.id === track.id)
          const isCurrentTrack = currentTrack?.id === track.id

          return (
            <div
              key={track.id}
              className={`flex-none w-48 group ${isSelected ? "opacity-75" : ""}`}
              onClick={() => onSelect?.(track)}
            >
              <div className="relative aspect-square mb-2 rounded-lg overflow-hidden">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isCurrentTrack) {
                        togglePlay()
                      } else {
                        playTrack(track)
                      }
                    }}
                  >
                    {isPlaying && isCurrentTrack ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Track Info */}
              <div className="space-y-1 px-2">
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {track.artist}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {track.duration}
                  </span>
                  {onSelect && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isSelected ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrackList