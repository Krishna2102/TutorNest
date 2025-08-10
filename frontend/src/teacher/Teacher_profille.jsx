import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { dispatchAuthChanged } from '../lib/auth'

const TeacherProfile = () => {
  const [user, setUser] = useState(null)
  const [headline, setHeadline] = useState('Certified Math Tutor with 5+ years of experience')
  const [bio, setBio] = useState('I help students build strong fundamentals and exam confidence.')
  const [subjects, setSubjects] = useState(['Mathematics', 'Physics'])
  const [hourlyRate, setHourlyRate] = useState(20)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  // Mock data for teaching history and schedule
  const [teachingHistory] = useState([
    { id: 1, student: 'Aisha', subject: 'Mathematics', date: '2024-01-15', duration: '60 min', status: 'completed' },
    { id: 2, student: 'Daniel', subject: 'Physics', date: '2024-01-12', duration: '90 min', status: 'completed' },
    { id: 3, student: 'Rina', subject: 'Mathematics', date: '2024-01-10', duration: '45 min', status: 'completed' },
  ])

  const [upcomingSessions] = useState([
    { id: 1, student: 'Aisha', subject: 'Mathematics', date: '2024-01-20', time: '15:00', duration: '60 min' },
    { id: 2, student: 'Daniel', subject: 'Physics', date: '2024-01-22', time: '16:30', duration: '90 min' },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

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

  if (!user) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Teacher Profile</h1>
            <p className="mt-1 text-stone-600">Showcase your expertise and manage your availability</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 disabled:opacity-60">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </section>

        {/* Profile Header */}
        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-700">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-stone-900">{user.fullName || 'Teacher Name'}</h2>
              <p className="text-stone-600">{user.email}</p>
              {user.phone && <p className="text-sm text-stone-500">{user.phone}</p>}
              {user.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(user.rating) ? 'text-orange-500' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-stone-600">
                    {user.rating.toFixed(1)} ({user.totalReviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Bio and Profile Details */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-900">Profile Details</h3>
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
              <div>
                <label className="block text-sm font-medium text-stone-700">Hourly Rate (USD)</label>
                <input type="number" value={hourlyRate} onChange={(e)=>setHourlyRate(Number(e.target.value))} min={0} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="pt-2">
                <button className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">Save changes</button>
              </div>
            </section>
          </div>

          {/* Right Column - Schedule and History */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Upcoming Sessions</h3>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-orange-50 ring-1 ring-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900">{session.subject}</h4>
                        <p className="text-sm text-stone-600">with {session.student}</p>
                        <p className="text-xs text-stone-500">{session.date} at {session.time} ({session.duration})</p>
                      </div>
                      <button className="rounded-lg bg-orange-600 px-3 py-1 text-white text-sm font-medium hover:bg-orange-700">
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-600 text-center py-4">No upcoming sessions scheduled</p>
              )}
            </section>

            {/* Teaching History */}
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Teaching History</h3>
              {teachingHistory.length > 0 ? (
                <div className="space-y-3">
                  {teachingHistory.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-orange-50 ring-1 ring-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900">{session.subject}</h4>
                        <p className="text-sm text-stone-600">with {session.student}</p>
                        <p className="text-xs text-stone-500">{session.date} ({session.duration})</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-600 text-center py-4">No teaching history found</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TeacherProfile
