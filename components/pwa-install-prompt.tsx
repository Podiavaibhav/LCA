"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

const DISMISSED_KEY = "pwa-install-prompt-dismissed"
const INSTALLED_KEY = "pwa-app-installed"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log("[PWA] PWA Install Prompt component mounted")
    
    // Check if user has already dismissed or installed
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === "true"
    const wasInstalled = localStorage.getItem(INSTALLED_KEY) === "true"
    
    console.log("[PWA] isDismissed:", isDismissed, "wasInstalled:", wasInstalled)
    
    if (isDismissed || wasInstalled) {
      console.log("[PWA] Prompt was previously dismissed or app was installed")
      return
    }

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    const isPWAInstalled = isStandalone || isInWebAppiOS

    console.log("[PWA] isStandalone:", isStandalone, "isInWebAppiOS:", isInWebAppiOS, "isPWAInstalled:", isPWAInstalled)

    if (isPWAInstalled) {
      console.log("[PWA] App is already installed, not showing prompt")
      localStorage.setItem(INSTALLED_KEY, "true")
      return
    }

    let promptShown = false

    const handler = (e: Event) => {
      console.log("[PWA] beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      if (!promptShown) {
        // Show prompt after 5 seconds delay
        console.log("[PWA] Scheduling prompt to show in 5 seconds")
        setTimeout(() => {
          console.log("[PWA] Showing prompt now")
          setShowInstallPrompt(true)
          setTimeout(() => setIsVisible(true), 100) // Add slight delay for animation
        }, 5000)
        promptShown = true
      }
    }

    // Fallback timer for browsers that don't fire beforeinstallprompt
    const fallbackTimer = setTimeout(() => {
      console.log("[PWA] Fallback timer fired. deferredPrompt:", !!deferredPrompt, "isPWAInstalled:", isPWAInstalled, "promptShown:", promptShown)
      if (!deferredPrompt && !isPWAInstalled && !promptShown) {
        console.log("[PWA] Showing fallback prompt")
        setShowInstallPrompt(true)
        setTimeout(() => setIsVisible(true), 100)
        promptShown = true
      }
    }, 5000)

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        "To install this app:\n\n1. Open browser menu\n2. Select 'Add to Home Screen' or 'Install App'\n3. Follow the prompts",
      )
      localStorage.setItem(INSTALLED_KEY, "true")
      handleDismiss()
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[PWA] User accepted the install prompt")
      localStorage.setItem(INSTALLED_KEY, "true")
    } else {
      console.log("[PWA] User dismissed the install prompt")
      localStorage.setItem(DISMISSED_KEY, "true")
    }

    setDeferredPrompt(null)
    handleDismiss()
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      setShowInstallPrompt(false)
    }, 300) // Wait for animation to complete
  }

  const handleLaterClick = () => {
    localStorage.setItem(DISMISSED_KEY, "true")
    handleDismiss()
  }

  const handleCloseClick = () => {
    localStorage.setItem(DISMISSED_KEY, "true")
    handleDismiss()
  }

  if (!showInstallPrompt) return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-primary/20 shadow-lg p-4 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl">📱</div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Install LCA Platform</h4>
            <p className="text-gray-600 text-xs">Get offline access and faster loading times</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2"
          >
            Install
          </Button>
          <Button
            onClick={handleLaterClick}
            variant="outline"
            size="sm"
            className="text-sm px-4 py-2"
          >
            Later
          </Button>
          <button
            onClick={handleCloseClick}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
