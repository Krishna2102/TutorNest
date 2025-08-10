import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { apiRequest } from '../lib/api'
import logo from '../assets/logo1.png'


const Navbar = () => {
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const profilePath = role === 'teacher' ? '/teacher/profile' : '/student/profile'

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-orange-50/90 backdrop-blur supports-[backdrop-filter]:bg-orange-50/70 border-b border-orange-200">
      <nav className="relative flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
      <Link to="/" className="flex items-center gap-2 w-[200px] h-[80px]">
              <img src={logo} alt="Logo" className="h-[50px] w-[200px]" />
                </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Home</NavLink>
          <NavLink to="/teachers" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Teachers</NavLink>
          <NavLink to="/courses" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Courses</NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>About Us</NavLink>
          <NavLink to="/discussion" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Discussion</NavLink>
          <NavLink to="/chat" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Chat</NavLink>
          <NavLink to="/video" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Video</NavLink>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-100">Log in</NavLink>
              <NavLink to="/register" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700">Sign up</NavLink>
            </>
          ) : (
            <>
              <button onClick={() => navigate(profilePath)} className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-100">Profile</button>
              <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
export default Navbar
