import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const Player = () => {
  const { currentTrack, isPlaying, play, pause, progress, setProgress, volume, setVolume } = usePlayer()
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Handle play/pause state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => console.error('Error playing audio:', error))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle track change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((error) => console.error('Error playing audio:', error))
      }
    }
  }, [currentTrack])

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const handleProgressChange = (e) => {
    const newProgress = e.target.value
    setProgress(newProgress)
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration
    }
  }

  const handleVolumeChange = (e) => setVolume(e.target.value)

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
    <div className="audio-player fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between z-50">
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

      {/* Track info */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto mb-2 sm:mb-0">
        <img
          src={currentTrack.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'}
          alt={currentTrack.title}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
        />
        <div className="truncate">
          <h4 className="font-medium text-sm sm:text-base truncate">{currentTrack.title}</h4>
          <p className="text-xs sm:text-sm text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 w-full sm:w-auto">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <SkipBack size={18} className="sm:size-20" />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className="p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            {isPlaying ? <Pause size={20} className="sm:size-24" /> : <Play size={20} className="sm:size-24" />}
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-full">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center space-x-2 w-full max-w-xs sm:max-w-md">
          <span className="text-[10px] sm:text-xs text-gray-400">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-[10px] sm:text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume + Like */}
     

      {/* Compact volume control for mobile */}
      
    </div>
  )
}

export default Player
