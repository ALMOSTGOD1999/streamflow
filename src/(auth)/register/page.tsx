"use client"
import { useAuthStore } from '@/store/Auth'
import React, { FormEvent, useState } from 'react'

function RegisterPage() {
    const { createAccount,login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    
    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault()

        //collect data

        const formData = new FormData(e.currentTarget)
        const firstName = formData.get("firstname")
        const lastName = formData.get("lastname")

        const email = formData.get("email")
        const password = formData.get("password")

        //validate

        if (!firstName || !lastName || !email || !password) {
            setError(() => "please fill all the fields")
            return
        }

        //call the store
        setIsLoading(true)
        setError("")

        const response = await createAccount(
            `${firstName} ${lastName}`, email?.toString(),
            password?.toString()
        )
        if (response.error) {
            setError(()=>response.error!.message)
            
        } else {
            const loginResponse = await login(email.toString(), password.toString()) 
            if (loginResponse.error) {
                setError(()=>loginResponse.error!.message)
            }
        }
    }
  return (
      <div>
          {error && (<p>{error}</p>)}
          <form onSubmit={handleSubmit}>
              
          </form>
      </div>
  )
}

export default RegisterPage