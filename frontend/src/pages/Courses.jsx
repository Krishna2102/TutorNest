import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load courses and enrolled courses from API on component mount
  useEffect(() => {
    fetchCourses()
    fetchEnrolledCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/courses')
      const data = await response.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'arts', name: 'Arts & Humanities' }
  ]

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const handleViewDetails = (course) => {
    setSelectedCourse(course)
    setShowModal(true)
  }

  const handleEnroll = async (course) => {
    setIsEnrolling(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/courses/${course._id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEnrolledCourses(prev => [...prev, course])
        setShowModal(false)
        alert(`Successfully enrolled in ${course.title}! You can view your progress in your profile.`)
      } else {
        alert(data.error || 'Failed to enroll in course')
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      alert('Failed to enroll in course. Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCourse(null)
  }

  return (
         <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Explore Our Courses</h1>
          <p className="mt-2 text-stone-600">Discover comprehensive learning programs designed to help you succeed</p>
        </div>

                 {/* Category Filters */}
         <div className="mb-8">
           <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                                 className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                   selectedCategory === category.id
                     ? 'bg-orange-600 text-white'
                     : 'bg-white text-stone-700 ring-1 ring-orange-200 hover:bg-orange-50'
                 }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-stone-600">Loading courses...</p>
          </div>
        )}

                 {/* Courses Grid */}
         {!loading && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map(course => (
                             <div key={course._id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(course)}>
                {/* Course Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{course.image}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-stone-900">{course.title}</h3>
                    <p className="text-sm text-stone-600">by {course.teacher?.fullName || 'Unknown Teacher'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(course.rating || 0) ? 'text-orange-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-stone-500">
                        {course.rating || 0} ({course.studentsEnrolled?.length || 0} students)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-sm text-stone-700 mb-4">{course.description}</p>

                {/* Course Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-stone-600">
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <span>📊 {course.level}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-stone-900">${course.price}</span>
                  <span className="text-sm text-stone-500">One-time payment</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetails(course)
                    }}
                    className="flex-1 rounded-lg bg-white px-3 py-2 text-orange-700 text-sm font-medium ring-1 ring-orange-200 hover:bg-orange-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isEnrolled(course._id)) {
                        alert('You are already enrolled in this course! Check your profile for progress.')
                      } else {
                        handleViewDetails(course)
                      }
                    }}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isEnrolled(course._id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                    disabled={isEnrolled(course._id)}
                  >
                    {isEnrolled(course._id) ? 'Enrolled' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600">No courses found in this category.</p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700"
            >
              View All Courses
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-orange-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
            <p className="text-orange-100 mb-6">Join thousands of students who are already advancing their skills</p>
            <button 
              onClick={() => navigate('/register')}
              className="rounded-lg bg-white px-6 py-3 text-orange-600 font-semibold hover:bg-orange-50"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>

             {/* Course Details Modal */}
       {showModal && selectedCourse && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedCourse.image}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">{selectedCourse.title}</h2>
                    <p className="text-stone-600">by {selectedCourse.teacher?.fullName || 'Unknown Teacher'}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

                         {/* Modal Content */}
             <div className="p-4 sm:p-6">
               <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                                 {/* Main Content */}
                 <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-stone-900 mb-4">Course Description</h3>
                  <p className="text-stone-700 leading-relaxed mb-6">{selectedCourse.fullDescription || selectedCourse.description}</p>

                  {selectedCourse.outcomes && selectedCourse.outcomes.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-stone-900 mb-4">What You'll Learn</h3>
                      <ul className="space-y-2 mb-6">
                        {selectedCourse.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-stone-700">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-stone-900 mb-4">Course Syllabus</h3>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        {selectedCourse.syllabus.map((week, index) => (
                          <div key={index} className="flex items-center gap-3 py-2">
                            <span className="text-orange-600 font-semibold min-w-[80px]">Week {index + 1}</span>
                            <span className="text-stone-700">{week}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedCourse.requirements && selectedCourse.requirements.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-stone-900 mb-4">Requirements</h3>
                      <ul className="space-y-2 mb-6">
                        {selectedCourse.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-stone-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                                 {/* Sidebar */}
                 <div className="lg:col-span-1">
                  <div className="bg-orange-50 rounded-lg p-6 sticky top-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">{selectedCourse.image}</div>
                      <h3 className="text-xl font-bold text-stone-900">{selectedCourse.title}</h3>
                    </div>

                                         <div className="space-y-4 mb-6">
                       <div className="flex justify-between">
                         <span className="text-stone-600">Duration:</span>
                         <span className="font-semibold">{selectedCourse.duration}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-stone-600">Level:</span>
                         <span className="font-semibold">{selectedCourse.level}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-stone-600">Students:</span>
                         <span className="font-semibold">{selectedCourse.studentsEnrolled?.length || 0}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-stone-600">Rating:</span>
                         <span className="font-semibold">{selectedCourse.rating || 0}/5</span>
                       </div>
                     </div>

                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-stone-900 mb-2">${selectedCourse.price}</div>
                      <p className="text-sm text-stone-600">One-time payment</p>
                    </div>

                                         {isEnrolled(selectedCourse._id) ? (
                      <div className="text-center">
                        <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-4">
                          <p className="font-semibold">✓ Already Enrolled</p>
                          <p className="text-sm">Check your profile for course progress</p>
                        </div>
                        <button
                          onClick={() => navigate('/profile')}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                        >
                          View Progress
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(selectedCourse)}
                        disabled={isEnrolling}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          isEnrolling
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}

                    <div className="mt-4 text-center">
                      <p className="text-xs text-stone-500">
                        ✓ 30-day money-back guarantee<br />
                        ✓ Lifetime access<br />
                        ✓ Certificate of completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Courses
