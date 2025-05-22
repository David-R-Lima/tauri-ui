import { GetPlaylist } from "@/services/playlist"
import UseControls from "@/store/song-control-store"
import { useQuery } from "@tanstack/react-query"
import { Disc3, RefreshCcw } from "lucide-react"
import { SongItem } from "../song-item"
import { Source } from "@/services/enums/source"

interface Props {
    playlistId: string
}
export function DisplayPlaylist({ playlistId }: Props) {

    const {setSource, setSourceId} = UseControls()

    const { data, isPending, refetch} = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: GetPlaylist
    })

    if( isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex justify-between w-full h-[80%] lg:h-[90%]">
            <div className="flex flex-col items-center justify-center w-[20%] h-full p-6 bg-primary rounded-l-xl">
                <div className="h-[50%] w-[80%]">
                    {data?.playlist.img_url ? (
                        <img src={data?.playlist.img_url ?? ""}></img>
                    ) : (
                        <Disc3 className="w-full h-full" />
                    )}
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: {data?.playlist.name}</p>
                    <p className="font-extrabold italic">Description: {data?.playlist.description}</p>
                    <p className="font-extrabold italic">Songs: {data?.playlist_songs.meta.totalItems}</p>
                </div>
            </div>
            <div className="w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
                <div className="px-4 py-2">
                    <RefreshCcw className="hover:cursor-pointer" onClick={() => {
                        refetch()
                    }}/>
                </div>
            {data && data?.playlist_songs.data && data?.playlist_songs.data.length > 0 ? (
                    data?.playlist_songs.data.map((playlistSong) => {
                    if (!playlistSong || !playlistSong.song) return null

                    return (
                        <div key={playlistSong.song_id}  onClick={() => {
                            setSource(Source.PLAYLIST)
                            setSourceId(playlistId)
                        }}>
                            <SongItem song={playlistSong.song}></SongItem>
                        </div>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
            </div>
        </div>
    )
}