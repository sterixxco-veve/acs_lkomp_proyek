import React, { useState, useEffect } from "react";

export default function MasterPeminjam() {
  const [peminjams, setPeminjams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // STATE BARU: Untuk menandai apakah sedang Edit atau Tambah
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    nama_peminjam: "",
    nrp: "",
    kategori: "",
  });

  const loadPeminjam = async () => {
    try {
      const result = await window.api.getPeminjam();
      setPeminjams(
        result.map((item) => ({
          id: item.id_peminjam,
          namaLengkap: item.nama_peminjam,
          nrpNid: item.nrp,
          kategori: item.kategori,
          totalPeminjaman: item.total_peminjaman
        }))
      );
    } catch (err) {
      console.error("Gagal mengambil data peminjam:", err);
    }
  };

  useEffect(() => {
    loadPeminjam();
  }, []);

  const filteredPeminjams = peminjams.filter(
    (p) =>
      p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nrpNid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aksi ketika tombol "+ Tambah Peminjam" diklik
  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({
      nama_peminjam: "",
      nrp: "",
      kategori: "",
    });
    setShowForm(true);
  };

  // Aksi ketika tombol "✏️" diklik
  const handleEdit = (peminjam) => {
    setIsEditMode(true);
    setSelectedId(peminjam.id);

    // Masukkan data lama ke dalam form modal
    setFormData({
      nama_peminjam: peminjam.namaLengkap,
      nrp: peminjam.nrpNid,
      kategori: peminjam.kategori,
      id_peminjam: peminjam.id
    });

    setShowForm(true);
  };

  // Fungsi Simpan (Menangani Tambah & Edit sekaligus)
  const handleSave = async () => {
    if (!formData.nama_peminjam || !formData.nrp || !formData.kategori) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      if (isEditMode) {
        // Jika statusnya EDIT, panggil API update (Sesuaikan nama API kamu, misal: updatePeminjam)
        await window.api.updatePeminjam({
          nama_peminjam: formData.nama_peminjam,
          nrp: formData.nrp,
          kategori: formData.kategori,
          id_peminjam: formData.id_peminjam // Pastikan ID juga dikirim untuk update
        });
      } else {
        // Jika statusnya TAMBAH BARU
        await window.api.addPeminjam({
          nama_peminjam: formData.nama_peminjam,
          nrp: formData.nrp,
          kategori: formData.kategori
        });
      }

      await loadPeminjam(); // Refresh data tabel
      setShowForm(false);   // Tutup modal
      setFormData({ nama_peminjam: "", nrp: "", kategori: "" }); // Reset form
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (peminjam) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus ${peminjam.namaLengkap}?`
    );

    if (!confirmDelete) return;

    try {
      // SINKRONISASI KE DATABASE (Opsional: sesuaikan nama API delete kamu jika ada)
      // await window.api.deletePeminjam(peminjam.id);

      // Update UI lokal sementara
      setPeminjams(peminjams.filter((p) => p.id !== peminjam.id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <style>{`body { color: #9094a0; }`}</style>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Master Peminjam
          </h1>
          <p className="text-slate-500 mt-1">
            Manajemen data peminjam laboratorium
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-[#5D7CEB] hover:bg-[#4a6bd8] text-white px-5 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          + Tambah Peminjam
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari nama atau NRP/NID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Nama Lengkap
              </th>
              <th className="text-left p-5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                NRP / NID
              </th>
              <th className="text-center p-5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Kategori
              </th>
              <th className="text-center p-5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Total Peminjaman
              </th>
              <th className="text-right p-5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPeminjams.map((peminjam) => (
              <tr
                key={peminjam.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {peminjam.namaLengkap ? peminjam.namaLengkap.charAt(0).toUpperCase() : "👤"}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {peminjam.namaLengkap}
                    </span>
                  </div>
                </td>

                <td className="p-5 text-slate-600">{peminjam.nrpNid}</td>

                <td className="p-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${peminjam.kategori === "Dosen"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {peminjam.kategori}
                  </span>
                </td>

                <td className="p-5 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {peminjam.totalPeminjaman || 0}x
                  </span>
                </td>

                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(peminjam)}
                      className="w-10 h-10 rounded-xl hover:bg-slate-100 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(peminjam)}
                      className="w-10 h-10 rounded-xl hover:bg-red-100 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPeminjams.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="font-semibold text-slate-700">Tidak ada data ditemukan</h3>
            <p className="text-slate-500 mt-1">Coba gunakan kata kunci lain</p>
          </div>
        )}
      </div>

      {/* DYNAMIC MODAL (TAMBAH / EDIT) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-7 w-[480px] shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {isEditMode ? "Edit Peminjam" : "Tambah Peminjam"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-slate-700">Nama Peminjam</label>
                <input
                  type="text"
                  value={formData.nama_peminjam}
                  onChange={(e) => setFormData({ ...formData, nama_peminjam: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan nama peminjam"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">NRP / NID</label>
                <input
                  type="text"
                  value={formData.nrp}
                  onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Masukkan NRP atau NID"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-[#5D7CEB] hover:bg-[#4a6bd8] text-white px-5 py-3 rounded-2xl font-medium transition"
              >
                {isEditMode ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}