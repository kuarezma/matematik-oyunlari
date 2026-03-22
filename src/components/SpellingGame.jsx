import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaArrowLeft, FaCheck, FaTimes, FaVolumeUp, FaRedo } from 'react-icons/fa'

const words = [
  { word: 'APPLE', hint: 'Elma', emoji: '🍎' },
  { word: 'HOUSE', hint: 'Ev', emoji: 'Ana' },
  { word: 'WATER', hint: 'Su', emoji: '💧' },
  { word: 'BOOK', hint: 'Kitap', emoji: '📚' },
  { word: 'TREE', hint: 'Ağaç', emoji: '🌳' },
  { word: 'SUN', hint: 'Güneş', emoji: '☀️' },
  { word: 'MOON', hint: 'Ay', emoji: '🌙' },
  { word: 'STAR', hint: 'Yıldız', emoji: '⭐' },
  { word: 'FISH', hint: 'Balık', emoji: '🐟' },
  { word: 'BIRD', hint: 'Kuş', emoji: '🐦' },
  { word: 'CAT', hint: 'Kedi', emoji: '🐱' },
  { word: 'DOG', hint: 'Köpek', emoji: '🐶' },
  { word: 'FLOWER', hint: 'Çiçek', emoji: '🌸' },
  { word: 'RAIN', hint: 'Yağmur', emoji: '🌧️' },
  { word: 'CLOUD', hint: 'Bulut', emoji: '☁️' },
  { word: 'SNOW', hint: 'Kar', emoji: '❄️' },
  { word: 'BALL', hint: 'Top', emoji: '⚽' },
  { word: 'KITE', hint: 'Uçurtma', emoji: '🪁' },
  { word: 'RAINBOW', hint: 'Gökkuşağı', emoji: '🌈' },
  { word: 'BUTTERFLY', hint: 'Kelebek', emoji: '🦋' },
]

export default function SpellingGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [currentWord, setCurrentWord] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('start')
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [shuffledWords, setShuffledWords] = useState([])
  const [userInput, setUserInput] = useState('')
  const [attempts, setAttempts] = useState(0)

  const startGame = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10)
    setShuffledWords(shuffled)
    setCurrentWord(0)
    setScore(0)
    setUserInput('')
    setAttempts(0)
    setGameState('playing')
  }

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (gameState === 'playing' && shuffledWords[currentWord]) {
      setTimeout(() => {
        speakWord(shuffledWords[currentWord].word)
      }, 500)
    }
  }, [currentWord, gameState])

  const handleSubmit = () => {
    const word = shuffledWords[currentWord]
    const isCorrect = userInput.toUpperCase().trim() === word.word

    setFeedback(isCorrect ? 'correct' : 'wrong')
    setAttempts(a => a + 1)

    if (isCorrect) {
      setScore(s => s + (attempts === 0 ? 100 : 50))
      
      setTimeout(() => {
        setFeedback(null)
        setUserInput('')
        setAttempts(0)
        if (currentWord < shuffledWords.length - 1) {
          setCurrentWord(c => c + 1)
          speakWord(shuffledWords[currentWord + 1].word)
        } else {
          endGame()
        }
      }, 1000)
    } else {
      setTimeout(() => {
        setFeedback(null)
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const endGame = () => {
    setGameState('ended')
    addPoints(score)
  }

  const handleLetterClick = (letter) => {
    if (userInput.length < word.length) {
      setUserInput(userInput + letter.toUpperCase())
    }
  }

  const handleBackspace = () => {
    setUserInput(userInput.slice(0, -1))
  }

  const handleClear = () => {
    setUserInput('')
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
            className="w-32 h-32 bg-gradient-to-br from-kid-blue to-kid-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <span className="text-6xl">Kelime</span>
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-4">
            Kelime Ustası
          </h1>
          
          <p className="text-white/80 text-lg mb-8 max-w-md">
            İngilizce kelimeleri dinle ve doğru yaz! İpucu olarak emoji ve Türkçe anlamını göreceksin.
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-kid-blue text-white px-12 py-4 rounded-full font-black text-2xl shadow-lg"
          >
             OYUNA BAŞLA
          </motion.button>
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

          <h1 className="text-4xl font-black text-white mb-2">Harika!</h1>
          <p className="text-white/80 text-xl mb-6">Tüm kelimeleri bitirdin!</p>

          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-white/70">Toplam Puan</p>
            <p className="text-6xl font-black rainbow-text">{score}</p>
            <p className="text-white/60 mt-2">+{score} puan eklendi!</p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-kid-blue text-white px-8 py-3 rounded-full font-black text-xl"
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

  const word = shuffledWords[currentWord]

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
        <div className="flex justify-between items-center mb-8">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-white font-bold">{user?.username}</span>
            <span className="bg-kid-blue text-white px-2 py-1 rounded-full text-xs font-bold">
              {score}⭐
            </span>
          </div>

          <div className="glass-card px-4 py-2">
            <span className="text-white font-bold">
              Kelime {currentWord + 1} / {shuffledWords.length}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentWord}
          className="glass-card p-8 text-center mb-6"
        >
          <div className="text-8xl mb-4">{word.emoji}</div>
          
          <p className="text-white/70 text-xl mb-2">
            İpucu: {word.hint}
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => speakWord(word.word)}
            className="bg-kid-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto mb-4"
          >
            <FaVolumeUp /> Dinle
          </motion.button>

          <div className="flex justify-center gap-2 mb-4">
            {[...Array(word.word.length)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-12 rounded-lg flex items-center justify-center text-2xl font-black border-b-4 ${
                  userInput.length > i
                    ? 'bg-white text-gray-800 border-gray-300'
                    : 'bg-white/10 text-white border-white/30'
                }`}
              >
                {userInput[i] || ''}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-8xl">Dogru</span>
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-8xl">Yanlis</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-7 gap-1 mb-4 max-w-md mx-auto">
          {['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'].map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter)}
              disabled={userInput.length >= word.word.length || feedback === 'wrong'}
              className="bg-white text-gray-800 py-3 rounded-lg font-bold text-sm disabled:opacity-30 hover:bg-gray-200"
            >
              {letter}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackspace}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-bold"
          >
            Sil Sil
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold"
          >
            Temizle Temizle
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={userInput.length !== word.word.length || feedback}
          className="w-full max-w-md mx-auto block bg-green-500 text-white py-4 rounded-full font-black text-xl disabled:opacity-50"
        >
          <FaCheck className="inline mr-2" /> Kontrol Et
        </motion.button>
      </div>
    </div>
  )
}