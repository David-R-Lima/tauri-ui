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
        <div className="flex justify-between w-full h-[95%]">
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
            <div className="w-[80%] bg-secondary rounded-r-xl p-4">
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