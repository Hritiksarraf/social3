'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useSupabase } from '@lib/supabase/SupabaseProvider'
import { uploadToCloudinary } from '@lib/uploadToCloudinary'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthShell from './AuthShell'
import FormField from '@components/ui/FormField'
import Button from '@components/ui/Button'
import { CLUBS, CLUB_KEYS } from '@components/ui/ClubBadge'

function CompleteProfileForm() {
  const { supabase, user } = useSupabase()
  const ensureUser = useMutation(api.users.ensureUser)
  const getOrCreateCollege = useMutation(api.colleges.getOrCreate)
  const addRadioStation = useMutation(api.colleges.addRadioStation)

  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [collage, setCollage] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [homeClub, setHomeClub] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetch('http://universities.hipolabs.com/search')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then((data) => {
        setColleges(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching colleges:', error)
        setLoading(false)
      })
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await getOrCreateCollege({ name: collage })

      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(collage)}&format=json`
      )
      const locationData = await locationResponse.json()
      if (locationData.length > 0) {
        await addRadioStation({
          collegeName: collage,
          name: username,
          lat: parseFloat(locationData[0].lat),
          lng: parseFloat(locationData[0].lon),
        })
      }

      let profilePhoto
      if (avatarFile) {
        profilePhoto = await uploadToCloudinary(avatarFile, 'image')
      }

      await ensureUser({
        supabaseUserId: user.id,
        email: user.email,
        firstName: firstname,
        lastName: lastname,
        userName: username,
        collageName: collage,
        pinCode: parseInt(pincode, 10),
        address,
        profilePhoto,
        homeClub: homeClub || undefined,
      })

      toast.success('Profile completed', { position: 'top-left', autoClose: 3000 })
    } catch (error) {
      console.error(error)
      toast.error('Failed to complete profile: ' + error.message, {
        position: 'top-left',
        autoClose: 5000,
      })
      setSubmitting(false)
    }
  }

  return (
    <>
      <AuthShell eyebrow="Last step" title={<>Make it<br />yours.</>}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-10">
          <div className="flex justify-center mb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full flex items-center justify-center relative"
              style={{
                background: avatarPreview
                  ? undefined
                  : 'linear-gradient(135deg, #34303E, #241F30)',
                border: avatarPreview ? 'none' : '2px dashed rgba(255,255,255,0.2)',
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-3xl">📷</span>
              )}
              <span
                className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full flex items-center justify-center text-lg font-extrabold border-[3px] border-surface-1"
                style={{ background: 'linear-gradient(135deg, #7857FF, #FF0073)' }}
              >
                +
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <FormField
              label="Last name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <FormField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="aisha.k"
            required
          />

          <div className="bg-base-1 border border-white/[0.09] rounded-2xl px-4 py-2.5">
            <span className="block text-[10px] font-extrabold tracking-[0.12em] uppercase text-purple-1 mb-1">
              College
            </span>
            {loading ? (
              <p className="text-sm text-ink-3 py-1">Loading colleges…</p>
            ) : (
              <select
                value={collage}
                onChange={(e) => setCollage(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[15px] font-semibold text-white"
              >
                <option className="bg-base-1" value="">
                  Select a college
                </option>
                {colleges.map((college, index) => (
                  <option className="bg-base-1" key={index} value={college.name}>
                    {college.name} - {college.country}
                  </option>
                ))}
              </select>
            )}
          </div>

          <FormField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <FormField
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            inputMode="numeric"
            required
          />

          <div className="mt-2">
            <p className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-ink-3 mb-2.5">
              Pick your home club
            </p>
            <div className="flex flex-wrap gap-2">
              {CLUB_KEYS.map((key) => {
                const c = CLUBS[key]
                const selected = homeClub === key
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setHomeClub(key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-extrabold -rotate-2 transition-opacity ${
                      selected ? '' : 'bg-surface-2 text-ink-2 border border-white/[0.08] opacity-90'
                    }`}
                    style={
                      selected
                        ? {
                            background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                            color: c.ink,
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.9)',
                          }
                        : undefined
                    }
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-6">
            {submitting ? 'Saving…' : 'Enter Yuva Vaani'}
          </Button>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="text-ink-3 text-sm font-semibold text-center"
          >
            Sign out
          </button>
        </form>
      </AuthShell>
      <ToastContainer />
    </>
  )
}

export default CompleteProfileForm
