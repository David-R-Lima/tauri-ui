import { api } from "../api"
import { Song } from "./types"
import { IPaginationResponse } from "../pagination"

interface getSongsProps {
    page: number
}

export async function GetSongs({ page }: getSongsProps) {
    console.log(page)
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