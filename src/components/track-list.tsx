"use client"

import React, { useRef, useEffect } from 'react'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play, Pause, MoreHorizontal } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"

const tracks = [
  {
    id: 1,
    title: "Madness (Hello Halo remix)",
    artist: "Drums Soundsystem vs Shade of Clay",
    duration: "2:08",
    cover: "/placeholder.svg?height=40&width=40",
    audioUrl: "/audio/sample.mp3"
  },
]

function AudioProgress() {
  const progress = useAudioPlayer((state) => state.progress)
  
  return (
    <div className="w-full h-1 bg-secondary mt-2">
      <div 
        className="h-full bg-primary transition-all duration-100" 
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function TrackList() {
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
  }, [setAudioElement])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      const progress = audio.currentTime / audio.duration
      setProgress(progress)

      // Monitor progress milestones
      if (progress >= 0.3) {
        setMilestone('thirty', true)
      }
      if (progress >= 0.6) {
        setMilestone('sixty', true)
      }
    }

    const handleEnded = () => {
      setMilestone('completed', true)
      setProgress(0)
      togglePlay()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [setProgress, setMilestone, togglePlay])

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioUrl) return

    audioRef.current.src = currentTrack.audioUrl
    audioRef.current.play()
  }, [currentTrack])

  return (
    <div className="space-y-4">
      <audio ref={audioRef} />
      {tracks.map((track) => (
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
            <AudioProgress />
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