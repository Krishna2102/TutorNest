import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-orange-200 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-stone-600">© {new Date().getFullYear()} Tutorly. All rights reserved.</p>
        <div className="flex items-center gap-4 text-stone-600">
          <a className="hover:text-orange-700" href="#">Privacy</a>
          <a className="hover:text-orange-700" href="#">Terms</a>
          <a className="hover:text-orange-700" href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
