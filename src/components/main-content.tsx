"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackList } from "@/components/track-list"
import { Track } from '@/hooks/use-audio-player'
import importedTracks from "@/modals/tracks"
export function MainContent() {
  const [stateTracks, setStateTracks] = useState<{ stream: Track[], featured: Track[] }>({
    stream: [],
    featured: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://bafybeic7ywhiwszs6pqllxis5gaiw3tcgejcbbjw4t22lh43cageiy3ykq.ipfs.dweb.link/')
        // const data = await response.json()


        setStateTracks({
          stream: importedTracks,
          featured: shuffleArray([...importedTracks])
        })
      } catch (error) {
        console.error("Failed to fetch tracks:", error)
      }
    }

    fetchData()
  }, [])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Filter tracks based on genre
  const getTracksByGenre = (genre: string, trackList: Track[]) =>
    trackList.filter(track => track.genre?.toLowerCase() === genre.toLowerCase())

  return (
    <div className="flex-1 overflow-hidden">
      <Tabs defaultValue="stream" className="h-full">
        <div className="border-b px-6 py-2">
          <TabsList>
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="stream" className="p-6">
          <ScrollArea className="overflow-x-auto scrollbar-hide">
            <h1 className="p-4 text-2xl font-semibold">General</h1>
            <TrackList  tracks={getTracksByGenre("general", stateTracks.stream)} tab={"featured"} />
            <h1 className="p-4 text-2xl font-semibold">Phonk</h1>
            <TrackList tracks={getTracksByGenre("phonk", stateTracks.stream)} tab={"featured"} />
            <h1 className="p-4 text-2xl font-semibold">Anime</h1>
            <TrackList  tracks={getTracksByGenre("anime", stateTracks.stream)} tab={"featured"} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="featured" className="p-6">
          <ScrollArea className="overflow-x-auto scrollbar-hide">
          <h1 className="p-4 text-2xl font-semibold">General</h1>
            <TrackList tracks={getTracksByGenre("phonk", stateTracks.featured)} tab={"featured"} />
            <h1 className="p-4 text-2xl font-semibold">Phonk</h1>
            <TrackList  tracks={getTracksByGenre("anime", stateTracks.featured)} tab={"featured"} />
            <h1 className="p-4 text-2xl font-semibold">Anime</h1>
            <TrackList  tracks={getTracksByGenre("general", stateTracks.featured)} tab={"featured"} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
