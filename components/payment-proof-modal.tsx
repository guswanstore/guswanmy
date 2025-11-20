"use client"

import type React from "react"

import { X, Copy, Check, Upload, Clock } from "lucide-react"
import { useState, useRef } from "react"
import QRCode from "qrcode"
import { useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

interface PaymentProofModalProps {
  isOpen: boolean
  onClose: () => void
  paymentNumber: string
  paymentMethod: string
  total: number
  items: Array<{ name: string; price: number; quantity: number }>
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  paymentNumber,
  paymentMethod,
  total,
  items,
}: PaymentProofModalProps) {
  const [qrCode, setQrCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>("")
  const [showPending, setShowPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { removeItem } = useCart()
  const { user } = useAuth()

  const methodIcons: Record<string, string> = {
    qris: "/images/payment-qris.jpg",
    dana: "/images/payment-dana.jpg",
    ovo: "/images/payment-ovo.jpg",
    gopay: "/images/payment-gopay.jpg",
  }

  const methodNames: Record<string, string> = {
    qris: "QRIS",
    dana: "DANA",
    ovo: "OVO",
    gopay: "GoPay",
  }

  useEffect(() => {
    if (isOpen && paymentMethod === "qris") {
      QRCode.toDataURL(`PAYMENT|${paymentNumber}|${total}`, {
        width: 300,
        margin: 2,
        color: { dark: "#000", light: "#fff" },
      }).then(setQrCode)
    }
  }, [isOpen, paymentMethod, paymentNumber, total])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedFileBase64(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPayment = () => {
    if (uploadedFile && uploadedFileBase64) {
      const order = {
        id: paymentNumber,
        email: user?.email || "guest@example.com",
        items: items.map((item) => item.name),
        total,
        paymentMethod,
        status: "pending" as const,
        proofImage: uploadedFileBase64,
        timestamp: new Date().toISOString(),
      }

      const storedOrders = localStorage.getItem("orders")
      const orders = storedOrders ? JSON.parse(storedOrders) : []
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))

      // Clear cart after successful upload
      items.forEach((item) => removeItem(item.name))

      setShowPending(true)
    }
  }

  if (!isOpen) return null

  // Pending Status View
  if (showPending) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-center">
              <h2 className="text-2xl font-black text-white">STATUS PEMBAYARAN</h2>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 text-center">
              {/* Animated Clock Icon */}
              <div className="flex justify-center">
                <div className="relative w-20 h-20">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-4xl"
                    style={{
                      animation: "spin 3s linear infinite",
                    }}
                  >
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="space-y-3">
                <p className="text-white font-black text-xl">MENUNGGU VERIFIKASI</p>
                <p className="text-slate-400 text-sm">
                  Bukti pembayaran Anda telah diterima dan sedang kami verifikasi
                </p>
              </div>

              {/* Reference Number */}
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-2">NOMOR REFERENSI</p>
                <code className="text-white font-mono font-bold text-sm">{paymentNumber}</code>
              </div>

              {/* Items Summary */}
              <div>
                <p className="text-slate-400 text-sm mb-3">PRODUK YANG DIPESAN</p>
                <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {item.name} <span className="text-purple-400">× {item.quantity}</span>
                      </span>
                      <span className="text-white font-bold">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  <span className="font-bold">Estimasi waktu verifikasi:</span>
                  <br />
                  Biasanya dalam 5-30 menit
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>

            <style>{`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </div>
      </>
    )
  }

  // Payment Details & Upload View
  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative p-6 border-b border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-pink-900/30">
            <div>
              <h2 className="text-2xl font-black text-white">BUKTI PEMBAYARAN</h2>
              <p className="text-purple-300 text-sm mt-1">Silahkan transfer sesuai nominal</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Payment Method */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-2">Metode Pembayaran</p>
              <div className="flex items-center gap-3">
                <img
                  src={methodIcons[paymentMethod] || "/placeholder.svg"}
                  alt={methodNames[paymentMethod]}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <p className="text-white font-black text-xl">{methodNames[paymentMethod]}</p>
                  <p className="text-purple-300 text-xs">Pembayaran Digital</p>
                </div>
              </div>
            </div>

            {/* Payment Number */}
            <div>
              <p className="text-slate-400 text-sm mb-2">NOMOR REFERENSI</p>
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between gap-3">
                <code className="text-white font-mono font-bold text-lg flex-1 break-all">{paymentNumber}</code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors flex-shrink-0"
                  title="Copy nomor referensi"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* QRIS Code for QRIS Method */}
            {paymentMethod === "qris" && qrCode && (
              <div>
                <p className="text-slate-400 text-sm mb-3">KODE QRIS</p>
                <div className="bg-white p-4 rounded-lg flex justify-center">
                  <img src={qrCode || "/placeholder.svg"} alt="QRIS Payment Code" className="w-48 h-48" />
                </div>
                <p className="text-slate-400 text-xs text-center mt-2">
                  Scan kode QRIS dengan aplikasi mobile banking atau e-wallet Anda
                </p>
              </div>
            )}

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-2">TOTAL YANG HARUS DITRANSFER</p>
              <p className="text-white font-black text-3xl">Rp {total.toLocaleString("id-ID")}</p>
              <p className="text-emerald-300 text-xs mt-2">{items.length} item • Status: Menunggu Pembayaran</p>
            </div>

            {/* Items Summary */}
            <div>
              <p className="text-slate-400 text-sm mb-3">RINCIAN PRODUK</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.name} <span className="text-purple-400">× {item.quantity}</span>
                    </span>
                    <span className="text-white font-bold">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Payment Proof */}
            <div>
              <p className="text-slate-400 text-sm mb-3">UPLOAD BUKTI PEMBAYARAN</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-500/50 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-600/10 transition-all duration-300 group"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                {uploadedFile ? (
                  <div className="space-y-2">
                    <div className="text-3xl">✓</div>
                    <p className="text-green-400 font-bold text-sm">{uploadedFile.name}</p>
                    <p className="text-slate-400 text-xs">Siap untuk dikirim</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto group-hover:text-purple-300" />
                    <p className="text-white font-bold text-sm">Klik untuk upload screenshot</p>
                    <p className="text-slate-400 text-xs">atau drag and drop</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <span className="font-bold">Instruksi:</span>
                <br />
                1. Transfer sesuai jumlah yang tertera
                <br />
                2. Screenshot bukti pembayaran (dari e-wallet/banking)
                <br />
                3. Upload screenshot di sini
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmitPayment}
                disabled={!uploadedFile}
                className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  uploadedFile
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                {uploadedFile ? "Kirim Bukti" : "Upload Terlebih Dahulu"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
