import { Card, CardContent } from "../ui/card"
import { AudioLines, Play } from "lucide-react"
import { History } from "@/services/history/types"
import UseControls from "@/store/song-control-store"

interface Props {
    item: History
}

export function QuickSelectItem({item}: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-between space-y-2">
                <div className="flex flex-col items-center w-full space-y-2">
                    {item.song?.img_url && (
                        <img className="size-32" src={item.song?.img_url} alt="" />
                    )}
                    {item.song?.title && (
                        <h1 className="truncate max-w-[90%]">{item.song?.title}</h1>
                    )}
                </div>
                {currentSong && currentSong.id === item.song_id && isPlaying ? (
                    <AudioLines size={32} className="animate-pulse text-primary" />
                ) : (
                    <Play size={32} className="hover:animate-pulse hover:text-primary hover:cursor-pointer" onClick={() => {
                        if(item.song) {
                            setCurrentSong(item.song)
                        }
                    }}></Play>
                )}
            </CardContent>
        </Card>
    )
}