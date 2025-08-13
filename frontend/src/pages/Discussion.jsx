import React, { useState, useEffect } from 'react'
import { apiRequest } from '../lib/api'

const Discussion = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  // New post form state
  const [qTitle, setQTitle] = useState('')
  const [qBody, setQBody] = useState('')
  const [qImageUrl, setQImageUrl] = useState('')
  const [qTags, setQTags] = useState('')

  // Edit post state
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editTags, setEditTags] = useState('')

  // Toggle for showing reply forms per post
  const [openReplyFor, setOpenReplyFor] = useState(null)

  // Fetch user data and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
        
        // Fetch posts
        const postsData = await apiRequest('/posts', { method: 'GET' })
        setPosts(postsData || [])
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const postQuestion = async (e) => {
    e.preventDefault()
    if (!qTitle.trim() || !qBody.trim()) return

    try {
      const tags = qTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const newPost = await apiRequest('/posts', {
        method: 'POST',
        body: {
          title: qTitle.trim(),
          body: qBody.trim(),
          imageUrl: qImageUrl.trim(),
          tags
        }
      })

      setPosts([newPost, ...posts])
      setQTitle('')
      setQBody('')
      setQImageUrl('')
      setQTags('')
    } catch (err) {
      console.error('Failed to create post:', err)
      setError('Failed to create post')
    }
  }

  const updatePost = async (postId) => {
    try {
      const tags = editTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const updatedPost = await apiRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: {
          title: editTitle.trim(),
          body: editBody.trim(),
          imageUrl: editImageUrl.trim(),
          tags
        }
      })

      setPosts(posts.map(post => post._id === postId ? updatedPost : post))
      setEditingPost(null)
      setEditTitle('')
      setEditBody('')
      setEditImageUrl('')
      setEditTags('')
    } catch (err) {
      console.error('Failed to update post:', err)
      setError('Failed to update post')
    }
  }

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' })
      setPosts(posts.filter(post => post._id !== postId))
    } catch (err) {
      console.error('Failed to delete post:', err)
      setError('Failed to delete post')
    }
  }

  const toggleLike = async (postId) => {
    try {
      const result = await apiRequest(`/posts/${postId}/like`, { method: 'POST' })
      
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: result.isLiked 
              ? [...post.likes, { userId: user?._id, userModel: user?.role === 'student' ? 'Student' : 'Teacher' }]
              : post.likes.filter(like => like.userId !== user?._id)
          }
        }
        return post
      }))
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  const addComment = async (postId, payload) => {
    try {
      const result = await apiRequest(`/posts/${postId}/comments`, {
        method: 'POST',
        body: {
          text: payload.text.trim(),
          type: payload.type
        }
      })

      setPosts(posts.map(post => post._id === postId ? result : post))
      setOpenReplyFor(null)
    } catch (err) {
      console.error('Failed to add comment:', err)
      setError('Failed to add comment')
    }
  }

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await apiRequest(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' })
      
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment._id !== commentId)
          }
        }
        return post
      }))
    } catch (err) {
      console.error('Failed to delete comment:', err)
      setError('Failed to delete comment')
    }
  }

  const startEditing = (post) => {
    setEditingPost(post._id)
    setEditTitle(post.title)
    setEditBody(post.body)
    setEditImageUrl(post.imageUrl || '')
    setEditTags(post.tags?.join(', ') || '')
  }

  const cancelEditing = () => {
    setEditingPost(null)
    setEditTitle('')
    setEditBody('')
    setEditImageUrl('')
    setEditTags('')
  }

  const isLiked = (post) => {
    return post.likes?.some(like => like.userId === user?._id)
  }

  const canEditPost = (post) => {
    return user && post.authorId === user._id
  }

  const canDeleteComment = (post, comment) => {
    return user && (comment.authorId === user._id || post.authorId === user._id)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 text-stone-800">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center">Loading posts...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900">Community Discussion</h1>
        <p className="mt-2 text-lg text-stone-700">Post questions and share opinions or answers.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Ask a question */}
        <div className="mt-8 rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900">Ask a question</h2>
          <form onSubmit={postQuestion} className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Title</label>
              <input 
                value={qTitle} 
                onChange={(e)=>setQTitle(e.target.value)} 
                placeholder="Summarize your question" 
                className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Details</label>
              <textarea 
                value={qBody} 
                onChange={(e)=>setQBody(e.target.value)} 
                rows={4} 
                placeholder="Provide context, what you tried, and where you're stuck" 
                className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">Image URL (optional)</label>
                <input 
                  value={qImageUrl} 
                  onChange={(e)=>setQImageUrl(e.target.value)} 
                  placeholder="https://example.com/image.jpg" 
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">Tags (comma-separated)</label>
                <input 
                  value={qTags} 
                  onChange={(e)=>setQTags(e.target.value)} 
                  placeholder="math, algebra, homework" 
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                className="rounded-lg bg-orange-600 px-5 py-2.5 text-white font-semibold hover:bg-orange-700"
              >
                Post question
              </button>
            </div>
          </form>
        </div>

        {/* Posts list */}
        <div className="mt-10 space-y-6">
          {posts.map(post => (
            <article key={post._id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <header className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {editingPost === post._id ? (
                    <div className="space-y-3">
                      <input 
                        value={editTitle} 
                        onChange={(e)=>setEditTitle(e.target.value)} 
                        className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                      <textarea 
                        value={editBody} 
                        onChange={(e)=>setEditBody(e.target.value)} 
                        rows={3}
                        className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input 
                          value={editImageUrl} 
                          onChange={(e)=>setEditImageUrl(e.target.value)} 
                          placeholder="Image URL" 
                          className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                        />
                        <input 
                          value={editTags} 
                          onChange={(e)=>setEditTags(e.target.value)} 
                          placeholder="Tags (comma-separated)" 
                          className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updatePost(post._id)}
                          className="rounded-lg bg-orange-600 px-3 py-1 text-white text-sm font-medium hover:bg-orange-700"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className="rounded-lg bg-gray-600 px-3 py-1 text-white text-sm font-medium hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-stone-900">{post.title}</h3>
                      <p className="mt-1 text-stone-700">{post.body}</p>
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt="Post image" 
                          className="mt-3 max-w-full h-auto rounded-lg"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs text-stone-800 ring-1 ring-orange-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-stone-500">
                        Posted by {post.author} • {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {canEditPost(post) && editingPost !== post._id && (
                    <>
                      <button 
                        onClick={() => startEditing(post)}
                        className="h-9 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePost(post._id)}
                        className="h-9 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => toggleLike(post._id)}
                    className={`h-9 rounded-lg px-3 py-2 text-sm font-semibold ${
                      isLiked(post) 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-white text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>
                  <button 
                    onClick={()=>setOpenReplyFor(openReplyFor === post._id ? null : post._id)} 
                    className="h-9 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100"
                  >
                    {openReplyFor === post._id ? 'Close' : 'Reply'}
                  </button>
                </div>
              </header>

              {/* Comments */}
              <div className="mt-5 space-y-3">
                {post.comments?.map(comment => (
                  <div key={comment._id} className="rounded-xl bg-orange-50 p-4 ring-1 ring-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-stone-600">
                        {comment.author} • {new Date(comment.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          comment.type === 'answer' 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-white text-orange-700 ring-1 ring-orange-300'
                        }`}>
                          {comment.type === 'answer' ? 'Answer' : 'Opinion'}
                        </span>
                        {canDeleteComment(post, comment) && (
                          <button 
                            onClick={() => deleteComment(post._id, comment._id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-stone-800">{comment.text}</p>
                  </div>
                ))}
                {(!post.comments || post.comments.length === 0) && (
                  <div className="rounded-xl bg-orange-50 p-4 ring-1 ring-orange-200 text-sm text-stone-600">
                    No comments yet. Be the first to share your opinion or answer.
                  </div>
                )}
              </div>

              {/* Reply form */}
              {openReplyFor === post._id && (
                <ReplyForm onSubmit={(data) => addComment(post._id, data)} />
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const ReplyForm = ({ onSubmit }) => {
  const [text, setText] = useState('')
  const [type, setType] = useState('opinion') // 'opinion' | 'answer'

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit({ text, type })
    setText('')
    setType('opinion')
  }

  return (
    <form onSubmit={submit} className="mt-5 rounded-2xl bg-white/90 p-4 ring-1 ring-orange-200">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700">Your comment</label>
          <textarea 
            value={text} 
            onChange={(e)=>setText(e.target.value)} 
            rows={3} 
            placeholder="Write your opinion or answer" 
            className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Type</label>
          <select 
            value={type} 
            onChange={(e)=>setType(e.target.value)} 
            className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="opinion">Opinion</option>
            <option value="answer">Answer</option>
          </select>
          <button className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">
            Post comment
          </button>
        </div>
      </div>
    </form>
  )
}

export default Discussion
