import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'

const shapes = ['circle', 'square', 'triangle']
const colors = ['red', 'blue', 'green', 'yellow']

export default function ReactionGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [gameState, setGameState] = useState('start')
  const [shape, setShape] = useState(null)
  const [target, setTarget] = useState(null)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [showShape, setShowShape] = useState(false)
  const [reactionTime, setReactionTime] = useState(null)
  const [clicked, setClicked] = useState(false)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const totalRounds = 10

  useEffect(() => {
    if (gameState === 'playing' && showShape) {
      startTimeRef.current = Date.now()
    }
  }, [showShape, gameState])

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [gameState])

  const startGame = () => {
    setRound(0)
    setScore(0)
    setTime(0)
    setGameState('playing')
    nextRound()
  }

  const nextRound = () => {
    if (round >= totalRounds) {
      endGame()
      return
    }
    
    setShowShape(false)
    setClicked(false)
    setReactionTime(null)
    
    const delay = Math.random() * 2000 + 1000
    
    setTimeout(() => {
      const newShape = shapes[Math.floor(Math.random() * shapes.length)]
      const newColor = colors[Math.floor(Math.random() * colors.length)]
      setShape({ type: newShape, color: newColor })
      setShowShape(true)
    }, delay)
  }

  const handleClick = () => {
    if (!showShape || clicked) return
    
    const reaction = Date.now() - startTimeRef.current
    setReactionTime(reaction)
    setClicked(true)
    
    if (reaction < 500) {
      setScore(s => s + 100)
    } else if (reaction < 800) {
      setScore(s => s + 50)
    } else if (reaction < 1200) {
      setScore(s => s + 25)
    }
    
    setTimeout(() => {
      setRound(r => r + 1)
      nextRound()
    }, 1000)
  }

  const endGame = () => {
    setGameState('ended')
    addPoints(score)
  }

  const Shape = ({ type, color, size = 'medium' }) => {
    const s = size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-32 h-32' : 'w-20 h-20'
    
    if (type === 'circle') {
      return <div className={`${s} rounded-full bg-${color}-500`}></div>
    }
    if (type === 'square') {
      return <div className={`${s} bg-${color}-500`}></div>
    }
    if (type === 'triangle') {
      return (
        <div className={`${s}`} style={{
          backgroundColor: 'transparent',
          borderLeft: `40px solid transparent`,
          borderRight: `40px solid transparent`,
          borderBottom: `80px solid var(--color-${color}-500)`
        }}></div>
      )
    }
    return null
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold">Geri</button>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">Reflex</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Refleks Testi</h1>
          <p className="text-white/80 mb-8 max-w-md">Sekil apareldiginde hemen tikla! Ne kadar hizli olursan o kadar cok puan.</p>
          
          <button onClick={startGame} className="bg-cyan-500 text-white px-12 py-4 rounded-full font-black text-2xl">Basla</button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Test Bitti!</h1>
          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-6xl font-black rainbow-text">{score}</p>
            <p className="text-white/60">+{score} puan eklendi</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-cyan-500 text-white px-8 py-3 rounded-full font-black">Tekrar</button>
            <button onClick={onBack} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">Ana</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
      
      <div className="flex justify-between items-center mb-4 max-w-md mx-auto">
        <div className="glass-card px-4 py-2 text-white font-bold">Tur {round + 1}/{totalRounds}</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-white">{time}s</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-kid-yellow">{score}</div>
      </div>
      
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: showShape && !clicked ? 1.02 : 1 }}
      >
        {!showShape ? (
          <div className="text-center">
            <p className="text-white/70 text-xl mb-4">Bekle...</p>
            <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        ) : shape ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`relative w-32 h-32 flex items-center justify-center`}
          >
            {shape.type === 'circle' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-32 h-32 rounded-full ${
                  shape.color === 'red' ? 'bg-red-500' :
                  shape.color === 'blue' ? 'bg-blue-500' :
                  shape.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              ></motion.div>
            )}
            {shape.type === 'square' && (
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-32 h-32 ${
                  shape.color === 'red' ? 'bg-red-500' :
                  shape.color === 'blue' ? 'bg-blue-500' :
                  shape.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              ></motion.div>
            )}
            {shape.type === 'triangle' && (
              <div
                className={`w-0 h-0 border-l-[64px] border-r-[64px] border-b-[110px] border-l-transparent border-r-transparent ${
                  shape.color === 'red' ? 'border-b-red-500' :
                  shape.color === 'blue' ? 'border-b-blue-500' :
                  shape.color === 'green' ? 'border-b-green-500' : 'border-b-yellow-500'
                }`}
              ></div>
            )}
            
            {reactionTime && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-16 bg-white/20 px-4 py-2 rounded-full"
              >
                <span className="text-white font-bold">{reactionTime}ms</span>
                {reactionTime < 500 && <span className="text-green-400 ml-2">Mukemmel!</span>}
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </motion.div>
      
      <p className="text-center text-white/60 mt-8">
        {showShape && !clicked ? 'TIKLA!' : 'Sekli bekle...'}
      </p>
    </div>
  )
}