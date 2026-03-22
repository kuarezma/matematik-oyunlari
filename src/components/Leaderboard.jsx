import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaArrowLeft, FaTrophy, FaStar, FaGamepad } from 'react-icons/fa'

export default function Leaderboard({ onBack }) {
  const { leaderboard, user } = useUser()

  const currentUserRank = leaderboard.findIndex(l => l.username === user?.username) + 1

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 max-w-4xl mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="glass-card px-4 py-2 flex items-center gap-2 text-white font-bold"
        >
          <FaArrowLeft /> Geri
        </motion.button>

        <h1 className="text-2xl md:text-3xl font-black rainbow-text">
          LİDER TABLOSU
        </h1>

        <div className="w-24"></div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        {leaderboard.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FaTrophy className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Henüz Kimse Yok!</h2>
            <p className="text-white/70">İlk oyunu sen oyna ve lider ol!</p>
          </div>
        ) : (
          <>
            {currentUserRank > 0 && currentUserRank > 5 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 mb-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="text-white font-bold">Senin Sıran</p>
                    <p className="text-white/70 text-sm">{user?.username} olarak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-kid-yellow font-black text-2xl">#{currentUserRank}</p>
                  <p className="text-white/70 text-sm">{user?.points}⭐</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex items-center justify-between ${
                    player.username === user?.username ? 'ring-4 ring-kid-yellow' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/20 text-white'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {player.username}
                        {player.username === user?.username && ' (Sen)'}
                      </p>
                      <p className="text-white/60 text-sm flex items-center gap-1">
                        <FaGamepad className="text-xs" /> {player.gamesPlayed} oyun
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-kid-yellow font-black text-2xl flex items-center gap-1">
                      <FaStar className="text-lg" /> {player.points}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}