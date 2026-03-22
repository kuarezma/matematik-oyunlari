import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

const sentences = [
  "Matematik guzel bir derstir.",
  "Okula her gun gitmeliyiz.",
  "Kitap okumak cok faydalidir.",
  "Spor yapmak sagliklidir.",
  "Sabah erken kalkmak iyidir.",
  "Derslerinde basarili ol.",
  "Arkadaslarla oynamak eglencelidir.",
  "Ev odevlerini yapmalisin.",
  "Gelecekte doktor olacagim.",
  "Bilgisayar programlamak ogreniyorum.",
  "Yuzme havuzda yuzmek superdir.",
  "Muzik dersinde sarki söylüyoruz.",
  "Resim yapmayi seviyorum.",
  "Fen laboratuvarda deney yapiyoruz.",
  "Tarih dersinde Osmanliyi ögreniyoruz.",
]

export default function TypingGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [currentSentence, setCurrentSentence] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [gameState, setGameState] = useState('start')
  const [errors, setErrors] = useState(0)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (gameState === 'playing' && time > 0) {
      timerRef.current = setTimeout(() => setTime(t => t - 1), 1000)
      return () => clearTimeout(timerRef.current)
    } else if (time === 0 && gameState === 'playing') {
      endGame()
    }
  }, [time, gameState])

  const startGame = () => {
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)])
    setUserInput('')
    setScore(0)
    setTime(60)
    setErrors(0)
    setGameState('playing')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    
    if (value === currentSentence) {
      setScore(s => s + value.length * 2)
      setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)])
      setUserInput('')
    }
    
    let err = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentSentence[i]) err++
    }
    setErrors(err)
  }

  const endGame = () => {
    setGameState('ended')
    const finalScore = Math.max(0, score - errors * 5)
    addPoints(finalScore)
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold">Geri</button>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">Yazi</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Hizli Yazma</h1>
          <p className="text-white/80 mb-8 max-w-md">Verilen cumleyi dogru ve hizli yaz.Yanlis yazma puan kiranidir!</p>
          
          <button onClick={startGame} className="bg-indigo-500 text-white px-12 py-4 rounded-full font-black text-2xl">Basla</button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Süre Doldu!</h1>
          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-6xl font-black rainbow-text">{Math.max(0, score - errors * 5)}</p>
            <p className="text-white/60">+{Math.max(0, score - errors * 5)} puan eklendi</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-indigo-500 text-white px-8 py-3 rounded-full font-black">Tekrar</button>
            <button onClick={onBack} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">Ana</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
      
      <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
        <div className="glass-card px-4 py-2 text-white font-bold text-xl">{time}s</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-kid-yellow">{score}</div>
        <div className="glass-card px-4 py-2 text-red-400 font-bold">Hatalar: {errors}</div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 mb-8 max-w-2xl mx-auto"
      >
        <p className="text-white/60 mb-2">Asagiya yaz:</p>
        <p className="text-2xl md:text-3xl font-black text-white leading-relaxed">
          {currentSentence.split('').map((char, i) => (
            <span key={i} className={
              i < userInput.length
                ? userInput[i] === char ? 'text-green-400' : 'text-red-400'
                : 'text-white'
            }>{char}</span>
          ))}
        </p>
      </motion.div>
      
      <div className="max-w-2xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Buraya yaz..."
          className="w-full p-6 text-2xl rounded-2xl bg-white/20 text-white placeholder-white/50 border-4 border-white/30 focus:border-indigo-500 outline-none"
          autoComplete="off"
        />
      </div>
    </div>
  )
}