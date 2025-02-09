"use client"
import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal, Check } from "lucide-react"
import { Track, useAudioPlayer } from "@/hooks/use-audio-player"
import { ScrollArea } from "./ui/scroll-area"

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
    if (!audio || !currentTrack?.songUrl) return
    if (audio.src !== currentTrack.songUrl) {
      audio.src = currentTrack.songUrl
    }
    if (isPlaying) {
      audio.play().catch((err) => console.error("Playback error:", err))
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  return (
    <div className="w-full pb-4 overflow-hidden">
      <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar w-[69vw]">
        {tracks.map((track) => {
          const isSelected = selectedTracks.some((t) => t.songUrl === track.songUrl)
          const isCurrentTrack = currentTrack?.songUrl === track.songUrl

          return (
            <div
              key={track.songUrl}
              className={`flex-none w-48 group ${isSelected ? "opacity-75" : ""}`}
              onClick={() => onSelect?.(track)}
            >
              <div className="relative aspect-square mb-2 rounded-lg overflow-hidden">
                <img
                  src={track.thumbnailUrl}
                  alt={track.songName}
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
                <div className="font-medium truncate">{track.songName}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {track.artistName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {/* {track.duration} */}
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
