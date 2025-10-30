import React, { useState } from 'react'
import { Upload as UploadIcon, Music, Mic, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    type: 'music',
    description: ''
  })
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { user } = useAuth()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type.startsWith('audio/') || droppedFile.type.startsWith('video/'))) {
      setFile(droppedFile)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    
    const uploadData = new FormData()
    uploadData.append('file', file)
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key])
    })

    try {
      await api.post('/tracks/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setFile(null)
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        type: 'music',
        description: ''
      })
      alert('Upload successful!')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

 

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Content</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                {formData.type === 'music' ? <Music size={24} /> : <Mic size={24} />}
                <span className="font-medium">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <UploadIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Drop your audio file here</p>
              <p className="text-gray-400 mb-4">or</p>
              <label className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg cursor-pointer inline-block">
                Choose File
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Artist *</label>
            <input
              type="text"
              required
              value={formData.artist}
              onChange={(e) => setFormData({...formData, artist: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Album</label>
            <input
              type="text"
              value={formData.album}
              onChange={(e) => setFormData({...formData, album: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="music">Music</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Content'}
        </button>
      </form>
    </div>
  )
}

export default Upload