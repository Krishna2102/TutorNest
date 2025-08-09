import React, { useState } from 'react'

const Video = () => {
  const [roomCode, setRoomCode] = useState('')
  const [joined, setJoined] = useState(false)

  const joinRoom = (e) => {
    e.preventDefault()
    if (!roomCode.trim()) return
    setJoined(true)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        {/* Video Area */}
        <section className="md:col-span-2 rounded-2xl bg-white/80 ring-1 ring-orange-200 p-4">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-orange-200 via-orange-100 to-orange-300 ring-1 ring-orange-300/40 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">🎥</div>
              <p className="text-stone-700">{joined ? 'Connected to room' : 'Join a room to start your session'}</p>
            </div>
          </div>
          {!joined && (
            <form onSubmit={joinRoom} className="mt-4 flex gap-2">
              <input value={roomCode} onChange={(e)=>setRoomCode(e.target.value)} placeholder="Enter room code" className="flex-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" />
              <button className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700">Join</button>
            </form>
          )}
        </section>

        {/* Participants / Controls */}
        <aside className="rounded-2xl bg-white/80 ring-1 ring-orange-200 p-4">
          <h2 className="text-sm font-semibold text-stone-900">Participants</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            <li className="rounded-lg bg-orange-50 px-3 py-2">You</li>
            {joined && <li className="rounded-lg bg-orange-50 px-3 py-2">Tutor</li>}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <button className="rounded-lg bg-white px-3 py-2 ring-1 ring-orange-200 hover:bg-orange-100">Mute</button>
            <button className="rounded-lg bg-white px-3 py-2 ring-1 ring-orange-200 hover:bg-orange-100">Stop</button>
            <button className="rounded-lg bg-orange-600 px-3 py-2 text-white hover:bg-orange-700">{joined ? 'Leave' : 'Start'}</button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Video
