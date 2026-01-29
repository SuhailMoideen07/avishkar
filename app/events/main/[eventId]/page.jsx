'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const EventRegisterPage = () => {
  const { eventId } = useParams()
  const router = useRouter()

  // 🔗 These will come from backend later using eventId
  const backendEventId = null // TODO
  const eventMeta = {
    name: 'Voice of Avishkar',
    description:
      'Show your talent and voice in front of the crowd. Compete with the best and win exciting prizes.',
    rules: [
      'Each participant gets 3 minutes.',
      'No abusive language allowed.',
      'Judges’ decision will be final.',
    ],
  }

  const upiDetails = {
    upiId: 'avishkar@upi',
    amount: 199,
    description: 'Main Event Registration',
  }

  const [form, setForm] = useState({
    name: '',
    age: '',
    phone: '',
    college: '',
    participantDepartment: '',
    participantType: '',
    semester: '',
    schoolClass: '',
    teamMembers: [''], // first member mandatory
    paymentScreenshot: null,
  })

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleTeamChange = (i, value) => {
    const arr = [...form.teamMembers]
    arr[i] = value
    setForm(prev => ({ ...prev, teamMembers: arr }))
  }

  const addTeamMember = () => {
    setForm(prev => ({ ...prev, teamMembers: [...prev.teamMembers, ''] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      eventId: backendEventId,
      slug: eventId,
      ...form,
    }

    console.log('Submitting:', payload)
    router.push('/events/my-registrations')
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/events/comic-bg2.png')" }}
      />
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 min-h-screen text-white flex justify-center px-4 py-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 space-y-5"
        >
          {/* EVENT META */}
          <div className="text-center space-y-2">
            <h1 className="deadpool-heading text-3xl">
              {eventMeta.name}
            </h1>
            <p className="text-sm text-white/80">
              {eventMeta.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/20">
            <p className="text-sm font-semibold mb-2 text-red-400">Rules</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
              {eventMeta.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* FORM */}
          <Field label="Full Name" onChange={v => handleChange('name', v)} />
          <Field label="Age" type="number" onChange={v => handleChange('age', v)} />
          <Field label="Phone" onChange={v => handleChange('phone', v)} />

          {/* Participant Type FIRST */}
          <div className="space-y-1">
            <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
              Participant Type
            </label>
            <select
              required
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-black/60
                border border-white/30
                text-base text-white
                shadow-inner
                focus:outline-none
                focus:border-red-500
                focus:ring-2 focus:ring-red-500/40
              "
              onChange={(e) => handleChange('participantType', e.target.value)}
            >
              <option value="">Select</option>
              <option value="college">College</option>
              <option value="school">School</option>
            </select>
          </div>

          {/* College / School Name */}
          <Field label="College / School Name" onChange={v => handleChange('college', v)} />

          {/* Department only for College */}
          {form.participantType === 'college' && (
            <Field
              label="Department"
              onChange={v => handleChange('participantDepartment', v)}
            />
          )}

          {form.participantType === 'college' && (
            <div className="p-3 rounded-lg border border-blue-400/40 bg-blue-500/10">
              <Field label="Semester" onChange={v => handleChange('semester', v)} />
            </div>
          )}

          {form.participantType === 'school' && (
            <div className="p-3 rounded-lg border border-green-400/40 bg-green-500/10">
              <Field label="Class" onChange={v => handleChange('schoolClass', v)} />
            </div>
          )}

          {/* Team */}
          <div className="space-y-1">
            <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
              Team Members
            </label>

            {form.teamMembers.map((m, i) => (
              <input
                key={i}
                required={i === 0} // Only first member is mandatory
                className="
                  w-full mb-2 px-4 py-2.5 rounded-lg
                  bg-black/60
                  border border-white/30
                  text-base text-white
                  shadow-inner
                  focus:outline-none
                  focus:border-red-500
                  focus:ring-2 focus:ring-red-500/40
                "
                placeholder={
                  i === 0 ? 'Member 1 (Required)' : `Member ${i + 1} (Optional)`
                }
                onChange={(e) => handleTeamChange(i, e.target.value)}
              />
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="text-xs text-red-400 mt-1"
            >
              + Add member
            </button>
          </div>

          {/* PAYMENT BLOCK */}
          <div className="p-4 rounded-xl border border-red-500/40 bg-black/50">
            <p className="text-sm text-white/80">Pay using UPI</p>
            <p className="text-lg text-red-400">{upiDetails.upiId}</p>
            <p className="text-sm">Amount: ₹{upiDetails.amount}</p>
            <p className="text-xs text-white/60">{upiDetails.description}</p>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
              Upload Payment Screenshot
            </label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="screenshot"
                className="
                  cursor-pointer px-3 py-1.5 rounded-md
                  text-sm
                  border border-white/30
                  bg-black/60
                  hover:border-red-500 hover:text-red-400
                  transition-all
                "
              >
                Choose File
              </label>

              <span className="text-xs text-white/70">
                {form.paymentScreenshot
                  ? form.paymentScreenshot.name
                  : 'No file selected'}
              </span>
            </div>

            <input
              id="screenshot"
              type="file"
              className="hidden"
              onChange={(e) =>
                handleChange('paymentScreenshot', e.target.files?.[0] || null)
              }
            />
          </div>

          <button
            type="submit"
            disabled={!form.paymentScreenshot}
            className={`
              w-full mt-4 py-2.5 rounded-full
              border border-white/30
              transition-all
              ${
                form.paymentScreenshot
                  ? 'hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_25px_rgba(220,38,38,0.75)]'
                  : 'opacity-40 cursor-not-allowed'
              }
            `}
          >
            Submit & Generate Code
          </button>
        </form>
      </div>
    </div>
  )
}

const Field = ({ label, type = 'text', onChange }) => (
  <div className="space-y-1">
    <label className="block text-base font-semibold tracking-wide text-white/90 drop-shadow">
      {label}
    </label>
    <input
      required
      type={type}
      className="
        w-full px-4 py-2.5 rounded-lg
        bg-black/60
        border border-white/30
        text-base text-white
        placeholder-white/40
        shadow-inner
        focus:outline-none
        focus:border-red-500
        focus:ring-2 focus:ring-red-500/40
      "
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

export default EventRegisterPage
