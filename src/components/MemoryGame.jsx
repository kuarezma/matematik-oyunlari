import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaArrowLeft, FaRedo, FaStar } from 'react-icons/fa'

const emojis = ['', '🎮', '🎨', '🎵', '⚽', '🍕', '🌈', '⭐', '🎁', '🎈', '🦁', '🐱', '🦊', '🐶', '🐸', '🦋']

export default function MemoryGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameState, setGameState] = useState('start')
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameTimer, setGameTimer] = useState(null)

  const initializeGame = (difficulty = 'easy') => {
    const pairs = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 12
    const shuffled = [...emojis].slice(0, pairs).flatMap(e => [
      { id: Math.random(), emoji: e, matched: false },
      { id: Math.random(), emoji: e, matched: false }
    ]).sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setScore(0)
    setTimer(0)
    setGameState('playing')
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
      setGameTimer(interval)
      return () => clearInterval(interval)
    }
  }, [gameState])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      setMoves(m => m + 1)

      if (firstCard.emoji === secondCard.emoji) {
        setMatched([...matched, firstCard.emoji])
        setScore(s => s + 100)
        
        setTimeout(() => {
          setFlipped([])
          if (matched.length + 1 === cards.length / 2) {
            endGame()
          }
        }, 500)
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }, [flipped])

  const flipCard = (id) => {
    if (flipped.length < 2 && !flipped.includes(id) && !matched.includes(cards.find(c => c.id === id).emoji)) {
      setFlipped([...flipped, id])
    }
  }

  const endGame = () => {
    setGameState('ended')
    const finalScore = score + Math.max(0, 1000 - timer * 2)
    setScore(finalScore)
    addPoints(finalScore)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-4 left-4 glass-card px-4 py-2 flex items-center gap-2 text-white font-bold"
        >
          <FaArrowLeft /> Geri
        </motion.button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 bg-gradient-to-br from-kid-purple to-kid-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <span className="text-6xl">Hafiza</span>
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-4">
            Hafıza Krallığı
          </h1>
          
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Kartları eşleştir! Tüm kartları en az hamlede bulmaya çalış.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initializeGame('easy')}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-black text-xl"
            >
              Kolay Kolay (6 çift)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initializeGame('medium')}
              className="bg-yellow-500 text-white px-8 py-3 rounded-full font-black text-xl"
            >
              Zor Orta (8 çift)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initializeGame('hard')}
              className="bg-red-500 text-white px-8 py-3 rounded-full font-black text-xl"
            >
              Zor Zor (12 çift)
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-8xl mb-4"
          >
            Tebrikler
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-2">Tebrikler!</h1>
          <p className="text-white/80 text-xl mb-6">Tüm kartları buldun!</p>

          <div className="glass-card p-8 inline-block mb-6">
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div>
                <p className="text-white/70">Hamle</p>
                <p className="text-4xl font-black text-white">{moves}</p>
              </div>
              <div>
                <p className="text-white/70">Süre</p>
                <p className="text-4xl font-black text-white">{formatTime(timer)}</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="text-white/70">Toplam Puan</p>
              <p className="text-5xl font-black rainbow-text">{score}</p>
              <p className="text-white/60 mt-2">+{score} puan eklendi!</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initializeGame('easy')}
              className="bg-kid-pink text-white px-8 py-3 rounded-full font-black text-xl"
            >
              <FaRedo /> Tekrar Oyna
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-white/20 text-white px-8 py-3 rounded-full font-bold"
            >
              Ana Ana Sayfa
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const columns = cards.length <= 12 ? 4 : 4

  return (
    <div className="min-h-screen p-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-4 left-4 glass-card px-4 py-2 flex items-center gap-2 text-white font-bold z-10"
      >
        <FaArrowLeft /> Geri
      </motion.button>

      <div className="max-w-xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-white font-bold">{user?.username}</span>
            <span className="bg-kid-purple text-white px-2 py-1 rounded-full text-xs font-bold">
              {score}⭐
            </span>
          </div>

          <div className="glass-card px-4 py-2 text-center">
            <p className="text-white/60 text-xs">Süre</p>
            <p className="text-2xl font-black text-white">{formatTime(timer)}</p>
          </div>

          <div className="glass-card px-4 py-2 text-center">
            <p className="text-white/60 text-xs">Hamle</p>
            <p className="text-2xl font-black text-white">{moves}</p>
          </div>
        </div>

        <motion.div 
          layout
          className={`grid gap-3`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(card.id) || matched.includes(card.emoji)
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => flipCard(card.id)}
                  disabled={isFlipped || flipped.length >= 2}
                  className={`w-full aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all ${
                    isFlipped 
                      ? 'bg-white shadow-lg' 
                      : 'bg-gradient-to-br from-kid-purple to-kid-pink shadow-lg'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isFlipped ? (
                      <motion.span
                        key={card.emoji}
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                      >
                        {card.emoji}
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        ❓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}