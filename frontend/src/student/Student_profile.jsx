import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { dispatchAuthChanged } from '../lib/auth'

const StudentProfile = () => {
  const [user, setUser] = useState(null)
  const [timeZone, setTimeZone] = useState('UTC+03:00')
  const [availability, setAvailability] = useState('Weekdays 5-7 PM')
  const [subjects, setSubjects] = useState([])
  const [educationLevel, setEducationLevel] = useState('school')
  const [classGrade, setClassGrade] = useState('')
  const [degree, setDegree] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [universityName, setUniversityName] = useState('')
  const [institution, setInstitution] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [pastClasses, setPastClasses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const navigate = useNavigate()

  // Fetch student profile data
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await apiRequest('/student/me', { method: 'GET' })
      setUser(data)
      
      // Set form fields from API data with proper defaults
      setEducationLevel(data.educationLevel || 'school')
      setClassGrade(data.class || '')
      setDegree(data.degree || '')
      setSchoolName(data.schoolName || '')
      setUniversityName(data.universityName || '')
      setInstitution(data.institution || '')
      setSubjects(data.preferredSubjects || [])
      
      console.log('Fetched user data:', data) // Debug log
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch upcoming sessions and past classes
  const fetchSessions = async () => {
    try {
      // Fetch upcoming sessions
      const upcomingData = await apiRequest('/student/upcoming-sessions', { method: 'GET' })
      setUpcomingSessions(upcomingData || [])
      
      // Fetch past classes
      const pastData = await apiRequest('/student/past-classes', { method: 'GET' })
      setPastClasses(pastData || [])
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
      // Use mock data as fallback
      setUpcomingSessions([
        { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-20', time: '15:00', duration: '60 min' },
        { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-22', time: '16:30', duration: '45 min' },
      ])
      setPastClasses([
        { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-15', duration: '60 min', status: 'completed' },
        { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-10', duration: '45 min', status: 'completed' },
        { id: 3, subject: 'Physics', teacher: 'Mr. Daniel', date: '2024-01-05', duration: '90 min', status: 'completed' },
      ])
    }
  }

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/courses/student/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setEnrolledCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchSessions()
    fetchEnrolledCourses()
  }, [])

  const handleSaveChanges = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const updateData = {
        educationLevel,
        class: classGrade,
        degree,
        schoolName,
        universityName,
        institution,
        preferredSubjects: subjects,
      }

      console.log('Sending update data:', updateData) // Debug log

      await apiRequest('/student/me', { 
        method: 'PUT', 
        body: updateData 
      })

      setSuccess('Profile updated successfully!')
      
      // Refresh profile data
      await fetchProfile()
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

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

  const handleUnenroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/unenroll`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setEnrolledCourses(enrolledCourses.filter(course => course._id !== courseId))
        setSuccess('Course unenrolled successfully!')
      } else {
        setError('Failed to unenroll from course')
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error)
      setError('Failed to unenroll from course')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center">Failed to load profile</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-8 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-900 to-orange-700 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-lg text-stone-600">📚 Manage your learning journey and preferences</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            disabled={loggingOut} 
            className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
          >
            {loggingOut ? '🔄 Logging out...' : '🚪 Logout'}
          </button>
        </section>

        {/* Profile Header */}
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-8 shadow-xl">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-blue-100">
                {user?.fullName?.charAt(0) || '👤'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-stone-900 mb-2">{user?.fullName || 'Student Name'} 👋</h2>
              <div className="space-y-2">
                <p className="text-lg text-stone-600 flex items-center gap-2">
                  📧 <span>{user?.email}</span>
                </p>
                {user?.phone && (
                  <p className="text-stone-500 flex items-center gap-2">
                    📱 <span>{user.phone}</span>
                  </p>
                )}
                {user?.location && (
                  <p className="text-stone-500 flex items-center gap-2">
                    📍 <span>{user.location}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl px-6 py-4 border border-orange-300">
                <div className="text-2xl font-bold text-orange-700">Student</div>
                <div className="text-sm text-orange-600">Active Learner</div>
              </div>
            </div>
          </div>
        </section>

        {/* Error and Success Messages */}
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-6 py-4 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-6 py-4 text-sm flex items-center gap-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Enrolled Courses Section */}
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-orange-200/50 p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            📚 <span>My Enrolled Courses</span>
          </h3>
          {enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.map(course => (
                <div key={course._id} className="bg-orange-50 rounded-lg p-4 ring-1 ring-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm">{course.title}</h4>
                      <p className="text-xs text-stone-600">by {course.teacher?.fullName}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnenroll(course._id);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                      title="Unenroll from course"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-xs text-stone-700 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{course.duration}</span>
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="text-orange-600 font-medium hover:text-orange-800"
                    >
                      Watch videos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-stone-600 mb-4">You haven't enrolled in any courses yet</p>
              <button
                onClick={() => navigate('/courses')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700"
              >
                Browse Courses
              </button>
            </div>
          )}
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Profile Details */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-900">Profile Details</h3>
              
              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium text-stone-700">Education Level</label>
                <select value={educationLevel} onChange={(e)=>setEducationLevel(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="school">School</option>
                  <option value="university">University</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Institution based on Education Level */}
              {educationLevel === 'school' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">School Name</label>
                  <input value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} placeholder="e.g., St. Mary's High School" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              )}

              {educationLevel === 'university' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">University Name</label>
                  <input value={universityName} onChange={(e)=>setUniversityName(e.target.value)} placeholder="e.g., University of Nairobi" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              )}

              {educationLevel === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">Institution Name</label>
                  <input value={institution} onChange={(e)=>setInstitution(e.target.value)} placeholder="e.g., Technical Institute" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              )}

              {/* Class or Degree based on Education Level */}
              {educationLevel === 'school' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">Class/Grade</label>
                  <select value={classGrade} onChange={(e)=>setClassGrade(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="A-Level">A-Level</option>
                    <option value="IB">International Baccalaureate</option>
                  </select>
                </div>
              )}

              {educationLevel === 'university' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">Degree</label>
                  <select value={degree} onChange={(e)=>setDegree(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select Degree</option>
                    <option value="Bachelor of Science">Bachelor of Science</option>
                    <option value="Bachelor of Arts">Bachelor of Arts</option>
                    <option value="Bachelor of Engineering">Bachelor of Engineering</option>
                    <option value="Bachelor of Commerce">Bachelor of Commerce</option>
                    <option value="Master of Science">Master of Science</option>
                    <option value="Master of Arts">Master of Arts</option>
                    <option value="Master of Business Administration">Master of Business Administration</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Time Zone</label>
                  <input value={timeZone} onChange={(e)=>setTimeZone(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Availability</label>
                  <input value={availability} onChange={(e)=>setAvailability(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">Preferred Subjects</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subjects.map(s => (
                    <span key={s} className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm text-stone-800 ring-1 ring-orange-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleSaveChanges}
                  disabled={saving} 
                  className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Schedule and History */}
          <div className="space-y-6">
            {/* Upcoming Schedule */}
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Upcoming Schedule</h3>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-orange-50 ring-1 ring-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900">{session.subject}</h4>
                        <p className="text-sm text-stone-600">with {session.teacher}</p>
                        <p className="text-xs text-stone-500">{session.date} at {session.time} ({session.duration})</p>
                      </div>
                      <button className="rounded-lg bg-orange-600 px-3 py-1 text-white text-sm font-medium hover:bg-orange-700">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-600 text-center py-4">No upcoming sessions scheduled</p>
              )}
            </section>

            {/* Activity History */}
            <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Activity History</h3>
              {pastClasses.length > 0 ? (
                <div className="space-y-3">
                  {pastClasses.map(classItem => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 rounded-lg bg-orange-50 ring-1 ring-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-stone-900">{classItem.subject}</h4>
                        <p className="text-sm text-stone-600">with {classItem.teacher}</p>
                        <p className="text-xs text-stone-500">{classItem.date} ({classItem.duration})</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {classItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-600 text-center py-4">No past classes found</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default StudentProfile
