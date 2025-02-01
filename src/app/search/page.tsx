"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrackList } from "@/components/track-list"

import tracks from "@/modals/tracks"
import {Track} from '@/hooks/use-audio-player'


export default function SearchWindow() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchTracks = async (query: string) => {
    const results: Track[] = tracks.filter((track) =>
      track.title.toLowerCase().includes(query.toLowerCase()) || 
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
      setResults([]);
    }
    setResults(results)
    return false
  }
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const searchResults = await searchTracks(query)
      setIsLoading(searchResults)
    } catch (error) {
      console.error("Error searching tracks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for songs, artists, or albums"
              value={query}
              onChange={(e) => {setQuery(e.target.value)}}
              className="pl-10"
            />
          </div>
        </form>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center">Searching...</div>
          ) : results.length > 0 ? (
            <TrackList tab="default" tracks={results} />
          ) : (
            <div className="text-center text-muted-foreground">
              {query ? "No results found" : "Start searching for music"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

