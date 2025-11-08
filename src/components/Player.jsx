import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    progress,
    setProgress
  } = usePlayer()

  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error('Error playing audio:', err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Handle track change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error('Error playing audio:', err))
      }
    }
  }, [currentTrack])

  const handleProgressChange = (e) => {
    const newProgress = e.target.value
    setProgress(newProgress)
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration
    }
  }

  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime
    const total = e.target.duration
    setCurrentTime(current)
    if (total) setProgress((current / total) * 100)
  }

  const handleLoadedMetadata = (e) => setDuration(e.target.duration)

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-gray-900 border-t border-gray-800
        p-3 sm:p-4
        flex flex-col sm:flex-row
        items-center justify-between
        gap-3 sm:gap-6
        z-50
      "
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          pause()
          setProgress(0)
        }}
      />

      {/* Track Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <img
          src={
            currentTrack.cover ||
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
          }
          alt={currentTrack.title}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
        />
        <div className="truncate">
          <h4 className="font-medium text-sm sm:text-base truncate">
            {currentTrack.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 w-full sm:w-auto">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <SkipBack size={18} />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className="p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full max-w-xs sm:max-w-md">
          <span className="text-[10px] sm:text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[10px] sm:text-xs text-gray-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Player
