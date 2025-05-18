import { QueryFunctionContext } from '@tanstack/react-query'
import { api } from '../api'
import { Playlist } from './types'

export async function GetPlaylist(ctx: QueryFunctionContext) {
  const [, page] = ctx.queryKey

  const { data } = await api.get<Playlist[]>('/playlist', {
    params: {
      page,
    },
  })

  return data
}
