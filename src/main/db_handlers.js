import mysql from 'mysql2/promise'

// Konfigurasi koneksi pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'lkomp_admin',
  password: 'admin_password',
  database: 'lkomp_hardware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

/**
 * Handler untuk Login
 */
export async function login({ username, password }) {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, username, role, lab_id, full_name FROM users WHERE username = ? AND password = ?',
      [username, password]
    )
    return rows.length > 0
      ? { success: true, user: rows[0] }
      : { success: false, message: 'Username atau Password salah' }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Handler untuk mengambil semua data PC di sebuah Lab
 */
export async function getAllPCs(labId) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM pc_units WHERE lab_id = ? ORDER BY grid_section, grid_row, grid_column',
      [labId]
    )
    return rows
  } catch (err) {
    console.error('[DB Error]:', err)
    return []
  }
}

/**
 * Memanggil Stored Procedure sp_generate_tiket
 */
export async function reportDamage({ pcId, reporterId, desc, severity }) {
  try {
    await pool.query('CALL sp_generate_tiket(?, ?, ?, ?)', [pcId, reporterId, desc, severity])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

/**
 * Mengambil data dari View view_rekap_peminjaman
 */
export async function getRekapPeminjaman() {
  try {
    const [rows] = await pool.query('SELECT * FROM view_rekap_peminjaman')
    return rows
  } catch (err) {
    return []
  }
}

/**
 * Mengambil data dari View view_analitik_kesehatan_lab
 */
export async function getLabHealth() {
  try {
    const [rows] = await pool.query('SELECT * FROM view_analitik_kesehatan_lab')
    return rows
  } catch (err) {
    return []
  }
}

export default {
  login,
  getAllPCs,
  reportDamage,
  getRekapPeminjaman,
  getLabHealth
}
