"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PriceTier {
  duration: string
  price: number
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [category, setCategory] = useState<"bot" | "executor" | "script">("bot")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    { duration: "7 Hari", price: 0 },
    { duration: "30 Hari", price: 0 },
    { duration: "Permanen", price: 0 },
  ])

  const handleAddTier = () => {
    setPriceTiers([...priceTiers, { duration: "", price: 0 }])
  }

  const handleRemoveTier = (index: number) => {
    if (priceTiers.length > 1) {
      setPriceTiers(priceTiers.filter((_, i) => i !== index))
    }
  }

  const handleUpdateTier = (index: number, field: "duration" | "price", value: string | number) => {
    const updated = [...priceTiers]
    if (field === "duration") {
      updated[index].duration = value as string
    } else {
      updated[index].price = Number.parseInt(value as string) || 0
    }
    setPriceTiers(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi semua tier harus terisi
    if (priceTiers.some((tier) => !tier.duration || tier.price === 0)) {
      alert("Semua durasi dan harga harus terisi!")
      return
    }

    const newProduct = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.toUpperCase(),
      description,
      icon: "✨",
      color: "from-purple-500 to-pink-500",
      colorDark: "from-purple-700 to-pink-700",
      pricing: priceTiers,
    }

    const products = JSON.parse(localStorage.getItem("customProducts") || "{}")
    if (!products[category]) {
      products[category] = []
    }
    products[category].push(newProduct)
    localStorage.setItem("customProducts", JSON.stringify(products))

    // Reset form
    setName("")
    setDescription("")
    setPriceTiers([
      { duration: "7 Hari", price: 0 },
      { duration: "30 Hari", price: 0 },
      { duration: "Permanen", price: 0 },
    ])

    alert("Produk berhasil ditambahkan!")
    onClose()
    window.location.reload()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-purple-500 border-opacity-30 max-w-md w-full p-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Tambah Produk Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "bot" | "executor" | "script")}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition"
            >
              <option value="bot">Bot</option>
              <option value="executor">Executor Roblox</option>
              <option value="script">Script</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Neural Hub"
              required
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan fitur dan keunggulan produk..."
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition resize-none"
            />
          </div>

          <div className="border-t border-purple-500 border-opacity-20 pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-300">Harga (Bisa Lebih dari 1)</p>
              <button
                type="button"
                onClick={handleAddTier}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Tier
              </button>
            </div>

            <div className="space-y-3">
              {priceTiers.map((tier, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tier.duration}
                      onChange={(e) => handleUpdateTier(index, "duration", e.target.value)}
                      placeholder="Contoh: 7 Hari"
                      className="w-full px-3 py-2 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={tier.price || ""}
                      onChange={(e) => handleUpdateTier(index, "price", e.target.value)}
                      placeholder="Harga"
                      className="w-full px-3 py-2 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition text-sm"
                    />
                  </div>
                  {priceTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition duration-200 mt-6"
          >
            Tambah Produk
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full text-gray-400 hover:text-gray-300 text-sm font-medium py-2 mt-3 transition"
        >
          Batal
        </button>
      </div>
    </div>
  )
}
