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
import { Disc3 } from "lucide-react"
import { SongsList } from "../songs-list"
import { Card, CardContent } from "../ui/card"

export function PlaylistCarousel() {
    const playlistQuery = useQuery({
        queryKey: ['playlist'],
        queryFn: GetPlaylists
    })

    const [displayPlaylist, setDisplayPlaylist] = useState<Playlist | undefined>(undefined) 

    return (
        <div className="w-full max-w-[85%]">
            {!displayPlaylist && (
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full h-full p-8"
                >
                    <CarouselContent>
                        {playlistQuery.data && playlistQuery.data.map((data) => (
                            <CarouselItem key={data.id} className="basis-1/2 lg:basis-1/3 hover:cursor-pointer" onClick={() => setDisplayPlaylist(data)}>
                                <div className="p-20">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-8">
                                        <div className="flex aspect-square items-center justify-center w-full">
                                                {data.img_url ? (
                                                    <img src={data.img_url} alt="" />
                                                ) : (
                                                    <Disc3 className="size-full text-primary"/>
                                                )} 
                                            </div>   
                                            <div className="absolute bottom-0 left-4 w-full p-4">
                                                <p className="font-extrabold">Songs: {data.playlist_songs?.length}</p>
                                            </div>   
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
            {displayPlaylist && (
                <SongsList setDisplayPlaylist={setDisplayPlaylist} displayPlaylist={displayPlaylist}></SongsList>
            )}
        </div>
    )
}