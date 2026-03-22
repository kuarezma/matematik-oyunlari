import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'

const levels = [
  { size: 5, speed: 300 },
  { size: 7, speed: 250 },
  { size: 9, speed: 200 },
  { size: 11, speed: 150 },
]

const symbols = ['★', '♠', '♣', '♥', '♦', '●', '■', '▲', '▼', '◆']

export default function MazeGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [level, setLevel] = useState(0)
  const [grid, setGrid] = useState([])
  const [player, setPlayer] = useState({ x: 0, y: 0 })
  const [goal, setGoal] = useState({ x: 0, y: 0 })
  const [path, setPath] = useState([])
  const [gameState, setGameState] = useState('start')
  const [time, setTime] = useState(0)
  const [score, setScore] = useState(0)
  const timerRef = useRef(null)
  const gridSize = levels[level].size

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [gameState])

  const generateMaze = (size) => {
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(1))
    const newPath = []
    let current = { x: 0, y: 0 }
    newPath.push({ ...current })
    
    const directions = [
      { dx: 0, dy: -1 }, { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
    ]
    
    for (let i = 0; i < size * size * 2; i++) {
      const validDirs = directions.filter(d => {
        const nx = current.x + d.dx * 2
        const ny = current.y + d.dy * 2
        return nx >= 0 && nx < size && ny >= 0 && ny < size && newGrid[ny][nx] === 1
      })
      
      if (validDirs.length === 0) break
      
      const dir = validDirs[Math.floor(Math.random() * validDirs.length)]
      newGrid[current.y + dir.dy][current.x + dir.dx] = 0
      current = { x: current.x + dir.dx * 2, y: current.y + dir.dy * 2 }
      newPath.push({ ...current })
    }
    
    setGrid(newGrid)
    setPath(newPath)
    setPlayer({ x: 0, y: 0 })
    setGoal({ x: size - 1, y: size - 1 })
  }

  const startGame = () => {
    setLevel(0)
    setScore(0)
    setTime(0)
    generateMaze(levels[0].size)
    setGameState('playing')
  }

  const movePlayer = (dx, dy) => {
    if (gameState !== 'playing') return
    
    const newX = player.x + dx
    const newY = player.y + dy
    
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && grid[newY][newX] === 0) {
      setPlayer({ x: newX, y: newY })
      
      if (newX === goal.x && newY === goal.y) {
        const baseScore = 100 * (level + 1)
        const timeBonus = Math.max(0, 60 - time)
        setScore(s => s + baseScore + timeBonus)
        
        if (level < levels.length - 1) {
          setTimeout(() => {
            setLevel(l => l + 1)
            generateMaze(levels[level + 1].size)
            setTime(0)
          }, 500)
        } else {
          endGame()
        }
      }
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') movePlayer(0, -1)
      else if (e.key === 'ArrowDown') movePlayer(0, 1)
      else if (e.key === 'ArrowLeft') movePlayer(-1, 0)
      else if (e.key === 'ArrowRight') movePlayer(1, 0)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [player, grid, gameState])

  const endGame = () => {
    setGameState('ended')
    addPoints(score)
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold">Geri</button>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">Labirent</span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Labirent Macerasi</h1>
          <p className="text-white/80 mb-8 max-w-md">Yoldaki yıldızları topla ve çıkışa ulaş! Ne kadar hızlı olursan o kadar çok puan.</p>
          
          <button onClick={startGame} className="bg-green-500 text-white px-12 py-4 rounded-full font-black text-2xl">Basla</button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Tebrikler!</h1>
          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-6xl font-black rainbow-text">{score}</p>
            <p className="text-white/60">+{score} puan eklendi</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-green-500 text-white px-8 py-3 rounded-full font-black">Tekrar</button>
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
        <div className="glass-card px-4 py-2 text-white font-bold">Seviye {level + 1}/{levels.length}</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-white">{time}s</div>
        <div className="glass-card px-4 py-2 text-2xl font-black text-kid-yellow">{score}</div>
      </div>
      
      <div 
        className="max-w-sm mx-auto grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((row, y) => (
          row.map((cell, x) => (
            <motion.div
              key={`${x}-${y}`}
              animate={{ scale: player.x === x && player.y === y ? 1.2 : 1 }}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl ${
                cell === 0 ? 'bg-white/20' : 'bg-purple-600'
              } ${x === goal.x && y === goal.y ? 'bg-green-500' : ''}`}
            >
              {x === goal.x && y === goal.y && '🏁'}
              {player.x === x && player.y === y && '😀'}
            </motion.div>
          ))
        ))}
      </div>
      
      <div className="mt-6 flex justify-center gap-2 max-w-sm mx-auto">
        <button onClick={() => movePlayer(0, -1)} className="glass-card px-6 py-3 text-2xl">↑</button>
        <button onClick={() => movePlayer(-1, 0)} className="glass-card px-6 py-3 text-2xl">←</button>
        <button onClick={() => movePlayer(0, 1)} className="glass-card px-6 py-3 text-2xl">↓</button>
        <button onClick={() => movePlayer(1, 0)} className="glass-card px-6 py-3 text-2xl">→</button>
      </div>
    </div>
  )
}