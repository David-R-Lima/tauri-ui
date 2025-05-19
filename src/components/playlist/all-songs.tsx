import { GetSongs } from "@/services/songs"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AudioLines } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SongItem } from "../song-item"

export function DisplayAllSongs() {

    const [page, setPage] = useState(1)

    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = useInfiniteQuery({
        queryKey: [
          'all-songs',
          page
        ],
        queryFn: ({ pageParam }) => {
          return GetSongs({
            page: Number(pageParam),
          })
        },
        getNextPageParam: ({ meta }) => {
        //   if (meta.page < meta.page) {
        //     return meta.pageIndex + 1
        //   }
        //   return undefined
            // setPage(meta.page + 1)
            return Number(meta.page + 1)
        },
    
        initialPageParam: 1,
        select: (data) => {
            const songs = data.pages.flatMap((page) => page.songs)
            const meta = data.pages[data.pages.length - 1].meta;
            console.log(meta)

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
        <div className="flex w-full h-full">
            <div className="w-[25%] h-full p-6">
                <div className="m-8 h-[70%]">
                    <AudioLines className="w-full h-full"/>
                </div>
                <div>
                    <p>Playlist: All songs</p>
                    <p>Songs: {infiniteQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div ref={observerRef} className="w-[75%] bg-secondary rounded-xl p-4 h-[95%] overflow-y-scroll overflow-x-hidden">
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