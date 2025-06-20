'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider2({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Initialize PostHog
    initPostHog()

    // Track page views on route change
    const handleRouteChange = () => {
      posthog?.capture('$pageview')
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <>{children}</>
}