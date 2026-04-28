import { User } from "@/types/auth"
import { getUsers, saveUsers, saveSession, clearSession } from "./storage"

export function signup(email: string, password: string) {

    const existingUsers = getUsers()

    const userExists = existingUsers.some(user => user.email === email)

    if(userExists) {
        return {
            success: false,
            error: "User already exists"
        }
    }
    const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
        createdAt: new Date().toISOString()
    }

    saveUsers([...existingUsers, newUser])
    saveSession({
        userId: newUser.id,
        email: newUser.email
    })
    return {
        success: true,
        error: null
    }
}

export function login(email: string, password: string) {
    const existingUsers = getUsers()
    const userExists = existingUsers.find(user => user.email === email && user.password === password)

    if(!userExists) {
        return {
            success: false,
            error: "Invalid email or password"
        }
    }

    saveSession({
        userId: userExists.id,
        email: userExists.email
    })

    return {
        success: true,
        error: null
    }
}

export function logout() {
    clearSession()
}