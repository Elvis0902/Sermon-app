import React, { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const Home = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const { playTrack } = usePlayer()

  const MAIN_FOLDER_ID = '17JwaFj35w_5OFRNrNjwSFDluoPLfl-AW' // e.g., 17JwaFj35w_5OFRNrNjwSFDluoPLfl-AW
  const API_KEY = 'AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M'

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // 1️⃣ Fetch all album folders
        const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${MAIN_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name)`
        const res = await fetch(foldersUrl)
        const data = await res.json()
        const albumFolders = data.files || []

        // 2️⃣ For each album folder, fetch files inside
        const albumPromises = albumFolders.map(async (folder) => {
          const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`
          const filesRes = await fetch(filesUrl)
          const filesData = await filesRes.json()
          const files = filesData.files || []

          // Separate image and audio files
          const imageFile = files.find((f) => f.mimeType.startsWith('image/'))
          const audioFiles = files.filter((f) => f.mimeType.startsWith('audio/'))

          // Album cover image URL (or fallback)
          const albumCover = imageFile
            ? `https://www.googleapis.com/drive/v3/files/${imageFile.id}?alt=media&key=${API_KEY}`
            : 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'

          // Build track list
          const tracks = audioFiles.map((file) => ({
            id: file.id,
            title: file.name,
            artist: folder.name,
            url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`,
            cover: albumCover,
          }))

          return {
            id: folder.id,
            name: folder.name,
            cover: albumCover,
            tracks,
          }
        })

        const resolvedAlbums = await Promise.all(albumPromises)
        setAlbums(resolvedAlbums)
      } catch (err) {
        console.error('Error fetching albums:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  const TrackCard = ({ track }) => (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group">
      <div className="relative mb-4">
        <img
          src={track.cover}
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
      <h1 className="text-4xl font-bold mb-8">Albums</h1>

      {albums.map((album) => (
        <section key={album.id} className="mb-10">
          {/* Album Header */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={album.cover}
              alt={album.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />
            <h2 className="text-2xl font-bold">{album.name}</h2>
          </div>

          {/* Tracks */}
          {album.tracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {album.tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No tracks found in this album.</p>
          )}
        </section>
      ))}
    </div>
  )
}

export default Home
