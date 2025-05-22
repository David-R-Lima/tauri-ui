import { AudioLines, RefreshCcw } from "lucide-react"
import { useEffect, useRef } from "react"
import { SongItem } from "../song-item"
import UseControls from "@/store/song-control-store"
import { Playlist } from "@/services/playlist/types"
import { PlaylistSong } from "@/services/playlist-songs/types"
import { UseLikedSongs } from "@/hooks/useLikedSongs"
import { Source } from "@/services/enums/source"

const allPlaylist: Playlist = { id: "all", name: "All Songs", playlist_songs: [] }

export function DisplayLikedSongs() {

    const { setSource, setCurrentSong } = UseControls()

    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = UseLikedSongs()
    
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
        <div className="flex justify-between w-full h-[80%] lg:h-[90%]">
            <div className="hidden lg:flex flex-col items-center justify-center w-[30%] xl:w-[20%] h-full p-6 bg-primary rounded-l-xl">
                <div className="h-[50%] w-[80%]">
                    <AudioLines className="w-full h-full"/>
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: All songs</p>
                    <p className="font-extrabold italic">Songs: {infiniteQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div className="w-full lg:w-[70%] xl:w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
                <div className="px-4 py-2">
                  <RefreshCcw className="hover:cursor-pointer" onClick={() => {
                    infiniteQuery.refetch()
                  }}/>
                </div>
                {infiniteQuery.data && infiniteQuery.data.songs.length && infiniteQuery.data.songs.length > 0 ? (
                    infiniteQuery.data.songs.map((data, i) => {

                    const playlistSong: PlaylistSong = {
                      playlist_id: "all",
                      song_id: data.id,
                      song: data
                    }

                    allPlaylist.playlist_songs?.push(playlistSong)

                    return (
                        <div key={i}>
                          <SongItem song={data} onClick={() => {
                              setSource(Source.LIKED)
                              setCurrentSong(data)
                          }} />
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