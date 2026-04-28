"use client"

import Image from "next/image"
import Link from "next/link"
import { login } from "@/lib/auth"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const validateForm = ()=> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !password) {
      setError("Please fill in all fields")
      return false
    }
    if(!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return false
    }
    if(password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    return true
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>)=> {
    e.preventDefault()
    if(!validateForm()) return

    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const result = login(email, password)
      if(!result.success) {
        setError(result.error)
        return
      }
      router.push("/dashboard")
    } catch(error) {
      setError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="border rounded-2xl flex flex-col gap-6 items-center p-4 bg-card w-full md:w-[400px]">
        <div className="flex flex-col gap-1 items-center">
          <Image src="/apple-touch-icon.png" alt="Logo" width={100} height={100} priority />
          <h2>Welcome back, mentors</h2>
          <p className="text-sm text-accent">Login to track your habits</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input value={email} data-testid="auth-login-email" onChange={(e)=> setEmail(e.target.value)} type="text" id="email" placeholder="abdulcto@gmail.com" className="border p-3 rounded-lg outline-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">password</label>
            <div className="relative">
              <input 
                value={password} 
                data-testid="auth-login-password"
                onChange={(e)=> setPassword(e.target.value)} 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="Enter your password" 
                className="border p-3 rounded-lg outline-primary w-full pr-12"  
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          {
            error && <p className="text-red-500 text-sm">{error}</p>
          }

          <button type="submit" data-testid="auth-login-submit" disabled={loading} className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary w-full bg-primary hover:bg-accent rounded-lg p-3 cursor-pointer">{loading ? "Signing you in!!" : "Log in"}</button>
        </form>
        <p>Don&apos;t have an account? <Link href={"/signup"} className="text-primary hover:underline">Sign up</Link></p>
      </div>
    </main>
  )
}

export default LoginForm