import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-orange-50/90 backdrop-blur supports-[backdrop-filter]:bg-orange-50/70 border-b border-orange-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">T</span>
          <span className="text-lg font-extrabold text-stone-900">Tutorly</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>About</NavLink>
          <NavLink to="/discussion" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Discussion</NavLink>
          <NavLink to="/chat" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Chat</NavLink>
          <NavLink to="/video" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Video</NavLink>
          <NavLink to="/student/profile" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Student</NavLink>
          <NavLink to="/teacher/profile" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-orange-700' : 'text-stone-700 hover:text-orange-700'}`}>Teacher</NavLink>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/login" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-100">Log in</NavLink>
          <NavLink to="/register" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700">Sign up</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
