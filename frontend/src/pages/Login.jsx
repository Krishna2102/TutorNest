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
    <main className="min-h-screen bg-orange-50 text-stone-800 flex items-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-8 shadow">
          <h1 className="text-2xl font-bold text-stone-900">Welcome back</h1>
          <p className="mt-1 text-stone-600">Log in to continue learning</p>

          {/* Role Switcher */}
          <div className="mt-6 grid grid-cols-2 gap-2 bg-orange-50 p-1 rounded-lg ring-1 ring-orange-200">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`rounded-md py-2 font-medium ${role === 'student' ? 'bg-white text-orange-700 ring-1 ring-orange-300' : 'text-stone-700 hover:text-orange-700'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`rounded-md py-2 font-medium ${role === 'teacher' ? 'bg-white text-orange-700 ring-1 ring-orange-300' : 'text-stone-700 hover:text-orange-700'}`}
            >
              Teacher
            </button>
          </div>

          {error && <div className="mt-4 rounded-lg bg-orange-100 text-orange-800 px-3 py-2 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button disabled={loading} type="submit" className="w-full rounded-lg bg-orange-600 py-2.5 text-white font-semibold hover:bg-orange-700 disabled:opacity-60">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
            <a className="hover:text-orange-700" href="#">Forgot password?</a>
            <span>
              Create new account? <Link to="/register" className="text-orange-700 font-semibold hover:underline">Register</Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
