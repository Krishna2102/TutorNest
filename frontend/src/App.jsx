import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Discussion from './pages/Discussion.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Chat from './pages/Chat.jsx'
import Video from './pages/Video.jsx'
import StudentProfile from './student/Student_profile.jsx'
import TeacherProfile from './teacher/Teacher_profille.jsx'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/video" element={<Video />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
