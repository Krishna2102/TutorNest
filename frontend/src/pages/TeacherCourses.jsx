import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TeacherCourses = () => {
  const [courses, setCourses] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: 'mathematics',
    level: 'Beginner',
    duration: '',
    price: 0,
    image: '📚',
    videos: [],
    syllabus: [],
    requirements: [],
    outcomes: []
  })

  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    duration: ''
  })

  const [newSyllabusItem, setNewSyllabusItem] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newOutcome, setNewOutcome] = useState('')

  useEffect(() => {
    fetchTeacherCourses()
  }, [])

  const fetchTeacherCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/courses/teacher/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleAddCourse = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      })
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setNewCourse({
          title: '',
          description: '',
          fullDescription: '',
          category: 'mathematics',
          level: 'Beginner',
          duration: '',
          price: 0,
          image: '📚',
          videos: [],
          syllabus: [],
          requirements: [],
          outcomes: []
        })
        fetchTeacherCourses()
      }
    } catch (error) {
      console.error('Error adding course:', error)
    }
    setLoading(false)
  }

  const handleUpdateCourse = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedCourse)
      })
      const data = await response.json()
      if (data.success) {
        setShowEditModal(false)
        setSelectedCourse(null)
        fetchTeacherCourses()
      }
    } catch (error) {
      console.error('Error updating course:', error)
    }
    setLoading(false)
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success) {
          fetchTeacherCourses()
        }
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }

  const addVideo = () => {
    if (newVideo.title && newVideo.url) {
      setNewCourse(prev => ({
        ...prev,
        videos: [...prev.videos, { ...newVideo }]
      }))
      setNewVideo({ title: '', url: '', duration: '' })
    }
  }

  const removeVideo = (index) => {
    setNewCourse(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const addSyllabusItem = () => {
    if (newSyllabusItem.trim()) {
      setNewCourse(prev => ({
        ...prev,
        syllabus: [...prev.syllabus, newSyllabusItem.trim()]
      }))
      setNewSyllabusItem('')
    }
  }

  const removeSyllabusItem = (index) => {
    setNewCourse(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setNewCourse(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (index) => {
    setNewCourse(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setNewCourse(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, newOutcome.trim()]
      }))
      setNewOutcome('')
    }
  }

  const removeOutcome = (index) => {
    setNewCourse(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
    }))
  }

  const categories = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'arts', name: 'Arts & Humanities' }
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">My Courses</h1>
            <p className="mt-2 text-stone-600">Manage your courses and track student progress</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Add New Course
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{course.image}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900">{course.title}</h3>
                  <p className="text-sm text-stone-600">{course.category} • {course.level}</p>
                  <p className="text-sm text-stone-600">{course.duration}</p>
                </div>
              </div>

              <p className="text-sm text-stone-700 mb-4">{course.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-stone-900">${course.price}</span>
                <span className="text-sm text-stone-500">{course.studentsEnrolled?.length || 0} students</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course)
                    setShowEditModal(true)
                  }}
                  className="flex-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600 mb-4">You haven't created any courses yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
            >
              Create Your First Course
            </button>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-stone-900">Add New Course</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Course Title</label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Level</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 8 weeks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Image Emoji</label>
                    <input
                      type="text"
                      value={newCourse.image}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="📚"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Short Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Full Description</label>
                  <textarea
                    value={newCourse.fullDescription}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, fullDescription: e.target.value }))}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Videos Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Course Videos</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Video title"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Video URL"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={addVideo}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Add Video
                    </button>
                  </div>
                  {newCourse.videos.map((video, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{video.title}</span>
                      <button
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Syllabus Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Course Syllabus</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSyllabusItem}
                      onChange={(e) => setNewSyllabusItem(e.target.value)}
                      placeholder="Add syllabus item"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={addSyllabusItem}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Add
                    </button>
                  </div>
                  {newCourse.syllabus.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => removeSyllabusItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Requirements Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Requirements</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add requirement"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={addRequirement}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Add
                    </button>
                  </div>
                  {newCourse.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{req}</span>
                      <button
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Outcomes Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">Learning Outcomes</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      placeholder="Add learning outcome"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={addOutcome}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Add
                    </button>
                  </div>
                  {newCourse.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{outcome}</span>
                      <button
                        onClick={() => removeOutcome(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleAddCourse}
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-stone-900">Edit Course</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Course Title</label>
                    <input
                      type="text"
                      value={selectedCourse.title}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                    <select
                      value={selectedCourse.category}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Level</label>
                    <select
                      value={selectedCourse.level}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={selectedCourse.price}
                      onChange={(e) => setSelectedCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
                  <textarea
                    value={selectedCourse.description}
                    onChange={(e) => setSelectedCourse(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleUpdateCourse}
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Updating...' : 'Update Course'}
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default TeacherCourses
