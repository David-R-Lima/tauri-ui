import { QueryFunctionContext } from '@tanstack/react-query'
import { api } from '../api'
import { CreatePlaylistType, Playlist } from './types'

export async function GetPlaylists(ctx: QueryFunctionContext) {
  const [, page] = ctx.queryKey

  const { data } = await api.get<Playlist[]>('/playlist', {
    params: {
      page,
    },
  })

  return data
}

export async function GetPlaylist(ctx: QueryFunctionContext) {
  const [, id] = ctx.queryKey

  const { data } = await api.get<Playlist>('/playlist/' + id)

  return data
}



export async function CreatePlaylist(formData: CreatePlaylistType) {
  await api.post('/playlist', {
    ...formData
  })
}