import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, ArrowLeft } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const AlbumPage = () => {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { playTrack } = usePlayer()
  const [albumName, setAlbumName] = useState('')
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [cover, setCover] = useState('')

  const API_KEY = 'AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M'

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        // Fetch album name
        const albumRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${albumId}?fields=name&key=${API_KEY}`
        )
        const albumData = await albumRes.json()
        setAlbumName(albumData.name)

        // Try to fetch an image as album cover
        const coverRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${albumId}'+in+parents+and+mimeType contains 'image/'&key=${API_KEY}&fields=files(id,name)`
        )
        const coverData = await coverRes.json()
        const coverUrl = coverData.files?.[0]
          ? `https://www.googleapis.com/drive/v3/files/${coverData.files[0].id}?alt=media&key=${API_KEY}`
          : 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
        setCover(coverUrl)

        // Fetch audio files
        const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${albumId}'+in+parents+and+(mimeType contains 'audio/' or mimeType='application/octet-stream')&key=${API_KEY}&fields=files(id,name,mimeType)`
        const res = await fetch(filesUrl)
        const data = await res.json()

        const trackList = (data.files || []).map((file) => ({
          id: file.id,
          title: file.name,
          artist: albumData.name,
          url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`,
          cover: coverUrl,
        }))

        setTracks(trackList)
      } catch (err) {
        console.error('Error fetching album:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbumData()
  }, [albumId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center mb-6 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      {/* Album Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <img
          src={cover}
          alt={albumName}
          className="w-40 h-40 md:w-56 md:h-56 rounded-lg object-cover shadow-lg"
        />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{albumName}</h1>
          <p className="text-gray-400">{tracks.length} track(s)</p>
          {tracks.length > 0 && (
            <button
              onClick={() => playTrack(tracks[0])}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium transition"
            >
              ▶ Play All
            </button>
          )}
        </div>
      </div>

      {/* Track List */}
      {tracks.length > 0 ? (
        <div className="divide-y divide-gray-700">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center justify-between py-4 hover:bg-gray-800 rounded-lg px-3 md:px-6 transition"
            >
              <div className="flex items-center space-x-4 w-full min-w-0">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                />
                <div className="truncate">
                  <h3 className="font-semibold truncate">{track.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
              </div>

              <button
                onClick={() => playTrack(track)}
                className="ml-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-full flex-shrink-0"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No tracks found in this album.</p>
      )}
    </div>
  )
}

export default AlbumPage
