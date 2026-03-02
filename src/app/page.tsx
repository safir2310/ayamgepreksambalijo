'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  ChefHat,
  ShoppingCart,
  Clock,
  Star,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Flame,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Utensils,
  Truck,
  Shield,
  Heart
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  discount: number
  image: string | null
  isPromotion: boolean
  isNew: boolean
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        // Get first 6 products, sorted by isPromotion, then isNew, then order
        const sorted = data
          .sort((a: Product, b: Product) => {
            if (a.isPromotion && !b.isPromotion) return -1
            if (!a.isPromotion && b.isPromotion) return 1
            if (a.isNew && !b.isNew) return -1
            if (!a.isNew && b.isNew) return 1
            return (a.isPromotion ? 0 : a.order) - (b.isPromotion ? 0 : b.order)
          })
          .slice(0, 6)
        setFeaturedProducts(sorted)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Flame className="w-8 h-8" />,
      title: 'Sambal Pedas Otentik',
      description: 'Sambal hijau dengan resep rahasia keluarga, memberikan sensasi pedas yang tak terlupakan'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Pengiriman Cepat',
      description: 'Pesanan sampai dalam waktu singkat dengan tetap menjaga kualitas dan kehangatan'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bahan Berkualitas',
      description: 'Menggunakan ayam segar pilihan dan bumbu-bumbu alami tanpa pengawet'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Pelayanan Ramah',
      description: 'Tim kami siap melayani dengan senyum untuk pengalaman berbelanja terbaik'
    }
  ]

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Pelanggan Puas', value: '10K+' },
    { icon: <Utensils className="w-6 h-6" />, label: 'Menu Tersedia', value: '50+' },
    { icon: <Star className="w-6 h-6" />, label: 'Rating', value: '4.9' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Pesanan Harian', value: '500+' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
                <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-orange-600 leading-tight">
                  AYAM GEPREK
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 -mt-1">SAMBAL IJO</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                Menu
              </a>
              <a href="#about" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                Tentang
              </a>
              <a href="#contact" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                Kontak
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-4 sm:px-6">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 sm:px-6">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-50 opacity-50" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Award className="w-4 h-4" />
                Best Fried Chicken 2024
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Rasakan Sensasi{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Sambal Ijo
                </span>{' '}
                Pedas Mantap!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Ayam geprek dengan sambal hijau otentik resep keluarga, dikombinasikan dengan nasi hangat dan lalapan segar. 
                Cita rasa yang akan membuat ketagihan!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 py-6 shadow-lg shadow-orange-200"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Pesan Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 text-lg px-8 py-6"
                  >
                    <ChefHat className="w-5 h-5 mr-2" />
                    Lihat Menu
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                      {stat.icon}
                      <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-3xl opacity-20 animate-pulse" />
                <Card className="relative h-full bg-white/80 backdrop-blur-sm border-2 border-orange-100 shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Ayam Geprek
                    </h3>
                    <p className="text-orange-600 font-semibold text-lg mb-4">
                      Sambal Pedas Mantap
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Nikmati sensasi pedas yang tak terlupakan
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman kuliner terbaik dengan kualitas dan rasa yang tak tertandingi
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="menu" className="py-16 sm:py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Menu Favorit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilihan menu terbaik yang paling dicari pelanggan kami
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                    <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Utensils className="w-16 h-16 text-orange-300" />
                        </div>
                      )}
                      {product.isPromotion && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          Promo
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          Baru
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm h-10">
                        {product.description || 'Menu spesial yang wajib dicoba'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount > 0 ? (
                            <>
                              <p className="text-lg font-bold text-red-600">
                                Rp {((product.price * (100 - product.discount)) / 100).toLocaleString('id-ID')}
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                Rp {product.price.toLocaleString('id-ID')}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-orange-600">
                              Rp {product.price.toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <Link href="/login">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Pesan
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg"
              >
                Lihat Semua Menu
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Siap Mencoba Sensasi Pedasnya?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl text-orange-100 mb-8 max-w-2xl mx-auto"
            >
              Daftar sekarang dan nikmati berbagai menu spesial kami dengan harga spesial untuk member baru!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Daftar Sekarang - Gratis!
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami siap melayani Anda dengan sepenuh hati
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Alamat</h3>
                  <p className="text-gray-600">
                    Jl. Contoh No. 123<br />
                    Kota, Indonesia
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Telepon / WhatsApp</h3>
                  <p className="text-gray-600">
                    +62 852 6081 2758<br />
                    Siap melayani 24/7
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 text-center h-full">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">
                    Senin - Minggu<br />
                    10:00 - 22:00 WIB
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-6 mt-12"
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-orange-100 to-orange-200 w-14 h-14 rounded-full flex items-center justify-center text-orange-600 hover:scale-110 transition-transform"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-orange-100 to-orange-200 w-14 h-14 rounded-full flex items-center justify-center text-orange-600 hover:scale-110 transition-transform"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a
              href="https://wa.me/6285260812758"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-orange-100 to-orange-200 w-14 h-14 rounded-full flex items-center justify-center text-orange-600 hover:scale-110 transition-transform"
            >
              <Phone className="w-7 h-7" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 border-t border-orange-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AYAM GEPREK</h3>
                  <p className="text-orange-400 text-sm">SAMBAL IJO</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Sambal pedas mantap yang membuat ketagihan. Nikmati sensasi pedas yang tak terlupakan!
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#menu" className="hover:text-orange-400 transition-colors">Ayam Geprek</a></li>
                <li><a href="#menu" className="hover:text-orange-400 transition-colors">Paket Hemat</a></li>
                <li><a href="#menu" className="hover:text-orange-400 transition-colors">Minuman</a></li>
                <li><a href="#menu" className="hover:text-orange-400 transition-colors">Tambahan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Tentang</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-orange-400 transition-colors">Cerita Kami</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition-colors">Lokasi</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Karir</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Akun</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Daftar</Link></li>
                <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Pesanan Saya</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm text-center sm:text-left">
                © 2024 Ayam Geprek Sambal Ijo. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/6285260812758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
