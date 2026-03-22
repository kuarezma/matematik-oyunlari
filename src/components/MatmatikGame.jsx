import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

export default function MatmatikGame({ onBack }) {
  const { user, addPoints } = useUser()
  const [numbers, setNumbers] = useState([])
  const [selected, setSelected] = useState([])
  const [p1Cells, setP1Cells] = useState([])
  const [p2Cells, setP2Cells] = useState([])
  const [turn, setTurn] = useState(1)
  const [gameState, setGameState] = useState('start')
  const [winner, setWinner] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const useNumbers = () => {
    const nums = []
    const counts = { 1: 3, 2: 4, 3: 4, 4: 3, 5: 3, 6: 2, 7: 2, 8: 2, 9: 2 }
    Object.entries(counts).forEach(([num, count]) => {
      for (let i = 0; i < count; i++) nums.push(parseInt(num))
    })
    return nums.sort(() => Math.random() - 0.5)
  }

  const startGame = () => {
    setNumbers(useNumbers())
    setSelected([])
    setP1Cells([])
    setP2Cells([])
    setTurn(1)
    setWinner(null)
    setLastResult(null)
    setGameState('playing')
  }

  const selectNum = (num, index) => {
    if (selected.length >= 2) return
    if (selected.some(s => s.index === index)) return
    
    const newSel = [...selected, { num, index }]
    setSelected(newSel)
    
    if (newSel.length === 2) {
      if (turn === 1) {
        const result = newSel[0].num * newSel[1].num
        markCell(1, result, index)
      }
    }
  }

  const markCell = (player, result, lastIndex) => {
    const cells = player === 1 ? p1Cells : p2Cells
    
    if (result >= 0 && result < 36 && !p1Cells.includes(result) && !p2Cells.includes(result)) {
      const newCells = player === 1 ? [...p1Cells, result] : [...p2Cells, result]
      if (player === 1) setP1Cells(newCells)
      else setP2Cells(newCells)
      
      setLastResult(`${newSel[0].num} × ${newSel[1].num} = ${result}`)
      
      if (checkWin(newCells)) {
        setWinner(player)
        setGameState('ended')
        addPoints(50)
        return
      }
      
      if (p1Cells.length + p2Cells.length >= 34) {
        setWinner('draw')
        setGameState('ended')
        return
      }
    }
    
    setSelected([])
    setTurn(turn === 1 ? 2 : 1)
  }

  const newSel = selected

  const checkWin = (cells) => {
    const wins = [
      [0,1,2,3], [1,2,3,4], [2,3,4,5],
      [6,7,8,9], [7,8,9,10], [8,9,10,11],
      [12,13,14,15], [13,14,15,16], [14,15,16,17],
      [18,19,20,21], [19,20,21,22], [20,21,22,23],
      [24,25,26,27], [25,26,27,28], [26,27,28,29],
      [30,31,32,33], [31,32,33,34], [32,33,34,35],
      [0,6,12,18], [6,12,18,24], [12,18,24,30],
      [1,7,13,19], [7,13,19,25], [13,19,25,31],
      [2,8,14,20], [8,14,20,26], [14,20,26,32],
      [3,9,15,21], [9,15,21,27], [15,21,27,33],
      [4,10,16,22], [10,16,22,28], [16,22,28,34],
      [5,11,17,23], [11,17,23,29], [17,23,29,35],
    ]
    return wins.some(combo => combo.every(c => cells.includes(c)))
  }

  const getCellNumber = (idx) => {
    const allCells = [...p1Cells, ...p2Cells]
    return allCells.includes(idx) ? idx : ''
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
        
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <span className="text-6xl font-black text-white">MM</span>
          </motion.div>
          
          <h1 className="text-5xl font-black text-white mb-4 rainbow-text">MatMatik</h1>
          <p className="text-white/80 text-lg mb-4 max-w-md mx-auto">
            EBA dan bildigin meşhur çarpma oyunu! Iki oyuncu sirayla 2 sayi secer, carpar ve sonucu tabloda isaretler.
          </p>
          <p className="text-white/60 mb-8">4 lu hizaya ulasin kazanin!</p>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-red-500 text-white px-12 py-4 rounded-full font-black text-2xl shadow-lg"
          >
            OYUNA BASLA
          </motion.button>
        </div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">
            {winner === 'draw' ? '🤝' : winner === 1 ? '🔵' : '🔴'}
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {winner === 'draw' ? 'Berabere!' : `${winner === 1 ? 'Mavi' : 'Kirmizi'} Kazandi!`}
          </h1>
          
          <div className="glass-card p-8 inline-block mt-6 mb-6">
            <p className="text-white/70">Kazanan Puani</p>
            <p className="text-5xl font-black rainbow-text">+50</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="bg-red-500 text-white px-8 py-3 rounded-full font-black">Tekrar Oyna</button>
            <button onClick={onBack} className="bg-white/20 text-white px-8 py-3 rounded-full font-bold">Ana Sayfa</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 glass-card px-4 py-2 text-white font-bold z-10">Geri</button>
      
      <div className="flex justify-between items-center mb-4 max-w-lg mx-auto">
        <div className={`glass-card px-4 py-2 rounded-xl ${turn === 1 ? 'bg-blue-500 ring-4 ring-blue-300' : 'bg-white/10'}`}>
          <p className="text-white font-bold">Mavi Oyuncu</p>
          <p className="text-white text-2xl font-black">{p1Cells.length}</p>
        </div>
        <div className="text-2xl font-black text-white">VS</div>
        <div className={`glass-card px-4 py-2 rounded-xl ${turn === 2 ? 'bg-red-500 ring-4 ring-red-300' : 'bg-white/10'}`}>
          <p className="text-white font-bold">Kirmizi Oyuncu</p>
          <p className="text-white text-2xl font-black">{p2Cells.length}</p>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-xl font-bold">
          Sira: <span className={turn === 1 ? 'text-blue-400' : 'text-red-400'}>
            {turn === 1 ? 'Mavi' : 'Kirmizi'} Oyuncu
          </span>
        </p>
        {selected.length === 1 && (
          <p className="text-white/70 mt-1">Bir sayi daha secin</p>
        )}
        {selected.length === 2 && (
          <p className="text-kid-yellow mt-2 text-xl font-bold animate-pulse">
            {selected[0].num} × {selected[1].num} = {selected[0].num * selected[1].num}
          </p>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-6 gap-1 bg-white/10 p-2 rounded-xl">
          {Array.from({ length: 36 }, (_, i) => {
            const isP1 = p1Cells.includes(i)
            const isP2 = p2Cells.includes(i)
            return (
              <div
                key={i}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  isP1 ? 'bg-blue-500 text-white' :
                  isP2 ? 'bg-red-500 text-white' :
                  'bg-white/20 text-white/60'
                }`}
              >
                {i}
              </div>
            )
          })}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <p className="text-white/60 text-center mb-2">Sayilari secin (2 adet)</p>
        <div className="flex flex-wrap justify-center gap-2">
          {numbers.map((num, i) => {
            const isSelected = selected.some(s => s.index === i)
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => selectNum(num, i)}
                disabled={isSelected || selected.length >= 2}
                className={`w-14 h-14 rounded-xl font-black text-2xl transition-all ${
                  isSelected
                    ? 'bg-kid-yellow text-kid-purple scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {num}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}