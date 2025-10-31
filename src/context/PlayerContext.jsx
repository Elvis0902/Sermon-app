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
  const [trackList, setTrackList] = useState([]) // holds album or playlist tracks
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const audioRef = useRef(null)

  // Initialize <audio> element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

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
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // ▶️ Play selected track
  const playTrack = (track, list = []) => {
    if (list.length) setTrackList(list)

    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.play()
      setCurrentTrack(track)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  // ▶️ Resume playback
  const play = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // ⏸ Pause playback
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // ⏹ Stop playback
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setProgress(0)
    }
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
