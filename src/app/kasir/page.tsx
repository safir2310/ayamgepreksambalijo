'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  User,
  LogOut,
  Package,
  X,
  CreditCard,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  discount: number
  image: string | null
  stock: number
  category: {
    name: string
  }
  isRedeemable: boolean
}

interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

export default function KasirPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingOrder, setProcessingOrder] = useState(false)
  const [paymentReceived, setPaymentReceived] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      window.location.href = '/login'
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'cashier' && parsedUser.role !== 'admin') {
      toast.error('Akses Ditolak', {
        description: 'Halaman ini hanya untuk kasir',
        position: 'top-center'
      })
      window.location.href = '/dashboard'
      return
    }

    setUser(parsedUser)
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.filter((p: Product) => !p.isRedeemable))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        setCategories(await res.json())
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Stok Habis', {
        description: `${product.name} tidak tersedia`,
        position: 'top-center'
      })
      return
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error('Stok Tidak Cukup', {
            description: `Maksimal ${product.stock} item`,
            position: 'top-center'
          })
          return prevCart
        }

        toast.success('Jumlah Diperbarui', {
          description: `${product.name} ditambah ke keranjang`,
          position: 'top-center'
        })

        return prevCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * getDiscountedPrice(product)
              }
            : item
        )
      }

      toast.success('Ditambahkan ke Keranjang', {
        description: `${product.name} ditambahkan`,
        position: 'top-center'
      })

      return [
        ...prevCart,
        { product, quantity: 1, subtotal: getDiscountedPrice(product) }
      ]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = Math.max(0, item.quantity + delta)
            const maxStock = item.product.stock

            if (newQuantity > maxStock) {
              toast.error('Stok Tidak Cukup', {
                description: `Maksimal ${maxStock} item`,
                position: 'top-center'
              })
              return item
            }

            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * getDiscountedPrice(item.product)
            }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const getDiscountedPrice = (product: Product) => {
    return product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || product.category.name.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      toast.error('Keranjang Kosong', {
        description: 'Tambahkan produk ke keranjang terlebih dahulu',
        position: 'top-center'
      })
      return
    }

    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    const total = getCartTotal()
    const payment = parseFloat(paymentReceived)

    if (isNaN(payment) || payment < total) {
      toast.error('Pembayaran Tidak Cukup', {
        description: 'Masukkan jumlah pembayaran yang benar',
        position: 'top-center'
      })
      return
    }

    setProcessingOrder(true)

    try {
      const res = await fetch('/api/orders/cashier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: 'Kasir - ' + user.username,
          userPhone: user.phone || '-',
          userAddress: '-',
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: getDiscountedPrice(item.product),
            subtotal: item.subtotal
          })),
          total: total,
          paymentMethod: 'cash',
          cashReceived: payment,
          cashChange: payment - total
        })
      })

      if (res.ok) {
        const data = await res.json()

        toast.success('Pesanan Berhasil!', {
          description: `Kembalian: Rp ${(payment - total).toLocaleString('id-ID')}`,
          position: 'top-center'
        })

        // Print receipt
        printReceipt(data.order, payment, payment - total)

        // Reset cart and payment
        setCart([])
        setPaymentReceived('')
        setShowPaymentModal(false)

        // Refresh products to update stock
        fetchProducts()
      } else {
        const errorData = await res.json()
        toast.error('Gagal Memproses Pesanan', {
          description: errorData.error || 'Terjadi kesalahan',
          position: 'top-center'
        })
      }
    } catch (error) {
      toast.error('Terjadi Kesalahan', {
        description: 'Silakan coba lagi',
        position: 'top-center'
      })
    } finally {
      setProcessingOrder(false)
    }
  }

  const printReceipt = (order: any, payment: number, change: number) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const orderId = order.id.slice(-6).toUpperCase()
    let receiptContent = `
      <html>
        <head>
          <title>Struk Pesanan #${orderId}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
            }
            .header h1 {
              font-size: 16px;
              margin: 0;
              color: #f97316;
            }
            .order-info {
              margin-bottom: 15px;
            }
            .order-info p {
              margin: 5px 0;
            }
            .items {
              margin-bottom: 15px;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .total {
              font-size: 14px;
              font-weight: bold;
              text-align: right;
              margin: 10px 0;
            }
            .payment-info {
              margin-top: 15px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .payment-info p {
              margin: 5px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
            .change {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
              background: #f0fdf4;
              padding: 10px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AYAM GEPREK SAMBAL IJO</h1>
            <p>Sambal Pedas Mantap</p>
            <p style="font-size: 10px; margin-top: 5px;">${new Date().toLocaleString('id-ID')}</p>
          </div>

          <div class="order-info">
            <p><strong>No. Pesanan:</strong> #${orderId}</p>
            <p><strong>Kasir:</strong> ${user.username}</p>
          </div>

          <div class="items">
            <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">
              DETAIL PESANAN
            </div>
    `

    order.items.forEach((item: any, index: number) => {
      receiptContent += `
        <div class="item">
          <span>${item.product.name} x${item.quantity}</span>
          <span>Rp ${item.subtotal.toLocaleString('id-ID')}</span>
        </div>
      `
    })

    receiptContent += `
          </div>

          <div class="total">
            TOTAL: Rp ${order.total.toLocaleString('id-ID')}
          </div>

          <div class="payment-info">
            <p><strong>Metode Pembayaran:</strong> Tunai</p>
            <p><strong>Bayar:</strong> Rp ${payment.toLocaleString('id-ID')}</p>
          </div>

          <div class="change">
            KEMBALIAN: Rp ${change.toLocaleString('id-ID')}
          </div>

          <div class="footer">
            <p>Terima kasih telah berbelanja</p>
            <p>di Ayam Geprek Sambal Ijo</p>
            <p style="margin-top: 10px;">***</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(receiptContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <Package className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Memuat kasir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-orange-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-orange-600">KASIR</h1>
                <p className="text-xs text-gray-500">Ayam Geprek Sambal Ijo</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-orange-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className={
                        selectedCategory === 'all'
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'border-orange-200'
                      }
                    >
                      Semua
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={
                          selectedCategory === cat.slug
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'border-orange-200'
                        }
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <AnimatePresence>
                  {filteredProducts.map((product) => {
                    const discountedPrice = getDiscountedPrice(product)

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -3 }}
                        className="cursor-pointer"
                        onClick={() => addToCart(product)}
                      >
                        <Card
                          className={`overflow-hidden border-2 transition-all duration-300 ${
                            product.stock <= 0
                              ? 'border-gray-200 opacity-50'
                              : 'border-orange-100 hover:border-orange-300 hover:shadow-lg'
                          }`}
                        >
                          <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-orange-300" />
                              </div>
                            )}
                            {product.discount > 0 && (
                              <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold">
                                -{product.discount}%
                              </Badge>
                            )}
                            {product.stock <= 0 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge className="bg-red-500 text-white">Habis</Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.discount > 0 ? (
                                  <div>
                                    <p className="text-xs text-gray-400 line-through">
                                      Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-sm font-bold text-orange-600">
                                      Rp {discountedPrice.toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm font-bold text-orange-600">
                                    Rp {discountedPrice.toLocaleString('id-ID')}
                                  </p>
                                )}
                              </div>
                              <div className="bg-orange-100 rounded-full p-2">
                                <Plus className="w-4 h-4 text-orange-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada produk ditemukan</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-2 border-orange-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Keranjang</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {getCartCount()} item
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Keranjang kosong</p>
                    <p className="text-xs text-gray-400 mt-1">Klik produk untuk menambahkan</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <ScrollArea className="h-[calc(100vh-450px)] mb-4">
                      <div className="space-y-3">
                        <AnimatePresence>
                          {cart.map((item) => (
                            <motion.div
                              key={item.product.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="bg-orange-50 rounded-lg p-3 border border-orange-100"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Rp {getDiscountedPrice(item.product).toLocaleString('id-ID')} / item
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 rounded-full border-orange-200"
                                    onClick={() => updateQuantity(item.product.id, -1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold text-sm">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 rounded-full border-orange-200"
                                    onClick={() => updateQuantity(item.product.id, 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <p className="font-bold text-orange-600 text-sm">
                                  Rp {item.subtotal.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>

                    <Separator className="my-4" />

                    {/* Total and Checkout */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-gray-700">Total:</span>
                        <span className="text-orange-600">
                          Rp {getCartTotal().toLocaleString('id-ID')}
                        </span>
                      </div>

                      <Button
                        onClick={handleProcessOrder}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 text-base shadow-lg"
                        disabled={cart.length === 0}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proses Pembayaran
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Pembayaran</h2>
                    <p className="text-sm text-gray-500">Masukkan jumlah pembayaran</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Total Pembayaran
                  </label>
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                    <p className="text-3xl font-bold text-orange-600 text-center">
                      Rp {getCartTotal().toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Jumlah Uang Diterima
                  </label>
                  <Input
                    type="number"
                    value={paymentReceived}
                    onChange={(e) => setPaymentReceived(e.target.value)}
                    placeholder="Masukkan jumlah uang"
                    className="text-lg font-semibold border-orange-200 focus-visible:ring-orange-500"
                    autoFocus
                  />
                </div>

                {!isNaN(parseFloat(paymentReceived)) && parseFloat(paymentReceived) >= getCartTotal() && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Kembalian:</p>
                    <p className="text-2xl font-bold text-green-600 text-center">
                      Rp {(parseFloat(paymentReceived) - getCartTotal()).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={processingOrder || !paymentReceived || parseFloat(paymentReceived) < getCartTotal()}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 text-base shadow-lg"
                >
                  {processingOrder ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Konfirmasi Pembayaran
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
