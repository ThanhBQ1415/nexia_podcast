'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState: any, formData: FormData) {
    const res = await fetch("")
    const json = await res.json
    if (!res.ok) {
        return {
            message: "Please enter a valid email"
        }
    }
    redirect('/dashboard')

}

export async function loginUser(prevState: any, formData: FormData) {
    // Send login request to authentication endpoint
    const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "application/json"
        }
    })

    // Parse response
    const json = await res.json()

    // Handle authentication errors
    if (!res.ok) {
        return {
            message: "Invalid email or password" 
        }
    }

    // Redirect to dashboard on successful login
    redirect('/dashboard')
}