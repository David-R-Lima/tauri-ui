import { GetPlaylist } from "@/services/playlist"
import UseControls from "@/store/song-control-store"
import { useQuery } from "@tanstack/react-query"
import { Disc3 } from "lucide-react"
import { SongItem } from "../song-item"

interface Props {
    playlistId: string
}
export function DisplayPlaylist({ playlistId }: Props) {

    const {setCurrentPlaylist} = UseControls()

    const playlistQuery = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: GetPlaylist
    })

    if( playlistQuery.isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex justify-between w-full h-[80%] lg:h-[90%]">
            <div className="flex flex-col items-center justify-center w-[20%] h-full p-6 bg-primary rounded-l-xl">
                <div className="h-[50%] w-[80%]">
                    {playlistQuery.data?.img_url ? (
                        <img src={playlistQuery.data?.img_url ?? ""}></img>
                    ) : (
                        <Disc3 className="w-full h-full" />
                    )}
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: {playlistQuery.data?.name}</p>
                    <p className="font-extrabold italic">Description: {playlistQuery.data?.description}</p>
                    <p className="font-extrabold italic">Songs: {playlistQuery.data?.playlist_songs?.length}</p>
                </div>
            </div>
            <div className="w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
            {playlistQuery.data && playlistQuery.data.playlist_songs && playlistQuery.data.playlist_songs.length > 0 ? (
                    playlistQuery.data.playlist_songs.map((data) => {
                    if (!data || !data.song) return null

                    return (
                        <div key={data.song_id}  onClick={() => {
                            setCurrentPlaylist(playlistQuery.data)
                        }}>
                            <SongItem song={data.song}></SongItem>
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