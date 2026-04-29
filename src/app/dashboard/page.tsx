"use client"


import { getSession, getHabits, subscribe } from "@/lib/storage"
import HabitList from "@/components/habits/HabitList"
import { useRouter } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { logout } from "@/lib/auth"

import HabitForm from "@/components/habits/HabitForm"
import ProfileDropdown from "@/components/auth/ProfileDropdown"
import { Session } from "@/types/auth"
import { Habit } from "@/types/habit"

const Dashboard = () => {
  const [showHabitDialog, setShowHabitDialog] = useState<boolean>(false)
  
  const session: Session | null = useSyncExternalStore(
    subscribe,
    getSession,
    ()=> null
  )
  const habits: Habit[] = useSyncExternalStore(
    subscribe,
    getHabits,
    ()=> []
  )

  const userHabits = habits.filter(h=> h.userId === session?.userId)

  const router = useRouter()

  useEffect(()=> {
    if(!session) {
      router.push("/login")
    }
  }, [router, session])

  if(!session) {
    return (
      <main className="flex flex-col items-center justify-center h-screen animate-pulse">
          <Image src="/apple-touch-icon.png" alt="Logo" width={100} height={100} priority />
          <h1>Habit Tracker</h1>
      </main>
    )
  }

  return (
    <main data-testid="dashboard-page" className="flex flex-col gap-10 items-center relative">
      <header className="flex items-center justify-between gap-1 w-full bg-card py-4 md:px-20 border-b">
        <div className="flex items-center gap-3">
          <Image src="/apple-touch-icon.png" alt="Logo" width={50} height={50} priority />
          <h2 className="font-medium">Habit Tracker</h2>
        </div>
        <div className="flex items-center gap-1">
        <ProfileDropdown />
        <button
          data-testid="auth-logout-button"
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
        </div>
      </header>

      <button data-testid="create-habit-button" onClick={()=> setShowHabitDialog(true)} className="md:w-[600px] w-[90%] bg-primary cursor-pointer py-4 rounded-lg hover:bg-accent active:scale-95 transition-all duration-100">Create Habit</button>

      {
        userHabits.length === 0 ? (
          <div data-testid="empty-state" className="flex flex-col gap-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-accent/30">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 11h4" />
              <path d="M12 16h4" />
              <path d="M8 11h.01" />
              <path d="M8 16h.01" />
              <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
            <h2>No habits yet</h2>
            <p className="text-accent">Create your first habit to get started on your journey!</p>
          </div>
        ): (
          <div className="flex flex-col gap-4 md:w-fit w-[90%]">
            <HabitList habits={userHabits} />
          </div>
        )
      }
      {
        showHabitDialog && (
            <HabitForm  setShowHabitDialog={setShowHabitDialog} />
        )
      }

      {
        showHabitDialog && (
          <div onClick={()=> setShowHabitDialog(false)} className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-40">lol</div>
        )
      }
    </main>
  )
}

export default Dashboard