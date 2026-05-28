import React, { useState } from 'react'

export const RegisterScreen = ({ onBackToLogin }) => {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'L4'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roleMap = {
    L4: {
      roleId: 1,
      labId: 1
    },
    L3: {
      roleId: 2,
      labId: 2
    },
    L2: {
      roleId: 3,
      labId: 3
    },
    E4: {
      roleId: 4,
      labId: 4
    },
    Sekretaris: {
      roleId: 6,
      labId: null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!form.full_name || !form.username || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Password tidak sama')
      return
    }

    setLoading(true)

    try {
      const selectedRole = roleMap[form.role]

      const payload = {
        fullName: form.full_name,
        username: form.username,
        password: form.password,
        roleId: selectedRole.roleId,
        labId: selectedRole.labId
      }

      console.log('REGISTER PAYLOAD:', payload)

      const res = await window.api.register(payload)

      if (res.success) {
        setSuccess('Registrasi berhasil!')

        setTimeout(() => {
          onBackToLogin()
        }, 1500)
      } else {
        setError(res.message || 'Registrasi gagal')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan sistem')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Register Account</h1>

          <p className="text-black text-sm">Buat akun baru untuk sistem laboratorium</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Nama Lengkap</label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.full_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  full_name: e.target.value
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Username</label>

            <input
              type="text"
              placeholder="Masukkan username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Password</label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Konfirmasi Password
            </label>

            <input
              type="password"
              placeholder="Konfirmasi password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Role & Lab</label>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="L4">Admin L4</option>
              <option value="L3">Admin L3</option>
              <option value="L2">Admin L2</option>
              <option value="E4">Admin E4</option>
              <option value="Sekretaris">Sekretaris</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className="mt-5 text-sm text-black hover:text-blue-600 transition-colors"
        >
          ← Kembali ke Login
        </button>
      </div>
    </div>
  )
}
