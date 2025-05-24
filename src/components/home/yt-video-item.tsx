import { AddSong } from "@/services/songs"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent } from "../ui/card"
import { Download, Loader2 } from "lucide-react"
import { YouTubeLikedPlayistItem } from "@/services/youtube/types"

interface Props {
    item: YouTubeLikedPlayistItem
}

export function YoutubeItem({item}: Props) {
    const downloadSongMutation = useMutation({
        mutationKey: ["download"],
        mutationFn: AddSong,
        onSuccess: () => {
            toast.success("Downloaded song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <Card className="h-full">
            <CardContent className="flex flex-col items-start justify-between space-y-2 h-full">
                {item.snippet.thumbnails.high?.url && (
                    <img src={item.snippet.thumbnails.high?.url} alt="" />
                )}
                {item.snippet.title && (
                    <h1 className="truncate max-w-[90%]">{item.snippet.title}</h1>
                )}
                {item.snippet.resourceId.videoId && !item.downloaded && !downloadSongMutation.isPending && (
                    <Download size={32} onClick={() => {
                        downloadSongMutation.mutate({
                            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                        })
                    }} />
                )}
                {item.snippet.resourceId.videoId && downloadSongMutation.isPending && (
                    <Loader2 className="animate-spin" />
                )}
            </CardContent>
        </Card>
    )
}