'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has active SSH credentials
    const credentials = sessionStorage.getItem('ssh-credentials')
    if (credentials) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-800 to-teal-600 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Linux WebGUI</h1>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  )
}