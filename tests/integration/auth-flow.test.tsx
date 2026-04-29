import { describe, it, expect, beforeEach } from "vitest"
import { signup, login } from "../../src/lib/auth"
import { getSession, clearSession } from "../../src/lib/storage"

describe("auth flow", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("submits the signup form and creates a session", () => {
        const result = signup("test@example.com", "password123")
        expect(result.success).toBe(true)
        expect(getSession()).not.toBeNull()
        expect(getSession()?.email).toBe("test@example.com")
    })

    it("shows an error for duplicate signup email", () => {
        signup("test@example.com", "password123")
        const result = signup("test@example.com", "password123")
        expect(result.success).toBe(false)
        expect(result.error).toBe("User already exists")
    })

    it("submits the login form and stores the active session", () => {
        signup("test@example.com", "password123")
        clearSession()
        const result = login("test@example.com", "password123")
        expect(result.success).toBe(true)
        expect(getSession()?.email).toBe("test@example.com")
    })

    it("shows an error for invalid login credentials", () => {
        const result = login("wrong@example.com", "wrongpassword")
        expect(result.success).toBe(false)
        expect(result.error).toBe("Invalid email or password")
    })
})