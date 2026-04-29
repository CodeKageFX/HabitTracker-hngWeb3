"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import { getSession, getUsers, saveSession, subscribe } from "@/lib/storage"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Session, User } from "@/types/auth"

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const session = useSyncExternalStore(
        subscribe,
        getSession,
        () => null
    )

    const allUsers = useSyncExternalStore(
        subscribe,
        getUsers,
        () => []
    )

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!session) return null

    const otherUsers = allUsers.filter(u => u.id !== session.userId)

    const handleSwitch = (user: User) => {
        const newSession: Session = {
            userId: user.id,
            email: user.email
        }
        saveSession(newSession)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded-xl transition-all duration-200 group"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    {session.email[0].toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold truncate max-w-[150px]">{session.email}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Session</span>
                </div>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 border rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-md bg-card/95 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b bg-accent/5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Switch Profile</p>
                        
                        {/* Active Profile */}
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <div className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold">
                                {session.email[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold truncate">{session.email}</span>
                                <span className="text-[10px] text-primary flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                        {otherUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleSwitch(user)}
                                className="flex items-center gap-3 p-2 hover:bg-accent/10 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium truncate flex-1">{user.email}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        ))}

                        {otherUsers.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-2">No other local profiles found</p>
                        )}
                    </div>

                    <div className="p-2 border-t bg-muted/20">
                        <button 
                            onClick={() => router.push("/login")}
                            className="w-full flex items-center gap-3 p-2 hover:bg-accent/10 rounded-xl transition-colors text-sm font-medium"
                        >
                            <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            </div>
                            Add another account
                        </button>
                        
                        <button
                            data-testid="auth-logout-button"
                            onClick={logout}
                            className="w-full flex items-center gap-3 p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors text-sm font-medium mt-1"
                        >
                            <div className="w-8 h-8 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            </div>
                            Sign out of all accounts
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown
