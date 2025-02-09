"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrackList } from "@/components/track-list"

import tracks from "@/modals/tracks"
import { Track } from "@/hooks/use-audio-player"

interface SearchWindowProps {
  checked?: boolean
  onSelectionChange?: (selected: Track[]) => void
}

const SearchWindow: React.FC<SearchWindowProps> = ({ checked = false, onSelectionChange }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const searchResults = tracks.filter((track) =>
        track.songName.toLowerCase().includes(query.toLowerCase()) ||
        track.songUrl.toLowerCase().includes(query.toLowerCase())
      )
      setResults(searchResults)
    } catch (error) {
      console.error("Error searching tracks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTrack = (track: Track) => {
    setSelectedTracks((prev) => {
      const isAlreadySelected = prev.some((t) => t.songUrl === track.songUrl)
      const updatedSelection = isAlreadySelected
        ? prev.filter((t) => t.songUrl !== track.songUrl)
        : [...prev, track]

      setTimeout(() => {
        onSelectionChange?.(updatedSelection)
      }, 0)

      return updatedSelection
    })
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
              onChange={(e) => setQuery(e.target.value)}
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
            <TrackList 
              tab="default" 
              tracks={results} 
              onSelect={checked ? handleSelectTrack : undefined} 
              selectedTracks={checked ? selectedTracks : undefined} 
            />
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

export default SearchWindow