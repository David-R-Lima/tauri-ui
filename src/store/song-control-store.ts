import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { GetNextSongs } from '@/services/songs'
import { Random } from '@/services/enums/random'
import { Source } from '@/services/enums/source'

interface ControlsState {
  currentSong: Song | undefined
  nextSongs: Song[]
  previousSongs: Song[]
  isPlaying: boolean
  currentTime: number
  repeat: boolean
  shuffle: boolean
  volume: number
  source: Source
  sourceId: string | undefined
  setSource: (source: Source) => void
  setSourceId: (sourceeId: string) => void
  setCurrentSong: (song: Song | undefined) => void
  clearCurrentSong: () => void
  setNextSongs: (songs: Song[]) => void
  setPreviousSongs: (songs: Song[]) => void
  play: () => void
  pause: () => void
  setCurrentTime: (time: number) => void
  setVolume: (value: number) => void
  setRepeat: () => void
  setShuffle: () => void
  nextSong: () => void
  previousSong: () => void
  handleEndSong: () => void
}

const UseControls = create<ControlsState>((set, get) => ({
  currentSong: undefined,
  nextSongs: [],
  previousSongs: [],
  isPlaying: false,
  currentTime: 0,
  volume: 0.2,
  repeat: false,
  shuffle: false,
  source: Source.ALL,
  sourceId: undefined,

  setCurrentSong: async (song) => {
    set({ currentSong: song })

    const { setNextSongs, shuffle, source, sourceId, currentSong } = get()

    const next = await GetNextSongs({
      random: shuffle ? Random.TRUE : undefined,
      source: source,
      sourceId: sourceId,
      startId: currentSong?.id,
    })

    setNextSongs(next)
  },
  clearCurrentSong: () => set({ currentSong: undefined }),
  setNextSongs: (songs) => set({ nextSongs: songs }),
  setPreviousSongs: (songs) => set({ previousSongs: songs }),

  setSource: (source) => set({ source }),
  setSourceId: (sourceId) => set({ sourceId }),

  play: async () => {
    const { nextSongs, setNextSongs, shuffle, source, sourceId, currentSong } = get()

    if (nextSongs && nextSongs.length === 0) {
      const next = await GetNextSongs({
        random: shuffle ? Random.TRUE : undefined,
        source: source,
        sourceId: sourceId,
        startId: currentSong?.id,
      })

      setNextSongs(next)
    }

    set({
      isPlaying: true,
    })
  },
  pause: () => set({ isPlaying: false }),

  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (value: number) => set({ volume: value }),

  setRepeat: () => set((state) => ({ repeat: !state.repeat })),
  setShuffle: async () => {
    const { shuffle, source, sourceId, currentSong, setNextSongs } = get()
    if (shuffle) {
      const res = await GetNextSongs({
        random: undefined,
        source: source,
        sourceId: sourceId,
        startId: currentSong?.id,
      })

      setNextSongs(res)
      set({ shuffle: false })
    } else {
      const res = await GetNextSongs({
        random: Random.TRUE,
        source: source,
        sourceId: sourceId,
        startId: currentSong?.id,
      })

      setNextSongs(res)
      set({ shuffle: true })
    }
  },
  nextSong: async () => {
    const {
      currentSong,
      nextSongs,
      previousSongs,
      setPreviousSongs,
      shuffle,
      setCurrentSong,
      play,
      source,
      sourceId,
      setNextSongs,
    } = get()

    let updatedNextSongs = nextSongs

    if (nextSongs && nextSongs.length <= 1) {
      updatedNextSongs = await GetNextSongs({
        random: shuffle ? Random.TRUE : undefined,
        source: source,
        sourceId: sourceId,
        startId: currentSong?.id,
      })

      setNextSongs(updatedNextSongs)
    }

    const next = updatedNextSongs[0]

    if (!next) return

    if (currentSong) {
      setPreviousSongs([...previousSongs, currentSong])
    }

    setCurrentSong(next)
    setNextSongs(updatedNextSongs.slice(1))
    play()
  },
  previousSong: () => {
    const {
      previousSongs,
      currentSong,
      nextSongs,
      setCurrentSong,
      setPreviousSongs,
      setNextSongs,
      play,
      currentTime,
    } = get()

    if (currentTime >= 10) {
      set({ currentTime: 0 })

      return
    }

    if (previousSongs.length === 0) return

    const last = previousSongs[previousSongs.length - 1]
    setPreviousSongs(previousSongs.slice(0, -1))

    if (currentSong) {
      setNextSongs([currentSong, ...nextSongs])
    }

    setCurrentSong(last)
    play()
  },
  handleEndSong: () => {
    get().nextSong()
  },
}))

export default UseControls
