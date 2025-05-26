"use client"

import { useEffect, useRef, useState } from "react"
import useControls from "../store/song-control-store"
import { ArrowLeftFromLine, ArrowRightToLine, AudioLines, Pause, Play, Repeat, Shuffle, Volume2, VolumeX } from "lucide-react"
import { Button } from "./ui/button"
import { AddSongToHistory } from "@/services/history"
import { NextSongsSheet } from "./next-songs-sheet"
import { OpenCurrentSongSheet } from "./open-current-song-sheet"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Slider } from "./ui/slider"
import { DivButton } from "./ui/div-but-button"
import { HandleEvents } from "./handle-events"
import { UpdateNowListening } from "@/services/now-listening"

const baseUrl = import.meta.env.VITE_API_URL

export function Controls() {
    const [open, setOpen] = useState(false);
    const [addedToHistory, setAddedToHistory] = useState(false)

    const {
        currentSong,
        isPlaying,
        currentTime,
        setCurrentTime,
        play,
        pause,
        volume,
        setVolume,
        repeat,
        setRepeat,
        shuffle,
        setShuffle,
        handleEndSong,
        nextSong,
        previousSong
    } = useControls()

    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Play/pause effect based on state
    useEffect(() => {
        const audio = audioRef.current

        if (!audio) return

        audio.volume = volume

        if (isPlaying) {
            audio.play().catch(console.error)
        } else {
            audio.pause()
        }
    }, [isPlaying, currentSong])

    //updatte volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    //update time
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => {
            setCurrentTime(audio.currentTime)
        }

        audio.addEventListener('timeupdate', updateTime)
        return () => {
            audio.removeEventListener('timeupdate', updateTime)
        }
    }, [currentSong])

    //add to history after 10 seconds
    useEffect(() => {
        if (currentSong && currentTime >= 10 && !addedToHistory) {
            AddSongToHistory({ song_id: currentSong.id })
                .catch(console.error)
            setAddedToHistory(true)
        }

        return () => {
            setAddedToHistory(false)
        }
    }, [currentTime, currentSong])

    useEffect(() => {
        if(currentSong) {
            UpdateNowListening({
                song_id: currentSong.id
            })
        }
    }, [currentSong])

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="z-5">
                {currentSong && (
                    <div className="flex items-center w-full">
                        <input
                            type="range"
                            min={0}
                            max={currentSong?.duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={(e) => {
                            const newTime = parseFloat(e.target.value)
                                if (audioRef.current) {
                                    audioRef.current.currentTime = newTime
                                }
                            }}
                            className="w-full"
                            aria-label="Progress bar"
                        />
                    </div>
                )}
        
                <div className="p-4 bg-secondary-foreground text-white flex flex-row items-center justify-between gap-2">
                    <div className="flex space-x-4">
                        <Button className="text-accent-foreground" variant={"secondary"} onClick={() => {
                            previousSong()
                        }}>
                            <ArrowLeftFromLine />
                        </Button>
                        <Button
                            onClick={isPlaying ? pause : play}
                            variant={'secondary'}
                            className="px-4 py-2 bg-primary"
                        >
                            {isPlaying ? <Pause/> : <Play/>}
                        </Button>
                        <Button className="text-accent-foreground" variant={"secondary"} onClick={() => {
                            nextSong()
                        }}>
                            <ArrowRightToLine />
                        </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                        {currentSong?.img_url ? (
                            <img
                                className="size-16 object-cover text-primary rounded"
                                src={currentSong?.img_url}
                                alt={currentSong?.title || "Song image"}
                            />  
                        ) : (
                            <AudioLines className="w-16 h-16 text-primary"/>
                        )}

                        <div className="text-lg text-primary font-semibold">
                            <p className="truncate max-w-[250px] lg:max-w-[400px] xl:max-w-[700px] 2xl:max-w-full">{currentSong ? `${currentSong.title?.replace(/\.mp3$/i, '')}` : 'No song selected'}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Popover>
                            <PopoverTrigger>
                                <DivButton>
                                    {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                </DivButton>
                            </PopoverTrigger>
                            <PopoverContent className="flex items-center justify-center w-6 m-2">
                                <Slider value={[volume * 100]} className="h-28" orientation="vertical" onValueChange={(e) => {
                                    const v = e[0]
                                    setVolume(v / 100)
                                }}></Slider>
                            </PopoverContent>
                        </Popover>
                        <Button
                            onClick={() => setRepeat()}
                            className="text-accent-foreground"
                            variant={`${repeat ? "default" : "secondary"}`}
                        >
                            <Repeat size={20} />
                        </Button>
                        <Button
                            onClick={() => setShuffle()}
                            className="text-accent-foreground"
                            variant={`${shuffle ? "default" : "secondary"}`}
                        >
                            <Shuffle size={20} />
                        </Button>
                        <NextSongsSheet />
                        <OpenCurrentSongSheet open={open} setOpen={setOpen} audioRef={audioRef}/>
                    </div>
                </div>
            </div>

            {currentSong?.local_url && (
                <audio
                key={currentSong.id}
                ref={audioRef}
                src={baseUrl + currentSong.local_url}
                preload="auto"
                onEnded={() => {
                    if (repeat && currentSong) {
                    audioRef.current!.currentTime = 0
                    audioRef.current!.play().catch(() => {})
                    setCurrentTime(0)
                    } else {
                    handleEndSong()
                    }
                }}
                />
            )}

            <HandleEvents />
        </div>
    )
}
