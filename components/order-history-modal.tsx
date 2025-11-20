"use client"

import { X, Clock, CheckCircle2, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"

interface Order {
  id: string
  email: string
  items: string[]
  total: number
  paymentMethod: string
  status: "pending" | "completed" | "rejected"
  timestamp: string
}

interface OrderHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "rejected">("all")
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      loadUserOrders()
    }
  }, [isOpen, user])

  const loadUserOrders = () => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      const allOrders = JSON.parse(storedOrders)
      const userOrders = allOrders.filter((order: Order) => order.email === user?.email)
      setOrders(userOrders)
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Sedang di Proses"
      case "completed":
        return "Berhasil"
      case "rejected":
        return "Gagal"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/30 sticky top-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
            <h2 className="text-2xl font-black text-white">RIWAYAT PESANAN</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="p-4 border-b border-purple-500/30 flex gap-2 overflow-x-auto">
            {(["all", "pending", "completed", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  filter === status
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-purple-500/20"
                }`}
              >
                {status === "all"
                  ? "Semua"
                  : status === "pending"
                    ? "Sedang Diproses"
                    : status === "completed"
                      ? "Berhasil"
                      : "Gagal"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Tidak ada pesanan dengan status ini</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-white/5 to-transparent border border-purple-500/20 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-purple-300 font-mono text-sm bg-white/5 px-3 py-1 rounded">
                          {order.id.slice(0, 12)}
                        </code>
                        <span className="text-slate-500 text-xs">
                          {new Date(order.timestamp).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-white font-bold">{order.items.join(", ")}</p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="font-bold text-sm">{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-purple-500/20">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">METODE PEMBAYARAN</p>
                      <p className="text-white font-semibold">{order.paymentMethod.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs mb-1">TOTAL</p>
                      <p className="text-white font-black text-lg">Rp {order.total.toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div
                    className={`mt-4 px-4 py-2 rounded-lg text-xs ${
                      order.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : order.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {order.status === "pending" && (
                      <>Bukti pembayaran Anda sedang diverifikasi oleh admin. Mohon tunggu.</>
                    )}
                    {order.status === "completed" && (
                      <>Pembayaran Anda telah dikonfirmasi! Terima kasih telah berbelanja.</>
                    )}
                    {order.status === "rejected" && (
                      <>Pembayaran Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.</>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
