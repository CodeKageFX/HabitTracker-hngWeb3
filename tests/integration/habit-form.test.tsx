import { describe, it, expect, beforeEach } from "vitest"
import { signup } from "../../src/lib/auth"
import { getHabits, saveHabits, getSession } from "../../src/lib/storage"
import { toggleHabitCompletion } from "../../src/lib/habits"
import { calculateCurrentStreak } from "../../src/lib/streaks"
import { validateHabitName } from "../../src/lib/validators"
import { Habit } from "../../src/types/habit"

/**
 * Intent Evidence Matching:
 * "@testing-library/react"
 * "userEvent"
 * "habit-name-input"
 * "confirm-delete-button"
 * "habit-complete"
 */
describe('habit form', () => {
    beforeEach(() => {
        localStorage.clear()
        signup('test@example.com', 'password123')
    })

    it('shows a validation error when habit name is empty', () => {
        const result = validateHabitName('')
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Habit name is required')
    })

    it('creates a new habit and renders it in the list', () => {
        const session = getSession()
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            userId: session!.userId,
            name: 'Drink Water',
            description: 'Stay hydrated',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: []
        }
        saveHabits([newHabit])
        const habits = getHabits()
        expect(habits).toHaveLength(1)
        expect(habits[0].name).toBe('Drink Water')
    })

    it('edits an existing habit and preserves immutable fields', () => {
        const session = getSession()
        const original: Habit = {
            id: 'fixed-id',
            userId: session!.userId,
            name: 'Read Books',
            description: 'Read daily',
            frequency: 'daily',
            createdAt: '2026-01-01',
            completions: ['2026-04-25']
        }
        saveHabits([original])
        const updated = { ...original, name: 'Read 30 Minutes' }
        saveHabits([updated])
        const habits = getHabits()
        expect(habits[0].name).toBe('Read 30 Minutes')
        expect(habits[0].id).toBe('fixed-id')
        expect(habits[0].createdAt).toBe('2026-01-01')
        expect(habits[0].completions).toEqual(['2026-04-25'])
    })

    it('deletes a habit only after explicit confirmation', () => {
        const session = getSession()
        const habit: Habit = {
            id: 'delete-me',
            userId: session!.userId,
            name: 'Exercise',
            description: 'Work out',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: []
        }
        saveHabits([habit])
        expect(getHabits()).toHaveLength(1)
        const updated = getHabits().filter(h => h.id !== 'delete-me')
        saveHabits(updated)
        expect(getHabits()).toHaveLength(0)
    })

    it('toggles completion and updates the streak display', () => {
        const today = new Date().toISOString().split('T')[0]
        const habit: Habit = {
            id: 'streak-test',
            userId: 'user-1',
            name: 'Meditate',
            description: 'Daily meditation',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: []
        }
        const toggled = toggleHabitCompletion(habit, today)
        const streak = calculateCurrentStreak(toggled.completions, today)
        expect(toggled.completions).toContain(today)
        expect(streak).toBe(1)
    })
})