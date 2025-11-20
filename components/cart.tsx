"use client"

import { useCart } from "@/context/cart-context"
import { X, Trash2, Check } from "lucide-react"
import { useState } from "react"
import CheckoutLoadingModal from "./checkout-loading-modal"
import PaymentProofModal from "./payment-proof-modal"
import OrderHistoryModal from "./order-history-modal"

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem } = useCart()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showPaymentProof, setShowPaymentProof] = useState(false)
  const [generatedPaymentNumber, setGeneratedPaymentNumber] = useState("")
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const paymentMethods = [
    { id: "qris", name: "QRIS", icon: "/images/payment-qris.jpg" },
    { id: "dana", name: "DANA", icon: "/images/payment-dana.jpg" },
    { id: "ovo", name: "OVO", icon: "/images/payment-ovo.jpg" },
    { id: "gopay", name: "GoPay", icon: "/images/payment-gopay.jpg" },
  ]

  const handleCheckout = () => {
    if (!selectedPayment || items.length === 0) return
    setIsCheckingOut(true)
    setShowLoadingModal(true)
  }

  const handleLoadingComplete = (paymentNumber: string) => {
    setGeneratedPaymentNumber(paymentNumber)
    setShowLoadingModal(false)
    setShowPaymentProof(true)
    setIsCheckingOut(false)
  }

  const handleClosePaymentProof = () => {
    setShowPaymentProof(false)
    onClose()
    setSelectedPayment(null)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl border-l border-purple-500/30 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-purple-500/30 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">KERANJANG</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOrderHistory(true)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition"
                title="Lihat riwayat pesanan"
              >
                Riwayat
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <p className="text-lg">Keranjang kosong</p>
                <p className="text-sm mt-2">Tambahkan produk untuk mulai berbelanja</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-purple-500/20 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{item.name}</h4>
                    <p className="text-purple-300 text-sm mt-1">
                      Rp {item.price.toLocaleString("id-ID")} × {item.quantity}
                    </p>
                    <p className="text-white font-bold text-lg mt-2">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Payment Methods */}
          {items.length > 0 && (
            <>
              <div className="border-t border-purple-500/30 p-6">
                <p className="text-white font-bold mb-4">Pilih Metode Pembayaran:</p>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg font-bold transition-all duration-300 text-center ${
                        selectedPayment === method.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 border border-purple-500/20"
                      }`}
                    >
                      <img
                        src={method.icon || "/placeholder.svg"}
                        alt={method.name}
                        className="w-8 h-8 mx-auto mb-2 object-contain"
                      />
                      <div className="text-xs">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="border-t border-purple-500/30 p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-black text-white">
                  <span>Total:</span>
                  <span className="text-2xl text-purple-300">Rp {total.toLocaleString("id-ID")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!selectedPayment || isCheckingOut || items.length === 0}
                  className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                    selectedPayment && !isCheckingOut && items.length > 0
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50"
                      : "bg-gray-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin">⚙️</div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Checkout
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutLoadingModal isOpen={showLoadingModal} onComplete={handleLoadingComplete} />
      <PaymentProofModal
        isOpen={showPaymentProof}
        onClose={handleClosePaymentProof}
        paymentNumber={generatedPaymentNumber}
        paymentMethod={selectedPayment || ""}
        total={total}
        items={items}
      />
      <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </>
  )
}
