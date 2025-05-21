import { Liked } from "@/services/enums/liked";
import { GetSongs } from "@/services/songs";
import { useInfiniteQuery } from "@tanstack/react-query";


export function UseLikedSongs() {
    const infiniteQuery = useInfiniteQuery({
        queryKey: [
          'liked-songs'
        ],
        queryFn: ({ pageParam = 1 }) => {
          return GetSongs({
            page: Number(pageParam),
            liked: Liked.TRUE
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

    return infiniteQuery
}