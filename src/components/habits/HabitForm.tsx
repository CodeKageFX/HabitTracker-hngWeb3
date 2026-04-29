"use client"


import { validateHabitName } from "@/lib/validators"
import { Habit } from "@/types/habit"
import { saveHabits, getHabits, getSession } from "@/lib/storage"
import { FormEvent, useState } from "react"

interface HabitFormProps {
  setShowHabitDialog: (value: boolean)=> void
  habitToEdit?: Habit
}

const HabitForm = ({setShowHabitDialog, habitToEdit}: HabitFormProps) => {
    const [error, setError] = useState<string | null>(null)
    const [habit, setHabit] = useState<Habit>(habitToEdit || {id: "", userId: "", name: "", description: "", frequency: "daily", createdAt: "", completions: []})
    const session = getSession()
    const habits = getHabits()

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=> {
      e.preventDefault()
      const result = validateHabitName(habit.name)
      if(!result.valid) {
        setError(result.error)
        return
      }
      const userId = session?.userId
      if(!userId) {
        setError("Login baami")
        return
      }
      if(habitToEdit) {
        const updatedHabits = habits.map((h)=> h.id === habitToEdit.id ? {...h, ...habit} : h)
        saveHabits(updatedHabits)
        
      } else{
        const newHabits: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        createdAt: new Date().toISOString().split("T")[0],
        completions: []
      }
      saveHabits([...habits, newHabits])
      }
      setShowHabitDialog(false)
    }
  return (
    <div className="bg-card py-4 px-8 md:w-[500px] flex flex-col gap-3 rounded-lg z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              
              <h2>{habitToEdit ? "Edit Habit" : "Create Habit"}</h2>
              <form data-testid="habit-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Habit Name</label>
                  <input data-testid="habit-name-input" type="text" value={habit.name} onChange={(e)=> setHabit((prev)=> ({...prev, name: e.target.value}))} id="name" placeholder="e.g Talk to my babe" className="border p-3 rounded-lg outline-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description">Description</label>
                  <input data-testid="habit-description-input" type="text" value={habit.description} onChange={(e)=> setHabit((prev)=> ({...prev, description: e.target.value}))} id="description" placeholder="What does this habit involve?" className="border p-3 rounded-lg outline-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="frequency">Frequency</label>
                  <select data-testid="habit-frequency-select" id="frequency" value={habit.frequency} onChange={(e)=> setHabit((prev)=> ({...prev, frequency: e.target.value as "daily"}))}>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                {
                  error && <p className="text-destructive text-sm">{error}</p>
                }
                <button data-testid="habit-save-button" type="submit" className="bg-primary cursor-pointer py-4 rounded-lg hover:bg-accent active:scale-95 transition-all duration-100">{habitToEdit ? "Update Habit" : "Create Habit"}</button>
              </form>
            </div>
  )
}

export default HabitForm