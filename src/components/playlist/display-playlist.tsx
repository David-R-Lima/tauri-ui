import { GetPlaylist } from "@/services/playlist"
import UseControls from "@/store/song-control-store"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, Disc3, Download } from "lucide-react"

interface Props {
    playlistId: string
}
export function DisplayPlaylist({ playlistId }: Props) {

    const {setCurrentSong, setCurrentPlaylist} = UseControls()

    const playlistQuery = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: GetPlaylist
    })

    if( playlistQuery.isPending) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex w-full h-full">
            <div className="w-[25%] h-full p-6">
                <div className="m-8 h-[70%]">
                    {playlistQuery.data?.img_url ? (
                        <img src={playlistQuery.data?.img_url ?? ""}></img>
                    ) : (
                        <Disc3 className="w-full h-full" />
                    )}
                </div>
                <div>
                    <p>Playlist: {playlistQuery.data?.name}</p>
                    <p>Description: {playlistQuery.data?.description}</p>
                    <p>Songs: {playlistQuery.data?.playlist_songs?.length}</p>
                </div>
            </div>
            <div className="w-[75%] bg-secondary rounded-xl p-4">
            {playlistQuery.data && playlistQuery.data.playlist_songs && playlistQuery.data.playlist_songs.length > 0 ? (
                    playlistQuery.data.playlist_songs.map((data) => {
                    if (!data || !data.song) return null

                    return (
                        <li key={data.song_id} className="flex items-center w-full space-x-4 border-b rounded-lg p-2 m-2 hover:cursor-pointer hover:bg-secondary" onClick={() => {
                            if(data.song) {
                                setCurrentPlaylist(playlistQuery.data)
                                setCurrentSong(data.song)
                            }
                        }}>
                            {data.song.img_url && (
                                <img className="size-10" src={data.song.img_url} alt="" />
                            )}
                            <p>{data.song.title ?? 'Untitled'}</p>
                            {
                                data.song.duration && (
                                    <p>
                                        {Math.floor(data.song.duration / 60)}:
                                        {(data.song.duration % 60).toString().padStart(2, '0')}
                                    </p>
                                )
                            }
                            {data.song.local_url ? (
                                <CheckIcon className="text-primary"></CheckIcon>
                            ) : (
                                <Download className="text-primary"></Download>
                            )}
                        </li>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
            </div>
        </div>
    )
}