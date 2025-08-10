import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'arts', name: 'Arts & Humanities' }
  ]

  const courses = [
    {
      id: 1,
      title: 'Advanced Calculus',
      category: 'mathematics',
      description: 'Master differential equations, integrals, and mathematical analysis',
      duration: '12 weeks',
      level: 'Advanced',
      students: 45,
      rating: 4.8,
      price: 299,
      instructor: 'Dr. Sarah Johnson',
      image: '📐'
    },
    {
      id: 2,
      title: 'Python Programming Fundamentals',
      category: 'programming',
      description: 'Learn Python from scratch with hands-on projects and real-world applications',
      duration: '8 weeks',
      level: 'Beginner',
      students: 128,
      rating: 4.9,
      price: 199,
      instructor: 'Prof. Michael Chen',
      image: '🐍'
    },
    {
      id: 3,
      title: 'Creative Writing Workshop',
      category: 'languages',
      description: 'Develop your writing skills through creative exercises and peer feedback',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 67,
      rating: 4.7,
      price: 149,
      instructor: 'Ms. Emily Rodriguez',
      image: '✍️'
    },
    {
      id: 4,
      title: 'Physics for Beginners',
      category: 'science',
      description: 'Understand fundamental physics concepts through interactive experiments',
      duration: '10 weeks',
      level: 'Beginner',
      students: 89,
      rating: 4.6,
      price: 249,
      instructor: 'Dr. James Wilson',
      image: '⚛️'
    },
    {
      id: 5,
      title: 'Data Structures & Algorithms',
      category: 'programming',
      description: 'Master essential computer science concepts for technical interviews',
      duration: '14 weeks',
      level: 'Advanced',
      students: 156,
      rating: 4.9,
      price: 399,
      instructor: 'Prof. Michael Chen',
      image: '🔢'
    },
    {
      id: 6,
      title: 'English Literature Analysis',
      category: 'languages',
      description: 'Explore classic and contemporary literature with critical analysis',
      duration: '8 weeks',
      level: 'Intermediate',
      students: 34,
      rating: 4.5,
      price: 179,
      instructor: 'Ms. Emily Rodriguez',
      image: '📚'
    },
    {
      id: 7,
      title: 'Chemistry Lab Techniques',
      category: 'science',
      description: 'Learn laboratory safety and essential chemistry techniques',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 42,
      rating: 4.7,
      price: 199,
      instructor: 'Dr. James Wilson',
      image: '🧪'
    },
    {
      id: 8,
      title: 'Linear Algebra',
      category: 'mathematics',
      description: 'Study vectors, matrices, and linear transformations',
      duration: '10 weeks',
      level: 'Intermediate',
      students: 78,
      rating: 4.8,
      price: 279,
      instructor: 'Dr. Sarah Johnson',
      image: '📊'
    }
  ]

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const handleEnroll = (courseId) => {
    navigate(`/enroll?course=${courseId}`)
  }

  const handleViewDetails = (courseId) => {
    navigate(`/course/${courseId}`)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Explore Our Courses</h1>
          <p className="mt-2 text-stone-600">Discover comprehensive learning programs designed to help you succeed</p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 hover:shadow-lg transition-shadow">
              {/* Course Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{course.image}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900">{course.title}</h3>
                  <p className="text-sm text-stone-600">by {course.instructor}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(course.rating) ? 'text-orange-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-stone-500">
                      {course.rating} ({course.students} students)
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
              <div className="flex gap-3">
                <button 
                  onClick={() => handleViewDetails(course.id)}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-orange-700 text-sm font-medium ring-1 ring-orange-200 hover:bg-orange-50"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleEnroll(course.id)}
                  className="flex-1 rounded-lg bg-orange-600 px-3 py-2 text-white text-sm font-medium hover:bg-orange-700"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
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
    </main>
  )
}

export default Courses
