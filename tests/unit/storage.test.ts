import { describe, it, expect, beforeEach } from "vitest"
import {
    getUsers, saveUsers,
    getSession, saveSession, clearSession,
    getHabits, saveHabits,
    subscribe
} from "../../src/lib/storage"
import { User, Session } from "../../src/types/auth"
import { Habit } from "../../src/types/habit"

describe("storage", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    describe("users", () => {
        it("returns empty array when no users stored", () => {
            expect(getUsers()).toEqual([])
        })

        it("saves and retrieves users", () => {
            const users: User[] = [{
                id: "1", email: "test@test.com",
                password: "pass", createdAt: "2026-01-01"
            }]
            saveUsers(users)
            expect(getUsers()).toEqual(users)
        })
    })

    describe("session", () => {
        it("returns null when no session stored", () => {
            expect(getSession()).toBeNull()
        })

        it("saves and retrieves session", () => {
            const session: Session = { userId: "1", email: "test@test.com" }
            saveSession(session)
            expect(getSession()).toEqual(session)
        })

        it("clears session", () => {
            const session: Session = { userId: "1", email: "test@test.com" }
            saveSession(session)
            clearSession()
            expect(getSession()).toBeNull()
        })
    })

    describe("habits", () => {
        it("returns empty array when no habits stored", () => {
            expect(getHabits()).toEqual([])
        })

        it("saves and retrieves habits", () => {
            const habits: Habit[] = [{
                id: "1", userId: "1", name: "Exercise",
                description: "Work out", frequency: "daily",
                createdAt: "2026-01-01", completions: []
            }]
            saveHabits(habits)
            expect(getHabits()).toEqual(habits)
        })
    })

    describe("subscribe", () => {
        it("subscribes and unsubscribes from storage events", () => {
            const callback = vi.fn()
            const unsubscribe = subscribe(callback)
            window.dispatchEvent(new Event("storage"))
            expect(callback).toHaveBeenCalled()
            unsubscribe()
        })
    })
})