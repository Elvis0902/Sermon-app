import React, { useState, useEffect } from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import api from '../api'

const Home = () => {
  const [featuredTracks, setFeaturedTracks] = useState([])
  const [recentTracks, setRecentTracks] = useState([])
  const [driveTracks, setDriveTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const { playTrack } = usePlayer()

  // ✅ Your Drive folder and API key
  const FOLDER_ID = '17JwaFj35w_5OFRNrNjwSFDluoPLfl-AW'
  const API_KEY = 'AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M' // ← replace with your actual API key

  // Fetch app tracks (featured + recent)
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await api.get('/tracks/featured')
        setFeaturedTracks(response.data)
        
        const recentResponse = await api.get('/tracks/recent')
        setRecentTracks(recentResponse.data)
      } catch (error) {
        console.error('Error fetching tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  // Fetch Google Drive audios
  useEffect(() => {
    const fetchDriveAudios = async () => {
      try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'audio/'&key=${API_KEY}&fields=files(id,name,mimeType)`
        const res = await fetch(url)
        const data = await res.json()
        if (data.files) {
          setDriveTracks(data.files)
        }
      } catch (err) {
        console.error('Error fetching Drive audios:', err)
      }
    }
    fetchDriveAudios()
  }, [])

  const TrackCard = ({ track }) => (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group">
      <div className="relative mb-4">
        <img
          src={track.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
          alt={track.title || track.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={() => playTrack(track)}
          className="absolute bottom-2 right-2 p-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
        >
          <Play size={20} fill="white" />
        </button>
      </div>
      <h3 className="font-semibold mb-1">{track.title || track.name}</h3>
      <p className="text-gray-400 text-sm">{track.artist || 'Unknown Artist'}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="gradient-bg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to MusicStream</h1>
          <p className="text-xl opacity-90">Discover, upload, and stream your favorite music and podcasts</p>
        </div>
      </div>

      {/* Featured Tracks */}

     

      {/* Google Drive Audios */}
      {driveTracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sermons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {driveTracks.map((file) => {
              const driveTrack = {
                id: file.id,
                title: file.name,
                artist: 'sermon',
                url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`,
                cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'
              }
              return <TrackCard key={file.id} track={driveTrack} />
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
