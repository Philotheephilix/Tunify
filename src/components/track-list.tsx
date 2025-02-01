"use client"

import React, { useRef, useEffect } from 'react'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal } from "lucide-react"
import { Track, useAudioPlayer } from "@/hooks/use-audio-player"

export function TrackList({ tab, tracks }: { tab: 'default' | 'featured' | 'recent'; tracks: Track[] }) {
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
    if (audioRef.current) {
      setAudioElement(audioRef.current)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const progress = audio.currentTime / audio.duration
      setProgress(progress)

      if (progress >= 0.3) setMilestone('thirty', true)
      if (progress >= 0.6) setMilestone('sixty', true)
    }

    const handleEnded = () => {
      setMilestone('completed', true)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioUrl) return
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl
    }
    if (isPlaying) {
      audio.play().catch(err => console.error("Playback error:", err))
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  return (
    <div className="space-y-4">
      <audio ref={audioRef} />
        {(tab === 'featured' 
         ? [...tracks].sort((a, b) => b.popularity - a.popularity) 
         : tracks
        ).map((track) => (
        <div 
          key={track.id} 
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent group"
        >
          <Avatar className="h-10 w-10">
            <img src={track.cover} alt={track.title} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{track.title}</div>
            <div className="text-sm text-muted-foreground truncate">
              {track.artist}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {track.duration}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => {
              if (currentTrack?.id === track.id) {
                togglePlay()
              } else {
                playTrack(track)
              }
            }}
          >
            {isPlaying && currentTrack?.id === track.id ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default TrackList
