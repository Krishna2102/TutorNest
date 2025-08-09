import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { dispatchAuthChanged } from '../lib/auth'

const TeacherProfile = () => {
  const [headline, setHeadline] = useState('Certified Math Tutor with 5+ years of experience')
  const [bio, setBio] = useState('I help students build strong fundamentals and exam confidence.')
  const [subjects, setSubjects] = useState(['Mathematics', 'Physics'])
  const [hourlyRate, setHourlyRate] = useState(20)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatchAuthChanged()
      navigate('/')
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Teacher Profile</h1>
            <p className="mt-1 text-stone-600">Showcase your expertise and manage your availability</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 disabled:opacity-60">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </section>

        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Headline</label>
            <input value={headline} onChange={(e)=>setHeadline(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Professional Summary</label>
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">Subjects</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {subjects.map(s => (
                <span key={s} className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm text-stone-800 ring-1 ring-orange-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Hourly Rate (USD)</label>
              <input type="number" value={hourlyRate} onChange={(e)=>setHourlyRate(Number(e.target.value))} min={0} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="pt-6">
              <button className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">Save changes</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TeacherProfile
