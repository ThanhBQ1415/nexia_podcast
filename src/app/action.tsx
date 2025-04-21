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
    const res = await fetch("")
    const json = await res.json
    if (!res.ok) {
        return {
            message: "Please enter a valid email"
        }
    }
    redirect('/dashboard')

}