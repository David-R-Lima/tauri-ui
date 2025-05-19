import { GetSongs } from "@/services/songs"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AudioLines } from "lucide-react"
import { useEffect, useRef } from "react"
import { SongItem } from "../song-item"

export function DisplayAllSongs() {

    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = useInfiniteQuery({
        queryKey: [
          'all-songs'
        ],
        queryFn: ({ pageParam }) => {
          return GetSongs({
            page: Number(pageParam),
          })
        },
        getNextPageParam: ({ meta }) => {
            return Number(meta.page + 1)
        },
    
        initialPageParam: 1,
        select: (data) => {
            const songs = data.pages.flatMap((page) => page.songs)
            const meta = data.pages[data.pages.length - 1].meta;

            return { songs, meta }
        },
    })
    
      useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              infiniteQuery.fetchNextPage() // Trigger fetching the next page
            }
          },
          { threshold: 1.0 },
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
                <div>
                    <p className="font-extrabold italic">Playlist: All songs</p>
                    <p className="font-extrabold italic">Songs: {infiniteQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div ref={observerRef} className="w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
            {infiniteQuery.data && infiniteQuery.data.songs.length && infiniteQuery.data.songs.length > 0 ? (
                    infiniteQuery.data.songs.map((data) => {

                    return (
                        <SongItem key={data.id} song={data}></SongItem>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
            </div>
        </div>
    )
}