import { api } from "../api"
import { Song } from "./types"
import { IPaginationResponse } from "../pagination"

interface getSongsProps {
    page: number
}

export async function GetSongs({ page }: getSongsProps) {
    const { data } = await api.get<{
        songs: Song[],
        meta: IPaginationResponse
    }>('/song', {
        params: {
            page,
        },
    })

    return data
}

export async function AddSong(url: string) {
    await api.post("/song/download", {
        url
    })
}

interface AddSongToPlaylistProps {
    songId: string;
    playlistId: string;
}

export async function AddSongToPlaylist({ songId, playlistId}: AddSongToPlaylistProps) {
    const data = await api.post(`/playlist/add`, {
        songId: songId,
        playlistId: playlistId,
    })

    return data
}