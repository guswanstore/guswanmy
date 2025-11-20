"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { LogOut, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"

interface ResellInfo {
  name: string
  email: string
  joinDate: string
  sales: number
  commission: number
}

export default function ResellerPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [resellerInfo, setResellerInfo] = useState<ResellInfo | null>(null)

  useEffect(() => {
    if (!user?.isReseller) {
      router.push("/")
      return
    }
    loadResellerInfo()
  }, [user, router])

  const loadResellerInfo = () => {
    const storedResellers = localStorage.getItem("resellers")
    if (storedResellers && user) {
      const resellers = JSON.parse(storedResellers)
      const currentReseller = resellers.find((r: any) => r.email === user.email)
      if (currentReseller) {
        setResellerInfo(currentReseller)
      }
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!resellerInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Reseller Dashboard</h1>
            <p className="text-purple-300">Pantau penjualan dan komisi Anda</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">NAMA</p>
              <p className="text-white font-black text-2xl">{resellerInfo.name}</p>
              <p className="text-purple-300 text-sm mt-1">{resellerInfo.email}</p>
              <p className="text-slate-500 text-xs mt-3">
                Bergabung: {new Date(resellerInfo.joinDate).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-2">TOTAL PENJUALAN</p>
                <p className="text-white font-black text-xl">{resellerInfo.sales}</p>
              </div>
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-2">KOMISI</p>
                <p className="text-green-400 font-black text-xl">
                  Rp {resellerInfo.commission.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Penjualan Bulan Ini</p>
                <p className="text-white font-black text-3xl mt-2">{Math.floor(resellerInfo.sales * 0.3)}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-800 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Komisi Bulan Ini</p>
                <p className="text-green-400 font-black text-3xl mt-2">
                  Rp {Math.floor(resellerInfo.commission * 0.3).toLocaleString("id-ID")}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-slate-800 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rata-rata Komisi</p>
                <p className="text-blue-400 font-black text-3xl mt-2">15%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8">
            <h2 className="text-white font-black text-xl mb-4">Link Referral Anda</h2>
            <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 mb-4">
              <code className="text-purple-300 text-sm break-all">
                https://superstore.com/ref/{user?.email?.split("@")[0]}
              </code>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Copy Link
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-8">
            <h2 className="text-white font-black text-xl mb-4">Info Penting</h2>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Komisi dihitung dari setiap penjualan via link referral Anda</li>
              <li>• Pembayaran komisi dilakukan setiap akhir bulan</li>
              <li>• Minimum withdrawal: Rp 100.000</li>
              <li>• Hubungi admin untuk pertanyaan lebih lanjut</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
