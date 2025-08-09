import React from 'react'

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-orange-50 text-stone-800">
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900">About Tutorly</h1>
        <p className="mt-4 text-lg text-stone-700">We connect learners with expert tutors for personalized 1-on-1 sessions online.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/70 ring-1 ring-orange-200 p-6">
            <h3 className="text-lg font-semibold text-stone-900">Our Mission</h3>
            <p className="mt-2 text-stone-700">Make high-quality tutoring accessible, affordable, and effective for everyone.</p>
          </div>
          <div className="rounded-2xl bg-white/70 ring-1 ring-orange-200 p-6">
            <h3 className="text-lg font-semibold text-stone-900">Our Tutors</h3>
            <p className="mt-2 text-stone-700">Vetted experts with proven track records across subjects and grade levels.</p>
          </div>
          <div className="rounded-2xl bg-white/70 ring-1 ring-orange-200 p-6">
            <h3 className="text-lg font-semibold text-stone-900">Our Approach</h3>
            <p className="mt-2 text-stone-700">Goal-oriented plans, progress tracking, and constant feedback loops.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUs
