import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const PlayerContext = createContext()

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [trackList, setTrackList] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const audioRef = useRef(new Audio()) // only one <audio> instance

  const audio = audioRef.current

  // Track time updates and when a song ends
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleEnded = () => {
      nextTrack()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Sync volume
  useEffect(() => {
    audio.volume = volume / 100
  }, [volume])

  // 🎵 Play a selected track
  const playTrack = (track, list = []) => {
    try {
      if (!track?.url) return

      // Pause before switching
      audio.pause()
      audio.currentTime = 0

      if (list.length) setTrackList(list)
      setCurrentTrack(track)
      setProgress(0)

      // Set source & play
      audio.src = track.url
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play error:', err))
    } catch (error) {
      console.error('Error playing track:', error)
    }
  }

  // ▶️ Resume playback
  const play = () => {
    if (currentTrack) {
      audio.play().then(() => setIsPlaying(true))
    }
  }

  // ⏸ Pause playback
  const pause = () => {
    audio.pause()
    setIsPlaying(false)
  }

  // ⏹ Stop playback
  const stop = () => {
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setProgress(0)
  }

  // ⏭ Next track
  const nextTrack = () => {
    if (!currentTrack || trackList.length === 0) return
    const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id)
    const next = trackList[currentIndex + 1]
    if (next) {
      playTrack(next, trackList)
    } else {
      stop()
    }
  }

  // ⏮ Previous track
  const prevTrack = () => {
    if (!currentTrack || trackList.length === 0) return
    const currentIndex = trackList.findIndex((t) => t.id === currentTrack.id)
    const prev = trackList[currentIndex - 1]
    if (prev) {
      playTrack(prev, trackList)
    }
  }

  const value = {
    currentTrack,
    isPlaying,
    progress,
    volume,
    playTrack,
    play,
    pause,
    stop,
    nextTrack,
    prevTrack,
    setProgress,
    setVolume,
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}
