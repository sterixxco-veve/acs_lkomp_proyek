import React, { useState } from 'react'

import { LoginScreen } from './components/LoginScreen'
import { RegisterScreen } from './components/RegisterScreen'
import { Dashboard } from './components/Dashboard'
import MasterPeminjam from './components/MasterPeminjam'

function App() {
  const [screen, setScreen] = useState('login')
  const [user, setUser] = useState(null)

  const handleLogin = (loggedUser) => {
    setUser(loggedUser)
    setScreen('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setScreen('login')
  }

  return (
    <>
      {screen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          goRegister={() => setScreen('register')}
        />
      )}

      {screen === 'register' && (
        <RegisterScreen
          onBackToLogin={() => setScreen('login')}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          setScreen={setScreen}
        />
      )}

      {screen === 'master-peminjam' && (
        <MasterPeminjam />
      )}
    </>
  )
}

export default App