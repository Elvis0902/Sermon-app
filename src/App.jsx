import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Library from './pages/Library'
import Upload from './pages/Upload'
import Player from './components/Player'
import Login from './pages/Login'
import GoogleDriveAudioList from "./pages/GoogleDriveAudioList";
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 overflow-y-auto pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/drive" element={<GoogleDriveAudioList />} />
                </Routes>
              </main>
              <Player />
            </div>
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  )
}

export default App