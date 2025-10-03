import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { dispatchAuthChanged } from '../lib/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 'student' | 'teacher'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password, role },
      })
      // Save token and user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatchAuthChanged()

      // Navigate to role-based profile
      if (role === 'student') navigate('/student/profile')
      else navigate('/teacher/profile')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 text-stone-800 flex items-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-900 to-orange-700 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="mt-2 text-stone-600">✨ Log in to continue your learning journey</p>
          </div>

          {/* Role Switcher */}
          <div className="mb-6 grid grid-cols-2 gap-3 bg-stone-50 p-2 rounded-2xl ring-1 ring-orange-200">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`rounded-xl py-3 font-semibold transition-all duration-200 ${role === 'student' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'text-stone-700 hover:text-orange-700 hover:bg-white'}`}
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`rounded-xl py-3 font-semibold transition-all duration-200 ${role === 'teacher' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'text-stone-700 hover:text-orange-700 hover:bg-white'}`}
            >
              👨‍🏫 Teacher
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">📧 Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
                className="w-full rounded-2xl border border-orange-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200" 
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">🔒 Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
                className="w-full rounded-2xl border border-orange-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200" 
                placeholder="Enter your password"
              />
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-4 text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Logging in...' : '🚀 Log in'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <a className="text-sm text-stone-600 hover:text-orange-700 transition-colors" href="#">
              🔑 Forgot password?
            </a>
            <div className="text-sm text-stone-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-orange-700 font-bold hover:text-orange-800 transition-colors"
              >
                Create Account ✨
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
