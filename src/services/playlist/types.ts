import { PlaylistSong } from '../playlist-songs/types'

export interface Playlist {
  id: string
  name?: string
  description?: string
  img_url?: string
  playlist_songs?: PlaylistSong[]
  created_at?: Date
  updated_at?: Date
}
