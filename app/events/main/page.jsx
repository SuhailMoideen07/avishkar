'use client'

import Link from 'next/link'
import Image from 'next/image'

const MainEventsPage = () => {
  return (
    <main
      className="
        min-h-[100dvh] w-full flex flex-col md:flex-row
        text-white relative bg-cover bg-center
        pt-20 md:pt-0
      "
      style={{ backgroundImage: "url('/events/comic-bg.png')" }}
    >
      {/* ================= VOICE OF AVISHKAR ================= */}
      <div className="w-full md:w-1/2 min-h-[50dvh] md:min-h-[100dvh] flex items-end justify-center">
        <div className="w-full px-6 md:px-10 pb-12 md:pb-16 text-center space-y-4">

          <Link href="/events/main/voice-of-avishkar" className="group mx-auto w-fit block">
            <div
              className="
                relative w-[220px] md:w-[260px] aspect-[3/4]
                transition-transform duration-300
                group-hover:-translate-y-2
              "
            >
              <Image
                src="/events/voice-of-avishkar.png"
                alt="Voice of Avishkar"
                fill
                className="
                  object-contain
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:drop-shadow-[0_0_50px_rgba(220,38,38,0.7)]
                "
                priority
              />
            </div>
          </Link>

          <h2 className="deadpool-heading text-4xl md:text-5xl">
            Voice of Avishkar
          </h2>

          <div className="pt-1">
            <Link href="/events/main/voice-of-avishkar">
              <span
                className="
                  inline-block px-8 md:px-10 py-2.5 md:py-3 rounded-full
                  border border-white/30
                  font-medium text-sm md:text-base
                  transition-all duration-300
                  hover:border-red-500
                  hover:text-red-400
                  hover:shadow-[0_0_30px_rgba(220,38,38,0.75)]
                  active:scale-95
                "
              >
                Register →
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= TREASURE HUNT ================= */}
      <div className="w-full md:w-1/2 min-h-[50dvh] md:min-h-[100dvh] flex items-end justify-center">
        <div className="w-full px-6 md:px-10 pb-12 md:pb-16 text-center space-y-4">

          <Link href="/events/main/treasure-hunt" className="group mx-auto w-fit block">
            <div
              className="
                relative w-[220px] md:w-[260px] aspect-[3/4]
                transition-transform duration-300
                group-hover:-translate-y-2
              "
            >
              <Image
                src="/events/treasure-hunt.png"
                alt="Treasure Hunt"
                fill
                className="
                  object-contain
                  transition-all duration-300
                  group-hover:scale-105
                  group-hover:drop-shadow-[0_0_50px_rgba(220,38,38,0.7)]
                "
                priority
              />
            </div>
          </Link>

          <h2 className="deadpool-heading text-4xl md:text-5xl">
            Treasure Hunt
          </h2>

          <div className="pt-1">
            <Link href="/events/main/treasure-hunt">
              <span
                className="
                  inline-block px-8 md:px-10 py-2.5 md:py-3 rounded-full
                  border border-white/30
                  font-medium text-sm md:text-base
                  transition-all duration-300
                  hover:border-red-500
                  hover:text-red-400
                  hover:shadow-[0_0_30px_rgba(220,38,38,0.75)]
                  active:scale-95
                "
              >
              Register →
              </span>
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}

export default MainEventsPage
