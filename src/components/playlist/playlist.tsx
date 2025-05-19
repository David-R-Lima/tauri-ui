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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DisplayPlaylist } from "./display-playlist"
import { DisplayAllSongs } from "./all-songs"

export function PlaylistCarousel() {
    const playlistQuery = useQuery({
        queryKey: ['playlist'],
        queryFn: GetPlaylists
    })

    return (
        <div className="flex w-full h-full">
            <Tabs defaultValue="all" className="flex items-center w-full">
                <TabsList className="flex items-center justify-center w-[95%] mb-6">
                    <Carousel   opts={{
                        align: "start",
                        loop: true,
                    }} className="w-full">
                        <CarouselContent className="w-full">
                            <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/8">
                                <TabsTrigger value="all" className="font-extrabold hover:cursor-pointer" >All songs</TabsTrigger>
                            </CarouselItem>
                            <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/8">
                                <TabsTrigger value="liked" className="font-extrabold hover:cursor-pointer">Liked</TabsTrigger>
                            </CarouselItem>
                            <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/8">
                                <TabsTrigger value="history" className="font-extrabold hover:cursor-pointer">Previous songs</TabsTrigger>
                            </CarouselItem>
                            {playlistQuery.data && playlistQuery.data.playlists.map((playlist) => (
                                <CarouselItem key={playlist.id} className="basis-1/5 lg:basis-1/6 xl:basis-1/8">
                                        <TabsTrigger value={playlist.id} className="font-extrabold hover:cursor-pointer">{playlist.name ?? "no name"}</TabsTrigger>
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
        </div>
    )
}