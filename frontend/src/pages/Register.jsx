import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { dispatchAuthChanged } from '../lib/auth'

const Register = () => {
  // Role: 'student' | 'teacher'
  const [role, setRole] = useState('student')

  // Common fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  // Student-specific
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [location, setLocation] = useState('')
  const [preferredSubjects, setPreferredSubjects] = useState([])

  // Teacher-specific
  const [profilePicture, setProfilePicture] = useState(null)
  const [qualification, setQualification] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [subjectsTaught, setSubjectsTaught] = useState([])
  const [hourlyRate, setHourlyRate] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [verificationDocs, setVerificationDocs] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const subjects = useMemo(() => [
    'Mathematics', 'Science', 'Programming', 'English', 'Geography', 'Arts', 'History', 'Physics', 'Chemistry', 'Biology'
  ], [])

  const toggleInArray = (arr, value, setter) => {
    if (arr.includes(value)) setter(arr.filter(v => v !== value))
    else setter([...arr, value])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (role === 'student') {
        const body = {
          fullName: name,
          email,
          password,
          phone,
          dateOfBirth,
          location,
          preferredSubjects,
        }
        const data = await apiRequest('/auth/register/student', { method: 'POST', body })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatchAuthChanged()
        navigate('/student/profile')
      } else {
        const body = {
          fullName: name,
          email,
          password,
          phone,
          qualification,
          experienceYears,
          subjectsTaught,
          hourlyRate,
          profilePictureUrl: '',
          resumeUrl: '',
          verificationDocs: [],
        }
        const data = await apiRequest('/auth/register/teacher', { method: 'POST', body })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatchAuthChanged()
        navigate('/teacher/profile')
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-8 shadow">
          <h1 className="text-2xl font-bold text-stone-900">Create your account</h1>
          <p className="mt-1 text-stone-600">Choose your role and complete the required details</p>

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

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            {/* Basic Info */}
            <section>
              <h2 className="text-lg font-semibold text-stone-900">Basic Info</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700">Full Name</label>
                  <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Email Address</label>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  <p className="mt-1 text-xs text-stone-500">We’ll send a verification link to this email</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Password</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700">Phone Number {role === 'teacher' && <span className="text-orange-700">(required)</span>}</label>
                  <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} required={role === 'teacher'} placeholder="Optional for students" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </section>

            {/* Student Section */}
            {role === 'student' && (
              <section>
                <h2 className="text-lg font-semibold text-stone-900">Profile Details</h2>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Date of Birth</label>
                    <input type="date" value={dateOfBirth} onChange={(e)=>setDateOfBirth(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Location (City, Country)</label>
                    <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="e.g., Nairobi, Kenya" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-stone-700">Preferred Subjects</label>
                  <div className="mt-2 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {subjects.map((s) => (
                      <label key={s} className="inline-flex items-center gap-2 rounded-lg bg-white/70 ring-1 ring-orange-200 px-3 py-2 text-sm text-stone-700">
                        <input type="checkbox" checked={preferredSubjects.includes(s)} onChange={()=>toggleInArray(preferredSubjects, s, setPreferredSubjects)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Teacher Section */}
            {role === 'teacher' && (
              <section>
                <h2 className="text-lg font-semibold text-stone-900">Professional Details</h2>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Profile Picture</label>
                    <input type="file" accept="image/*" onChange={(e)=>setProfilePicture(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-white hover:file:bg-orange-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Educational Qualification</label>
                    <input value={qualification} onChange={(e)=>setQualification(e.target.value)} placeholder="e.g., B.Sc. in Mathematics" required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Teaching Experience (years)</label>
                    <input type="number" min="0" value={experienceYears} onChange={(e)=>setExperienceYears(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Hourly Rate (USD)</label>
                    <input type="number" min="0" step="1" value={hourlyRate} onChange={(e)=>setHourlyRate(e.target.value)} required className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-stone-700">Subjects Taught</label>
                  <div className="mt-2 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {subjects.map((s) => (
                      <label key={s} className="inline-flex items-center gap-2 rounded-lg bg-white/70 ring-1 ring-orange-200 px-3 py-2 text-sm text-stone-700">
                        <input type="checkbox" checked={subjectsTaught.includes(s)} onChange={()=>toggleInArray(subjectsTaught, s, setSubjectsTaught)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Resume/CV (PDF, optional)</label>
                    <input type="file" accept="application/pdf" onChange={(e)=>setResumeFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-white hover:file:bg-orange-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Verification Documents (ID, certificates)</label>
                    <input multiple type="file" accept="image/*,application/pdf" onChange={(e)=>setVerificationDocs(Array.from(e.target.files || []))} className="mt-1 block w-full text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-white hover:file:bg-orange-700" />
                  </div>
                </div>
              </section>
            )}

            <button disabled={loading} type="submit" className="w-full rounded-lg bg-orange-600 py-2.5 text-white font-semibold hover:bg-orange-700 disabled:opacity-60">{loading ? 'Creating account...' : 'Sign up'}</button>
          </form>

          <p className="mt-4 text-sm text-stone-600">Already have an account? <Link to="/login" className="text-orange-700 font-semibold hover:underline">Log in</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Register
