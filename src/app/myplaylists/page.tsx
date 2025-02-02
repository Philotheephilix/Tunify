"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Track } from "@/hooks/use-audio-player";
import TrackList from "@/components/track-list";
import { ArrowLeftCircle, SkipBackIcon } from "lucide-react";

export default function PlaylistGrid() {
  const [playlistNames, setPlaylistNames] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const storedList = localStorage.getItem("playlistList");
    if (storedList) {
      setPlaylistNames(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    if (selectedPlaylist) {
      const storedTracks = localStorage.getItem(selectedPlaylist);
      setTracks(storedTracks ? JSON.parse(storedTracks) : []);
    }
  }, [selectedPlaylist]);

  const handleTrackSelect = (track: Track) => {
    setSelectedTracks((prev) =>
      prev.some((t) => t.id === track.id) ? prev.filter((t) => t.id !== track.id) : [...prev, track]
    );
  };

  return (
    <div className="p-6">
      {selectedPlaylist ? (
        <div>
          <Button variant="ghost" onClick={() => setSelectedPlaylist(null)}>
            <ArrowLeftCircle/> Back to Playlists
          </Button>

          <TrackList
            tab="default"
            tracks={tracks}
            onSelect={isSelecting ? handleTrackSelect : undefined}
            selectedTracks={isSelecting ? selectedTracks : undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlistNames.length > 0 ? (
            playlistNames.map((playlist) => (
              <Card key={playlist} className="cursor-pointer hover:bg-accent transition" onClick={() => setSelectedPlaylist(playlist)}>
                <CardHeader>
                  <CardTitle>{playlist}</CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No playlists found.</p>
          )}
        </div>
      )}
    </div>
  );
}
