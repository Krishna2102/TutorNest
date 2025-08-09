import React, { useMemo, useState } from 'react'

const Chat = () => {
  const contacts = useMemo(() => ([
    { id: 't1', name: 'Ms. Amina (Math)', last: 'See you at 5 PM', unread: 2 },
    { id: 't2', name: 'Mr. Daniel (Physics)', last: 'Upload your worksheet', unread: 0 },
    { id: 't3', name: 'Dr. Kim (English)', last: 'Great progress today!', unread: 0 },
  ]), [])

  const [activeId, setActiveId] = useState(contacts[0]?.id || null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, from: 'tutor', text: 'Hi! Ready for today’s session?' },
    { id: 2, from: 'me', text: 'Yes, I am.' },
  ])

  const active = contacts.find(c => c.id === activeId)

  const send = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: message.trim() }])
    setMessage('')
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts */}
        <aside className="md:col-span-1 rounded-2xl bg-white/80 ring-1 ring-orange-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-orange-200 bg-orange-100/60">
            <h2 className="text-sm font-semibold text-stone-900">Chats</h2>
          </div>
          <ul className="divide-y divide-orange-100">
            {contacts.map(c => (
              <li key={c.id}>
                <button onClick={()=>setActiveId(c.id)} className={`w-full text-left px-4 py-3 hover:bg-orange-50 ${activeId === c.id ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-stone-900 line-clamp-1">{c.name}</p>
                    {c.unread > 0 && <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-orange-600 px-2 text-xs text-white">{c.unread}</span>}
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-1">{c.last}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Messages */}
        <section className="md:col-span-2 rounded-2xl bg-white/80 ring-1 ring-orange-200 flex flex-col">
          <div className="px-5 py-3 border-b border-orange-200 flex items-center justify-between bg-orange-100/60">
            <div className="font-semibold text-stone-900">{active?.name || 'Select a chat'}</div>
            <div className="text-xs text-stone-600">Demo chat</div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.from === 'me' ? 'ml-auto bg-orange-600 text-white' : 'bg-orange-100 text-stone-800'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="p-4 border-t border-orange-200 flex items-center gap-2">
            <input
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">Send</button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default Chat
