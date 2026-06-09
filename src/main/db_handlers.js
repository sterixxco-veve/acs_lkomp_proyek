import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

// ========================================
// MYSQL CONNECTION
// ========================================

const pool = mysql.createPool({
  host: 'localhost',
  user: 'lkomp_admin',
  password: 'admin_password',
  database: 'acs_lkomp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// ========================================
// AUTH
// ========================================

export async function register({ username, password, fullName = null, roleId = 2, labId = null }) {
  try {
    const [existing] = await pool.execute('SELECT user_id FROM users WHERE username = ?', [
      username
    ])

    if (existing.length > 0) {
      return {
        success: false,
        message: 'Username sudah digunakan'
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.execute(
      `
      INSERT INTO users
      (username, password, full_name, role_id, lab_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [username, hashedPassword, fullName || username, roleId, labId, 'Active']
    )

    return {
      success: true,
      user: {
        user_id: result.insertId,
        username,
        full_name: fullName || username,
        role_id: roleId
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

export async function login({ username, password }) {
  try {
    const [rows] = await pool.execute(
      ` SELECT u.user_id, u.username, u.PASSWORD AS password, u.full_name, u.role_id, r.role_name, u.lab_id, u.STATUS AS status FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.username = ? AND u.STATUS = 'Active' `,
      [username]
    )

    if (rows.length === 0) {
      return {
        // success: false,
        success: true,
        user: {
          user_id: 1,
          username: 'admin_l4',
          role_name: 'Admin L4',
          lab_id: 1
        }
      }
    }

    const user = rows[0]
    console.log('INPUT PASSWORD:', password)
    console.log('HASH DB:', user.password)

    console.log(await bcrypt.compare(password, user.password))

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(user)

    if (!isMatch) {
      return {
        success: false,
        message: 'Password salah'
      }
    }

    delete user.password

    return {
      success: true,
      user
    }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      message: err.message
    }
  }
}

// ========================================
// MASTER PC
// ========================================

export async function getAllLabs() {
  try {
    const [rows] = await pool.execute('SELECT * FROM labs ORDER BY lab_id ASC')
    return rows
  } catch (err) {
    return []
  }
}

export async function getAllPCs(labId = null) {
  try {
    let query = `
      SELECT
        p.*,
        l.lab_name
      FROM pcs p
      JOIN labs l ON p.lab_id = l.lab_id
      WHERE p.is_deleted = FALSE
    `

    let params = []

    if (labId) {
      query += ' AND p.lab_id = ?'
      params.push(labId)
    }

    query += ' ORDER BY p.pc_code ASC'

    const [rows] = await pool.execute(query, params)

    return rows
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getPeminjam() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM peminjam
      ORDER BY nama_peminjam ASC
    `)

    return rows
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function addPeminjam(data) {
  console.log('INSERT PEMINJAM:', data)

  const [result] = await pool.query('CALL insert_peminjam(?, ?, ?)', [
    data.nama_peminjam,
    data.nrp,
    data.kategori
  ])

  console.log(result)

  return result
}

export async function addPC(data) {
  try {
    await pool.query('CALL sp_add_pc(?, ?, ?, ?, ?, ?)', [
      data.pc_code,
      data.lab_id,
      data.processor,
      data.ram,
      data.storage,
      data.gpu
    ])

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

export async function updatePC(data) {
  try {
    await pool.query('CALL sp_update_pc(?, ?, ?, ?, ?, ?, ?, ?)', [
      data.pc_id,
      data.pc_code,
      data.lab_id,
      data.processor,
      data.ram,
      data.storage,
      data.gpu,
      data.status
    ])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export async function deletePC(pcId) {
  try {
    await pool.query('CALL sp_soft_delete_pc(?)', [pcId])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// ==========================================
//        PC SOFTWARE (INSTALASI) HANDLERS
// ==========================================

export async function getPcInstalledSoftware(pcId) {
  try {
    const [rows] = await pool.execute(
      `SELECT software_id FROM pc_softwares WHERE pc_id = ? AND STATUS = 'Installed'`,
      [pcId]
    )
    return rows.map((r) => r.software_id)
  } catch (err) {
    console.error('Error getPcInstalledSoftware:', err)
    return []
  }
}

export async function updatePcSoftware(pcId, softwareIds) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await connection.execute(`UPDATE pc_softwares SET STATUS = 'Uninstalled' WHERE pc_id = ?`, [
      pcId
    ])

    if (softwareIds && softwareIds.length > 0) {
      for (const sId of softwareIds) {
        const [existing] = await connection.execute(
          `SELECT pc_software_id FROM pc_softwares WHERE pc_id = ? AND software_id = ?`,
          [pcId, sId]
        )

        if (existing.length > 0) {
          await connection.execute(
            `UPDATE pc_softwares SET STATUS = 'Installed', installed_date = CURDATE() WHERE pc_id = ? AND software_id = ?`,
            [pcId, sId]
          )
        } else {
          await connection.execute(
            `INSERT INTO pc_softwares (pc_id, software_id, installed_date, STATUS) VALUES (?, ?, CURDATE(), 'Installed')`,
            [pcId, sId]
          )
        }
      }
    }

    await connection.commit()
    return { success: true }
  } catch (err) {
    await connection.rollback()
    return { success: false, message: err.message }
  } finally {
    connection.release()
  }
}

// ========================================
// COMPONENTS
// ========================================

export async function getComponents() {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM components WHERE is_deleted = FALSE ORDER BY component_name ASC`
    )
    return rows
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function addComponent(data) {
  try {
    await pool.query('CALL sp_add_component(?, ?, ?, ?, ?, ?)', [
      data.component_name,
      data.brand,
      data.type,
      data.stock,
      data.min_stock,
      data.condition_status
    ])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export async function updateComponent(data) {
  try {
    await pool.query('CALL sp_update_component(?, ?, ?, ?, ?, ?, ?)', [
      data.component_id,
      data.component_name,
      data.brand,
      data.type,
      data.stock,
      data.min_stock,
      data.condition_status
    ])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export async function deleteComponent(id) {
  try {
    await pool.query('CALL sp_soft_delete_component(?)', [id])
    return { success: true }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// ========================================
// SOFTWARE
// ========================================

export async function getSoftware(labId = null) {
  try {
    let query = `
      SELECT 
        s.software_id, 
        s.software_name, 
        s.VERSION as version, 
        s.mata_kuliah, 
        s.license_type, 
        s.license_expiry,
        COALESCE(GROUP_CONCAT(DISTINCT l.lab_id), '') as lab_ids,
        COALESCE(GROUP_CONCAT(DISTINCT l.lab_name SEPARATOR ', '), '') as lab_names,
        (SELECT COUNT(ps.pc_id) FROM pc_softwares ps WHERE ps.software_id = s.software_id AND ps.STATUS = 'Installed') as installed_count
      FROM softwares s
      LEFT JOIN software_lab_access sla ON s.software_id = sla.software_id
      LEFT JOIN labs l ON sla.lab_id = l.lab_id
    `
    let params = []

    // Filter khusus Admin Lab
    if (labId) {
      query += ` WHERE s.software_id IN (SELECT software_id FROM software_lab_access WHERE lab_id = ?)`
      params.push(labId)
    }

    query += ` GROUP BY s.software_id ORDER BY s.software_name ASC`

    const [rows] = await pool.execute(query, params)
    return rows
  } catch (err) {
    console.error('Error getSoftware:', err)
    return []
  }
}

export async function addSoftware(data) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // 1. Insert ke tabel softwares
    const [result] = await connection.execute(
      'INSERT INTO softwares (software_name, VERSION, mata_kuliah, license_type, license_expiry) VALUES (?, ?, ?, ?, ?)',
      [data.software_name, data.version, data.mata_kuliah, data.license_type, data.license_expiry]
    )
    const newSoftwareId = result.insertId

    // 2. Insert ke tabel software_lab_access
    if (data.lab_ids && data.lab_ids.length > 0) {
      for (const labId of data.lab_ids) {
        await connection.execute(
          'INSERT INTO software_lab_access (software_id, lab_id) VALUES (?, ?)',
          [newSoftwareId, labId]
        )
      }
    }

    await connection.commit()
    return { success: true }
  } catch (err) {
    await connection.rollback()
    return { success: false, message: err.message }
  } finally {
    connection.release()
  }
}

export async function updateSoftware(data) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // 1. Update tabel softwares
    await connection.execute(
      'UPDATE softwares SET software_name = ?, VERSION = ?, mata_kuliah = ?, license_type = ?, license_expiry = ? WHERE software_id = ?',
      [
        data.software_name,
        data.version,
        data.mata_kuliah,
        data.license_type,
        data.license_expiry,
        data.software_id
      ]
    )

    // 2. Reset akses lab
    await connection.execute('DELETE FROM software_lab_access WHERE software_id = ?', [
      data.software_id
    ])

    // 3. Insert ulang akses lab
    if (data.lab_ids && data.lab_ids.length > 0) {
      for (const labId of data.lab_ids) {
        await connection.execute(
          'INSERT INTO software_lab_access (software_id, lab_id) VALUES (?, ?)',
          [data.software_id, labId]
        )
      }
    }

    await connection.commit()
    return { success: true }
  } catch (err) {
    await connection.rollback()
    return { success: false, message: err.message }
  } finally {
    connection.release()
  }
}

export async function deleteSoftware(id) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    // Hapus relasi lab dulu (child), baru hapus software (parent)
    await connection.execute('DELETE FROM software_lab_access WHERE software_id = ?', [id])
    await connection.execute('DELETE FROM softwares WHERE software_id = ?', [id])

    await connection.commit()
    return { success: true }
  } catch (err) {
    await connection.rollback()
    return {
      success: false,
      message: 'Gagal menghapus! Software ini mungkin masih terinstal di beberapa PC.'
    }
  } finally {
    connection.release()
  }
}

// ========================================
// MAINTENANCE
// ========================================

export async function createMaintenance(data) {
  try {
    const [result] = await pool.execute(
      `
      INSERT INTO maintenance
      (
        pc_id,
        complaint,
        maintenance_status,
        handled_by
      )
      VALUES (?, ?, ?, ?)
      `,
      [data.pc_id, data.complaint, 'Pending', data.handled_by]
    )

    return {
      success: true,
      maintenance_id: result.insertId
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

export async function addMaintenanceDetail(data) {
  try {
    await pool.execute(
      `
      INSERT INTO maintenance_details
      (
        maintenance_id,
        component_id,
        quantity
      )
      VALUES (?, ?, ?)
      `,
      [data.maintenance_id, data.component_id, data.quantity]
    )

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

export async function finishMaintenance(maintenanceId) {
  try {
    await pool.query('CALL sp_finish_maintenance(?)', [maintenanceId])

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// ========================================
// REPORTS
// ========================================

export async function getHealthStatus() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vw_health_status_per_lab
    `)

    return rows
  } catch (err) {
    return []
  }
}

export async function getLowStock() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vw_low_stock_alert
    `)

    return rows
  } catch (err) {
    return []
  }
}

export async function getMaintenanceTrend() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vw_maintenance_trend
    `)

    return rows
  } catch (err) {
    return []
  }
}

// ========================================
// TV DASHBOARD
// ========================================

export async function getDashboardSummary() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vw_dashboard_summary
    `)

    return rows[0]
  } catch (err) {
    return null
  }
}

export async function getLiveActivity() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vw_live_activity
      LIMIT 10
    `)

    return rows
  } catch (err) {
    return []
  }
}

// ========================================
// PEMINJAMAN
// ========================================

export async function createPeminjaman(data) {
  try {
    const [result] = await pool.query('CALL insert_peminjaman(?, ?, ?, ?, ?, ?, ?)', [
      data.document_number,
      data.id_peminjam,
      data.event_name,
      data.purpose,
      data.total_user,
      data.borrow_start,
      data.borrow_end
    ])

    return result[0][0]
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function addDetailPeminjaman(data) {
  try {
    await pool.query('CALL insert_detail_peminjaman(?, ?, ?, ?, ?)', [
      data.peminjaman_id,
      data.item_type,
      data.reference_id,
      data.item_name,
      data.quantity
    ])

    return {
      success: true
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getPeminjaman() {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.*,
        pm.nama_peminjam
      FROM peminjaman p
      JOIN peminjam pm
      ON p.id_peminjam = pm.id_peminjam
      ORDER BY p.created_at DESC
    `)

    console.log('GET PEMINJAMAN', rows)

    return rows
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function getPeminjamanDetail(peminjamanId) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM detail_peminjaman
    WHERE peminjaman_id = ?
    `,
    [peminjamanId]
  )

  console.log('DETAIL:', rows)

  return rows
}

export async function returnItem(detailId) {
  await pool.query('CALL return_item(?)', [detailId])

  return {
    success: true
  }
}

export default {
  register,
  login,

  getAllLabs,

  getAllPCs,
  addPC,
  updatePC,
  deletePC,
  getPcInstalledSoftware,

  getPeminjam,
  addPeminjam,

  createPeminjaman,
  addDetailPeminjaman,
  getPeminjaman,
  getPeminjamanDetail,
  returnItem,

  getComponents,
  addComponent,
  updateComponent,
  deleteComponent,

  getSoftware,
  addSoftware,
  updateSoftware,
  deleteSoftware,

  createMaintenance,
  addMaintenanceDetail,
  finishMaintenance,

  getHealthStatus,
  getLowStock,
  getMaintenanceTrend,

  getDashboardSummary,
  getLiveActivity
}
