"use client"

import { useEffect, useState } from "react"
import ExplainerAnimation from "@/components/explainer-animation"

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <main className="w-full h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 overflow-hidden">
      <ExplainerAnimation />
    </main>
  )
}
