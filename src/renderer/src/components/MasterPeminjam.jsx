import React, { useState, useEffect } from "react";


export default function MasterPeminjam() {
  const [peminjams, setPeminjams] = useState([]);

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
      )
    } catch (err) {
      console.error("Gagal mengambil data peminjam:", err);
    }
  };

  useEffect(() => {
    loadPeminjam();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nama_peminjam: "",
    nrp: "",
  });

  const filteredPeminjams = peminjams.filter(
    (p) =>
      p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nrpNid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      nama_peminjam: "",
      nrp: "",
    });

    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.nama_peminjam || !formData.nrp) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      await window.api.addPeminjam({
        nama_peminjam: formData.nama_peminjam,
        nrp: formData.nrp,
        kategori: formData.kategori
      });

      await loadPeminjam();

      setShowForm(false);

      setFormData({
        nama_peminjam: "",
        nrp: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  const handleEdit = (peminjam) => {
    const namaLengkap = prompt(
      "Edit Nama Lengkap",
      peminjam.namaLengkap
    );

    if (!namaLengkap) return;

    const nrpNid = prompt(
      "Edit NRP / NID",
      peminjam.nrpNid
    );

    if (!nrpNid) return;

    setPeminjams(
      peminjams.map((p) =>
        p.id === peminjam.id
          ? {
            ...p,
            namaLengkap,
            nrpNid,
          }
          : p
      )
    );
  };

  const handleDelete = (peminjam) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus ${peminjam.namaLengkap}?`
    );

    if (!confirmDelete) return;

    setPeminjams(
      peminjams.filter((p) => p.id !== peminjam.id)
    );
  };

  return (
    <div className="p-6">
      <style>{`body {color: #9094a0; }`}</style>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Master Peminjam
          </h1>

          <p className="text-slate-500">
            Manajemen data peminjam laboratorium
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-[#5D7CEB] hover:bg-[#4a6bd8] text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Tambah Peminjam
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            🔍
          </span>

          <input
            type="text"
            placeholder="Cari nama atau NRP/NID..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full border rounded-xl pl-10 pr-4 py-3"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4">
                Nama Lengkap
              </th>

              <th className="text-left p-4">
                NRP / NID
              </th>

              <th className="text-center p-4">
                Kategori
              </th>

              <th className="text-center p-4">
                Total Peminjaman
              </th>

              <th className="text-right p-4">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPeminjams.map((peminjam) => (
              <tr
                key={peminjam.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      👤
                    </div>

                    <span className="font-medium">
                      {peminjam.namaLengkap}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  {peminjam.nrpNid}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${peminjam.kategori === "Dosen"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {peminjam.kategori}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    {peminjam.totalPeminjaman || 0}x
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        handleEdit(peminjam)
                      }
                      className="px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(peminjam)
                      }
                      className="px-3 py-2 rounded-lg hover:bg-red-100"
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
          <div className="text-center py-10 text-slate-500">
            Tidak ada data ditemukan
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-xl">
            <h2 className="text-2xl font-bold mb-5">
              Tambah Peminjam
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">
                  Nama Peminjam
                </label>

                <input
                  type="text"
                  value={formData.nama_peminjam}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nama_peminjam: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                  placeholder="Masukkan nama peminjam"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  NRP / NID
                </label>

                <input
                  type="text"
                  value={formData.nrp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nrp: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                  placeholder="Masukkan NRP atau NID"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Kategori
                </label>

                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kategori: e.target.value
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  <option value="Mahasiswa">
                    Mahasiswa
                  </option>

                  <option value="Dosen">
                    Dosen
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                className="bg-[#5D7CEB] text-white px-4 py-2 rounded-xl"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}