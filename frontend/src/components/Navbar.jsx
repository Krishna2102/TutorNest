import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { apiRequest } from '../lib/api'
import logo from '../assets/logo1.png'


const Navbar = () => {
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      setIsMobileMenuOpen(false)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-orange-50/90 backdrop-blur supports-[backdrop-filter]:bg-orange-50/70 border-b border-orange-200">
      <nav className="relative flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 w-[200px] h-[80px]" onClick={closeMobileMenu}>
          <img src={logo} alt="Logo" className="h-[50px] w-[200px]" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Home</NavLink>
          <NavLink to="/teachers" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Teachers</NavLink>
          <NavLink to="/courses" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Courses</NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>About Us</NavLink>
          <NavLink to="/discussion" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Discussion</NavLink>
          <NavLink to="/chat" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Chat</NavLink>
          <NavLink to="/video" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Video</NavLink>
        </div>

        {/* Desktop Auth Buttons */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-stone-700 hover:text-orange-700 hover:bg-orange-100"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {/* Mobile Navigation Links */}
            <NavLink 
              to="/" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/teachers" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Teachers
            </NavLink>
            <NavLink 
              to="/courses" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Courses
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              About Us
            </NavLink>
            <NavLink 
              to="/discussion" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Discussion
            </NavLink>
            <NavLink 
              to="/chat" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Chat
            </NavLink>
            <NavLink 
              to="/video" 
              className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-orange-700 bg-orange-50' : 'text-stone-700 hover:text-orange-700 hover:bg-orange-50'}`}
              onClick={closeMobileMenu}
            >
              Video
            </NavLink>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-orange-200">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <NavLink 
                    to="/login" 
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-50"
                    onClick={closeMobileMenu}
                  >
                    Log in
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
                    onClick={closeMobileMenu}
                  >
                    Sign up
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      navigate(profilePath)
                      closeMobileMenu()
                    }} 
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-50"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar
