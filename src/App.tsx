import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import InboxPage from './pages/InboxPage'

function App() {
  // Remove loading state - let individual components handle auth
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes with layout - always show layout */}
      <Route element={<AuthLayout />}>
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/conversations" element={<InboxPage />} />
        <Route path="/contacts" element={<InboxPage />} />
        <Route path="/analytics" element={<InboxPage />} />
        <Route path="/settings" element={<InboxPage />} />
        <Route path="/" element={<Navigate to="/inbox" replace />} />
      </Route>
    </Routes>
  )
}

export default App