import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { GetNextSongs } from '@/services/songs'
import { Random } from '@/services/enums/random'
import { Source } from '@/services/enums/source'
import { Shuffle } from 'lucide-react'

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
  setCurrentSong: (song: Song, fromNextSongsSidebar?: boolean) => void
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

  setCurrentSong: async (song, fromNextSongsSidebar) => {
    const {
      currentSong,
      previousSongs,
      nextSongs,
      setPreviousSongs,
      setNextSongs,
      shuffle,
      source,
      sourceId
    } = get();
  
    if (currentSong?.id === song.id) return;

    let tempNext = nextSongs 
    let tempPrev = previousSongs

    if(!fromNextSongsSidebar) {
      const fetchedSongs = await GetNextSongs({
        source: source,
        sourceId: sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id
      })
  
      tempNext = fetchedSongs
    }

    let where: "prev" | "next" | undefined = undefined
  
    const prevIndex = tempPrev.findIndex(s => s.id === song.id);
    const nextIndex = tempNext.findIndex(s => s.id === song.id);
  
    if (prevIndex !== -1) where = "prev";
    if (nextIndex !== -1) where = "next";

    switch (where) {
      case "prev": {
        console.log(tempNext)
        if (currentSong) {
          tempNext = [currentSong, ...tempNext]
        }
        tempPrev = tempPrev.slice(0, prevIndex)
        break;
      }
      case "next": {
        if (currentSong) {
          tempPrev = [...tempPrev, currentSong]
        }
        tempNext = tempNext.slice(nextIndex + 1)
        break;
      }
      case undefined: {
        if (currentSong) {
          tempPrev = [...tempPrev, currentSong];
        }
        break;
      }
    }

    if(fromNextSongsSidebar && tempNext.length === 0) {
      const fetchedSongs = await GetNextSongs({
        source: source,
        sourceId: sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id
      })
  
      tempNext = fetchedSongs
    }

    set({ currentSong: song });
    setPreviousSongs(tempPrev)
    setNextSongs(tempNext)
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
      play,
      source,
      sourceId,
      setNextSongs,
    } = get()

    let updatedNextSongs = nextSongs

    // console.log(updatedNextSongs)

    if (nextSongs && nextSongs.length === 0) {
      updatedNextSongs = await GetNextSongs({
        random: shuffle ? Random.TRUE : undefined,
        source: source,
        sourceId: sourceId,
        startId: currentSong?.id,
      })

      setNextSongs(updatedNextSongs.slice(1))

      if(updatedNextSongs.length  > 0) {
        set({currentSong: updatedNextSongs[0]})
      }

      return;
    }

    const next = updatedNextSongs[0]

    if (!next) return

    if (currentSong) {
      setPreviousSongs([...previousSongs, currentSong])
    }

    set({
      currentSong: next,
      nextSongs: updatedNextSongs.slice(1),
    });
    play()
  },
  previousSong: () => {
    const {
      previousSongs,
      currentSong,
      nextSongs,
      setPreviousSongs,
      setNextSongs,
      play,
    } = get()

    if (previousSongs.length === 0) return

    const last = previousSongs[previousSongs.length - 1];
    // setPreviousSongs(previousSongs.slice(previousSongs.length - 1, previousSongs.length))
    setPreviousSongs(previousSongs.slice(0, -1));

    if (currentSong) {
      setNextSongs([currentSong, ...nextSongs])
    }

    set({currentSong: last})
    play()
  },
  handleEndSong: () => {
    get().nextSong()
  },
}))

export default UseControls
