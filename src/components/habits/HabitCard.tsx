"use client"

import { useState } from "react"
import { Habit } from "@/types/habit"
import { getHabitSlug } from "@/lib/slug"
import { saveHabits, getHabits } from "@/lib/storage"
import { toggleHabitCompletion } from "@/lib/habits"
import HabitForm from "./HabitForm"
import { calculateCurrentStreak } from "@/lib/streaks"
interface HabitCardProps {
  habit: Habit
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const[isEditing, setIsEditing] = useState<boolean>(false)
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const streak = calculateCurrentStreak(habit.completions)
  const habits = getHabits()
  const today = new Date().toISOString().split("T")[0]
  const isComplete = habit.completions?.includes(today)


  const handleDelete = (id: string)=> {
    const updated = habits.filter((habit)=> habit.id !== id)
    saveHabits(updated)

    setShowDeleteConfirm(false)
  }

  const handleComplete = (id: string)=> {
    const updated = habits.map(h=> 
      h.id === id ? toggleHabitCompletion(h, today) : h
    )

    saveHabits(updated)
  }
  return (
    <>
      <div data-testid={`habit-card-${getHabitSlug(habit.name)}`} className={`  bg-card py-4 px-8 w-full md:w-[500px] flex flex-col gap-3 rounded-lg z-40 border shadow-sm ${isComplete ? "border-primary border-2" : ""}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{habit.name}</h2>
          <div className="relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 fill-orange-500">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span data-testid={`habit-streak-${getHabitSlug(habit.name)}`} className="absolute text-[10px] font-black text-white mt-2">{streak}</span>
          </div>
        </div>
        <p className="text-muted-foreground">{habit.description}</p>
        <div className="text-xs font-semibold px-2 py-1 bg-accent/10 text-accent rounded-md w-fit">
          {habit.frequency}
        </div>

        <div className="flex items-center gap-3 pt-3 border-t mt-1">
          <button onClick={()=> handleComplete(habit.id)} data-testid={`habit-complete-${getHabitSlug(habit.name)}`} className={`flex-1 text-secondary py-2 rounded-lg font-bold hover:bg-accent transition-colors ${isComplete ? "bg-muted-foreground hover:bg-muted-foreground/80" : "bg-primary hover:bg-accent"}`}>
            {
              isComplete ? "Completed" : "Mark Complete"
            }
          </button>
          <button onClick={()=> {setIsEditing(true)}} disabled={isComplete} data-testid={`habit-edit-${getHabitSlug(habit.name)}`} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent border rounded-lg hover:bg-accent/10 transition-colors text-accent" aria-label="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            data-testid={`habit-delete-${getHabitSlug(habit.name)}`}
            className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <>
          <div
            onClick={() => setShowDeleteConfirm(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all cursor-pointer"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-2xl shadow-2xl z-50 w-[90%] max-w-[400px] border flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Delete Habit?</h2>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete <span className="font-bold text-foreground">&quot;{habit.name}&quot;</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-xl hover:bg-accent/10 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={()=> handleDelete(habit.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <>
          <div
            onClick={() => setIsEditing(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all cursor-pointer"
          />
          <HabitForm 
            habitToEdit={habit}
            setShowHabitDialog={setIsEditing} 
          />
        </>
      )}
    </>
  )
}

export default HabitCard