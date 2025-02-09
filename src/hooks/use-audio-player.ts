"use client"

import tracks from "@/modals/tracks"
import { create } from "zustand"

export interface Track {
  songName:string,
  songUrl:string,
  thumbnailUrl:string,
  artistName:string,
  artistId:string,
  genre:string
}

interface AudioPlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  volume: number
  has30PercentPlayed: boolean
  has60PercentPlayed: boolean
  hasCompleted: boolean
  audioElement: HTMLAudioElement | null
  playTrack: (track: Track) => void
  togglePlay: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  seekTo: (value: number) => void
  playNextTrack: () => void
  playPreviousTrack: () => void
  setMilestone: (milestone: 'thirty' | 'sixty' | 'completed', value: boolean) => void
  setAudioElement: (element: HTMLAudioElement) => void
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  volume: 100,
  has30PercentPlayed: false,
  has60PercentPlayed: false,
  hasCompleted: false,
  audioElement: null,

  playTrack: (track) => {
    const state = get()
    if (state.audioElement) {
      state.audioElement.src = track.songUrl
      state.audioElement.play().catch(() => {})
    }
    set({ 
      currentTrack: track, 
      isPlaying: true,
      progress: 0,
      has30PercentPlayed: false,
      has60PercentPlayed: false,
      hasCompleted: false
    })
  },

  togglePlay: () => set((state) => {
    if (state.audioElement) {
      if (state.isPlaying) {
        state.audioElement.pause()
      } else {
        state.audioElement.play()
      }
    }
    return { isPlaying: !state.isPlaying }
  }),

  setProgress: (progress) => set({ progress }),

  setVolume: (volume) => {
    const state = get()
    if (state.audioElement) {
      state.audioElement.volume = volume / 100
    }
    set({ volume })
  },

  seekTo: (value) => {
    const state = get()
    if (state.audioElement) {
      const time = (value / 100) * state.audioElement.duration
      state.audioElement.currentTime = time
      set({ progress: value / 100 })
    }
  },

  playNextTrack: () => {
    const state = get()
    if (!state.currentTrack) return
    
    const currentIndex = tracks.findIndex(track => track.songUrl === state.currentTrack?.songUrl)
    const nextTrack = tracks[currentIndex + 1] || tracks[0]
    
    if (nextTrack) {
      if (state.isPlaying){
        state.togglePlay()
      }
      state.playTrack(nextTrack)
    }
  },
  
  playPreviousTrack: () => {
    const state = get()
    if (!state.currentTrack) return
    
    const currentIndex = tracks.findIndex(track => track.songUrl === state.currentTrack?.songUrl)
    const previousTrack = tracks[currentIndex - 1] || tracks[tracks.length - 1]
    
    if (previousTrack) {
      if (state.isPlaying){
        state.togglePlay()
      }
      state.playTrack(previousTrack)
    }
  },

  setMilestone: (milestone, value) => 
    set((state) => ({
      [milestone === 'thirty' ? 'has30PercentPlayed' : 
       milestone === 'sixty' ? 'has60PercentPlayed' : 'hasCompleted']: value
    })),

  setAudioElement: (element) => set({ audioElement: element })
}))