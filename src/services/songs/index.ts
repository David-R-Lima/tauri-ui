import { api } from '../api'
import { Song } from './types'
import { IPaginationResponse } from '../pagination'
import { OrderBy } from '../enums/order-by'
import { Liked } from '../enums/liked'
import { Random } from '../enums/random'
import { Source } from '../enums/source'

interface getSongsProps {
  page: number
  limit?: number
  order_by?: OrderBy
  liked?: Liked
  text?: string
  duration_gte?: number
  duration_lte?: number
}

export async function GetSongs({
  page,
  duration_gte,
  duration_lte,
  order_by,
  liked,
  limit,
  text,
}: getSongsProps) {
  const { data } = await api.get<{
    songs: Song[]
    meta: IPaginationResponse
  }>('/song', {
    params: {
      page,
      limit,
      order_by,
      liked,
      text,
      duration_gte,
      duration_lte,
    },
  })

  return data
}

export async function AddSong(url: string) {
  await api.post('/song/download', {
    url,
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

interface updateSongProps {
  song_id: string
  liked?: Liked
  duration?: number
  artist?: string
  title?: string
}

export async function UpdateSong(props: updateSongProps) {
  await api.put('/song', {
    song_id: props.song_id,
    liked: props.liked,
    duration: props.duration,
    artist: props.artist,
    title: props.title,
  })
}

interface GetNextSongsProps {
  random?: Random
  source?: Source
  sourceId?: string
  startId?: string
}

export async function GetNextSongs(props: GetNextSongsProps) {
  const { data } = await api.get<Song[]>('/song/next', {
    params: {
      random: props.random,
      source: props.source,
      source_id: props.sourceId,
      start_id: props.startId,
    },
  })

  return data
}

// export async function GetNextSongs(ctx: QueryFunctionContext) {
//   const [, random, source, sourceId, startId] = ctx.queryKey
//   const { data } = await api.get<Song[]>('/song/next', {
//     params: {
//       random: random,
//       source: source,
//       source_id: sourceId,
//       start_id: startId,
//     },
//   })

//   return data
// }
