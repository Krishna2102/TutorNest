import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isEnrolling, setIsEnrolling] = useState(false)
  const navigate = useNavigate()

  // Load enrolled courses from localStorage on component mount
  useEffect(() => {
    const savedEnrolledCourses = localStorage.getItem('enrolledCourses')
    if (savedEnrolledCourses) {
      setEnrolledCourses(JSON.parse(savedEnrolledCourses))
    }
  }, [])

  // Save enrolled courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses))
  }, [enrolledCourses])

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
      fullDescription: 'This comprehensive course covers advanced calculus concepts including limits, continuity, differentiation, integration, and their applications. You\'ll learn to solve complex mathematical problems and understand the theoretical foundations of calculus. Perfect for students pursuing STEM fields or advanced mathematics.',
      duration: '12 weeks',
      level: 'Advanced',
      students: 45,
      rating: 4.8,
      price: 299,
      instructor: 'Dr. Sarah Johnson',
      image: '📐',
      syllabus: [
        'Week 1-2: Limits and Continuity',
        'Week 3-4: Differentiation Techniques',
        'Week 5-6: Applications of Derivatives',
        'Week 7-8: Integration Methods',
        'Week 9-10: Applications of Integrals',
        'Week 11-12: Series and Sequences'
      ],
      requirements: [
        'Basic algebra and trigonometry',
        'Pre-calculus knowledge',
        'Dedication to practice problems'
      ],
      outcomes: [
        'Solve complex calculus problems',
        'Understand mathematical proofs',
        'Apply calculus to real-world scenarios'
      ]
    },
    {
      id: 2,
      title: 'Python Programming Fundamentals',
      category: 'programming',
      description: 'Learn Python from scratch with hands-on projects and real-world applications',
      fullDescription: 'Start your programming journey with Python! This beginner-friendly course covers everything from basic syntax to object-oriented programming. You\'ll build real projects including a calculator, web scraper, and simple game. Perfect for anyone wanting to learn programming or enhance their technical skills.',
      duration: '8 weeks',
      level: 'Beginner',
      students: 128,
      rating: 4.9,
      price: 199,
      instructor: 'Prof. Michael Chen',
      image: '🐍',
      syllabus: [
        'Week 1: Introduction to Python',
        'Week 2: Variables and Data Types',
        'Week 3: Control Structures',
        'Week 4: Functions and Modules',
        'Week 5: Lists and Dictionaries',
        'Week 6: File Handling',
        'Week 7: Object-Oriented Programming',
        'Week 8: Final Project'
      ],
      requirements: [
        'Basic computer literacy',
        'No prior programming experience needed',
        'Windows, Mac, or Linux computer'
      ],
      outcomes: [
        'Write Python programs from scratch',
        'Build practical applications',
        'Understand programming fundamentals'
      ]
    },
    {
      id: 3,
      title: 'Creative Writing Workshop',
      category: 'languages',
      description: 'Develop your writing skills through creative exercises and peer feedback',
      fullDescription: 'Unlock your creative potential in this interactive writing workshop. You\'ll explore different genres, develop your unique voice, and receive constructive feedback from peers and instructors. Whether you\'re a beginner or experienced writer, this course will help you hone your craft.',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 67,
      rating: 4.7,
      price: 149,
      instructor: 'Ms. Emily Rodriguez',
      image: '✍️',
      syllabus: [
        'Week 1: Finding Your Voice',
        'Week 2: Character Development',
        'Week 3: Plot and Structure',
        'Week 4: Dialogue and Description',
        'Week 5: Revision Techniques',
        'Week 6: Publishing and Sharing'
      ],
      requirements: [
        'Basic writing skills',
        'Openness to feedback',
        'Creative mindset'
      ],
      outcomes: [
        'Develop unique writing style',
        'Create compelling narratives',
        'Receive and give constructive feedback'
      ]
    },
    {
      id: 4,
      title: 'Physics for Beginners',
      category: 'science',
      description: 'Understand fundamental physics concepts through interactive experiments',
      fullDescription: 'Discover the fascinating world of physics through hands-on experiments and real-world applications. This course makes complex concepts accessible through interactive demonstrations and practical examples. Perfect for students curious about how the universe works.',
      duration: '10 weeks',
      level: 'Beginner',
      students: 89,
      rating: 4.6,
      price: 249,
      instructor: 'Dr. James Wilson',
      image: '⚛️',
      syllabus: [
        'Week 1-2: Mechanics and Motion',
        'Week 3-4: Forces and Energy',
        'Week 5-6: Waves and Sound',
        'Week 7-8: Electricity and Magnetism',
        'Week 9-10: Modern Physics'
      ],
      requirements: [
        'Basic algebra skills',
        'Curiosity about the natural world',
        'Access to simple household materials for experiments'
      ],
      outcomes: [
        'Understand fundamental physics principles',
        'Conduct simple experiments',
        'Apply physics to everyday phenomena'
      ]
    },
    {
      id: 5,
      title: 'Data Structures & Algorithms',
      category: 'programming',
      description: 'Master essential computer science concepts for technical interviews',
      fullDescription: 'Prepare for technical interviews and advance your programming skills with this comprehensive course on data structures and algorithms. You\'ll learn to solve complex problems efficiently and understand the theoretical foundations of computer science.',
      duration: '14 weeks',
      level: 'Advanced',
      students: 156,
      rating: 4.9,
      price: 399,
      instructor: 'Prof. Michael Chen',
      image: '🔢',
      syllabus: [
        'Week 1-2: Arrays and Strings',
        'Week 3-4: Linked Lists and Stacks',
        'Week 5-6: Queues and Trees',
        'Week 7-8: Graphs and Traversal',
        'Week 9-10: Sorting Algorithms',
        'Week 11-12: Dynamic Programming',
        'Week 13-14: Advanced Problem Solving'
      ],
      requirements: [
        'Strong programming fundamentals',
        'Basic mathematics',
        'Problem-solving mindset'
      ],
      outcomes: [
        'Master common data structures',
        'Implement efficient algorithms',
        'Ace technical interviews'
      ]
    },
    {
      id: 6,
      title: 'English Literature Analysis',
      category: 'languages',
      description: 'Explore classic and contemporary literature with critical analysis',
      fullDescription: 'Dive deep into the world of literature through critical analysis of classic and contemporary works. You\'ll develop analytical skills, understand literary devices, and explore the cultural and historical contexts of various texts.',
      duration: '8 weeks',
      level: 'Intermediate',
      students: 34,
      rating: 4.5,
      price: 179,
      instructor: 'Ms. Emily Rodriguez',
      image: '📚',
      syllabus: [
        'Week 1: Introduction to Literary Analysis',
        'Week 2: Poetry Analysis',
        'Week 3: Short Stories',
        'Week 4: Novels and Novellas',
        'Week 5: Drama and Theater',
        'Week 6: Contemporary Literature',
        'Week 7: Critical Theory',
        'Week 8: Final Analysis Project'
      ],
      requirements: [
        'Strong reading comprehension',
        'Interest in literature',
        'Analytical thinking skills'
      ],
      outcomes: [
        'Analyze literary texts critically',
        'Understand literary devices',
        'Write compelling literary essays'
      ]
    },
    {
      id: 7,
      title: 'Chemistry Lab Techniques',
      category: 'science',
      description: 'Learn laboratory safety and essential chemistry techniques',
      fullDescription: 'Master essential laboratory techniques and safety protocols in this hands-on chemistry course. You\'ll learn proper lab procedures, chemical handling, and experimental methods used in professional laboratories.',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 42,
      rating: 4.7,
      price: 199,
      instructor: 'Dr. James Wilson',
      image: '🧪',
      syllabus: [
        'Week 1: Lab Safety and Equipment',
        'Week 2: Measurement and Precision',
        'Week 3: Chemical Reactions',
        'Week 4: Chromatography',
        'Week 5: Spectroscopy',
        'Week 6: Final Lab Project'
      ],
      requirements: [
        'Basic chemistry knowledge',
        'Attention to safety protocols',
        'Access to lab materials (provided)'
      ],
      outcomes: [
        'Perform laboratory procedures safely',
        'Use scientific equipment properly',
        'Analyze experimental data'
      ]
    },
    {
      id: 8,
      title: 'Linear Algebra',
      category: 'mathematics',
      description: 'Study vectors, matrices, and linear transformations',
      fullDescription: 'Explore the fundamental concepts of linear algebra including vectors, matrices, eigenvalues, and linear transformations. This course provides the mathematical foundation for many advanced topics in science and engineering.',
      duration: '10 weeks',
      level: 'Intermediate',
      students: 78,
      rating: 4.8,
      price: 279,
      instructor: 'Dr. Sarah Johnson',
      image: '📊',
      syllabus: [
        'Week 1-2: Vectors and Vector Spaces',
        'Week 3-4: Matrices and Operations',
        'Week 5-6: Linear Transformations',
        'Week 7-8: Eigenvalues and Eigenvectors',
        'Week 9-10: Applications and Projects'
      ],
      requirements: [
        'Basic calculus knowledge',
        'Understanding of mathematical proofs',
        'Strong algebraic skills'
      ],
      outcomes: [
        'Solve systems of linear equations',
        'Understand matrix operations',
        'Apply linear algebra to real problems'
      ]
    }
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add course to enrolled courses
    const enrollmentDate = new Date().toISOString()
    const enrolledCourse = {
      ...course,
      enrolledAt: enrollmentDate,
      progress: 0,
      status: 'active'
    }
    
    setEnrolledCourses(prev => [...prev, enrolledCourse])
    setIsEnrolling(false)
    setShowModal(false)
    
    // Show success message
    alert(`Successfully enrolled in ${course.title}! You can view your progress in your profile.`)
  }

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCourse(null)
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
            <div key={course.id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(course)}>
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails(course)
                  }}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-orange-700 text-sm font-medium ring-1 ring-orange-200 hover:bg-orange-50"
                >
                  View Details
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isEnrolled(course.id)) {
                      alert('You are already enrolled in this course! Check your profile for progress.')
                    } else {
                      handleViewDetails(course)
                    }
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                    isEnrolled(course.id)
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                  disabled={isEnrolled(course.id)}
                >
                  {isEnrolled(course.id) ? 'Enrolled' : 'Enroll Now'}
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

      {/* Course Details Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedCourse.image}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">{selectedCourse.title}</h2>
                    <p className="text-stone-600">by {selectedCourse.instructor}</p>
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
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-stone-900 mb-4">Course Description</h3>
                  <p className="text-stone-700 leading-relaxed mb-6">{selectedCourse.fullDescription}</p>

                  <h3 className="text-xl font-bold text-stone-900 mb-4">What You'll Learn</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedCourse.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-stone-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-bold text-stone-900 mb-4">Course Syllabus</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedCourse.syllabus.map((week, index) => (
                      <div key={index} className="flex items-center gap-3 py-2">
                        <span className="text-orange-600 font-semibold min-w-[80px]">Week {index + 1}</span>
                        <span className="text-stone-700">{week}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-4">Requirements</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedCourse.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-stone-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
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
                        <span className="font-semibold">{selectedCourse.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Rating:</span>
                        <span className="font-semibold">{selectedCourse.rating}/5</span>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-stone-900 mb-2">${selectedCourse.price}</div>
                      <p className="text-sm text-stone-600">One-time payment</p>
                    </div>

                    {isEnrolled(selectedCourse.id) ? (
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
