import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { GetMyLikedPlaylist } from "@/services/youtube";
import { Loader2, MoveLeft, MoveRight } from "lucide-react";
import { YoutubeItem } from "./yt-video-item";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import { useEffect, useRef, useState } from "react";
import { GetQuickSelect } from "@/services/history";
import { QuickSelectItem } from "./quick-select-item";


export function Home() {
    const [api, setApi] = useState<CarouselApi>()
    const [quickSelectApi, setQuickSelectApi] = useState<CarouselApi>()

    const infiniteQuery = useInfiniteQuery({
        queryKey: ["yt-liked"],
        queryFn: async ({ pageParam }) => {
            const res = await GetMyLikedPlaylist({
                pageToken: pageParam === "" ? undefined : pageParam
            })

            return res
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage.nextPageToken ?? undefined
        },
        select: (data) => {
            const res = data.pages.flatMap(page => page.items)

            return {
                items: res,
                nextPageToken: data.pages[data.pages.length - 1].nextPageToken
            }
        }
    })

    const historyQuery = useQuery({
        queryKey: ["quick-select"],
        queryFn: GetQuickSelect
    })

    const observerRef = useRef<HTMLDivElement | null>(null)
    
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

    return (
        <div className="mx-h-[80vh] overflow-y-auto overflow-x-hidden p-4 space-y-4">
            <div className="space-y-4">
                <h1>Quick select</h1>
                <div className="flex w-full justify-between">
                    <div className="p-1 bg-primary rounded-full hover:cursor-pointer" onClick={() => {
                            quickSelectApi?.scrollPrev(true)
                        }}>
                        <MoveLeft className="" />
                    </div>
                    <div className="p-1 bg-primary rounded-full hover:cursor-pointer" onClick={() => {
                            quickSelectApi?.scrollNext(true)
                        }}>
                        <MoveRight />
                    </div>
                </div>
                <Carousel setApi={setQuickSelectApi} className="w-[90vw]">
                    <CarouselContent className="">
                        {historyQuery.data && historyQuery.data.map((item, i) => (
                            <CarouselItem key={i} className="basis-1/4">
                                <QuickSelectItem item={item}></QuickSelectItem>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="space-y-4">
                <h1>Youtube liked</h1>
                <div className="flex w-full justify-between">
                    <div className="p-1 bg-primary rounded-full hover:cursor-pointer" onClick={() => {
                            api?.scrollPrev(true)
                        }}>
                        <MoveLeft className="" />
                    </div>
                    <div className="p-1 bg-primary rounded-full hover:cursor-pointer" onClick={() => {
                            api?.scrollNext(true)
                        }}>
                        <MoveRight />
                    </div>
                </div>
                <Carousel setApi={setApi} className="w-[90vw]">
                    <CarouselContent className="">
                        {infiniteQuery.data && infiniteQuery.data.items && infiniteQuery.data.items.map((item, i) => (
                                <CarouselItem key={i} className="basis-1/3">
                                    <YoutubeItem item={item} key={i}></YoutubeItem>
                                </CarouselItem>
                            ))}
                        <CarouselItem className="basis-1/3">
                            <div ref={observerRef} className="h-full">
                                <Card className="h-full">
                                    <CardContent className="flex items-center justify-center h-full">
                                        <Loader2  size={128} className="animate-spin text-primary" />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}