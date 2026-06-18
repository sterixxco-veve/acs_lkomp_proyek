import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export const Settings = () => {
  const { user } = useOutletContext()

  const [formData, setFormData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        alert('Konfirmasi password tidak sama')
        return
      }

      alert(
        'Fitur update profile akan disambungkan ke database setelah backend dibuat'
      )
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan data')
    }
  }

  return (
    <div className="p-8 w-full text-slate-800">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-slate-800 mb-2">
        Settings
      </h1>

      <p className="text-slate-500 mb-8">
        Pengaturan akun dan profil pengguna
      </p>

      {/* ACCOUNT SETTINGS */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-300 max-w-5xl">

        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          Informasi Akun
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* USERNAME */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="
                w-full
                border
                border-slate-300
                bg-white
                text-slate-800
                placeholder:text-slate-400
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* FULL NAME */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Nama Lengkap
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="
                w-full
                border
                border-slate-300
                bg-white
                text-slate-800
                placeholder:text-slate-400
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* OLD PASSWORD */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Password Lama
            </label>

            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="
                w-full
                border
                border-slate-300
                bg-white
                text-slate-800
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Password Baru
            </label>

            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="
                w-full
                border
                border-slate-300
                bg-white
                text-slate-800
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-slate-700">
              Konfirmasi Password Baru
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="
                w-full
                border
                border-slate-300
                bg-white
                text-slate-800
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            Simpan Perubahan
          </button>
        </div>

      </div>

      {/* USER INFORMATION */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-300 max-w-5xl mt-8">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Informasi Login
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">
              User ID
            </p>

            <p className="font-bold text-slate-800">
              {user?.user_id}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">
              Username
            </p>

            <p className="font-bold text-slate-800">
              {user?.username}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">
              Role
            </p>

            <p className="font-bold text-slate-800">
              {user?.role_name}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">
              Lab
            </p>

            <p className="font-bold text-slate-800">
              {user?.lab_name || '-'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">
              Status
            </p>

            <p className="font-bold text-green-600">
              {user?.status || 'Active'}
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}