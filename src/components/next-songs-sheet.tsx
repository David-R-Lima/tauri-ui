import { AlignJustify, AudioLines, Disc2, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import UseControls from "@/store/song-control-store";
import { useEffect, useRef, useState } from "react";


export function NextSongsSheet() {
    const { nextSongs, previousSongs, currentSong, setCurrentSong } = UseControls()

    const currentSongRef = useRef<HTMLDivElement>(null);

    const [scroll, setScroll] = useState(false)

    useEffect(() => {
        if (currentSongRef.current) {
            currentSongRef.current.scrollIntoView({ block: 'center' });
        }
    }, [currentSong, scroll]);

    return (
        <Sheet onOpenChange={() => {
            setScroll(!scroll)
        }}>
            <SheetTrigger>
                <Button>
                    <AlignJustify />
                </Button>
            </SheetTrigger>
            <SheetContent className="p-4 min-w-[30vw]">
                <h1>Next songs</h1>
                <div className="space-y-4 h-full overflow-y-scroll p-4">
                    {previousSongs.slice(0, 10).map((song) => (
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                                {song.img_url ? (
                                    <img src={song.img_url} alt="" className="size-12"/>
                                ) : (
                                    <Disc2 />
                                )}
                                <p className="truncate">{song.title}</p> 
                            </div>
                            <Button onClick={() => {
                                setCurrentSong(song)
                            }}>
                                <Play />
                            </Button>
                        </div>
                    ))}
                    {currentSong && (
                        <div ref={currentSongRef} className="flex items-center justify-between animate-pulse">
                            <div className="flex items-center space-x-2">
                                {currentSong.img_url ? (
                                    <img src={currentSong.img_url} alt="" className="size-12"/>
                                ) : (
                                    <Disc2 />
                                )}
                                <p>{currentSong.title}</p> 
                            </div>
                            <AudioLines className="size-12 text-primary"/>
                        </div>
                    )}
                    {nextSongs.map((song) => (
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                                {song.img_url ? (
                                    <img src={song.img_url} alt="" className="size-12"/>
                                ) : (
                                    <Disc2 />
                                )}
                                <p className="truncate">{song.title}</p> 
                            </div>
                            <Button onClick={() => {
                                setCurrentSong(song)
                            }}>
                                <Play />
                            </Button>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}