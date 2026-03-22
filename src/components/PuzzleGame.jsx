import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'

const puzzles = [
  {
    id: 1,
    question: "Turkceleri eslestir",
    items: [
      { left: 'Elma', right: 'Apple', emoji: '🍎' },
      { left: 'Ev', right: 'House', emoji: '🏠' },
      { left: 'Su', right: 'Water', emoji: '💧' },
      { left: 'Kitap', right: 'Book', emoji: '📚' },
      { left: 'Kopek', right: 'Dog', emoji: '🐶' },
    ]
  },
  {
    id: 2,
    question: "Matematik eslestir",
    items: [
      { left: '5 + 3', right: '8', emoji: '🔢' },
      { left: '10 - 4', right: '6', emoji: '🔢' },
      { left: '2 x 6', right: '12', emoji: '🔢' },
      { left: '20 / 4', right: '5', emoji: '🔢' },
      { left: '7 + 7', right: '14', emoji: '🔢' },
    ]
  },
  {
    id: 3,
    question: 'Sekilleri eslestir',
    items: [
      { left: 'Kare', right: 'Square', emoji: '■' },
      { left: 'Daire', right: 'Circle', emoji: '●' },
      { left: 'Ucgen', right: 'Triangle', emoji: '▲' },
      { left: 'Yildiz', right: 'Star', emoji: '★' },
      { left: 'Kalp', right: 'Heart', emoji: '♥' },
    ]
  },
  {
    id: 4,
    question: 'Zit kavramlar',
    items: [
      { left: 'Buyuk', right: 'Kucuk', emoji: '↔️' },
      { left: 'Sicak', right: 'Soguk', emoji: '🌡️' },
      { left: 'Hizli', right: 'Yavas', emoji: '🏃' },
      { left: 'Acik', right: 'Kapali', emoji: '🚪' },
      { left: 'Tatli', right: 'Ac', emoji: '🍬' },
    ]
  },
]

export default function PuzzleGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('start')
  const [matches, setMatches] = useState({})
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [shuffledLeft, setShuffledLeft] = useState([])
  const [shuffledRight, setShuffledRight] = useState([])

  const startGame = () => {
    setCurrentPuzzle(0)
    setScore(0)
    setMatches({})
    setSelectedLeft(null)
    loadPuzzle(0)
    setGameState('playing')
  }

  const loadPuzzle = (index) => {
    const puzzle = puzzles[index]
    setShuffledLeft([...puzzle.items].sort(() => Math.random() - 0.5))
    setShuffledRight([...puzzle.items].sort(() => Math.random() - 0.5))
    setMatches({})
    setSelectedLeft(null)
  }

  const handleLeftClick = (item) => {
    setSelectedLeft(item)
  }

  const handleRightClick = (item) => {
    if (!selectedLeft) return
    
    const puzzle = puzzles[currentPuzzle]
    const originalLeft = puzzle.items.find(i => i.left === selectedLeft.left)
    
    if (originalLeft && originalLeft.right === item.right) {
      setMatches(prev => ({
        ...prev,
        [selectedLeft.left]: item
      }))
      setScore(s => s + 20)
      setSelectedLeft(null)
    } else {
      setScore(s => Math.max(0, s - 5))
      setSelectedLeft(null)
    }
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const puzzle = puzzles[currentPuzzle]
      if (Object.keys(matches).length === puzzle.items.length) {
        if (currentPuzzle < puzzles.length - 1) {
          setTimeout(() => {
            setCurrentPuzzle(c => c + 1)
            loadPuzzle(c => c + 1)
          }, 1000)
        } else {
          setGameState('ended')
          addPoints(score)
        }
      }
    }
  }, [matches, currentPuzzle, gameState])

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold">Geri</button>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">Bulmaca</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Esleme Bulmacasi</h1>
          <p className="text-white/80 mb-8 max-w-md">Soldaki ve sagdaki esleri eslestir. Her dogru eslestirme +20 puan!</p>
          
          <button onClick={startGame} className="bg-pink-500 text-white px-12 py-4 rounded-full font-black text-2xl">Basla</button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Bravo!</h1>
          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-6xl font-black rainbow-text">{score}</p>
            <p className="text-white/60">+{score} puan eklendi</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-pink-500 text-white px-8 py-3 rounded-full font-black">Tekrar</button>
            <button onClick={onBack} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">Ana</button>
          </div>
        </div>
      </div>
    )
  }

  const puzzle = puzzles[currentPuzzle]

  return (
    <div className="min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
      
      <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
        <div className="glass-card px-4 py-2 text-white font-bold">Bulmaca {currentPuzzle + 1}/{puzzles.length}</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-kid-yellow">{score} puan</div>
      </div>
      
      <div className="glass-card p-6 mb-6">
        <h2 className="text-2xl font-black text-white text-center">{puzzle.question}</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          {shuffledLeft.map((item, i) => {
            const isMatched = matches[item.left]
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLeftClick(item)}
                disabled={!!isMatched}
                className={`w-full p-4 rounded-xl font-bold text-lg flex items-center gap-3 ${
                  isMatched ? 'bg-green-500 text-white' :
                  selectedLeft?.left === item.left ? 'bg-purple-500 text-white' :
                  'bg-white/20 text-white'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.left}</span>
                {isMatched && <span className="ml-auto text-2xl">✓</span>}
              </motion.button>
            )
          })}
        </div>
        
        <div className="space-y-2">
          {shuffledRight.map((item, i) => {
            const isMatched = Object.values(matches).some(m => m.right === item.right)
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRightClick(item)}
                disabled={!!isMatched}
                className={`w-full p-4 rounded-xl font-bold text-lg flex items-center gap-3 ${
                  isMatched ? 'bg-green-500 text-white opacity-50' :
                  selectedLeft ? 'bg-blue-500 text-white' :
                  'bg-white/20 text-white'
                }`}
              >
                <span>{item.right}</span>
                {isMatched && <span className="ml-auto text-2xl">✓</span>}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}