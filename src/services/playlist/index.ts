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

interface GetPlaylistParams {
  id?: string,
  page?: number
}

export async function GetPlaylist({ id, page }: GetPlaylistParams) {

  const { data } = await api.get<{
    playlist: Playlist,
    playlist_songs: {
      data: PlaylistSong[],
      meta: IPaginationResponse
    }
  }>('/playlist/' + id, {
    params: {
      page,
    },
  })

  return data
}



export async function CreatePlaylist(formData: CreatePlaylistType) {
  await api.post('/playlist', {
    ...formData
  })
}
interface AddSongToPlaylistProps {
  songId: string
  playlistId: string
}

export async function AddSongToPlaylist({ songId, playlistId }: AddSongToPlaylistProps) {
  const data = await api.post(`/playlist/add`, {
    songId: songId,
    playlistId: playlistId,
  })

  return data
}


export async function RemoveSongFromPlaylist({ songId, playlistId }: AddSongToPlaylistProps) {
  const data = await api.delete(`/playlist/remove`, {
    data: {
      songId: songId,
      playlistId: playlistId,
    }
  })

  return data
}