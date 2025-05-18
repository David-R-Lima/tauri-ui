"use client"

import { useEffect, useRef } from "react"
import useControls from "../store/song-control-store"
import { ArrowLeftFromLine, ArrowRightToLine, Pause, Play, Repeat, Shuffle, Volume2, VolumeX } from "lucide-react"
import { Button } from "./ui/button"

const baseUrl = import.meta.env.VITE_API_URL

export function Controls() {
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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

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



    return (
        <div className="flex flex-col w-full">
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
                    <Button variant={"secondary"} onClick={() => {
                        previousSong()
                    }}>
                        <ArrowLeftFromLine />
                    </Button>
                    <Button
                        onClick={isPlaying ? pause : play}
                        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                    >
                        {isPlaying ? <Pause/> : <Play/>}
                    </Button>
                    <Button variant={"secondary"} onClick={() => {
                        nextSong()
                    }}>
                        <ArrowRightToLine />
                    </Button>
                </div>
                <div className="flex items-center space-x-4">
                    <img
                        className="w-16 h-16 object-cover rounded"
                        src={currentSong?.img_url}
                        alt={currentSong?.title || "Song image"}
                    />
                    <div className="text-lg font-semibold">
                        {currentSong ? `Now playing: ${currentSong.title}` : 'No song selected'}
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-24"
                            aria-label="Volume"
                        />
                    </div>
                    <Button
                        onClick={() => setRepeat()}
                        className=""
                        variant={`${repeat ? "default" : "secondary"}`}
                    >
                        <Repeat size={20} />
                    </Button>
                    <Button
                        onClick={() => setShuffle()}
                        className=""
                        variant={`${shuffle ? "default" : "secondary"}`}
                    >
                        <Shuffle size={20} />
                    </Button>
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
            </div>
        </div>
    )
}
