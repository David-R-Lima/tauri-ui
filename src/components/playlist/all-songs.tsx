import { GetSongs } from "@/services/songs"
import { useQuery } from "@tanstack/react-query"
import { AudioLines } from "lucide-react"
import { useState } from "react"
import { SongItem } from "../song-item"

export function DisplayAllSongs() {

    const [page, setPage] = useState(1)

    const songsQuery = useQuery({
        queryKey: ['all-songs', page],
        queryFn: GetSongs
    })

    if(songsQuery.isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex w-full h-full">
            <div className="w-[25%] h-full p-6">
                <div className="m-8 h-[70%]">
                    <AudioLines className="w-full h-full"/>
                </div>
                <div>
                    <p>Playlist: All songs</p>
                    <p>Songs: {songsQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div className="w-[75%] bg-secondary rounded-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
            {songsQuery.data && songsQuery.data.songs.length && songsQuery.data.songs.length > 0 ? (
                    songsQuery.data.songs.map((data) => {

                    return (
                        <SongItem song={data}></SongItem>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
            </div>
        </div>
    )
}