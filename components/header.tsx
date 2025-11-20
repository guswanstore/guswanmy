"use client"

import { ShoppingCart, LogOut, LogIn, User, MessageCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { useState } from "react"
import AuthModal from "./auth-modal"

interface HeaderProps {
  onCartClick: () => void
  onSupportClick?: () => void
}

export default function Header({ onCartClick, onSupportClick }: HeaderProps) {
  const { items } = useCart()
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const itemCount = items.length

  return (
    <>
      <header className="border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-white tracking-wider">GUSWANSTORE</span>
          </div>

          <div className="flex items-center gap-4">
            {onSupportClick && (
              <button
                onClick={onSupportClick}
                className="p-3 hover:bg-slate-800 rounded-lg transition text-green-400 hover:text-green-300"
                title="Support"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                {user.isReseller && (
                  <Link
                    href="/reseller"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm"
                  >
                    Reseller Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout()
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition text-red-400"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </button>
            )}

            {user && !user.isAdmin && (
              <button
                onClick={onCartClick}
                className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
