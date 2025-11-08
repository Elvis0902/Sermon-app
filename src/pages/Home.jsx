import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const MAIN_FOLDER_ID = '17JwaFj35w_5OFRNrNjwSFDluoPLfl-AW'
  const API_KEY = 'AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M'

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${MAIN_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name)`
        const res = await fetch(foldersUrl)
        const data = await res.json()
        const albumFolders = data.files || []

        const albumData = await Promise.all(
          albumFolders.map(async (folder) => {
            const coverUrl = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType contains 'image/'&key=${API_KEY}&fields=files(id,name)`
            const coverRes = await fetch(coverUrl)
            const coverData = await coverRes.json()
            const cover =
              coverData.files?.[0]
                ? `https://www.googleapis.com/drive/v3/files/${coverData.files[0].id}?alt=media&key=${API_KEY}`
                : 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'

            return { id: folder.id, name: folder.name, cover }
          })
        )

        setAlbums(albumData)
      } catch (err) {
        console.error('Error fetching albums:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Hero Section */}
      <section className="text-center mb-10 md:mb-14">
        <div className="gradient-bg bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 sm:p-10 text-white shadow-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Welcome to MusicStream
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">
            Discover, upload, and stream your favorite music and podcasts.
          </p>
        </div>
      </section>

      {/* Album Section */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-100">Albums</h2>

      {albums.length > 0 ? (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
            sm:gap-6
          "
        >
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/album/${album.id}`)}
              className="
                bg-gray-800 hover:bg-gray-700
                rounded-xl p-3 sm:p-4
                cursor-pointer transition-all
                shadow-md hover:shadow-xl
                transform hover:-translate-y-1
              "
            >
              <img
                src={album.cover}
                alt={album.name}
                className="
                  w-full
                  aspect-square
                  object-cover
                  rounded-lg
                  mb-3
                  shadow-sm
                "
              />
              <h3
                className="
                  font-semibold
                  text-base sm:text-lg
                  text-center text-gray-100
                  truncate
                "
              >
                {album.name}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic text-center mt-10">
          No albums found.
        </p>
      )}
    </div>
  )
}

export default Home
