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
  const [meetLink, setMeetLink] = useState('');

  // Get current user from localStorage
  const userRaw = localStorage.getItem('user');
  const currentUser = userRaw ? JSON.parse(userRaw) : null;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchChatsAndNames = async () => {
      try {
        console.log('Fetching chats for user:', currentUserId);
        const data = await apiRequest('/chat/all');
        console.log('Chats data:', data);
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
        console.log('Contact IDs to fetch:', idsArr);
        
        const names = await Promise.all(idsArr.map(async (id) => {
          try {
            console.log(`Fetching user info for ID: ${id}`);
            const response = await apiRequest(`/chat/user/${id}`);
            console.log(`User info response for ${id}:`, response);
            
            if (response && response.success && response.user && response.user.fullName) {
              return { id, name: response.user.fullName };
            }
          } catch (error) {
            console.error(`Failed to fetch user info for ${id}:`, error);
          }
          // Fallback
          return { id, name: 'Unknown User' };
        }));
        
        console.log('Fetched names:', names);
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
        console.error('Error fetching chats:', err);
        // You could show a toast notification here
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
      console.error('Error sending message:', err);
      // You could show a toast notification here
    }
  };

  // Generate Google Meet link (for teachers)
  const generateMeetLink = () => {
    const randomMeetId = Math.random().toString(36).substring(2, 15);
    const meetUrl = `https://meet.google.com/${randomMeetId}`;
    setMeetLink(meetUrl);
    
    // Send the meet link as a message
    const sendMeetLink = async () => {
      try {
        const newMsg = await apiRequest('/chat/send', {
          method: 'POST',
          body: {
            sender: currentUserId,
            receiver: activeContact,
            message: `🎥 Join Google Meet: ${meetUrl}`,
          },
        });
        setChats(prev => [...prev, newMsg]);
      } catch (err) {
        console.error('Error sending meet link:', err);
      }
    };
    sendMeetLink();
  };

  // Handle payment (for students)
  const handlePayment = async () => {
    try {
      // This is a simple implementation - you'd integrate with actual payment gateway
      const amount = 100; // Example amount
      const confirmed = window.confirm(`Pay ₹${amount} to this teacher?`);
      
      if (confirmed) {
        // Here you would integrate with payment gateway like Razorpay/Stripe
        alert('Payment successful! You can now access premium features.');
        
        // Send payment confirmation message
        const newMsg = await apiRequest('/chat/send', {
          method: 'POST',
          body: {
            sender: currentUserId,
            receiver: activeContact,
            message: `💰 Payment of ₹${amount} completed successfully!`,
          },
        });
        setChats(prev => [...prev, newMsg]);
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-white to-orange-100 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Contacts Sidebar */}
        <aside className="md:col-span-1 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl ring-1 ring-orange-200/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-200/50 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              💬 <span>Conversations</span>
            </h2>
            <p className="text-orange-100 text-sm mt-1">{contacts.length} active chats</p>
          </div>
          <ul className="divide-y divide-orange-100/30 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {contacts.map(c => (
              <li key={c.id}>
                <button 
                  onClick={()=>setActiveContact(c.id)} 
                  className={`w-full text-left px-5 py-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 transition-all duration-200 ${
                    activeContact === c.id 
                      ? 'bg-gradient-to-r from-orange-100 to-orange-200/50 border-r-4 border-orange-500' 
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(c.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate">{c.name || 'Unknown User'}</p>
                      <p className="text-sm text-stone-500 truncate">{c.lastMessage || 'No messages yet'}</p>
                    </div>
                    {activeContact === c.id && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chatbox */}
        <section className="md:col-span-2 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl ring-1 ring-orange-200/50 flex flex-col">
          <div className="px-6 py-4 border-b border-orange-200/50 bg-gradient-to-r from-stone-50 to-orange-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeContact && (
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {(contacts.find(c => c.id === activeContact)?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-bold text-stone-900">
                  {activeContact ?
                    (contacts.find(c => c.id === activeContact)?.name || 'Unknown User')
                    : 'Select a conversation'}
                </h3>
                {activeContact && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                )}
              </div>
            </div>
            {/* Action buttons based on user role */}
            {activeContact && (
              <div className="flex gap-3">
                {currentUser?.role === 'teacher' ? (
                  <button
                    onClick={generateMeetLink}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                  >
                    <span>📹</span> Create Meet
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                  >
                    <span>💰</span> Pay Teacher
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-stone-50/50 to-orange-50/30">
            {activeContact ? (
              [...messages].sort((a, b) => new Date(a.createdAt || a.time) - new Date(b.createdAt || b.time)).map(m => (
                <div key={m._id || m.id} className={`flex ${m.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                    m.sender === currentUserId 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md' 
                      : 'bg-white text-stone-800 border border-orange-100 rounded-bl-md'
                  }`}>
                    <p className="leading-relaxed">{m.message}</p>
                    <p className={`text-xs mt-1 ${m.sender === currentUserId ? 'text-orange-100' : 'text-stone-400'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-stone-700 mb-2">No conversation selected</h3>
                  <p className="text-stone-500">Choose a conversation from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
          {activeContact && (
            <form onSubmit={send} className="p-4 border-t border-orange-200/50 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full rounded-2xl border border-orange-200 bg-stone-50 px-4 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-sm"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-stone-400 hover:text-orange-500 transition-colors">
                    😊
                  </button>
                </div>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Chat
