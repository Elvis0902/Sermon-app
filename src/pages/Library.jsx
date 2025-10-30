import React, { useState, useEffect } from 'react'
import { Play, Heart, MoreHorizontal, Grid, List } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Library = () => {
  const [tracks, setTracks] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const { playTrack } = usePlayer()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchLibrary()
    }
  }, [user, filter])

  const fetchLibrary = async () => {
    try {
      const response = await api.get(`/tracks/library?filter=${filter}`)
      setTracks(response.data)
    } catch (error) {
      console.error('Error fetching library:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your library</h2>
          <p className="text-gray-400">Sign in to access your personal music collection</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="music">Music</option>
            <option value="podcast">Podcasts</option>
            <option value="liked">Liked</option>
          </select>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div key={track.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group">
              <div className="relative mb-4">
                <img
                  src={track.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                  alt={track.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => playTrack(track)}
                  className="absolute bottom-2 right-2 p-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                >
                  <Play size={20} fill="white" />
                </button>
              </div>
              <h3 className="font-semibold mb-1">{track.title}</h3>
              <p className="text-gray-400 text-sm">{track.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 group"
            >
              <img
                src={track.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{track.title}</h4>
                <p className="text-gray-400 text-sm">{track.artist}</p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-700 rounded-full">
                  <Heart size={16} />
                </button>
                <button
                  onClick={() => playTrack(track)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  <Play size={16} fill="white" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-full">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Library