import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-700 rounded-lg md:hidden"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
            MusicStream
          </Link>
        </div>
        

       
      </div>
    </header>
  )
}

export default Header