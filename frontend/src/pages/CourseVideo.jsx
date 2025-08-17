import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CourseVideo = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourseContent()
  }, [courseId])

  const fetchCourseContent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCourse(data.course)
        if (data.course.videos && data.course.videos.length > 0) {
          setSelectedVideo(data.course.videos[0])
        }
      } else {
        setError(data.error || 'Failed to load course content')
      }
    } catch (error) {
      setError('Failed to load course content')
      console.error('Error fetching course content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = (video) => {
    setSelectedVideo(video)
  }

  const getVideoEmbedUrl = (url) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Handle YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    // Return original URL if not recognized
    return url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading course content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Access Denied</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">Course not found</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <span>←</span>
            <span>Back to Profile</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{course.image}</div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900">{course.title}</h1>
              <p className="text-stone-600">by {course.teacher?.fullName}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {selectedVideo ? (
                <div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={getVideoEmbedUrl(selectedVideo.url)}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-stone-900 mb-2">{selectedVideo.title}</h2>
                    {selectedVideo.duration && (
                      <p className="text-stone-600">Duration: {selectedVideo.duration}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-stone-600">No videos available for this course</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Information */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-stone-900 mb-4">About This Course</h3>
              <p className="text-stone-700 leading-relaxed mb-6">{course.fullDescription || course.description}</p>

              {course.outcomes && course.outcomes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-stone-900 mb-3">What You'll Learn</h4>
                  <ul className="space-y-2">
                    {course.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-stone-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-stone-900 mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-stone-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.syllabus && course.syllabus.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-stone-900 mb-3">Course Syllabus</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {course.syllabus.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 py-2">
                        <span className="text-orange-600 font-semibold min-w-[80px]">Week {index + 1}</span>
                        <span className="text-stone-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Course Videos</h3>
              {course.videos && course.videos.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {course.videos.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => handleVideoSelect(video)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVideo === video
                          ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                          : 'bg-gray-50 text-stone-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold text-orange-700">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{video.title}</p>
                          {video.duration && (
                            <p className="text-xs text-stone-500">{video.duration}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📹</div>
                  <p className="text-stone-600">No videos uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CourseVideo
