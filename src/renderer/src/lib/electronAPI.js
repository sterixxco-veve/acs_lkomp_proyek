/**
 * MOCK API (Electron IPC Handlers - Proposal v2.0)
 * Menangani query ke MySQL (Simulasi)
 */
export const electronAPI = {
  login: async (creds) => {
    await new Promise((r) => setTimeout(r, 600))
    if (creds.username === 'admin_asisten') {
      return {
        success: true,
        user: { user_id: 1, full_name: 'Asisten Lab Utama', role: 'admin', lab_id: 'L2' }
      }
    }
    if (creds.username === 'kiosk_l2') {
      return {
        success: true,
        user: { user_id: 2, full_name: 'Kiosk Lab L2', role: 'kiosk', lab_id: 'L2' }
      }
    }
    return { success: false, message: 'Kombinasi login tidak valid.' }
  },

  getPCs: async (labId) => {
    const sections = ['A', 'B', 'C', 'D', 'E']
    let pcs = []
    sections.forEach((sec) => {
      for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= 2; c++) {
          const pcCode = `${sec}${r}0${c}`
          const rand = Math.random()
          const status = rand > 0.9 ? 'broken' : rand > 0.8 ? 'maintenance' : 'active'
          pcs.push({
            pc_id: Math.floor(Math.random() * 1000),
            lab_id: labId,
            pc_code: pcCode,
            grid_section: sec,
            grid_row: r,
            grid_column: c,
            status: status,
            specs: {
              cpu: rand > 0.5 ? 'Intel Core i7-12700' : 'AMD Ryzen 5 5600X',
              ram: rand > 0.5 ? '16GB DDR4 3200MHz' : '32GB DDR4 3600MHz',
              gpu: rand > 0.5 ? 'NVIDIA RTX 3060 12GB' : 'AMD RX 6600 XT 8GB',
              storage: 'SSD 512GB NVMe',
              motherboard: 'ASUS Prime B660M'
            }
          })
        }
      }
    })
    return pcs
  },

  getLabHealth: async () => [
    { lab_id: 'L2', lab_name: 'Lab L2', total_pc: 40, pc_aktif: 36, pc_rusak: 2, tiket_open: 2 },
    { lab_id: 'L3', lab_name: 'Lab L3', total_pc: 40, pc_aktif: 39, pc_rusak: 0, tiket_open: 0 },
    { lab_id: 'L4', lab_name: 'Lab L4', total_pc: 40, pc_aktif: 35, pc_rusak: 3, tiket_open: 5 },
    { lab_id: 'E4', lab_name: 'Lab E4', total_pc: 30, pc_aktif: 28, pc_rusak: 1, tiket_open: 1 }
  ],

  getInventory: async () => [
    {
      item_id: 1,
      item_name: 'RAM 8GB DDR4',
      category: 'RAM',
      brand: 'Samsung',
      stock_count: 19,
      status: 'new'
    },
    {
      item_id: 2,
      item_name: 'Mouse Logitech M100',
      category: 'Peripherals',
      brand: 'Logitech',
      stock_count: 15,
      status: 'new'
    },
    {
      item_id: 3,
      item_name: 'SSD 512GB NVMe',
      category: 'Storage',
      brand: 'WD Blue',
      stock_count: 5,
      status: 'new'
    }
  ],

  getLoans: async () => [
    {
      lending_id: 1,
      borrower_name: 'Dr. Johannes',
      borrower_role: 'Dosen',
      item_name: 'RAM 8GB DDR4',
      borrow_date: '2026-03-26',
      expected_return_date: '2026-04-09',
      status: 'borrowed'
    },
    {
      lending_id: 2,
      borrower_name: 'Prof. Siti',
      borrower_role: 'Dosen',
      item_name: 'NVIDIA RTX 3060',
      borrow_date: '2026-04-01',
      expected_return_date: '2026-04-15',
      status: 'returned'
    }
  ],

  getTickets: async () => [
    {
      ticket_id: 'TKT-001',
      pc_code: 'A102',
      reporter: 'Mahasiswa',
      desc: 'Keyboard Rusak',
      date: '2026-03-26',
      status: 'open',
      severity: 'low'
    },
    {
      ticket_id: 'TKT-002',
      pc_code: 'B201',
      reporter: 'Dosen',
      desc: 'Monitor No Signal',
      date: '2026-03-27',
      status: 'in progress',
      severity: 'high'
    }
  ]
}
