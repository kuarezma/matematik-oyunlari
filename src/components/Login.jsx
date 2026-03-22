import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaStar, FaGamepad, FaTrophy } from 'react-icons/fa'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const { createUser, loginUser } = useUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) return
    
    if (isRegister) {
      createUser(username.trim())
    } else {
      const user = loginUser(username.trim())
      if (!user) {
        alert('Kullanici bulunamadi! Once kayit olun.')
        return
      }
    }
    onLogin()
  }

  return (
    <div className="text-center">
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-block mb-8"
      >
        <div className="w-32 h-32 bg-kid-yellow rounded-full flex items-center justify-center shadow-2xl">
          <FaGamepad className="text-6xl text-white" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black mb-2 rainbow-text"
      >
        MATEMATIK DUNYASI
      </motion.h1>
      
      <p className="text-white/80 text-xl mb-8">Eglenerek ogren, lider ol!</p>

      <form onSubmit={handleSubmit} className="glass-card p-8 inline-block">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isRegister ? 'Yeni Oyuncuyu Karsiliyoruz!' : 'Hos Geldin!'}
        </h2>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanici adin..."
          className="w-full px-6 py-4 text-xl rounded-full border-4 border-white/30 bg-white/20 text-white placeholder-white/60 focus:outline-none focus:border-kid-yellow transition-all"
          maxLength={15}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 py-4 px-8 bg-kid-yellow text-kid-purple font-black text-xl rounded-full btn-neon"
        >
          {isRegister ? 'Haydi Baslayalim!' : 'Oyuna Gir'}
        </motion.button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="mt-4 text-white/70 hover:text-white underline"
        >
          {isRegister ? 'Zaten hesabin var mi? Giris yap' : 'Yeni oyuncu musun? Kayit ol'}
        </button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-center gap-8"
      >
        <div className="glass-card px-6 py-4 text-center">
          <FaStar className="text-3xl text-kid-yellow mx-auto mb-2" />
          <p className="text-white font-bold">Puan Kazan</p>
        </div>
        <div className="glass-card px-6 py-4 text-center">
          <FaTrophy className="text-3xl text-kid-orange mx-auto mb-2" />
          <p className="text-white font-bold">Lider Ol</p>
        </div>
      </motion.div>
    </div>
  )
}