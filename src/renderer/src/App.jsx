// import React, { useState } from 'react'

// import { LoginScreen } from './components/LoginScreen'
// import { RegisterScreen } from './components/RegisterScreen'
// import { TvDashboard } from './components/TvDashboard'
// import { Dashboard } from './components/Dashboard'

// import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard'
// import { LabAdminDashboard } from './components/dashboard/LabAdminDashboard'
// import { SekretarisDashboard } from './components/dashboard/SekretarisDashboard'

// import MasterPeminjam from './components/MasterPeminjam'
// function App() {
//   const [screen, setScreen] = useState('login')
//   const [user, setUser] = useState(null)

//   const handleLogin = (loggedUser) => {
//     setUser(loggedUser)
//     setScreen('dashboard')
//   }

//   const handleLogout = () => {
//     setUser(null)
//     setScreen('login')
//   }

//   return (
//     <>
//       {screen === 'login' && (
//         <LoginScreen
//           onLogin={handleLogin}
//           goRegister={() => setScreen('register')}
//           onOpenTv={() => setScreen('tv-dashboard-public')}
//         />
//       )}

//       {screen === 'register' && (
//         <RegisterScreen
//           onBackToLogin={() => setScreen('login')}
//         />
//       )}

//       {screen === 'dashboard' && (
//         <Dashboard
//           user={user}
//           onLogout={handleLogout}
//           setScreen={setScreen}
//         />
//       )}

//       {screen === 'master-peminjam' && (
//         <MasterPeminjam />
//       )}

//       {screen === 'tv-dashboard-public' && (
//         <TvDashboard
//           isPublic={true}
//           onBack={() => setScreen('login')}
//         />
//       )}
//     </>
//   )
// }

// export default App

import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { LoginScreen } from './components/LoginScreen'
import { RegisterScreen } from './components/RegisterScreen'
import { TvDashboard } from './components/TvDashboard'

import { Dashboard } from './components/Dashboard'
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard'
import { LabAdminDashboard } from './components/dashboard/LabAdminDashboard'
import { SekretarisDashboard } from './components/dashboard/SekretarisDashboard'

import { MasterComponents } from './components/MasterComponents'
import { MasterPC } from './components/MasterPC'
import { MasterSoftware } from './components/MasterSoftware'
import { Settings } from './components/Settings'
import { MaintenanceTransaction } from './components/MaintenanceTransaction'
import { Reports } from './components/Reports'

import MasterPeminjam from './components/MasterPeminjam'
// import { BorrowingLetterForm } from './components/BorrowingLetterForm'
import PengembalianDashboard from './components/PengembalianDashboard'

function App() {
  const [user, setUser] = useState(null)

  const router = createBrowserRouter([
    { 
      path: '/', 
      element: user ? <Navigate to="/dashboard" /> : <LoginScreen onLogin={setUser} /> 
    },
    { path: '/register', element: <RegisterScreen /> },
    { path: '/tv-dashboard-public', element: <TvDashboard isPublic={true} /> },

    {
      path: '/dashboard',
      element: user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" />,
      children: [
        // Default Overview
        { 
          path: '', 
          element: user?.role_name === 'SuperAdmin' ? <SuperAdminDashboard /> : 
                   user?.role_name === 'Sekretaris' ? <SekretarisDashboard /> : 
                   <LabAdminDashboard /> 
        },

        // Admin & SuperAdmin
        { path: 'master-pc', element: <MasterPC /> },
        { path: 'master-components', element: <MasterComponents /> },
        { path: 'master-software', element: <MasterSoftware /> },
        { path: 'maintenance', element: <MaintenanceTransaction /> },
        { path: 'reports', element: <Reports /> },
        { path: 'settings', element: <Settings /> },

        // Sekretaris
        { path: 'master-peminjam', element: <MasterPeminjam /> },
        { path: 'borrowing-letter', element: <SekretarisDashboard /> },
        { path: 'pengembalian', element: <PengembalianDashboard /> },
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App