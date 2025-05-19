import { Song } from "@/services/songs/types";
import UseControls from "@/store/song-control-store";
import { CheckIcon, Download } from "lucide-react";


interface Props {
    song: Song
}

export function SongItem({ song }: Props) {

    const {setCurrentSong} = UseControls()

    return (
        <div className="flex h-[70px] items-center w-full space-x-4 border-b rounded-lg p-2 m-2 hover:cursor-pointer hover:bg-secondary" onClick={() => {
            setCurrentSong(song)
        }}>
            {song.img_url && (
                <img className="size-10" src={song.img_url} alt="" />
            )}
            <p>{song.title ?? 'Untitled'}</p>
            {
                song.duration && (
                    <p>
                        {Math.floor(song.duration / 60)}:
                        {(song.duration % 60).toString().padStart(2, '0')}
                    </p>
                )
            }
            {song.local_url ? (
                <CheckIcon className="text-primary"></CheckIcon>
            ) : (
                <Download className="text-primary"></Download>
            )}
        </div>
    )
}