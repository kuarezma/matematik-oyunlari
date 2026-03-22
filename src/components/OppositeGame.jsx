import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'

const opposites = [
  { word: 'Buyuk', opposite: 'Kucuk', emoji: '↔️', hint: 'Buyuk un ziddi' },
  { word: 'Sicak', opposite: 'Soguk', emoji: '🌡️', hint: 'Sicak in ziddi' },
  { word: 'Hizli', opposite: 'Yavas', emoji: '🏃', hint: 'Hizli nin ziddi' },
  { word: 'Acik', opposite: 'Kapali', emoji: '🚪', hint: 'Acik in ziddi' },
  { word: 'Tatli', opposite: 'Ac', emoji: '🍬', hint: 'Tatli nin ziddi' },
  { word: 'Isik', opposite: 'Karanlik', emoji: '💡', hint: 'Isik in ziddi' },
  { word: 'Gokyuzu', opposite: 'Yer', emoji: '🌍', hint: 'Gokyuzu nun ziddi' },
  { word: 'Gunduz', opposite: 'Gece', emoji: '☀️', hint: 'Gunduz un ziddi' },
  { word: 'Dolu', opposite: 'Bos', emoji: '📦', hint: 'Dolu nun ziddi' },
  { word: 'Gulmek', opposite: 'Aglamak', emoji: '😄', hint: 'Gulmek in ziddi' },
]

export default function OppositeGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [words, setWords] = useState([])
  const [options, setOptions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameState, setGameState] = useState('start')
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [gameState])

  const startGame = () => {
    const shuffled = [...opposites].sort(() => Math.random() - 0.5).slice(0, 10)
    setWords(shuffled)
    setCurrent(0)
    setScore(0)
    setTime(0)
    generateOptions(shuffled[0])
    setGameState('playing')
  }

  const generateOptions = (currentWord) => {
    const correct = currentWord.opposite
    const others = opposites.filter(o => o.word !== currentWord.word).map(o => o.opposite)
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...shuffled, correct].sort(() => Math.random() - 0.5)
    setOptions(options)
  }

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    
    if (option === words[current].opposite) {
      setFeedback('correct')
      setScore(s => s + 10 + Math.max(0, 10 - time))
      setTimeout(() => {
        setFeedback(null)
        setSelected(null)
        if (current < words.length - 1) {
          setCurrent(c => c + 1)
          generateOptions(words[current + 1])
        } else {
          setGameState('ended')
          addPoints(score)
        }
      }, 500)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setFeedback(null)
        setSelected(null)
      }, 500)
    }
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold">Geri</button>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">Zit</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Zit Kavramlar</h1>
          <p className="text-white/80 mb-8 max-w-md">Verilen kelimenin zit kavramini sec. Hizli cevap ver bonus puan kazan!</p>
          
          <button onClick={startGame} className="bg-orange-500 text-white px-12 py-4 rounded-full font-black text-2xl">Basla</button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Harika!</h1>
          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-white/70 mb-2">Tamamlanan:</p>
            <p className="text-4xl font-black text-white">{words.length}</p>
            <p className="text-6xl font-black rainbow-text mt-4">{score}</p>
            <p className="text-white/60">+{score} puan eklendi</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-orange-500 text-white px-8 py-3 rounded-full font-black">Tekrar</button>
            <button onClick={onBack} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">Ana</button>
          </div>
        </div>
      </div>
    )
  }

  const currentWord = words[current]
  const correctOption = currentWord.opposite

  return (
    <div className="min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
      
      <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
        <div className="glass-card px-4 py-2 text-white font-bold">{current + 1}/{words.length}</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-white">{time}s</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-kid-yellow">{score}</div>
      </div>
      
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center mb-8 max-w-md mx-auto"
      >
        <div className="text-6xl mb-4">{currentWord.emoji}</div>
        <h2 className="text-3xl font-black text-white mb-2">{currentWord.word}</h2>
        <p className="text-white/60">{currentWord.hint}</p>
        
        {feedback === 'wrong' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4">
            <p className="text-red-400 font-bold">Dogru cevap: {correctOption}</p>
          </motion.div>
        )}
      </motion.div>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {options.map((option, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option)}
            disabled={!!selected}
            className={`p-6 rounded-2xl font-black text-xl ${
              selected === option
                ? option === correctOption
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : selected && option === correctOption
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}