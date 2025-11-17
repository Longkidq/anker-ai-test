import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import './VotePage.css'

function VotePage() {
  const { user } = useAuth()
  const [works, setWorks] = useState([])
  const [userVotes, setUserVotes] = useState([])
  const [userVoteCount, setUserVoteCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(null)

  // 獲取用戶ID
  const getUserId = async () => {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('google_id', user.id)
      .single()
    return data?.id
  }

  // 加載作品列表
  const loadWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorks(data || [])
    } catch (error) {
      console.error('加載作品錯誤:', error)
    }
  }

  // 加載用戶投票記錄
  const loadUserVotes = async () => {
    try {
      const userId = await getUserId()
      if (!userId) return

      const { data, error } = await supabase
        .from('votes')
        .select('work_id')
        .eq('user_id', userId)

      if (error) throw error
      setUserVotes(data?.map(v => v.work_id) || [])
      setUserVoteCount(data?.length || 0)
    } catch (error) {
      console.error('加載投票記錄錯誤:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([loadWorks(), loadUserVotes()])
      setLoading(false)
    }
    fetchData()
  }, [user])

  // 處理投票
  const handleVote = async (workId) => {
    if (userVoteCount >= 3) {
      alert('您已經用完所有投票額度（3票）')
      return
    }

    if (userVotes.includes(workId)) {
      alert('您已經對這個作品投過票了')
      return
    }

    setVoting(workId)

    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('無法獲取用戶信息')
      }

      // 插入投票記錄
      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: userId,
          work_id: workId,
        })

      if (error) throw error

      // 更新本地狀態
      setUserVotes([...userVotes, workId])
      setUserVoteCount(userVoteCount + 1)

      // 更新作品得票數（觸發器會自動更新，但我們也手動刷新一下）
      await loadWorks()
    } catch (error) {
      console.error('投票錯誤:', error)
      alert('投票失敗，請重試：' + error.message)
    } finally {
      setVoting(null)
    }
  }

  return (
    <div className="vote-page">
      <div className="vote-container">
        <div className="vote-header">
          <h1 className="page-title">我要投票</h1>
          <Link to="/" className="back-link">
            返回首頁
          </Link>
        </div>

        <div className="vote-info">
          <div className="remaining-votes">
            剩餘投票數: {3 - userVoteCount} / 3
          </div>
        </div>

        {loading ? (
          <div className="loading">載入中...</div>
        ) : works.length === 0 ? (
          <div className="empty-state">
            <p>目前還沒有作品提交</p>
            <Link to="/submit" className="submit-link">
              成為第一個提交作品的人！
            </Link>
          </div>
        ) : (
          <div className="works-list">
            {works.map((work) => {
              const hasVoted = userVotes.includes(work.id)
              const canVote = !hasVoted && userVoteCount < 3
              
              return (
                <div key={work.id} className="work-card">
                  <h3 className="work-name">{work.name}</h3>
                  <p className="work-description">{work.description}</p>
                  <div className="work-footer">
                    <span className="vote-count">得票數: {work.votes_count || 0}</span>
                    <button 
                      className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                      onClick={() => handleVote(work.id)}
                      disabled={!canVote || voting === work.id}
                    >
                      {hasVoted ? '已投票' : voting === work.id ? '投票中...' : '投票'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VotePage

