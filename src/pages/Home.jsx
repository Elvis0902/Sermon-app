import React, { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const Home = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const { playTrack } = usePlayer()

  const MAIN_FOLDER_ID = '17JwaFj35w_5OFRNrNjwSFDluoPLfl-AW' // The parent folder that holds all album folders
  const API_KEY = 'AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M'

  {/* Hero Section */}
   <div className="mb-8"> 
   <div className="gradient-bg rounded-2xl p-8 mb-8"> 
    <h1 className="text-4xl font-bold mb-4">Welcome to MusicStream</h1>
     <p className="text-xl opacity-90">Discover, upload, and stream your favorite music and podcasts</p>
      </div> 
      </div>

  // Fetch all albums (folders)
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Step 1: Get all subfolders (albums)
        const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${MAIN_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name)`
        const res = await fetch(foldersUrl)
        const data = await res.json()
        const albumFolders = data.files || []

        // Step 2: For each folder, fetch its audio files
        const albumPromises = albumFolders.map(async (folder) => {
          const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'audio/'&key=${API_KEY}&fields=files(id,name,mimeType)`
          const filesRes = await fetch(filesUrl)
          const filesData = await filesRes.json()
          const tracks = (filesData.files || []).map((file) => ({
            id: file.id,
            title: file.name,
            artist: folder.name,
            url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`,
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
          }))

          return {
            id: folder.id,
            name: folder.name,
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
          <h2 className="text-2xl font-bold mb-4">{album.name}</h2>
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
