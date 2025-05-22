import { Song } from "@/services/songs/types";
import UseControls from "@/store/song-control-store";
import { AudioLines, Heart, Play, Plus, Trash } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { AddSongToPlaylist, UpdateSong } from "@/services/songs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Liked } from "@/services/enums/liked";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface Props {
    song: Song
    onClick: () => void
}

export function SongItem({ song, onClick }: Props) {

    const {currentSong, isPlaying, play, setCurrentTime, pause} = UseControls()

    const playlists = usePlaylists()

    const addSongtoPlaylistMutation = useMutation({
        mutationFn: AddSongToPlaylist,
        onSuccess: () => {
            toast.success("Song Added to playlist")
            playlists.refetch()
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    const updateSongMutation = useMutation({
        mutationFn: UpdateSong,
        onSuccess: () => {
            toast.success("Liked song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <div className="flex h-[70px] items-center justify-between w-full space-x-4 border-b rounded-lg p-2 m-2 hover:bg-secondary" >
            <div className="flex items-center space-x-4 hover:cursor-pointer" onClick={() => {
                onClick()
            }}> 
                {currentSong?.id === song.id && isPlaying && (
                    <AudioLines className="animate-pulse text-primary" />
                )}
                {(currentSong?.id !== song.id || !isPlaying) && (
                    <Play  onClick={() => {
                        pause()
                        setCurrentTime(0)
                        play()
                    }}/>
                )}

                {song.img_url && (
                    <img className="size-10" src={song.img_url} alt="" />
                )}
                <p className="truncate max-w-[100px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-full">{(song.title ?? 'Untitled').replace(/\.mp3$/i, '')}</p>

                {
                    song.duration && (
                        <p>
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, '0')}
                        </p>
                    )
                }
                {/* {song.local_url ? (
                    <CheckIcon className="text-primary"></CheckIcon>
                ) : (
                    <Download className="text-primary"></Download>
                )} */}
            </div>
            <div className="flex items-center justify-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="hover:cursor-pointer">                
                        <Plus />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Playlists</DropdownMenuLabel>
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        {playlists.data && playlists.data.playlists.map((playlist, i) => (
                            <DropdownMenuItem key={i} className="hover:cursor-pointer" onClick={() => {
                                addSongtoPlaylistMutation.mutate({
                                    songId: song.id,
                                    playlistId: playlist.id,
                                })
                            }}>
                                {playlist.name ?? "no name"}
                            </DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {
                    song.liked ? (
                        <Heart className="fill-primary text-primary transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                            updateSongMutation.mutate({
                                song_id: song.id,
                                liked: Liked.FALSE
                            })

                            song.liked = false
                        }}/>
                    ) : (
                        <Heart className="transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                            updateSongMutation.mutate({
                                song_id: song.id,
                                liked: Liked.TRUE
                            })

                            song.liked = true
                        }}/>
                    )
                }
                <Trash className="text-red-500 hover:animate-pulse hover:cursor-pointer"/>
            </div>
        </div>
    )
}