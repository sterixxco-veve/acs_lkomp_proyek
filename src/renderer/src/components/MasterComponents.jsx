// import React, { useState } from 'react'

// export const MasterComponents = () => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedType, setSelectedType] = useState('Semua Tipe')

//   const componentsData = [
//     {
//       id: 1,
//       name: 'RAM DDR4 8GB',
//       brand: 'Kingston',
//       type: 'RAM',
//       stock: 8,
//       minStock: 15,
//       condition: 'New',
//       icon: '🖥️'
//     },
//     {
//       id: 2,
//       name: 'RAM DDR4 16GB',
//       brand: 'Corsair',
//       type: 'RAM',
//       stock: 22,
//       minStock: 10,
//       condition: 'New',
//       icon: '🖥️'
//     },
//     {
//       id: 3,
//       name: 'SSD 256GB SATA',
//       brand: 'Samsung',
//       type: 'SSD',
//       stock: 18,
//       minStock: 12,
//       condition: 'New',
//       icon: '💾'
//     },
//     {
//       id: 4,
//       name: 'HDD 500GB',
//       brand: 'WD Blue',
//       type: 'HDD',
//       stock: 5,
//       minStock: 10,
//       condition: 'New',
//       icon: '💿'
//     },
//     {
//       id: 5,
//       name: 'PSU 600W',
//       brand: 'Corsair',
//       type: 'PSU',
//       stock: 12,
//       minStock: 8,
//       condition: 'New',
//       icon: '⚡'
//     },
//     {
//       id: 6,
//       name: 'Motherboard H510',
//       brand: 'Asus',
//       type: 'Motherboard',
//       stock: 6,
//       minStock: 5,
//       condition: 'New',
//       icon: '🔌'
//     },
//     {
//       id: 7,
//       name: 'CPU Fan',
//       brand: 'Cooler Master',
//       type: 'Cooling',
//       stock: 4,
//       minStock: 8,
//       condition: 'New',
//       icon: '❄️'
//     }
//   ]

//   const types = ['Semua Tipe', 'RAM', 'SSD', 'HDD', 'PSU', 'Motherboard', 'Cooling']

//   const getLowStockItems = () => componentsData.filter((c) => c.stock < c.minStock)

//   const getTypeColor = (type) => {
//     const colors = {
//       RAM: 'bg-blue-100 text-blue-600',
//       SSD: 'bg-purple-100 text-purple-600',
//       HDD: 'bg-orange-100 text-orange-600',
//       PSU: 'bg-green-100 text-green-600',
//       Motherboard: 'bg-indigo-100 text-indigo-600',
//       Cooling: 'bg-cyan-100 text-cyan-600'
//     }
//     return colors[type] || 'bg-slate-100 text-slate-600'
//   }

//   const getStockStatus = (stock, minStock) => {
//     if (stock < minStock) return { text: 'Low Stock', color: 'text-red-600' }
//     return { text: 'In Stock', color: 'text-green-600' }
//   }

//   const lowStockItems = getLowStockItems()

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-start">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-900">Master Components</h2>
//           <p className="text-slate-500 text-sm mt-1">Manajemen inventory komponen hardware</p>
//         </div>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md">
//           <span className="text-lg">+</span> Tambah Komponen
//         </button>
//       </div>

//       {lowStockItems.length > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
//           <div className="text-2xl flex-shrink-0">⚠️</div>
//           <div>
//             <h3 className="font-semibold text-red-900">
//               Low Stock Alert ({lowStockItems.length} items)
//             </h3>
//             <p className="text-red-700 text-sm mt-1">
//               {lowStockItems.map((i) => i.name).join(', ')} memerlukan restocking segera.
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="flex gap-4 items-center">
//         <div className="flex-1 relative">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
//             <svg
//               viewBox="0 0 24 24"
//               width="18"
//               height="18"
//               stroke="currentColor"
//               strokeWidth="2"
//               fill="none"
//             >
//               <circle cx="11" cy="11" r="8"></circle>
//               <path d="m21 21-4.35-4.35"></path>
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Cari nama komponen atau brand..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//           />
//         </div>
//         <div className="relative min-w-max">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none pr-10 cursor-pointer transition-all"
//           >
//             {types.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {componentsData.map((component) => {
//           const status = getStockStatus(component.stock, component.minStock)
//           const stockPercent = (component.stock / component.minStock) * 100
//           return (
//             <div
//               key={component.id}
//               className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="text-2xl">{component.icon}</div>
//                   <div>
//                     <h3 className="font-bold text-slate-900">{component.name}</h3>
//                     <p className="text-xs text-slate-500">{component.brand}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <span
//                   className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getTypeColor(component.type)}`}
//                 >
//                   {component.type}
//                 </span>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-xs font-semibold text-slate-600">Stock Level</p>
//                     <p className="text-sm font-bold text-slate-900">{component.stock} units</p>
//                   </div>
//                   <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
//                     <div
//                       className={`h-full rounded-full transition-all ${component.stock < component.minStock ? 'bg-red-500' : 'bg-green-500'}`}
//                       style={{ width: `${Math.min(stockPercent, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
//                   <p className="text-xs text-slate-600">Min: {component.minStock}</p>
//                   <p className={`text-xs font-semibold ${status.color}`}>{status.text}</p>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-200">
//           <h3 className="text-lg font-bold text-slate-900">Inventory Detail</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200">
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Component Name</th>
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Brand</th>
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Type</th>
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Stock</th>
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Min Stock</th>
//                 <th className="text-left py-4 px-6 font-semibold text-slate-700">Condition</th>
//               </tr>
//             </thead>
//             <tbody>
//               {componentsData.map((component) => (
//                 <tr
//                   key={component.id}
//                   className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
//                 >
//                   <td className="py-4 px-6 font-semibold text-slate-900">{component.name}</td>
//                   <td className="py-4 px-6 text-slate-700">{component.brand}</td>
//                   <td className="py-4 px-6">
//                     <span
//                       className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getTypeColor(component.type)}`}
//                     >
//                       {component.type}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6">
//                     <span
//                       className={`font-bold ${component.stock < component.minStock ? 'text-red-600' : 'text-green-600'}`}
//                     >
//                       {component.stock}
//                     </span>
//                   </td>
//                   <td className="py-4 px-6 text-slate-700">{component.minStock}</td>
//                   <td className="py-4 px-6 text-slate-700">{component.condition}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'

export const MasterComponents = () => {
  const [componentsData, setComponentsData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('Semua Tipe')

  // State Modal
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const initialForm = {
    component_name: '',
    brand: '',
    type: 'RAM',
    stock: '',
    min_stock: '',
    condition_status: 'New'
  }
  const [formData, setFormData] = useState(initialForm)

  const types = [
    'Semua Tipe',
    'Processor',
    'RAM',
    'SSD',
    'HDD',
    'GPU',
    'PSU',
    'Motherboard',
    'Cooling'
  ]
  const conditionTypes = ['New', 'Used', 'Broken']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const res = await window.api.getComponents()
    const formattedComps = res.map((c) => ({
      ...c,
      type: c.TYPE || c.type,
      brand: c.BRAND || c.brand,
      stock: c.STOCK || c.stock,
      min_stock: c.MIN_STOCK || c.min_stock
    }))

    setComponentsData(formattedComps)
  }

  // Helper untuk Icon
  const getIcon = (type) => {
    const icons = { RAM: '🖥️', SSD: '💾', HDD: '💿', PSU: '⚡', Motherboard: '🔌', Cooling: '❄️' }
    return icons[type] || '📦'
  }

  // CRUD Handlers
  const handleOpenAdd = () => {
    setFormData(initialForm)
    setIsAddOpen(true)
  }

  const handleOpenEdit = (comp) => {
    setSelectedItem(comp)
    setFormData({
      component_id: comp.component_id,
      component_name: comp.component_name,
      brand: comp.brand,
      type: comp.type,
      stock: comp.stock,
      min_stock: comp.min_stock,
      condition_status: comp.condition_status
    })
    setIsEditOpen(true)
  }

  const handleOpenDelete = (comp) => {
    setSelectedItem(comp)
    setIsDeleteOpen(true)
  }

  const handleSave = async (isEdit = false) => {
    if (!formData.component_name || !formData.stock || !formData.min_stock) {
      alert('Nama, Stock, dan Min Stock wajib diisi!')
      return
    }

    const payload = {
      ...formData,
      stock: parseInt(formData.stock),
      min_stock: parseInt(formData.min_stock)
    }

    const res = isEdit
      ? await window.api.updateComponent(payload)
      : await window.api.addComponent(payload)

    if (res.success) {
      isEdit ? setIsEditOpen(false) : setIsAddOpen(false)
      loadData()
    } else {
      alert('Gagal menyimpan data: ' + res.message)
    }
  }

  const handleDelete = async () => {
    const res = await window.api.deleteComponent(selectedItem.component_id)
    if (res.success) {
      setIsDeleteOpen(false)
      loadData()
    } else {
      alert('Gagal menghapus data: ' + res.message)
    }
  }

  // Filtering
  const filteredData = componentsData.filter((c) => {
    const matchSearch =
      c.component_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = selectedType === 'Semua Tipe' || c.type === selectedType
    return matchSearch && matchType
  })

  const lowStockItems = componentsData.filter((c) => c.stock < c.min_stock)

  const getTypeColor = (type) => {
    const colors = {
      RAM: 'bg-blue-100 text-blue-600',
      SSD: 'bg-purple-100 text-purple-600',
      HDD: 'bg-orange-100 text-orange-600',
      PSU: 'bg-green-100 text-green-600',
      Motherboard: 'bg-indigo-100 text-indigo-600',
      Cooling: 'bg-cyan-100 text-cyan-600'
    }
    return colors[type] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Master Components</h2>
          <p className="text-slate-500 text-sm mt-1">Manajemen inventory komponen hardware</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <span className="text-lg">+</span> Tambah Komponen
        </button>
      </div>

      {/* LOW STOCK ALERT */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-900">
              Low Stock Alert ({lowStockItems.length} items)
            </h3>
            <p className="text-red-700 text-sm mt-1">
              {lowStockItems.map((i) => i.component_name).join(', ')} memerlukan restocking segera.
            </p>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Cari nama komponen atau brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 w-48 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer transition-all"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* GRID VIEW (Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.map((component) => {
          const stockPercent = (component.stock / component.min_stock) * 100
          const isLowStock = component.stock < component.min_stock
          return (
            <div
              key={component.component_id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getIcon(component.type)}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">
                      {component.component_name}
                    </h3>
                    <p className="text-xs text-slate-500">{component.brand}</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getTypeColor(component.type)}`}
                >
                  {component.type}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-slate-600">Stock Level</p>
                    <p className="text-sm font-bold text-slate-900">{component.stock} units</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(stockPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-xs text-slate-600">Min: {component.min_stock}</p>
                  <p
                    className={`text-xs font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {isLowStock ? 'Low Stock' : 'In Stock'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* TABLE VIEW (Details with Actions) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Inventory Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="text-left py-4 px-6 font-semibold">Component Name</th>
                <th className="text-left py-4 px-6 font-semibold">Brand</th>
                <th className="text-left py-4 px-6 font-semibold">Type</th>
                <th className="text-left py-4 px-6 font-semibold">Stock</th>
                <th className="text-left py-4 px-6 font-semibold">Min Stock</th>
                <th className="text-left py-4 px-6 font-semibold">Condition</th>
                <th className="text-center py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((component) => (
                <tr
                  key={component.component_id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-6 font-bold text-slate-900">{component.component_name}</td>
                  <td className="py-4 px-6 text-slate-700">{component.brand}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${getTypeColor(component.type)}`}
                    >
                      {component.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-bold ${component.stock < component.min_stock ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {component.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{component.min_stock}</td>
                  <td className="py-4 px-6 text-slate-700">{component.condition_status}</td>
                  <td className="py-4 px-6 flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(component)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleOpenDelete(component)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-16 px-4 text-center bg-slate-50/50">
                    <div className="text-5xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Gudang Kosong</h3>
                    <p className="text-slate-500">
                      Komponen yang dicari tidak ditemukan atau stok belum ditambahkan.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL FORM (ADD & EDIT) ================= */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditOpen ? 'Edit Komponen' : 'Tambah Komponen Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false)
                  setIsEditOpen(false)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5 bg-white">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nama Komponen
                  </label>
                  <input
                    type="text"
                    value={formData.component_name}
                    onChange={(e) => setFormData({ ...formData, component_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900  placeholder-slate-400"
                    placeholder="Misal: RAM Kingston 16GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                    placeholder="Kingston, Asus..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
                  >
                    {types
                      .filter((t) => t !== 'Semua Tipe')
                      .map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Stok Saat Ini
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 "
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Batas Minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 "
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kondisi</label>
                  <select
                    value={formData.condition_status}
                    onChange={(e) => setFormData({ ...formData, condition_status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 bg-white"
                  >
                    {conditionTypes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddOpen(false)
                  setIsEditOpen(false)
                }}
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleSave(isEditOpen)}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold shadow-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8FAFC] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Konfirmasi Hapus</h3>
              <p className="text-slate-600">
                Apakah Anda yakin ingin menghapus komponen{' '}
                <span className="font-bold text-slate-900">{selectedItem?.component_name}</span>?
                Data ini akan masuk ke riwayat (soft delete).
              </p>
            </div>
            <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
