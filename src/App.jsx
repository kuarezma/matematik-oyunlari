import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserProvider } from './context/UserContext'
import Login from './components/Login'
import Home from './components/Home'
import Leaderboard from './components/Leaderboard'
import MathGame from './components/MathGame'
import MemoryGame from './components/MemoryGame'
import SpellingGame from './components/SpellingGame'
import MazeGame from './components/MazeGame'
import PuzzleGame from './components/PuzzleGame'
import OppositeGame from './components/OppositeGame'
import ReactionGame from './components/ReactionGame'
import TypingGame from './components/TypingGame'
import MatmatikGame from './components/MatmatikGame'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentGame, setCurrentGame] = useState(null)

  const navigate = (page) => {
    setCurrentPage(page)
    setCurrentGame(null)
  }

  const playGame = (gameId) => {
    setCurrentGame(gameId)
    setCurrentPage('game')
  }

  const gameComponents = {
    matmatik: MatmatikGame,
    math: MathGame,
    memory: MemoryGame,
    spelling: SpellingGame,
    maze: MazeGame,
    puzzle: PuzzleGame,
    opposite: OppositeGame,
    reaction: ReactionGame,
    typing: TypingGame,
  }

  const GameComponent = currentGame ? gameComponents[currentGame] : null

  return (
    <UserProvider>
      <div className="min-h-screen relative overflow-hidden">
        <div className="floating-shapes absolute inset-0 pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          {currentPage === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center min-h-screen"
            >
              <Login onLogin={() => navigate('home')} />
            </motion.div>
          )}

          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Home 
                onNavigate={navigate} 
                onPlayGame={playGame}
              />
            </motion.div>
          )}

          {currentPage === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Leaderboard onBack={() => navigate('home')} />
            </motion.div>
          )}

          {currentPage === 'game' && GameComponent && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <GameComponent onBack={() => navigate('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserProvider>
  )
}

export default App