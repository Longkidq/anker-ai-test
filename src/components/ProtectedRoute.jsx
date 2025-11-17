import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#ffffff'
      }}>
        <div>載入中...</div>
      </div>
    )
  }

  if (!user) {
    // 未登入，重定向到登入頁
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

