"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause,
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat, 
  Shuffle 
} from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { usePrivy } from "@privy-io/react-auth"
import { Client } from "@gradio/client"

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { user } = usePrivy()
  const { 
    currentTrack, 
    isPlaying, 
    progress,
    volume,
    togglePlay, 
    setProgress,
    setVolume,
    seekTo,
    setMilestone,
    setAudioElement,
    playPreviousTrack,
    playNextTrack
  } = useAudioPlayer()

  const [isLoading, setIsLoading] = useState(false)

  // Track which milestones have been reached for current song
  const milestonesReached = useRef({
    thirty: false,
    sixty: false,
    completed: false
  })

  const updateUserMinutes = async (minutes: number, artistID: string) => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.id, // user ID from Privy auth
          artistID: artistID, // artist's ID from currentTrack
          addMinutes: minutes.toFixed(2)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update minutes listened')
      }
    } catch (error) {
      console.error('Error updating minutes listened:', error)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current)
    }
  }, [setAudioElement])

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.songUrl) return

    // Reset milestones when new track starts
    milestonesReached.current = {
      thirty: false,
      sixty: false,
      completed: false
    }

    audioRef.current.src = currentTrack.songUrl
    audioRef.current.play()
  }, [currentTrack])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    // Calculate minutes for each milestone
    const thirtyPercentMinutes = (audio.duration * 0.3) / 60
    const sixtyPercentMinutes = (audio.duration * 0.6) / 60
    const remainingMinutes = (audio.duration * 0.4) / 60

    const handleTimeUpdate = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100
      setProgress(currentProgress)

      // Monitor progress milestones and update minutes
      if (currentProgress >= 30 && !milestonesReached.current.thirty) {
        setMilestone('thirty', true)
        milestonesReached.current.thirty = true
        if (currentTrack?.artistId) {
          updateUserMinutes(thirtyPercentMinutes, currentTrack.artistId)
        }
      }
      if (currentProgress >= 60 && !milestonesReached.current.sixty) {
        setMilestone('sixty', true)
        milestonesReached.current.sixty = true
        if (currentTrack?.artistId) {
          updateUserMinutes(thirtyPercentMinutes, currentTrack.artistId)
        }
      }
    }

    const handleEnded = () => {
      if (!milestonesReached.current.completed) {
        setMilestone('completed', true)
        milestonesReached.current.completed = true
        if (currentTrack?.artistId) {
          updateUserMinutes(thirtyPercentMinutes, currentTrack.artistId)
        }
      }
      setProgress(0)
      togglePlay()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [setProgress, setMilestone, togglePlay, currentTrack])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChangeVoice = async () => {
    if (!currentTrack) return

    setIsLoading(true)

    try {
      const client = await Client.connect("yuntian-deng/ChatGPT");
      const result = await client.predict("/predict", { 		
          inputs: "Hello!!", 		
          top_p: 0, 		
          temperature: 0, 		
          chat_counter: 3, 		
          chatbot: [["Hello!",null]], 
      });
      const description = (result.data as string[])[0] // Assuming the description is in the first element of the array

      // Use TTS to speak the description
      const utterance = new SpeechSynthesisUtterance(description)
      speechSynthesis.speak(utterance)

      console.log(description)
    } catch (error) {
      console.error("Error fetching song description:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-80 border-l bg-card p-4 flex flex-col gap-4">
      <audio ref={audioRef} />
      {currentTrack && (
        <>
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={currentTrack.thumbnailUrl || "/placeholder.svg"}
              alt={currentTrack.songName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{currentTrack.songName}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artistName}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider 
                value={[progress]} 
                max={100} 
                step={1} 
                onValueChange={(value) => seekTo(value[0])}
              />
              {audioRef.current && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(audioRef.current.currentTime)}</span>
                  <span>{formatTime(audioRef.current.duration || 0)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNextTrack}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Slider 
                value={[volume]} 
                max={100} 
                step={1} 
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleChangeVoice} 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Change Voice"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}