import { useSession } from 'next-auth/react'

export default function useAuth() {
  const { data: session, status } = useSession()
  const user = (session as any)?.user || null
  return { user, status }
}
