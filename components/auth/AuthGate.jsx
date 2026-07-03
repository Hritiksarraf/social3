'use client'

import { useCurrentUser } from '@lib/hooks/useCurrentUser'
import CompleteProfileForm from './CompleteProfileForm'
import Splash from '@components/ui/Splash'

function AuthGate({ children }) {
  const { authLoading, supabaseUser, currentUser, currentUserLoading } = useCurrentUser()

  if (authLoading || currentUserLoading) {
    return <Splash />
  }

  if (!supabaseUser) {
    return null
  }

  if (currentUser === null) {
    return <CompleteProfileForm />
  }

  return children
}

export default AuthGate
