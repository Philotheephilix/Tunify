"use client"

import { useEffect, useRef } from "react"
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
export type GradioConfig = {
  provider: "GRADIO";
  name: string;
  appUrl: string;
  endpoint?: string;
  parameters?: unknown[];
  temperature?: number; 
  apiKey?: string;
};

export  function Player() {
//   const gradioConfig: GradioConfig = {
//     provider: "GRADIO",
//     name: "deepseek-vl2-small",
//     appUrl: "deepseek-ai/deepseek-vl2-small",
//     parameters: [
//         [["Hello!", null]],
//         0.9, // topP
//         0.1, // temperature
//         0, // repetitionPenalty
//         100, // maxGenerationTokens
//         0, // maxHistoryTokens
//         "deepseek-ai/deepseek-vl2-small", // model name
//     ],
// };
// const llm = new Agent(gradioConfig);
// const response = await llm.generate(
//     [{ role: "user", content: "Hello!" }],
//     { text: "hello" },
//     {}
// );
// console.log(response.value);
  const audioRef = useRef<HTMLAudioElement>(null)
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

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current)
    }
  }, [setAudioElement])

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.songUrl) return

    audioRef.current.src = currentTrack.songUrl
    audioRef.current.play()
  }, [currentTrack])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100
      setProgress(currentProgress)

      // Monitor progress milestones
      if (currentProgress >= 30) {
        setMilestone('thirty', true)
      }
      if (currentProgress >= 60) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
          </div>
        </>
      )}
    </div>
  )
}