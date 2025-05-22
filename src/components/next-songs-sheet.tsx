import { AlignJustify, Disc2, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import UseControls from "@/store/song-control-store";


export function NextSongsSheet() {
    const { nextSongs, setCurrentSong } = UseControls()

    return (
        <Sheet>
            <SheetTrigger>
                <Button>
                    <AlignJustify />
                </Button>
            </SheetTrigger>
            <SheetContent className="p-4">
                <h1>Next songs</h1>
                <div className="space-y-4">
                    {nextSongs.map((song) => (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {song.img_url ? (
                                    <img src={song.img_url} alt="" className="size-12"/>
                                ) : (
                                    <Disc2 />
                                )}
                                <p>{song.title}</p> 
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