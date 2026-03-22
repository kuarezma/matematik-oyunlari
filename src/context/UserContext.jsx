import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
    setLoading(false)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false })
        .limit(100)
      
      if (data) setLeaderboard(data)
    } catch (err) {
      console.log('Supabase not configured, using localStorage')
    }
  }

  const createUser = async (username) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, points: 0, games_played: 0 }])
        .select()
        .single()
      
      if (data) {
        setUser(data)
        return data
      }
    } catch (err) {
      console.log('Supabase not configured')
    }
    
    const newUser = {
      id: Date.now(),
      username,
      points: 0,
      games_played: 0,
      created_at: new Date().toISOString()
    }
    setUser(newUser)
    return newUser
  }

  const loginUser = async (username) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()
      
      if (data) {
        setUser(data)
        return data
      }
    } catch (err) {
      console.log('Supabase not configured')
    }
    return null
  }

  const addPoints = async (points) => {
    if (!user) return
    
    const updatedUser = { ...user, points: user.points + points, games_played: user.games_played + 1 }
    setUser(updatedUser)
    
    try {
      await supabase
        .from('users')
        .update({ points: updatedUser.points, games_played: updatedUser.games_played })
        .eq('id', user.id)
      
      const leaderEntry = { username: user.username, points: updatedUser.points, games_played: updatedUser.games_played }
      
      await supabase
        .from('leaderboard')
        .upsert([leaderEntry], { onConflict: 'username' })
      
      fetchLeaderboard()
    } catch (err) {
      console.log('Supabase not configured')
    }
  }

  const logout = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, leaderboard, loading, createUser, loginUser, addPoints, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)