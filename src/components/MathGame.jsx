import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaArrowLeft, FaStar, FaCheck, FaTimes, FaFire, FaBolt } from 'react-icons/fa'

export default function MathGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [currentProblem, setCurrentProblem] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameState, setGameState] = useState('start')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [streak, setStreak] = useState(0)
  const [problems, setProblems] = useState([])

  const generateProblem = () => {
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]
    let num1, num2, answer

    switch(op) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        break
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        break
    }

    return { num1, num2, op, answer }
  }

  const startGame = () => {
    const newProblems = Array.from({ length: 20 }, () => generateProblem())
    setProblems(newProblems)
    setCurrentProblem(0)
    setScore(0)
    setStreak(0)
    setTimeLeft(60)
    setGameState('playing')
    setAnswer('')
  }

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame()
    }
  }, [timeLeft, gameState])

  const endGame = () => {
    setGameState('ended')
    if (score > 0) {
      addPoints(score)
    }
  }

  const handleAnswer = (num) => {
    if (feedback) return
    
    const newAnswer = answer + num
    setAnswer(newAnswer)

    if (newAnswer.length >= 1) {
      const currentProb = problems[currentProblem]
      if (parseInt(newAnswer) === currentProb.answer) {
        setFeedback('correct')
        const newStreak = streak + 1
        setStreak(newStreak)
        const bonus = Math.min(newStreak, 5) * 5
        setScore(s => s + 10 + bonus)
        
        setTimeout(() => {
          setFeedback(null)
          setAnswer('')
          if (currentProblem < problems.length - 1) {
            setCurrentProblem(c => c + 1)
          } else {
            endGame()
          }
        }, 500)
      } else if (newAnswer.length >= String(currentProb.answer).length) {
        setFeedback('wrong')
        setStreak(0)
        
        setTimeout(() => {
          setFeedback(null)
          setAnswer('')
          if (currentProblem < problems.length - 1) {
            setCurrentProblem(c => c + 1)
          } else {
            endGame()
          }
        }, 500)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      handleAnswer(e.key)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [answer, feedback, currentProblem])

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
            className="w-32 h-32 bg-gradient-to-br from-kid-yellow to-kid-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <span className="text-6xl">Matematik</span>
          </motion.div>

          <h1 className="text-5xl font-black text-white mb-4">
            Matematik Yolculuğu
          </h1>
          
          <p className="text-white/80 text-xl mb-8 max-w-md">
            60 saniye içinde olabildiğince çok soru cevapla! Arka arkaya doğru cevap vererek bonus puan kazan!
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-kid-yellow text-kid-purple px-12 py-4 rounded-full font-black text-2xl shadow-lg btn-neon"
          >
             OYUNA BAŞLA
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (gameState === 'ended') {
    const rank = Math.floor(score / 50) + 1
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
            
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-2">Oyun Bitti!</h1>
          
          <p className="text-white/80 text-xl mb-6">
            Harika oyun {user?.username}!
          </p>

          <div className="glass-card p-8 inline-block mb-6">
            <p className="text-white/70 text-lg">Toplam Puan</p>
            <p className="text-6xl font-black rainbow-text">{score}</p>
            <p className="text-white/60 mt-2">+{score} puan eklendi!</p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-kid-yellow text-kid-purple px-8 py-3 rounded-full font-black text-xl"
            >
              Tekrar Tekrar Oyna
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

  const currentProb = problems[currentProblem]

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

      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-white font-bold">{user?.username}</span>
            <span className="bg-kid-yellow text-kid-purple px-2 py-1 rounded-full text-xs font-bold">
              {score} puan
            </span>
          </div>

          <div className={`glass-card px-6 py-2 flex items-center gap-2 ${timeLeft <= 10 ? 'animate-pulse bg-red-500/30' : ''}`}>
            <FaBolt className={timeLeft <= 10 ? 'text-red-400' : 'text-kid-yellow'} />
            <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>

          {streak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="glass-card px-4 py-2 flex items-center gap-2 bg-orange-500/30"
            >
              <FaFire className="text-orange-400 animate-pulse" />
              <span className="text-orange-400 font-black">x{streak}</span>
            </motion.div>
          )}
        </div>

        <div className="glass-card p-8 text-center mb-8">
          <p className="text-white/60 mb-4">
            Soru {currentProblem + 1} / {problems.length}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProblem}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-6xl md:text-8xl font-black text-white mb-8"
            >
              {currentProb.num1} {currentProb.op === '*' ? '×' : currentProb.op} {currentProb.num2} = ?
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mb-4">
            {[...Array(Math.max(...problems.map(p => String(p.answer).length)))].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-16 rounded-xl flex items-center justify-center text-3xl font-black ${
                  answer.length > i 
                    ? feedback === 'correct' 
                      ? 'bg-green-500 text-white'
                      : feedback === 'wrong'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/30'
                } border-2 border-white/20`}
              >
                {answer[i] || '_'}
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
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[1,2,3,4,5,6,7,8,9,0].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(String(num))}
              disabled={feedback !== null}
              className="glass-card py-6 text-3xl font-black text-white hover:bg-white/30 disabled:opacity-50"
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}