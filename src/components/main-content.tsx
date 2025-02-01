"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackList } from "@/components/track-list"

export function MainContent() {
  return (
    <div className="flex-1 overflow-hidden">
      <Tabs defaultValue="stream" className="h-full">
        <div className="border-b px-6 py-2">
          <TabsList>
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="Recent Releases">Recent Releases</TabsTrigger>
          </TabsList>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <TabsContent value="stream" className="p-6">
            <TrackList tab='default'/>
          </TabsContent>
          <TabsContent value="trending" className="p-6">
            <TrackList tab='featured'/>
          </TabsContent>
          <TabsContent value="Recent Releases" className="p-6">
            <TrackList tab='recent'/>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

