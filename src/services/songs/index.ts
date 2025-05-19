import { QueryFunctionContext } from "@tanstack/react-query"
import { api } from "../api"
import { Song } from "./types"
import { IPaginationResponse } from "../pagination"


export async function GetSongs(ctx: QueryFunctionContext) {
    const [, page] = ctx.queryKey

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