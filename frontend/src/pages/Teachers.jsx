import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const navigate = useNavigate()

  const subjects = [
    'Mathematics', 'Science', 'Programming', 'English', 'Geography', 
    'Arts', 'History', 'Physics', 'Chemistry', 'Biology'
  ]

  // Mock teachers data for demonstration
  const mockTeachers = [
    {
      id: 1,
      fullName: 'Dr. Sarah Johnson',
      qualification: 'PhD in Mathematics',
      experienceYears: 8,
      subjectsTaught: ['Mathematics', 'Physics'],
      hourlyRate: 45,
      rating: 4.8,
      totalReviews: 127,
      profilePictureUrl: '',
      bio: 'Experienced mathematics educator with expertise in calculus and algebra. Passionate about making complex concepts accessible to all students.',
      location: 'New York, USA'
    },
    {
      id: 2,
      fullName: 'Prof. Michael Chen',
      qualification: 'Master of Science in Computer Science',
      experienceYears: 12,
      subjectsTaught: ['Programming', 'Mathematics'],
      hourlyRate: 55,
      rating: 4.9,
      totalReviews: 203,
      profilePictureUrl: '',
      bio: 'Senior software engineer turned educator. Specializes in Python, JavaScript, and data structures.',
      location: 'San Francisco, USA'
    },
    {
      id: 3,
      fullName: 'Ms. Emily Rodriguez',
      qualification: 'Bachelor of Arts in English Literature',
      experienceYears: 6,
      subjectsTaught: ['English', 'History'],
      hourlyRate: 35,
      rating: 4.7,
      totalReviews: 89,
      profilePictureUrl: '',
      bio: 'Literature enthusiast with a passion for creative writing and critical analysis. Helps students develop strong communication skills.',
      location: 'Los Angeles, USA'
    },
    {
      id: 4,
      fullName: 'Dr. James Wilson',
      qualification: 'PhD in Physics',
      experienceYears: 15,
      subjectsTaught: ['Physics', 'Chemistry'],
      hourlyRate: 60,
      rating: 4.6,
      totalReviews: 156,
      profilePictureUrl: '',
      bio: 'Research physicist with extensive teaching experience. Makes physics concepts engaging and understandable.',
      location: 'Boston, USA'
    },
    {
      id: 5,
      fullName: 'Ms. Aisha Patel',
      qualification: 'Master of Education',
      experienceYears: 7,
      subjectsTaught: ['Biology', 'Science'],
      hourlyRate: 40,
      rating: 4.8,
      totalReviews: 94,
      profilePictureUrl: '',
      bio: 'Dedicated biology teacher with a focus on hands-on learning and real-world applications.',
      location: 'Chicago, USA'
    }
  ]

  useEffect(() => {
    // In a real app, this would fetch from the API
    // fetchTeachers()
    setTeachers(mockTeachers)
    setLoading(false)
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedSubject) params.append('subject', selectedSubject)
      if (minRate) params.append('minRate', minRate)
      if (maxRate) params.append('maxRate', maxRate)

      const data = await apiRequest(`/student/teachers?${params}`, { method: 'GET' })
      setTeachers(data)
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
      setError('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleChat = (teacherId) => {
    // Navigate to chat page with teacher
    navigate(`/chat?teacher=${teacherId}`)
  }

  const handleBookSession = (teacherId) => {
    // Navigate to booking page
    navigate(`/booking?teacher=${teacherId}`)
  }

  const filteredTeachers = teachers.filter(teacher => {
    if (selectedSubject && !teacher.subjectsTaught.includes(selectedSubject)) return false
    if (minRate && teacher.hourlyRate < Number(minRate)) return false
    if (maxRate && teacher.hourlyRate > Number(maxRate)) return false
    return true
  })

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center">
            <div className="text-lg">Loading teachers...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Find Your Perfect Teacher</h1>
          <p className="mt-2 text-stone-600">Connect with experienced educators who can help you excel in your studies</p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Filter Teachers</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
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
                value={minRate} 
                onChange={(e) => setMinRate(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Max Rate (USD)</label>
              <input 
                type="number" 
                value={maxRate} 
                onChange={(e) => setMaxRate(e.target.value)}
                placeholder="100"
                className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={fetchTeachers}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 hover:shadow-lg transition-shadow">
              {/* Teacher Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center text-xl font-bold text-orange-700 ring-2 ring-orange-200">
                  {teacher.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900">{teacher.fullName}</h3>
                  <p className="text-sm text-stone-600">{teacher.qualification}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(teacher.rating) ? 'text-orange-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-stone-500">
                      {teacher.rating} ({teacher.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Teacher Details */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-stone-700">{teacher.bio}</p>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <span>📍 {teacher.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <span>📚 {teacher.experienceYears} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <span>💰 ${teacher.hourlyRate}/hour</span>
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-4">
                <p className="text-sm font-medium text-stone-700 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjectsTaught.map(subject => (
                    <span key={subject} className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs text-stone-800 ring-1 ring-orange-200">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => handleChat(teacher.id)}
                  className="flex-1 rounded-lg bg-orange-600 px-3 py-2 text-white text-sm font-medium hover:bg-orange-700"
                >
                  Chat
                </button>
                <button 
                  onClick={() => handleBookSession(teacher.id)}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-orange-700 text-sm font-medium ring-1 ring-orange-200 hover:bg-orange-50"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600">No teachers found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedSubject('')
                setMinRate('')
                setMaxRate('')
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
