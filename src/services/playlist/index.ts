import { QueryFunctionContext } from '@tanstack/react-query'
import { api } from '../api'
import { CreatePlaylistType, Playlist } from './types'
import { IPaginationResponse } from '../pagination'
import { PlaylistSong } from '../playlist-songs/types'

export async function GetPlaylists(ctx: QueryFunctionContext) {
  const [, page, limit, pinned, order_by, text] = ctx.queryKey

  const { data } = await api.get<{
    playlists: Playlist[],
    meta: IPaginationResponse
  }>('/playlist', {
    params: {
      page,
      limit,
      pinned,
      order_by,
      text,
    },
  })

  return data
}

export async function GetPlaylist(ctx: QueryFunctionContext) {
  const [, id] = ctx.queryKey

  const { data } = await api.get<{
    playlist: Playlist,
    playlist_songs: {
      data: PlaylistSong[],
      meta: IPaginationResponse
    }
  }>('/playlist/' + id)

  return data
}



export async function CreatePlaylist(formData: CreatePlaylistType) {
  await api.post('/playlist', {
    ...formData
  })
}