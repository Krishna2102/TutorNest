import React, { useState, useEffect } from 'react'
import { apiRequest } from '../lib/api'
import { useLocation } from 'react-router-dom'


const Chat = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const teacherParam = params.get('teacher');

  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Get current user from localStorage
  const userRaw = localStorage.getItem('user');
  const currentUser = userRaw ? JSON.parse(userRaw) : null;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchChatsAndNames = async () => {
      try {
        const data = await apiRequest('/chat/all');
        setChats(data);
        // Find unique contacts (other party in each chat)
        const contactMap = {};
        const contactIds = new Set();
        data.forEach(chat => {
          const otherId = chat.sender === currentUserId ? chat.receiver : chat.sender;
          contactIds.add(otherId);
          if (!contactMap[otherId]) {
            contactMap[otherId] = {
              id: otherId,
              lastMessage: chat.message,
              lastTime: chat.createdAt,
              name: '',
            };
          }
        });
        // If teacherParam exists and not in contacts, add it
        if (teacherParam && !contactMap[teacherParam]) {
          contactMap[teacherParam] = {
            id: teacherParam,
            lastMessage: '',
            lastTime: '',
            name: '',
          };
          contactIds.add(teacherParam);
        }
        // Fetch names for contacts
        const idsArr = Array.from(contactIds);
        const names = await Promise.all(idsArr.map(async (id) => {
          // Try public students endpoint first (avoids /api/student auth middleware)
          try {
            const student = await apiRequest(`/students/${id}`);
            if (student && student.fullName) {
              return { id, name: student.fullName };
            }
          } catch {}
          // Try teacher
          try {
            const teacher = await apiRequest(`/teachers/${id}`);
            if (teacher && teacher.fullName) {
              return { id, name: teacher.fullName };
            }
          } catch {}
          // Fallback
          return { id, name: 'Unknown User' };
        }));
        names.forEach(({ id, name }) => {
          if (contactMap[id]) contactMap[id].name = name;
        });
        setContacts(Object.values(contactMap));
        // Set active contact from teacherParam or first contact
        if (teacherParam) {
          setActiveContact(teacherParam);
        } else if (Object.values(contactMap).length > 0) {
          setActiveContact(Object.values(contactMap)[0].id);
        }
      } catch (err) {
        // handle error
      }
    };
    fetchChatsAndNames();
  }, [currentUserId, teacherParam]);

  useEffect(() => {
    // Filter messages for active contact
    if (!activeContact) {
      setMessages([]);
      return;
    }
    const filtered = chats.filter(chat =>
      (chat.sender === currentUserId && chat.receiver === activeContact) ||
      (chat.receiver === currentUserId && chat.sender === activeContact)
    );
    setMessages(filtered);
  }, [activeContact, chats, currentUserId]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeContact) return;
    try {
      // Store message in DB
      const newMsg = await apiRequest('/chat/send', {
        method: 'POST',
        body: {
          sender: currentUserId,
          receiver: activeContact,
          message: message.trim(),
        },
      });
      setChats(prev => [...prev, newMsg]);
      setMessage('');
    } catch (err) {
      // handle error
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-orange-50 text-stone-800">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contacts Sidebar */}
        <aside className="md:col-span-1 rounded-2xl bg-white/80 ring-1 ring-orange-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-orange-200 bg-orange-100/60">
            <h2 className="text-sm font-semibold text-stone-900">Chats</h2>
          </div>
          <ul className="divide-y divide-orange-100">
            {contacts.map(c => (
              <li key={c.id}>
                <button onClick={()=>setActiveContact(c.id)} className={`w-full text-left px-4 py-3 hover:bg-orange-50 ${activeContact === c.id ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-stone-900 line-clamp-1">{c.name !== c.id ? c.name : 'Unknown User'}</p>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-1">{c.lastMessage}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chatbox */}
        <section className="md:col-span-2 rounded-2xl bg-white/80 ring-1 ring-orange-200 flex flex-col">
          <div className="px-5 py-3 border-b border-orange-200 flex items-center justify-between bg-orange-100/60">
            <div className="font-semibold text-stone-900">
                {activeContact ?
                  (contacts.find(c => c.id === activeContact)?.name || 'Unknown User')
                  : 'Select a chat'}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(m => (
              <div key={m._id || m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.sender === currentUserId ? 'ml-auto bg-orange-600 text-white' : 'bg-orange-100 text-stone-800'}`}>
                {m.message}
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
  );
}

export default Chat
