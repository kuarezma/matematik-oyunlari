import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { FaTrophy, FaSignOutAlt, FaUser, FaStar, FaCalculator, FaBrain, FaSpellCheck } from 'react-icons/fa'

const games = [
  { id: 'matmatik', title: 'MatMatik', description: 'EBA dan hatla ünlü çarpma oyunu! Rakipini yen.', icon: FaStar, color: 'from-red-500 to-orange-500', bgColor: 'bg-gradient-to-br from-red-500 to-orange-500' },
  { id: 'math', title: 'Matematik Yolculugu', description: 'Toplama, cikarma, carpma ve bolme islemleri ile matematik dunya sina dal!', icon: FaCalculator, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 'memory', title: 'Hafiza Kralligi', description: 'Kartlari eslestir, hafizaini guclendir ve en iyi sonuclari elde et!', icon: FaBrain, color: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'spelling', title: 'Kelime Ustasi', description: 'Ingilizce kelimeleri dogru yaz, vocabulary ni gelistir!', icon: FaSpellCheck, color: 'from-blue-500 to-green-500', bgColor: 'bg-gradient-to-br from-blue-500 to-green-500' },
  { id: 'maze', title: 'Labirent Macerasi', description: 'Labirentte yolunu bul, sureyi minimuma indir!', icon: FaStar, color: 'from-green-500 to-blue-500', bgColor: 'bg-gradient-to-br from-green-500 to-blue-500' },
  { id: 'puzzle', title: 'Esleme Bulmacasi', description: 'Esleri eslestir, bulmacalari cozmeyi ogren!', icon: FaTrophy, color: 'from-pink-500 to-purple-500', bgColor: 'bg-gradient-to-br from-pink-500 to-purple-500' },
  { id: 'opposite', title: 'Zit Kavramlar', description: 'Kelimenin zit kavramini bul, bilgini test et!', icon: FaUser, color: 'from-orange-500 to-red-500', bgColor: 'bg-gradient-to-br from-orange-500 to-red-500' },
  { id: 'reaction', title: 'Refleks Testi', description: 'Reflekslerini test et, ne kadar hizlisin?', icon: FaStar, color: 'from-cyan-500 to-blue-500', bgColor: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
  { id: 'typing', title: 'Hizli Yazma', description: 'Hizli ve dogru yazmayi ogren!', icon: FaUser, color: 'from-indigo-500 to-purple-500', bgColor: 'bg-gradient-to-br from-indigo-500 to-purple-500' },
]

export default function Home({ onNavigate, onPlayGame }) {
  const { user, logout, leaderboard } = useUser()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="w-12 h-12 bg-kid-yellow rounded-xl flex items-center justify-center shadow-lg">
            <FaStar className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black rainbow-text hidden sm:block">
            MATEMATIK OYUNLARI
          </h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('leaderboard')}
            className="glass-card px-4 py-2 flex items-center gap-2 text-white font-bold hover:bg-white/20 transition-all"
          >
            <FaTrophy className="text-kid-yellow" />
            <span className="hidden md:inline">Lider Tablosu</span>
          </motion.button>

          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <FaUser className="text-kid-blue" />
            <span className="text-white font-bold">{user?.username}</span>
            <span className="bg-kid-yellow text-kid-purple px-2 py-1 rounded-full text-xs font-bold">
              {user?.points} puan
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="glass-card px-4 py-2 text-kid-red font-bold"
          >
            <FaSignOutAlt />
          </motion.button>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
          Oyun Zamani!
        </h2>
        <p className="text-white/80 text-xl">Hangi oyunu oynamak istersin?</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlayGame(game.id)}
              className={`${game.bgColor} rounded-3xl p-6 cursor-pointer shadow-2xl`}
            >
              <div className="w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <game.icon className="text-5xl text-white" />
              </div>
              
              <h3 className="text-xl font-black text-white text-center mb-3">
                {game.title}
              </h3>
              
              <p className="text-white/90 text-center text-sm">
                {game.description}
              </p>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mt-6 flex justify-center"
              >
                <div className="bg-white text-gray-800 px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg">
                  <span>▶</span> OYNA
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 max-w-md mx-auto"
        >
          <h3 className="text-2xl font-black text-center mb-4 text-white">
            En Iyi 5 Oyuncu
          </h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((player, index) => (
              <motion.div
                key={player.username}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex justify-between items-center p-3 rounded-xl ${
                  index === 0 ? 'bg-yellow-400/30' :
                  index === 1 ? 'bg-gray-300/30' :
                  index === 2 ? 'bg-orange-400/30' : 'bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black">
                    {index + 1}.
                  </span>
                  <span className="text-white font-bold">{player.username}</span>
                </div>
                <span className="text-kid-yellow font-black">{player.points} puan</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}