"use client"

import { create } from "zustand"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  cover: string
}

interface AudioPlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  togglePlay: () => void
}

export const useAudioPlayer = create<AudioPlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}))


