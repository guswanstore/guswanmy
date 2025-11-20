"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import TabNavigation from "@/components/tab-navigation"
import ProductGrid from "@/components/product-grid"
import Cart from "@/components/cart"
import WelcomePopup from "@/components/welcome-popup"
import HeroBanner from "@/components/hero-banner"
import { CartProvider } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import AuthModal from "@/components/auth-modal"
import SupportChatbot from "@/components/support-chatbot"

function HomeContent() {
  const [activeTab, setActiveTab] = useState("bot")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const { user } = useAuth()
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  useEffect(() => {
    if (user && !hasShownWelcome) {
      setShowWelcome(true)
      setHasShownWelcome(true)
    }
  }, [user, hasShownWelcome])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-black text-white mb-4">GUSWANSTORE</h1>
          <p className="text-gray-300 mb-8 text-lg">Silahkan login terlebih dahulu untuk mengakses toko digital kami</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-lg"
          >
            Login / Register Sekarang
          </button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />

        <div className="container mx-auto px-4 py-12">
          <HeroBanner />

          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-12">
            <ProductGrid category={activeTab} />
          </div>
        </div>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </main>

      <WelcomePopup isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <SupportChatbot isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  )
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  )
}
