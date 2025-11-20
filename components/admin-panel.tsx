"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Plus, Users, Package, LogOut, Eye, Download } from "lucide-react"

interface Order {
  id: string
  email: string
  items: string[]
  total: number
  paymentMethod: string
  status: "pending" | "completed" | "rejected"
  proofImage?: string
  timestamp: string
}

interface Reseller {
  id: string
  email: string
  name: string
  joinDate: string
  sales: number
  commission: number
}

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "resellers">("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [resellers, setResellers] = useState<Reseller[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "rejected">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showProofModal, setShowProofModal] = useState(false)

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
      return
    }
    loadOrders()
    loadResellers()
  }, [user, router])

  const loadOrders = () => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }

  const loadResellers = () => {
    const storedResellers = localStorage.getItem("resellers")
    if (storedResellers) {
      setResellers(JSON.parse(storedResellers))
    }
  }

  const updateOrderStatus = (id: string, status: "pending" | "completed" | "rejected") => {
    const updatedOrders = orders.map((order) => (order.id === id ? { ...order, status } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleViewProof = (order: Order) => {
    setSelectedOrder(order)
    setShowProofModal(true)
  }

  const downloadProof = (order: Order) => {
    if (order.proofImage) {
      const link = document.createElement("a")
      link.href = order.proofImage
      link.download = `bukti-pembayaran-${order.id}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
            <p className="text-purple-300">Kelola toko dan pesanan dengan mudah</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {(["orders", "products", "resellers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {tab === "orders" && <Package className="w-5 h-5" />}
              {tab === "products" && <Package className="w-5 h-5" />}
              {tab === "resellers" && <Users className="w-5 h-5" />}
              {tab === "orders" ? "Pesanan" : tab === "products" ? "Produk" : "Reseller"}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              {(["all", "pending", "completed", "rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    filter === status ? "bg-purple-600 text-white" : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {status === "all"
                    ? "Semua"
                    : status === "pending"
                      ? "Menunggu"
                      : status === "completed"
                        ? "Selesai"
                        : "Ditolak"}{" "}
                  ({filteredOrders.length})
                </button>
              ))}
            </div>

            <div className="bg-slate-900 bg-opacity-50 border border-purple-500 border-opacity-20 rounded-xl overflow-hidden backdrop-blur-sm">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Tidak ada pesanan dengan status ini</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500 border-opacity-20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Produk</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Metode</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Bukti</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-purple-500 border-opacity-10 hover:bg-slate-800 hover:bg-opacity-50 transition"
                        >
                          <td className="px-6 py-4 text-sm text-white font-mono">{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-sm text-purple-300">{order.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{order.items.join(", ")}</td>
                          <td className="px-6 py-4 text-sm text-white font-semibold">
                            Rp {order.total.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{order.paymentMethod}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-500 bg-opacity-20 text-green-300"
                                  : order.status === "pending"
                                    ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                                    : "bg-red-500 bg-opacity-20 text-red-300"
                              }`}
                            >
                              {order.status === "pending"
                                ? "Menunggu"
                                : order.status === "completed"
                                  ? "Selesai"
                                  : "Ditolak"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {order.proofImage ? (
                              <button
                                onClick={() => handleViewProof(order)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                              >
                                <Eye className="w-4 h-4" />
                                Lihat
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs">Tidak ada</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {order.status !== "completed" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "completed")}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                                >
                                  Terima
                                </button>
                              )}
                              {order.status !== "rejected" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "rejected")}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                                >
                                  Tolak
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="mb-6">
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
                <Plus className="w-5 h-5" />
                Tambah Produk Baru
              </button>
            </div>
            <div className="bg-slate-900 bg-opacity-50 border border-purple-500 border-opacity-20 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-lg">Fitur manajemen produk siap digunakan</p>
              <p className="text-slate-500 text-sm mt-2">Gunakan tombol di atas untuk menambah produk baru ke toko</p>
            </div>
          </div>
        )}

        {/* Resellers Tab */}
        {activeTab === "resellers" && (
          <div>
            <div className="mb-6">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition">
                <Plus className="w-5 h-5" />
                Tambah Reseller Baru
              </button>
            </div>
            {resellers.length === 0 ? (
              <div className="bg-slate-900 bg-opacity-50 border border-purple-500 border-opacity-20 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-lg">Belum ada reseller terdaftar</p>
                <p className="text-slate-500 text-sm mt-2">Klik tombol di atas untuk menambah reseller baru</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resellers.map((reseller) => (
                  <div key={reseller.id} className="bg-slate-800 border border-purple-500/20 rounded-lg p-6">
                    <p className="text-white font-bold text-lg">{reseller.name}</p>
                    <p className="text-purple-300 text-sm">{reseller.email}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Penjualan:</span>
                        <span className="text-white font-bold">{reseller.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Komisi:</span>
                        <span className="text-green-400 font-bold">
                          Rp {reseller.commission.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showProofModal && selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowProofModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-purple-500 border-opacity-30 max-w-2xl w-full p-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Bukti Pembayaran</h2>
                <button onClick={() => setShowProofModal(false)} className="text-gray-400 hover:text-gray-300 text-2xl">
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Nomor Referensi</p>
                  <p className="text-white font-mono font-bold text-lg">{selectedOrder.id}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Informasi Pembayaran</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">
                      Email: <span className="text-purple-300">{selectedOrder.email}</span>
                    </p>
                    <p className="text-white">
                      Metode: <span className="text-purple-300">{selectedOrder.paymentMethod.toUpperCase()}</span>
                    </p>
                    <p className="text-white">
                      Total: <span className="text-green-400">Rp {selectedOrder.total.toLocaleString("id-ID")}</span>
                    </p>
                    <p className="text-white">
                      Waktu:{" "}
                      <span className="text-purple-300">
                        {new Date(selectedOrder.timestamp).toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedOrder.proofImage && (
                  <div>
                    <p className="text-gray-400 text-sm mb-3">Screenshot Bukti</p>
                    <img
                      src={selectedOrder.proofImage || "/placeholder.svg"}
                      alt="Bukti Pembayaran"
                      className="w-full rounded-lg border border-purple-500 border-opacity-30"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => downloadProof(selectedOrder)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowProofModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
