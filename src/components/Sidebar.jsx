import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Upload, Library } from 'lucide-react'

const BottomNav = () => {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    //{ icon: Upload, label: 'Upload', path: '/upload' },
    //{ icon: Library, label: 'Library', path: '/library' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center text-sm transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
