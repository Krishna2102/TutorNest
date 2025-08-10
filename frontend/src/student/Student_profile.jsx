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
  const navigate = useNavigate()

  // Mock data for activity history and schedule
  const [pastClasses] = useState([
    { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-15', duration: '60 min', status: 'completed' },
    { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-10', duration: '45 min', status: 'completed' },
    { id: 3, subject: 'Physics', teacher: 'Mr. Daniel', date: '2024-01-05', duration: '90 min', status: 'completed' },
  ])

  const [upcomingSessions] = useState([
    { id: 1, subject: 'Mathematics', teacher: 'Ms. Amina', date: '2024-01-20', time: '15:00', duration: '60 min' },
    { id: 2, subject: 'English', teacher: 'Dr. Kim', date: '2024-01-22', time: '16:30', duration: '45 min' },
  ])

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

  useEffect(() => {
    fetchProfile()
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

  if (loading) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center">Failed to load profile</div>
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Student Profile</h1>
            <p className="mt-1 text-stone-600">Manage your learning preferences</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 disabled:opacity-60">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </section>

        {/* Profile Header */}
        <section className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
          <div className="flex items-center gap-6">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.fullName} 
                className="w-24 h-24 rounded-full object-cover ring-2 ring-orange-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-700 ring-2 ring-orange-200">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-stone-900">{user.fullName || 'Student Name'}</h2>
              <p className="text-stone-600">{user.email}</p>
              {user.phone && <p className="text-sm text-stone-500">{user.phone}</p>}
              {user.location && <p className="text-sm text-stone-500">{user.location}</p>}
            </div>
          </div>
        </section>

        {/* Error and Success Messages */}
        {error && (
          <div className="rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-100 text-green-800 px-4 py-3 text-sm">
            {success}
          </div>
        )}

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
