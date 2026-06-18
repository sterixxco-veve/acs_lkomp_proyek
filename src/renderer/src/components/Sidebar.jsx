// import React from 'react'

// export function Sidebar({ user, activeMenu, setActiveMenu, onLogout }) {
//   const menuItems = []

//   if (user.role_name === 'SuperAdmin') {
//     menuItems.push(
//       'Dashboard',
//       'Master PC',
//       'Components',
//       'Software',
//       'Maintenance',
//       'Reports',
//       'TV Dashboard',
//       'Users',
//       'Settings'
//     )
//   }

//   if (user.role_name.includes('Admin') && user.role_name !== 'SuperAdmin') {
//     menuItems.push(
//       'Dashboard',
//       'Master PC',
//       'Components',
//       'Software',
//       'Maintenance',
//       'Reports',
//       'TV Dashboard',
//       'Settings'
//     )
//   }

//   if (user.role_name === 'Sekretaris') {
//     menuItems.push(
//       'Surat Peminjaman',
//       'Master Peminjam',
//       'Laporan Peminjaman'
//     )
//   }

//   return (
//     <div className="w-[260px] bg-[#30408D] text-white flex flex-col justify-between">
//       <div>
//         <div className="p-6 border-b border-white/10">
//           <h1 className="text-2xl font-bold">Lkomp</h1>
//           <p className="text-sm text-white/70">Hardware Overview</p>
//         </div>

//         <div className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item}
//               type="button"
//               onClick={() => setActiveMenu(item)}
//               className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeMenu === item
//                   ? 'bg-[#5D7CEB] shadow-lg'
//                   : 'hover:bg-white/10'
//                 }`}
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-4 border-t border-white/10">
//         <div className="mb-4">
//           <p className="font-semibold">{user.full_name}</p>
//           <p className="text-sm text-white/70">{user.role_name}</p>
//         </div>

//         <button
//           onClick={onLogout}
//           className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// }

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Bikin array object biar gampang mapping nama menu dan URL-nya
  let menuItems = []

  if (user.role_name === 'SuperAdmin') {
    menuItems = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Master PC', path: '/dashboard/master-pc' },
      { name: 'Components', path: '/dashboard/master-components' },
      { name: 'Software', path: '/dashboard/master-software' },
      { name: 'Maintenance', path: '/dashboard/maintenance' },
      { name: 'Reports', path: '/dashboard/reports' },
      { name: 'TV Dashboard', path: '/tv-dashboard-public' }, // Opsional kalau mau diarahkan ke public TV
      { name: 'Users', path: '/dashboard/users' },
      { name: 'Settings', path: '/dashboard/settings' }
    ]
  } else if (user.role_name.includes('Admin') && user.role_name !== 'SuperAdmin') {
    menuItems = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Master PC', path: '/dashboard/master-pc' },
      { name: 'Components', path: '/dashboard/master-components' },
      { name: 'Software', path: '/dashboard/master-software' },
      { name: 'Maintenance', path: '/dashboard/maintenance' },
      { name: 'Reports', path: '/dashboard/reports' },
      { name: 'TV Dashboard', path: '/tv-dashboard-public' },
      { name: 'Settings', path: '/dashboard/settings' }
    ]
  } else if (user.role_name === 'Sekretaris') {
    menuItems = [
      // Sekretaris defaultnya masuk ke dashboard, dan dirender ke BorrowingLetter (Surat Peminjaman)
      { name: 'Surat Peminjaman', path: '/dashboard' }, 
      { name: 'Master Peminjam', path: '/dashboard/master-peminjam' },
      { name: 'Laporan Peminjaman', path: '/dashboard/pengembalian' }
    ]
  }

  // Fungsi untuk ngecek apakah tombol lagi aktif (biar warnanya nyala)
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    }
    return location.pathname.includes(path)
  }

  return (
    <div className="w-[260px] bg-[#30408D] text-white flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">Lkomp</h1>
          <p className="text-sm text-white/70">Hardware Overview</p>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-[#5D7CEB] shadow-lg'
                  : 'hover:bg-white/10'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4">
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm text-white/70">{user.role_name}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  )
}