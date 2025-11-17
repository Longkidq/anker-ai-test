import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import './SubmitPage.css'

function SubmitPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [workName, setWorkName] = useState('')
  const [workDescription, setWorkDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // 1. 確保用戶在users表中存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', user.id)
        .single()

      let userId

      if (existingUser) {
        userId = existingUser.id
      } else {
        // 如果用戶不存在，創建新用戶
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            google_id: user.id,
            name: user.user_metadata?.full_name || user.email || '用戶',
            email: user.email,
          })
          .select('id')
          .single()

        if (userError) throw userError
        userId = newUser.id
      }

      // 2. 提交作品
      const { error: workError } = await supabase
        .from('works')
        .insert({
          name: workName.trim(),
          description: workDescription.trim(),
          user_id: userId,
        })

      if (workError) throw workError

      // 3. 成功提示
      setMessage('作品提交成功！')
      setWorkName('')
      setWorkDescription('')

      // 4. 2秒後跳轉到投票頁
      setTimeout(() => {
        navigate('/vote')
      }, 2000)
    } catch (error) {
      console.error('提交錯誤:', error)
      setMessage('提交失敗，請重試：' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="submit-page">
      <div className="submit-container">
        <h1 className="page-title">提交作品</h1>
        
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label htmlFor="workName">作品名稱</label>
            <input
              type="text"
              id="workName"
              value={workName}
              onChange={(e) => setWorkName(e.target.value)}
              placeholder="請輸入作品名稱"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="workDescription">作品簡介</label>
            <textarea
              id="workDescription"
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="請簡要描述您的AI作品..."
              rows="6"
              required
            />
          </div>
          
          {message && (
            <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '提交作品'}
            </button>
            <Link to="/" className="cancel-link">
              返回首頁
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitPage

