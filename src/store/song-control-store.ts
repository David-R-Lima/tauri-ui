import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { GetNextSongs } from '@/services/songs'
import { Random } from '@/services/enums/random'
import { Source } from '@/services/enums/source'

interface ControlsState {
  currentSong: Song | undefined
  playlist: Song[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  repeat: boolean
  shuffle: boolean
  volume: number
  source: Source
  sourceId: string | undefined
  setSource: (source: Source) => void
  setSourceId: (sourceeId: string) => void
  setCurrentSong: (song: Song, initial?: boolean) => void
  clearCurrentSong: () => void
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
  currentIndex: 0,
  playlist: [],
  nextSongs: [],
  previousSongs: [],
  isPlaying: false,
  currentTime: 0,
  volume: 0.2,
  repeat: false,
  shuffle: false,
  source: Source.ALL,
  sourceId: undefined,

  setCurrentSong: async (song, initial) => {
    const { currentSong, playlist, shuffle, source, sourceId, currentIndex } = get();

    if(initial) {
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id
      });

      set({
        currentSong: song,
        playlist: [song, ...fetchedSongs],
        currentIndex: 0,
      });

      return 
    }
  
    if (currentSong?.id === song.id) return;
  
    // Find index of song in current playlist
    let songIndex = playlist.findIndex(s => s.id === song.id);

    if(songIndex !== currentIndex) {
      songIndex = playlist.splice(songIndex).findIndex(s => s.id === song.id);
    }

    let newPlaylist = playlist;
  
    // If song not found, fetch new songs starting from song.id
    if (songIndex === -1 || newPlaylist.length === songIndex + 1) {
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id
      });
    
      // Append fetched songs if song was found at the end, or replace if not found
      newPlaylist = songIndex === -1 
        ? fetchedSongs 
        : [...newPlaylist.slice(0, songIndex + 1), ...fetchedSongs];
    
      songIndex = newPlaylist.findIndex(s => s.id === song.id);
    }
  
    set({
      currentSong: song,
      playlist: newPlaylist,
      currentIndex: songIndex,
    });
  },

  clearCurrentSong: () => set({ currentSong: undefined }),

  setSource: (source) => set({ source }),
  setSourceId: (sourceId) => set({ sourceId }),

  play: async () => {
    // const { shuffle, source, sourceId, currentSong } = get()

    // if (nextSongs && nextSongs.length === 0) {
    //   const next = await GetNextSongs({
    //     random: shuffle ? Random.TRUE : undefined,
    //     source: source,
    //     sourceId: sourceId,
    //     startId: currentSong?.id,
    //   })

    //   setNextSongs(next)
    // }

    set({
      isPlaying: true,
    })
  },
  pause: () => set({ isPlaying: false }),

  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (value: number) => set({ volume: value }),

  setRepeat: () => set((state) => ({ repeat: !state.repeat })),
  setShuffle: async () => {
    const { shuffle, source, sourceId, playlist, currentIndex } = get();
  
    const newShuffleState = !shuffle;
  
    const fetchedSongs = await GetNextSongs({
      random: newShuffleState ? Random.TRUE : undefined,
      source,
      sourceId,
    });
  
    const preserved = playlist.slice(0, currentIndex + 1);
  
    set({
      shuffle: newShuffleState,
      playlist: [...preserved, ...fetchedSongs],
    });
  },
  nextSong: async () => {
    const { playlist, currentIndex, source, sourceId, shuffle } = get();
  
    const newIndex = currentIndex + 1;
  
    if (newIndex >= playlist.length -1) {
      const tempStart = playlist[newIndex] ?? undefined
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : undefined,
        startId: tempStart ? tempStart.id : undefined,
      });

      if (fetchedSongs.length > 0) {
        const newPlaylist = [...playlist, ...fetchedSongs];
  
        set({
          playlist: newPlaylist,
          currentIndex: newIndex,
          currentSong: newPlaylist[newIndex],
        });
  
        get().play();
        return; // exit early because we already set the currentSong
      }
    }

    // Normal behavior: move forward in playlist
    if (newIndex < playlist.length) {
      set({
        currentIndex: newIndex,
        currentSong: playlist[newIndex],
      });
      get().play();
    }
  },
  previousSong: () => {
    const { currentIndex, playlist } = get();
  
    if (currentIndex <= 0) return; // no previous
  
    set({
      currentIndex: currentIndex - 1,
      currentSong: playlist[currentIndex - 1]
    });
  
    get().play();
  },
  handleEndSong: () => {
    get().nextSong()
  },
}))

export default UseControls
