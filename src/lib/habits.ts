import { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
    const unique = [...new Set(habit.completions)]

    const exists = unique.includes(date)

    const newCompletions = exists
    ? unique.filter(d => d !== date)
    : [...unique, date]

    return {...habit, completions: newCompletions}
}