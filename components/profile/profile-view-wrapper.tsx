'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Profile from './profile'
import { Users } from '@/lib/interfaces/user'
import { Professional } from '@/lib/interfaces/professional'


interface ProfileViewerWrapperProps {
  professional: Professional
}

export default function ProfileViewerWrapper({ professional }: ProfileViewerWrapperProps) {
  const [isProfileVisible, setIsProfileVisible] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsProfileVisible(true)}
      >
        Ver perfil
      </Button>
      {isProfileVisible && (
        <div className="fixed -inset-x-full -inset-y-full bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Profile 
          user ={professional.users? professional.users : {} as Users}
          professional={professional} 
          onClose={() => setIsProfileVisible(false)}
        />
        </div>
      )}
    </>
  )
}