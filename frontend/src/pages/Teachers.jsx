import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const navigate = useNavigate()

  const subjects = [
    'Mathematics', 'Science', 'Programming', 'English', 'Geography', 
    'Arts', 'History', 'Physics', 'Chemistry', 'Biology'
  ]

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (selectedSubject) params.append('subject', selectedSubject)
      if (minRate) params.append('minRate', minRate)
      if (maxRate) params.append('maxRate', maxRate)

  const data = await apiRequest(`/teachers?${params.toString()}`, { method: 'GET' })

      // Map MongoDB _id to id for frontend
      const formatted = data.map(t => ({
  id: t._id,
  fullName: t.fullName,
  qualification: t.qualification,
  experienceYears: t.experienceYears,
  subjectsTaught: t.subjectsTaught || [],
  hourlyRate: t.hourlyRate,
  rating: t.rating || 0,
  totalReviews: t.totalReviews || 0,
  profilePictureUrl: t.profilePictureUrl || '', // use backend avatar field
  bio: t.bio || '', // if you want to add a bio field in backend later
  location: t.location || '' // if you add location to teacher in backend
}))


      setTeachers(formatted)
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
      setError('Failed to load teachers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleChat = (teacherId) => {
    navigate(`/chat?teacher=${teacherId}`)
  }

  const handleBookSession = (teacherId) => {
    navigate(`/booking?teacher=${teacherId}`)
  }

  // Filtering is also handled on backend, but you can keep this as safety
  const filteredTeachers = teachers.filter(t => {
    if (selectedSubject && !t.subjectsTaught.includes(selectedSubject)) return false
    if (minRate && t.hourlyRate < Number(minRate)) return false
    if (maxRate && t.hourlyRate > Number(maxRate)) return false
    return true
  })

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex justify-center items-center">
          <div className="text-lg">Loading teachers...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-white to-orange-100 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-stone-900 to-orange-700 bg-clip-text text-transparent">
            Find Your Perfect Teacher
          </h1>
          <p className="mt-4 text-xl text-stone-600 max-w-2xl mx-auto">
            🎓 Connect with experienced educators who can help you excel in your studies
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg ring-1 ring-orange-200">
              <span className="text-sm font-medium text-orange-700">
                {filteredTeachers.length} expert teachers available
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10 rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            🔍 <span>Filter Teachers</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-orange-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Min Rate (USD)</label>
              <input
                type="number"
                min="0"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-orange-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Max Rate (USD)</label>
              <input
                type="number"
                min="0"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                placeholder="100"
                className="w-full rounded-xl border border-orange-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchTeachers}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-3 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔍 Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="group rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 hover:ring-orange-300">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-4 ring-orange-100">
                    {teacher.fullName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                    {teacher.fullName}
                  </h3>
                  <p className="text-sm text-stone-600 font-medium">{teacher.qualification}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-orange-50 px-2 py-1 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(teacher.rating) ? 'text-orange-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                      {teacher.rating} ({teacher.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <p className="text-sm text-stone-700 leading-relaxed">{teacher.bio || "Experienced educator passionate about helping students succeed."}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 px-3 py-2 rounded-xl">
                    <span>📍</span>
                    <span>{teacher.location || "Online"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 px-3 py-2 rounded-xl">
                    <span>📚</span>
                    <span>{teacher.experienceYears}+ years</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-lg font-bold text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 rounded-2xl border border-orange-200">
                  <span>💰</span>
                  <span>${teacher.hourlyRate}/hour</span>
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-stone-700 mb-3">📖 Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjectsTaught.map(subject => (
                    <span key={subject} className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-orange-200 px-3 py-1.5 text-xs font-medium text-orange-800 ring-1 ring-orange-300 hover:scale-105 transition-transform">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleChat(teacher.id)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-3 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => handleBookSession(teacher.id)}
                  className="flex-1 rounded-2xl bg-white hover:bg-orange-50 px-4 py-3 text-orange-700 text-sm font-semibold ring-2 ring-orange-200 hover:ring-orange-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  📅 Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTeachers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-stone-600">No teachers found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedSubject('')
                setMinRate('')
                setMaxRate('')
                fetchTeachers()
              }}
              className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default Teachers
