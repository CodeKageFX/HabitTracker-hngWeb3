import { User, Session} from "@/types/auth";
import { Habit } from "@/types/habit";

let cachedHabits: Habit[] = []
let lastHabitString = ""
let cachedSession: Session | null = null;
let lastSessionString = "";
let cachedUsers: User[] = []
let lastUsersString = "";

const KEYS = {
    users: "habit-tracker-users",
    session: "habit-tracker-session",
    habits: "habit-tracker-habits",
}

const notify = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage-update"));
  }
};


export function getUsers(): User[] {
    if(typeof window === "undefined") return []
    const raw = localStorage.getItem(KEYS.users)

    if(!raw) {
        cachedUsers = []
        lastUsersString = ""
        return []
    }

    if(raw !== lastUsersString) {
        cachedUsers = JSON.parse(raw)
        lastUsersString = raw
    }

    return cachedUsers
}

export function saveUsers(users: User[]): void {
    if(typeof window === "undefined") return
    localStorage.setItem(KEYS.users, JSON.stringify(users))
    notify()
}

export function getSession(): Session | null {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(KEYS.session);

    if (!raw) {
        cachedSession = null;
        lastSessionString = "";
        return null;
    }

    if (raw !== lastSessionString) {
        cachedSession = JSON.parse(raw);
        lastSessionString = raw;
    }

    return cachedSession;
}
export function saveSession(session: Session): void {
    if(typeof window === "undefined") return

    localStorage.setItem(KEYS.session, JSON.stringify(session))
    notify()
}

export function clearSession() {
    if(typeof window === "undefined") return
    localStorage.setItem(KEYS.session, JSON.stringify(null))
    notify()
}

export function getHabits(): Habit[] {
    if(typeof window === "undefined") return []

    const raw = localStorage.getItem(KEYS.habits) || "[]"

    if(raw !== lastHabitString) {
        cachedHabits = JSON.parse(raw)
        lastHabitString = raw
    }

    return cachedHabits
}
export function saveHabits(habits: Habit[]): void {
    if(typeof window === "undefined") return
    localStorage.setItem(KEYS.habits, JSON.stringify(habits))

    notify()
}

export function subscribe(callback: () => void) {
    window.addEventListener("storage-update", callback);
    // Also listen for changes from other tabs (default browser behavior)
    window.addEventListener("storage", callback); 
    
    return () => {
        window.removeEventListener("storage-update", callback);
        window.removeEventListener("storage", callback);
    };
}
