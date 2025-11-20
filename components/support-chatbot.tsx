"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

const FAQ_OPTIONS = [
  {
    id: "1",
    question: "Cara membeli produk",
    answer:
      "Untuk membeli produk, ikuti langkah berikut:\n1. Login ke akun Anda\n2. Pilih produk yang ingin dibeli\n3. Pilih durasi/tier yang diinginkan\n4. Masukkan produk ke keranjang\n5. Klik checkout\n6. Upload bukti pembayaran\n7. Tunggu konfirmasi dari admin\n\nProses verifikasi biasanya memakan waktu 1-2 jam. Jika ada pertanyaan, jangan ragu untuk menghubungi kami!",
  },
  {
    id: "2",
    question: "Apakah produk ini aman?",
    answer:
      "Ya, semua produk kami telah diverifikasi dan dijamin aman untuk digunakan. Kami bekerja sama dengan developer terpercaya untuk memastikan kualitas produk. Setiap produk telah melalui quality control ketat sebelum dijual. Kepuasan dan keamanan customer adalah prioritas utama kami!",
  },
  {
    id: "3",
    question: "Saya mau merefundkan uang",
    answer:
      "Maaf, saya tidak bisa menjawab pertanyaan itu. Mungkin kamu bisa hubungi admin langsung dibawah ini:\n\nWhatsApp: 081913143472\nGmail: guswanreal@gmail.com\n\nAdmin kami siap membantu Anda dengan segala pertanyaan refund!",
  },
  {
    id: "4",
    question: "Saluran WhatsApp Guswan mana?",
    answer:
      "Anda bisa menghubungi kami melalui WhatsApp di nomor: 081913143472\n\nAdmin kami online 24/7 untuk membantu Anda. Silakan kirim pesan dengan pertanyaan atau keluhan Anda, dan kami akan merespons secepatnya!",
  },
  {
    id: "5",
    question: "Haruskah emailnya email kita saat beli?",
    answer:
      "Ya, email yang Anda gunakan untuk login harus sama dengan email yang Anda gunakan saat melakukan pembelian. Ini penting untuk proses verifikasi dan pengiriman kunci akses produk. Pastikan email Anda aktif dan mudah diakses agar Anda dapat menerima notifikasi pembayaran dan akses produk dengan lancar!",
  },
]

interface SupportChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportChatbot({ isOpen, onClose }: SupportChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const handleOpen = () => {
    if (!hasInitialized) {
      const initialMessage: Message = {
        id: "init",
        type: "bot",
        content: "Halo saya GuswanVirtual 👋\n\nSilahkan pilih pertanyaan dibawah untuk saya bantu:",
        timestamp: new Date(),
      }
      setMessages([initialMessage])
      setHasInitialized(true)
    }
    setIsMinimized(false)
  }

  const handleSelectOption = (option: (typeof FAQ_OPTIONS)[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: option.question,
      timestamp: new Date(),
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: option.answer,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          handleOpen()
          if (!isOpen) return
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 z-40"
        title="Support Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-lg">GuswanVirtual Support</h3>
          <p className="text-purple-100 text-sm">Online 24/7</p>
        </div>
        <button
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false)
            } else {
              onClose()
            }
          }}
          className="p-2 hover:bg-white/20 rounded-lg transition text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-xl whitespace-pre-wrap text-sm leading-relaxed ${
                message.type === "user"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                  : "bg-slate-800 text-gray-200 border border-purple-500/30 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Options */}
      <div className="border-t border-purple-500/20 p-4 space-y-2 max-h-56 overflow-y-auto scrollbar-hide">
        {FAQ_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option)}
            className="w-full text-left px-3 py-2 text-sm bg-slate-800/50 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            {option.question}
          </button>
        ))}
      </div>

      {/* Footer Contact Info */}
      <div className="border-t border-purple-500/20 bg-slate-900/50 px-4 py-3 text-center text-xs text-gray-400">
        <p>Hubungi Admin: 081913143472 | guswanreal@gmail.com</p>
      </div>
    </div>
  )
}
