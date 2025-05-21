import { GetHistory } from "@/services/history";
import { useInfiniteQuery } from "@tanstack/react-query";

export function UseHistorySongs() {
    const infiniteQuery = useInfiniteQuery({
        queryKey: [
            'previous-songs',
        ],
        queryFn: ({ pageParam = 1 }) => {
          return GetHistory({
            page: Number(pageParam),
          })
        },
        getNextPageParam: ({ meta }) => {
            return Number(meta.page + 1)
        },
        initialPageParam: 1,
        select: (data) => {
            const history = data.pages.flatMap((page) => page.history)
            const meta = data.pages[data.pages.length - 1].meta;

            return { history, meta }
        },
    })

    return infiniteQuery
}