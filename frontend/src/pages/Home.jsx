import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-orange-50 text-stone-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 ring-1 ring-orange-200">Learn smarter, not harder</span>
            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900">
              Find your perfect <span className="text-orange-600">Tutor</span> for any subject
            </h1>
            <p className="mt-4 text-lg text-stone-700 max-w-xl">
              1-on-1 online lessons with vetted tutors. Flexible scheduling, transparent pricing, and results you can measure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#get-started" className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Get started
              </a>
              <a href="#browse" className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold text-orange-700 bg-white ring-1 ring-orange-200 hover:bg-orange-100">
                Browse tutors
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-bold text-stone-900">3k+</p>
                <p className="text-sm text-stone-600">Expert tutors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">25k+</p>
                <p className="text-sm text-stone-600">Lessons delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">4.9/5</p>
                <p className="text-sm text-stone-600">Avg. rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-md">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-orange-200 via-orange-100 to-orange-300 p-1 shadow-xl ring-1 ring-orange-300/40">
                <div className="h-full w-full rounded-[22px] bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🧑‍🏫</div>
                    <p className="text-stone-700">Interactive whiteboard, live chat, and file sharing inside your lesson.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="browse" className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Popular subjects</h2>
          <a className="text-sm font-semibold text-orange-700 hover:text-orange-800" href="#">View all</a>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: '📐', label: 'Math' },
            { icon: '🔬', label: 'Science' },
            { icon: '💻', label: 'Programming' },
            { icon: '🗣️', label: 'English' },
            { icon: '🌎', label: 'Geography' },
            { icon: '🎨', label: 'Arts' },
          ].map(({ icon, label }) => (
            <div key={label} className="group rounded-xl bg-white/70 ring-1 ring-orange-200/60 hover:ring-orange-300 transition p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-semibold text-stone-800">{label}</div>
              <div className="text-xs text-stone-500 mt-1">Find {label} tutors</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/70 ring-1 ring-orange-200/60">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Tell us your goals',
                text: 'Answer a few quick questions to help us personalize your matches.'
              },
              {
                step: '2',
                title: 'Pick a tutor',
                text: 'Compare ratings, prices, and availability to choose the right fit.'
              },
              {
                step: '3',
                title: 'Start learning',
                text: 'Meet online and track progress with shared notes and homework.'
              },
            ].map(({ step, title, text }) => (
              <div key={step} className="relative rounded-2xl bg-orange-50 p-6 ring-1 ring-orange-200">
                <div className="absolute -top-3 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white text-sm font-bold shadow">
                  {step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">{title}</h3>
                <p className="mt-2 text-stone-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-orange-100 to-white p-8 ring-1 ring-orange-200">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'My daughter jumped two grade levels in math within a term.',
                name: 'Aisha, Parent'
              },
              {
                quote: 'Scheduling is easy and the tutors are top-notch.',
                name: 'Daniel, Student'
              },
              {
                quote: 'Transparent pricing and real progress reports I can trust.',
                name: 'Rina, Parent'
              },
            ].map(({ quote, name }) => (
              <div key={name} className="rounded-2xl bg-white/70 p-6 ring-1 ring-orange-200">
                <div className="text-4xl text-orange-400">“</div>
                <p className="mt-2 text-stone-800">{quote}</p>
                <p className="mt-4 text-sm font-medium text-stone-600">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 md:p-10 text-white shadow-xl">
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold">Ready to boost your grades?</h3>
              <p className="mt-2 text-orange-50/90">
                Join thousands of learners achieving more with personalized 1-on-1 tutoring.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#" className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-orange-700 font-semibold shadow-sm hover:bg-orange-50">
                  Create a free account
                </a>
                <a href="#" className="inline-flex items-center justify-center rounded-lg ring-1 ring-white/70 px-5 py-3 text-white font-semibold hover:bg-white/10">
                  Talk to an advisor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home