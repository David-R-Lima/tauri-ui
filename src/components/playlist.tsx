"use client"

import { useQuery } from "@tanstack/react-query"
import { GetPlaylist } from "../services/playlist"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"
import { useState } from "react"
import { Playlist } from "../services/playlist/types"
import { Disc3 } from "lucide-react"
import { SongsList } from "./songs-list"

export function PlaylistCarousel() {
    const playlistQuery = useQuery({
        queryKey: ['playlist'],
        queryFn: GetPlaylist
    })

    const [displayPlaylist, setDisplayPlaylist] = useState<Playlist | undefined>(undefined) 

    return <div>
        {!displayPlaylist && (
            <Carousel>
                <CarouselContent className="w-full space-x-8 max-w-[75vw] p-8">
                    {playlistQuery.data && playlistQuery.data.map((data) => (
                        <CarouselItem key={data.id} className="relative bg-secondary flex flex-col items-center justify-center h-[40vh] max-w-[30%] hover:cursor-pointer rounded-4xl" onClick={() => {
                            setDisplayPlaylist(data)
                        }}>       
                            <div className="w-full h-full p-6">
                                {data.img_url ? (
                                    <img src={data.img_url} alt="" />
                                ) : (
                                    <Disc3 className="h-full w-full text-primary"/>
                                )} 
                            </div>   
                            <div className="absolute bottom-0 left-4 w-full p-4">
                                <p className="font-extrabold">Songs: {data.playlist_songs?.length}</p>
                            </div>         
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="text-primary" />
                <CarouselNext className="text-primary" />
            </Carousel>
        )}

        {displayPlaylist && (
            <SongsList setDisplayPlaylist={setDisplayPlaylist} displayPlaylist={displayPlaylist}></SongsList>
        )}
    </div>
}