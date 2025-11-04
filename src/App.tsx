import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser } from './lib/auth/auth'
import AuthLayout from './components/AuthLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import InboxPage from './pages/InboxPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    setIsAuthenticated(!!user)
  }

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/inbox" replace /> : <LoginPage />
      } />
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/inbox" replace /> : <SignupPage />
      } />

      {/* Protected routes with layout */}
      <Route element={isAuthenticated ? <AuthLayout /> : <Navigate to="/login" replace />}>
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/conversations" element={<InboxPage />} />
        <Route path="/contacts" element={<InboxPage />} />
        <Route path="/analytics" element={<InboxPage />} />
        <Route path="/settings" element={<InboxPage />} />
      </Route>

      {/* Default route */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/inbox" : "/login"} replace />
      } />
    </Routes>
  )
}

export default App