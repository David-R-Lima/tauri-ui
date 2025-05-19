"use client"

import { useQuery } from "@tanstack/react-query"
import { GetPlaylists } from "../../services/playlist"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { useState } from "react"
import { Playlist } from "../../services/playlist/types"
import { SongsList } from "../songs-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DisplayPlaylist } from "./display-playlist"
import { DisplayAllSongs } from "./all-songs"

export function PlaylistCarousel() {
    const playlistQuery = useQuery({
        queryKey: ['playlist'],
        queryFn: GetPlaylists
    })

    const [displayPlaylist, setDisplayPlaylist] = useState<Playlist | undefined>(undefined) 

    return (
        <div className="flex w-full h-full">
            <Tabs defaultValue="all" className="flex items-center w-full">
                <TabsList className="flex items-center justify-center w-[95%]">
                    <Carousel   opts={{
                        align: "start",
                        loop: true,
                    }} className="w-full">
                        <CarouselContent className="w-full">
                            <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                                <TabsTrigger value="all" className="font-extrabold">All songs</TabsTrigger>
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                                <TabsTrigger value="liked" className="font-extrabold">Liked</TabsTrigger>
                            </CarouselItem>
                            {playlistQuery.data && playlistQuery.data.playlists.map((playlist) => (
                                <CarouselItem key={playlist.id} className="md:basis-1/4 lg:basis-1/5">
                                        <TabsTrigger value={playlist.id} className="font-extrabold">{playlist.name ?? "no name"}</TabsTrigger>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </TabsList>
                <TabsContent value="all" className="w-full h-full">
                    <DisplayAllSongs></DisplayAllSongs>
                </TabsContent>
                <TabsContent value="liked" className="w-full"></TabsContent>
                {playlistQuery.data && playlistQuery.data.playlists.map((playlist) => (
                    <TabsContent key={playlist.id} value={playlist.id} className="w-full">
                        <DisplayPlaylist playlistId={playlist.id}></DisplayPlaylist>
                    </TabsContent>
                ))}
            </Tabs>
            {displayPlaylist && (
                <SongsList setDisplayPlaylist={setDisplayPlaylist} displayPlaylist={displayPlaylist}></SongsList>
            )}
        </div>
    )
}