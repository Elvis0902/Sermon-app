import React, { createContext, useContext, useState } from 'react'

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)

  const playTrack = (track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  const play = () => {
    setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const stop = () => {
    setIsPlaying(false)
    setCurrentTrack(null)
    setProgress(0)
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
    setProgress,
    setVolume
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}