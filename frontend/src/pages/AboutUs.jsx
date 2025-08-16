import React from 'react'

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Empowering Education Through Technology
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way students learn by connecting them with expert tutors 
            through our innovative online platform, making quality education accessible to everyone.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Story</h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Founded in 2023, TutorNest emerged from a simple belief: every student deserves access to 
              exceptional educational support, regardless of their location or background.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">The Beginning</h3>
              <p className="text-stone-700 leading-relaxed mb-4">
                Our journey started when our founders, experienced educators themselves, recognized the 
                growing gap between students who could afford private tutoring and those who couldn't. 
                They saw how technology could bridge this divide and create opportunities for all learners.
              </p>
              <p className="text-stone-700 leading-relaxed">
                What began as a small platform connecting local tutors with students has grown into a 
                comprehensive educational ecosystem serving thousands of learners across multiple countries.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
                  <div className="text-sm text-stone-600">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <div className="text-sm text-stone-600">Expert Tutors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                  <div className="text-sm text-stone-600">Subjects Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                  <div className="text-sm text-stone-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Our Mission</h3>
              <p className="text-stone-700 leading-relaxed">
                To democratize quality education by providing accessible, affordable, and personalized 
                tutoring services that empower students to achieve their academic goals and unlock their 
                full potential, regardless of their geographical location or economic background.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Our Vision</h3>
              <p className="text-stone-700 leading-relaxed">
                To become the world's leading platform for personalized education, where every student 
                has access to world-class tutors and learning resources, creating a future where 
                educational excellence knows no boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the way we serve our community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Excellence</h3>
              <p className="text-stone-700">
                We maintain the highest standards in education, ensuring every tutor is thoroughly 
                vetted and every session delivers measurable results.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Accessibility</h3>
              <p className="text-stone-700">
                We believe quality education should be available to everyone, regardless of location, 
                background, or financial circumstances.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Personalization</h3>
              <p className="text-stone-700">
                Every student is unique, so we tailor our approach to individual learning styles, 
                goals, and preferences for optimal results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Our dedicated team of education professionals, technologists, and innovators work 
              together to create the best learning experience for our students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">S</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Sarah Johnson</h3>
              <p className="text-orange-600 font-semibold mb-2">CEO & Co-Founder</p>
              <p className="text-stone-700 text-sm">
                Former high school principal with 15+ years in education technology and curriculum development.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">M</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Michael Chen</h3>
              <p className="text-orange-600 font-semibold mb-2">CTO & Co-Founder</p>
              <p className="text-stone-700 text-sm">
                Software engineer with expertise in AI and machine learning, passionate about educational innovation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">D</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Dr. Emily Rodriguez</h3>
              <p className="text-orange-600 font-semibold mb-2">Head of Education</p>
              <p className="text-stone-700 text-sm">
                PhD in Educational Psychology with extensive experience in personalized learning methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">What Our Community Says</h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto">
              Hear from students, parents, and tutors about their experiences with TutorNest.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Alex Thompson</h4>
                  <p className="text-sm text-stone-600">High School Student</p>
                </div>
              </div>
              <p className="text-stone-700 italic">
                "TutorNest helped me improve my math grades from C to A in just 3 months. 
                My tutor was patient, knowledgeable, and really understood how I learn best."
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-600 font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Maria Garcia</h4>
                  <p className="text-sm text-stone-600">Parent</p>
                </div>
              </div>
              <p className="text-stone-700 italic">
                "As a working parent, I was worried about finding quality tutoring for my daughter. 
                TutorNest made it so easy and affordable. The progress tracking is amazing!"
              </p>
            </div>
          </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already transformed their academic performance 
            with our expert tutors and personalized learning approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Find Your Tutor
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Become a Tutor
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUs
