"use client"
import { useAuthStore } from '@/store/Auth'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
    const { session } = useAuthStore()
    const router = useRouter()

    useEffect(()=> {
        if (session) {
        router.push('/')
    }
    }, [session])
    
    if (session) {
        return null
    }
    
    return (
        <div className=''>
            <div className=''>{children}
            </div>
        </div>
  )
}

export default layout