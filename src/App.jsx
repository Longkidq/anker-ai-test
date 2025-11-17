import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SubmitPage from './pages/SubmitPage'
import VotePage from './pages/VotePage'
import { testConnection } from './utils/testConnection'

function App() {
  useEffect(() => {
    // 應用啟動時測試數據庫連接
    testConnection()
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit" 
            element={
              <ProtectedRoute>
                <SubmitPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vote" 
            element={
              <ProtectedRoute>
                <VotePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

