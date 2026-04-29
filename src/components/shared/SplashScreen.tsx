"use client"

import Image from "next/image"
import { useEffect } from "react"
import { getSession } from "@/lib/storage"
import { useRouter } from "next/navigation"

const SplashScreen = () => {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession()
      if (session) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [router])
  return (
    <main data-testid="splash-screen" className="flex flex-col items-center justify-center h-screen animate-pulse">
      <Image src="/apple-touch-icon.png" alt="Logo" width={100} height={100} priority />
      <h1>Habit Tracker</h1>
    </main>
  )
}

export default SplashScreen