import { useState } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { RegisterScreen } from './components/RegisterScreen'
import { Dashboard } from './components/Dashboard'

function App() {
  const [screen, setScreen] = useState('login')
  const [user, setUser] = useState(null)

  const handleLogin = (loggedInUser) => {
    console.log(loggedInUser)

    setUser(loggedInUser)
    setScreen('home')
  }

  return (
    <>
      {screen === 'login' && (
        <LoginScreen onLogin={handleLogin} goRegister={() => setScreen('register')} />
      )}

      {screen === 'register' && <RegisterScreen onBackToLogin={() => setScreen('login')} />}

      {screen === 'home' && <Dashboard user={user} />}
    </>
  )
}

export default App
