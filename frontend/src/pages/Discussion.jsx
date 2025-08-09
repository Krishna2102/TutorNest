import React, { useMemo, useState } from 'react'

const Discussion = () => {
  const initialQuestions = useMemo(() => ([
    {
      id: 'q1',
      title: 'How do I factor quadratic equations quickly?',
      body: 'Looking for tips or tricks to factor quadratics without trial-and-error every time.',
      author: 'Aisha',
      createdAt: new Date().toISOString(),
      comments: [
        { id: 'c1', author: 'Ms. Amina', text: 'Use the AC method and look for pairs that multiply to AC and add to B.', type: 'answer', createdAt: new Date().toISOString() },
        { id: 'c2', author: 'Daniel', text: 'Practice with perfect square trinomials first; patterns become obvious.', type: 'opinion', createdAt: new Date().toISOString() },
      ],
    },
  ]), [])

  const [questions, setQuestions] = useState(initialQuestions)

  // New question form state
  const [qTitle, setQTitle] = useState('')
  const [qBody, setQBody] = useState('')
  const [qAuthor, setQAuthor] = useState('')

  // Toggle for showing reply forms per question
  const [openReplyFor, setOpenReplyFor] = useState(null)

  const postQuestion = (e) => {
    e.preventDefault()
    if (!qTitle.trim() || !qBody.trim()) return

    const newQuestion = {
      id: `q_${Date.now()}`,
      title: qTitle.trim(),
      body: qBody.trim(),
      author: qAuthor.trim() || 'Anonymous',
      createdAt: new Date().toISOString(),
      comments: [],
    }
    setQuestions([newQuestion, ...questions])
    setQTitle('')
    setQBody('')
    setQAuthor('')
  }

  const addComment = (questionId, payload) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const newComment = {
        id: `c_${Date.now()}`,
        author: payload.author?.trim() || 'Anonymous',
        text: payload.text.trim(),
        type: payload.type, // 'opinion' | 'answer'
        createdAt: new Date().toISOString(),
      }
      return { ...q, comments: [...q.comments, newComment] }
    }))
  }

  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900">Community Discussion</h1>
        <p className="mt-2 text-lg text-stone-700">Post questions and share opinions or answers.</p>

        {/* Ask a question */}
        <div className="mt-8 rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900">Ask a question</h2>
          <form onSubmit={postQuestion} className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Title</label>
              <input value={qTitle} onChange={(e)=>setQTitle(e.target.value)} placeholder="Summarize your question" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">Details</label>
              <textarea value={qBody} onChange={(e)=>setQBody(e.target.value)} rows={4} placeholder="Provide context, what you tried, and where you’re stuck" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">Your name (optional)</label>
                <input value={qAuthor} onChange={(e)=>setQAuthor(e.target.value)} placeholder="e.g., Aisha" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="pt-6 md:pt-6">
                <button type="submit" className="w-full md:w-auto rounded-lg bg-orange-600 px-5 py-2.5 text-white font-semibold hover:bg-orange-700">Post question</button>
              </div>
            </div>
          </form>
        </div>

        {/* Questions list */}
        <div className="mt-10 space-y-6">
          {questions.map(q => (
            <article key={q.id} className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-6">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{q.title}</h3>
                  <p className="mt-1 text-stone-700">{q.body}</p>
                  <p className="mt-2 text-xs text-stone-500">Asked by {q.author} • {new Date(q.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={()=>setOpenReplyFor(openReplyFor === q.id ? null : q.id)} className="h-9 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100">
                  {openReplyFor === q.id ? 'Close' : 'Reply'}
                </button>
              </header>

              {/* Comments */}
              <div className="mt-5 space-y-3">
                {q.comments.map(c => (
                  <div key={c.id} className="rounded-xl bg-orange-50 p-4 ring-1 ring-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-stone-600">{c.author} • {new Date(c.createdAt).toLocaleString()}</div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${c.type === 'answer' ? 'bg-orange-600 text-white' : 'bg-white text-orange-700 ring-1 ring-orange-300'}`}>
                        {c.type === 'answer' ? 'Answer' : 'Opinion'}
                      </span>
                    </div>
                    <p className="mt-2 text-stone-800">{c.text}</p>
                  </div>
                ))}
                {q.comments.length === 0 && (
                  <div className="rounded-xl bg-orange-50 p-4 ring-1 ring-orange-200 text-sm text-stone-600">No comments yet. Be the first to share your opinion or answer.</div>
                )}
              </div>

              {/* Reply form */}
              {openReplyFor === q.id && (
                <ReplyForm onSubmit={(data) => { addComment(q.id, data); setOpenReplyFor(null) }} />
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const ReplyForm = ({ onSubmit }) => {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [type, setType] = useState('opinion') // 'opinion' | 'answer'

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit({ author, text, type })
    setAuthor('')
    setText('')
    setType('opinion')
  }

  return (
    <form onSubmit={submit} className="mt-5 rounded-2xl bg-white/90 p-4 ring-1 ring-orange-200">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700">Your comment</label>
          <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} placeholder="Write your opinion or answer" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Type</label>
          <select value={type} onChange={(e)=>setType(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
            <option value="opinion">Opinion</option>
            <option value="answer">Answer</option>
          </select>
          <label className="block mt-3 text-sm font-medium text-stone-700">Your name (optional)</label>
          <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="e.g., Rina" className="mt-1 w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
          <button className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">Post comment</button>
        </div>
      </div>
    </form>
  )
}

export default Discussion
