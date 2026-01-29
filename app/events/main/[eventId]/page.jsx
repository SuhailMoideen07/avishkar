'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminEventDetailsPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/admin/event/${eventId}`)
        const data = await res.json()
        setEvent(data.event)
      } catch (err) {
        console.error('Failed to load event', err)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) fetchEvent()
  }, [eventId])

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event…
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-10 py-16 max-w-6xl mx-auto space-y-12">

        {/* EVENT HEADER */}
        <section className="space-y-3">
          <h1 className="deadpool-heading text-4xl">
            {event.title}
          </h1>
          <p className="text-white/80 max-w-3xl">
            {event.description}
          </p>
        </section>

        {/* EVENT INFO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard label="Category" value={event.eventCategory} />
          <InfoCard label="Department" value={event.department || 'Common'} />
          <InfoCard label="Type" value={event.type} />
          <InfoCard label="Team Size" value={event.type === 'team' ? event.teamSize : 'Single'} />
          <InfoCard label="Amount" value={`₹${event.amount}`} />
          <InfoCard label="Status" value={event.isActive ? 'Active' : 'Disabled'} />
        </section>

        {/* RULES */}
        <section className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="deadpool-heading text-2xl mb-3">
            Rules
          </h2>
          <ul className="list-disc list-inside space-y-1 text-white/80">
            {event.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </section>

        {/* REGISTRATIONS PLACEHOLDER */}
        <section>
          <h2 className="deadpool-heading text-3xl mb-4">
            Registered Participants
          </h2>

          <div className="border border-white/20 rounded-xl p-6 bg-black/40 backdrop-blur-md text-white/60">
            Registrations table will appear here.
            <br />
            (Enter college / Participated actions later)
          </div>
        </section>

      </div>
    </div>
  )
}

/* =========================
   SMALL COMPONENT
   ========================= */
function InfoCard({ label, value }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
