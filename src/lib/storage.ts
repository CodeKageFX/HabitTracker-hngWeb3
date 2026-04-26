import { User, Session} from "@/types/auth";
import { Habit } from "@/types/habit";

const KEYS = {
    users: "habit-tracker-users",
    session: "habit-tracker-session",
    habits: "habit-tracker-habits",
}


export function getUsers(): User[] {
    if(typeof window === "undefined") return []
    const users = localStorage.getItem(KEYS.users)

    if(users) {
        return JSON.parse(users)
    }
    return []
}

export function saveUsers(users: User[]): void {

    localStorage.setItem(KEYS.users, JSON.stringify(users))
}

export function getSession(): Session | null {
    if(typeof window === "undefined") return null

    const session = localStorage.getItem(KEYS.session)

    if(session) {
        return JSON.parse(session)
    }

    return null
}
export function saveSession(session: Session): void | null {
    if(typeof window === "undefined") return null

    localStorage.setItem(KEYS.session, JSON.stringify(session))
}

export function clearSession() {
    return localStorage.setItem(KEYS.session, JSON.stringify(null))
}

export function getHabits(): Habit[] {
    if(typeof window === "undefined") return []

    const habit = localStorage.getItem(KEYS.habits)

    if(habit) {
        return JSON.parse(habit)
    }

    return []
}
export function saveHabits(habits: Habit[]): void {
    localStorage.setItem(KEYS.habits, JSON.stringify(habits))
}
