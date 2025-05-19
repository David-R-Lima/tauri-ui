import { AudioLines } from "lucide-react"
import { useEffect, useRef } from "react"
import { SongItem } from "../song-item"
import UseControls from "@/store/song-control-store"
import { Playlist } from "@/services/playlist/types"
import { PlaylistSong } from "@/services/playlist-songs/types"
import { UseAllSongs } from "@/hooks/useAllSongs"

const allPlaylist: Playlist = { id: "all", name: "All Songs", playlist_songs: [] }

export function DisplayAllSongs() {

    const { setCurrentPlaylist } = UseControls()

    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = UseAllSongs()
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            infiniteQuery.fetchNextPage() // Trigger fetching the next page
          }
        },
        { threshold: 0 },
      )
  
      if (observerRef.current) {
        observer.observe(observerRef.current)
      }
  
      return () => {
        if (observerRef.current) {
          observer.unobserve(observerRef.current)
        }
      }
    }, [infiniteQuery.hasNextPage, infiniteQuery.fetchNextPage])

    if(infiniteQuery.isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex justify-between w-full h-[95%]">
            <div className="flex flex-col items-center justify-center w-[20%] h-full p-6 bg-primary rounded-l-xl">
                <div className="h-[50%] w-[80%]">
                    <AudioLines className="w-full h-full"/>
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: All songs</p>
                    <p className="font-extrabold italic">Songs: {infiniteQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div className="w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
                {infiniteQuery.data && infiniteQuery.data.songs.length && infiniteQuery.data.songs.length > 0 ? (
                    infiniteQuery.data.songs.map((data) => {

                    const playlistSong: PlaylistSong = {
                      playlist_id: "all",
                      song_id: data.id,
                      song: data
                    }

                    allPlaylist.playlist_songs?.push(playlistSong)

                    return (
                        <div onClick={() => {
                          setCurrentPlaylist(allPlaylist)
                        }}>
                          <SongItem key={data.id} song={data}></SongItem>
                        </div>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}

                <div ref={observerRef}></div>
            </div>
        </div>
    )
}