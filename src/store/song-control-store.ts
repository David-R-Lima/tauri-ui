import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { Playlist } from '@/services/playlist/types'

interface ControlsState {
  currentSong: Song | undefined
  currentPlaylist: Playlist | undefined
  randomizedPlaylist: Playlist | undefined
  isPlaying: boolean
  currentTime: number
  repeat: boolean
  shuffle: boolean
  volume: number
  setCurrentSong: (song: Song | undefined) => void
  clearCurrentSong: () => void
  play: () => void
  pause: () => void
  setCurrentTime: (time: number) => void
  setVolume: (value: number) => void
  setCurrentPlaylist: (playlist: Playlist | undefined) => void
  setRepeat: () => void
  setShuffle: () => void
  nextSong: () => void
  previousSong: () => void
  handleEndSong: () => void
  setRandomizedPlaylist: () => void
}

const UseControls = create<ControlsState>((set, get) => ({
  currentSong: undefined,
  isPlaying: false,
  currentTime: 0,
  volume: 0.2,
  currentPlaylist: undefined,
  repeat: false,
  shuffle: false,
  randomizedPlaylist: undefined,

  setCurrentSong: (song) => set({ currentSong: song }),
  clearCurrentSong: () => set({ currentSong: undefined }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (value: number) => set({ volume: value }),

  setCurrentPlaylist: (playlist: Playlist | undefined) => set({ currentPlaylist: playlist }),
  setRepeat: () => set((state) => ({ repeat: !state.repeat })),
  setShuffle: () => {
    const { shuffle, setRandomizedPlaylist } = get()
    if (shuffle) {
      set({ shuffle: false })
    } else {
      set({ shuffle: true })
      setRandomizedPlaylist()
    }
  },
  nextSong: () => {
    const {
      currentPlaylist,
      randomizedPlaylist,
      currentSong,
      shuffle,
      setCurrentSong,
      pause,
      play,
    } = get()

    const basePlaylist = shuffle ? randomizedPlaylist : currentPlaylist

    if (!basePlaylist?.playlist_songs || basePlaylist.playlist_songs.length === 0) return

    const songs = basePlaylist.playlist_songs
    const currentIndex = songs.findIndex((s) => s.song_id === currentSong?.id)

    // Fallback to first if current song not found
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % songs.length

    pause()
    set({ currentTime: 0 }) // Reset time
    setCurrentSong(songs[nextIndex].song)
    play()
  },

  previousSong: () => {
    const {
      currentPlaylist,
      randomizedPlaylist,
      currentSong,
      shuffle,
      setCurrentSong,
      pause,
      play,
    } = get()

    const basePlaylist = shuffle ? randomizedPlaylist : currentPlaylist

    if (!basePlaylist?.playlist_songs || basePlaylist.playlist_songs.length === 0) return

    const songs = basePlaylist.playlist_songs
    const currentIndex = songs.findIndex((s) => s.song_id === currentSong?.id)

    // Fallback to last if current song not found
    const previousIndex =
      currentIndex === -1 ? songs.length - 1 : (currentIndex - 1 + songs.length) % songs.length

    pause()
    set({ currentTime: 0 }) // Reset time
    setCurrentSong(songs[previousIndex].song)
    play()
  },
  handleEndSong: () => {
    get().nextSong()
  },
  setRandomizedPlaylist: () => {
    const { currentPlaylist } = get()
    if (!currentPlaylist?.playlist_songs) return

    // Shallow copy of playlist_songs
    const shuffled = [...currentPlaylist.playlist_songs]

    // Fisher-Yates Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    set({
      randomizedPlaylist: {
        ...currentPlaylist,
        playlist_songs: shuffled,
      },
    })
  },
}))

export default UseControls
