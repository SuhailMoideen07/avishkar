'use client'

import Link from 'next/link'

export default function EventsPage() {
  return (
    <main className="min-h-[100dvh] w-full flex flex-col md:flex-row bg-black text-white">

      {/* MAIN EVENTS */}
      <div
        className="w-full md:w-1/2 min-h-[50dvh] md:min-h-[100dvh] relative flex items-end justify-center 
                   border-b md:border-b-0 md:border-r border-white/10
                   bg-no-repeat bg-center bg-cover md:bg-[length:95%]"
        style={{ backgroundImage: "url('/events/main-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" style={{ zIndex: 1 }} />

        <div className="relative w-full px-6 md:px-10 pb-12 md:pb-16 text-center space-y-3 md:space-y-4" style={{ zIndex: 2 }}>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Main Events
          </h2>

          <p className="text-yellow-400/80 max-w-sm mx-auto text-sm md:text-base">
            Flagship events, competitions and keynote sessions
          </p>

          <div>
            <Link 
              href="/events/main"
              className="
                inline-block
                mt-2
                px-8 md:px-10 py-2.5 md:py-3 rounded-full
                border border-white/30
                font-medium text-sm md:text-base
                transition-all duration-300
                hover:-translate-y-2
                hover:scale-105
                hover:border-yellow-400
                hover:text-yellow-400
                hover:shadow-[0_0_40px_rgba(255,200,0,0.5)]
                active:scale-95
              "
            >
              Explore →
            </Link>
          </div>
        </div>
      </div>

      {/* DEPARTMENT EVENTS */}
      <div
        className="w-full md:w-1/2 min-h-[50dvh] md:min-h-[100dvh] relative flex items-end justify-center 
                   bg-cover bg-center brightness-105 saturate-110"
        style={{ backgroundImage: "url('/events/dept-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" style={{ zIndex: 1 }} />

        <div className="relative w-full px-6 md:px-10 pb-12 md:pb-16 text-center space-y-3 md:space-y-4" style={{ zIndex: 2 }}>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Department Events
          </h2>

          <p className="text-yellow-400/80 max-w-sm mx-auto text-sm md:text-base">
            Explore events organized by individual departments
          </p>
          
          <div>
            <Link 
              href="/events/dept"
              className="
                inline-block
                mt-2
                px-8 md:px-10 py-2.5 md:py-3 rounded-full
                border border-white/30
                font-medium text-sm md:text-base
                transition-all duration-300
                hover:-translate-y-2
                hover:scale-105
                hover:border-yellow-400
                hover:text-yellow-400
                hover:shadow-[0_0_40px_rgba(255,200,0,0.5)]
                active:scale-95
              "
            >
              Choose Department →
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}