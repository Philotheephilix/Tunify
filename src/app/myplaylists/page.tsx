"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Track } from "@/hooks/use-audio-player";
import TrackList from "@/components/track-list";
import { ArrowLeftCircle } from "lucide-react";

export default function PlaylistGrid() {
  const [playlistNames, setPlaylistNames] = useState<string[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<Record<string, Track[]>>({});
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const storedList = localStorage.getItem("playlistList");
    if (storedList) {
      const names = JSON.parse(storedList);
      setPlaylistNames(names);
      
      // Load tracks for all playlists
      const tracksMap: Record<string, Track[]> = {};
      names.forEach((playlist: string) => {
        const storedTracks = localStorage.getItem(playlist);
        if (storedTracks) {
          tracksMap[playlist] = JSON.parse(storedTracks);
        }
      });
      setPlaylistTracks(tracksMap);
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const handleTrackSelect = (track: Track) => {
    setSelectedTracks((prev) =>
      prev.some((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track]
    );
  };

  return (
    <div className="p-6">
      {selectedPlaylist ? (
        <div>
          <Button variant="ghost" onClick={() => setSelectedPlaylist(null)}>
            <ArrowLeftCircle className="mr-2" /> Back to Playlists
          </Button>
          <TrackList
            tab="default"
            tracks={playlistTracks[selectedPlaylist] || []}
            onSelect={isSelecting ? handleTrackSelect : undefined}
            selectedTracks={isSelecting ? selectedTracks : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlistNames.length > 0 ? (
            playlistNames.map((playlist) => (
              <Card
                key={playlist}
                className="cursor-pointer hover:bg-accent/50 transition group"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Initials Thumbnail */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                      <span className="text-3xl font-bold text-primary">
                        {getInitials(playlist)}
                      </span>
                    </div>
                    
                    {/* Playlist Name */}
                    <h3 className="font-semibold text-lg text-center">
                      {playlist}
                    </h3>
                    
                    {/* Track Preview */}
                    <div className="w-full text-sm text-muted-foreground">
                      {playlistTracks[playlist]?.slice(0, 3).map((track, index) => (
                        <div key={track.id} className="truncate text-center">
                          {track.title}
                        </div>
                      ))}
                      {playlistTracks[playlist]?.length > 3 && (
                        <div className="text-center text-xs mt-1">
                          +{playlistTracks[playlist].length - 3} more
                        </div>
                      )}
                      {(!playlistTracks[playlist] || playlistTracks[playlist].length === 0) && (
                        <div className="text-center italic">No tracks</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              No playlists found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}