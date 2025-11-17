import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './HomePage.css'

function HomePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="home-page">
      <div className="user-info">
        <div className="user-details">
          {user?.user_metadata?.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="頭像" 
              className="user-avatar"
            />
          )}
          <span className="user-name">
            {user?.user_metadata?.full_name || user?.email || '用戶'}
          </span>
        </div>
        <button onClick={handleSignOut} className="signout-btn">
          登出
        </button>
      </div>

      <div className="hero-section">
        <h1 className="hero-title">AI-Day 活動</h1>
        <p className="hero-description">
          搭建一個互相激發的創造樂園，成為全球消費者熱愛的AI創作平台
        </p>
      </div>
      
      <div className="action-buttons">
        <Link to="/submit" className="action-button submit-button">
          提交作品
        </Link>
        <Link to="/vote" className="action-button vote-button">
          我要投票
        </Link>
      </div>
    </div>
  )
}

export default HomePage

