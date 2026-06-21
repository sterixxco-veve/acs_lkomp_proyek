import React, { useEffect, useState } from "react";

export default function PengembalianDashboard() {
    const [suratList, setSuratList] = useState([]);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [detailItems, setDetailItems] = useState([]);

    useEffect(() => {
        loadPeminjaman();
    }, []);

    const loadPeminjaman = async () => {
        try {
            const data = await window.api.getPeminjaman()
            console.log("DATA PEMINJAMAN:", data)
            setSuratList(data)
        } catch (err) {
            console.error(err)
        }
    };

    const selectSurat = async (surat) => {
        console.log("SURAT DIPILIH:", surat)
        const detail =
            await window.api.getPeminjamanDetail(
                surat.peminjaman_id
            )
        console.log("ID YANG DICARI:", surat.peminjaman_id)
        console.log("DETAIL DITEMUKAN:", detail)
        setSelectedSurat(surat)
        setDetailItems(detail)
    }

    const handleReturn = async (detailId) => {
        try {
            await window.api.returnItem(detailId);
            const detail =
                await window.api.getPeminjamanDetail(
                    selectedSurat.peminjaman_id
                );
            setDetailItems(detail);
            alert("Item berhasil dikembalikan");
        } catch (err) {
            console.error(err);
            alert("Gagal update status");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] p-8 font-sans antialiased text-[#1E293B]">
            <style>{`body { color: #9094a0; }`}</style>

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Pengembalian Barang
                </h1>
                <p className="text-slate-500 mt-1">
                    Monitoring dan manajemen pemulihan logistik laboratorium komputer
                </p>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">

                {/* LEFT SIDE: LIST SURAT */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-[#E2E8F0] p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="text-xl">📁</span>
                        <h2 className="font-bold text-xl text-[#1E293B] tracking-tight">
                            Daftar Surat Peminjaman
                        </h2>
                    </div>

                    <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 custom-scrollbar">
                        {suratList.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 text-sm">
                                Tidak ada data peminjaman aktif
                            </div>
                        ) : (
                            suratList.map((surat) => {
                                const isSelected = selectedSurat?.peminjaman_id === surat.peminjaman_id;
                                return (
                                    <div
                                        key={surat.peminjaman_id}
                                        onClick={() => selectSurat(surat)}
                                        className={`group cursor-pointer border rounded-2xl p-4 transition-all duration-200 relative overflow-hidden ${isSelected
                                            ? "border-[#5D7CEB] bg-blue-50/60 shadow-sm ring-2 ring-blue-100/50"
                                            : "border-[#E2E8F0] bg-white hover:border-slate-300 hover:bg-[#F8FAFC]"
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5D7CEB]" />
                                        )}
                                        <div className={`font-bold text-sm tracking-wide transition-colors ${isSelected ? "text-[#30408D]" : "text-slate-700"}`}>
                                            {surat.document_number}
                                        </div>

                                        <div className="text-base font-semibold text-[#1E293B] mt-1.5 truncate">
                                            {surat.nama_peminjam}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                                            <span>📅</span>
                                            <span>
                                                {new Date(surat.borrow_start).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: PANEL DETAIL */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-[#E2E8F0] p-8 min-h-[500px]">
                    {!selectedSurat ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                            <span className="text-5xl mb-4 opacity-50">📑</span>
                            <h3 className="font-semibold text-base text-slate-700">Belum Ada Berkas Dipilih</h3>
                            <p className="text-sm text-slate-500 mt-1">Silakan klik salah satu daftar surat di panel kiri</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* DETAIL TOP BANNER */}
                            <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                                <div>
                                    <span className="bg-blue-50 text-[#30408D] text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                                        Surat Terpilih
                                    </span>
                                    <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight mt-2">
                                        {selectedSurat.document_number}
                                    </h2>
                                </div>
                                <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center text-xl shadow-inner">
                                    📝
                                </div>
                            </div>

                            {/* METADATA INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identitas Peminjam</span>
                                    <p className="text-base font-bold text-[#1E293B]">{selectedSurat.nama_peminjam}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenggat Waktu Selesai</span>
                                    <p className="text-base font-semibold text-[#1E293B]">
                                        {new Date(selectedSurat.borrow_end).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-200/60">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waktu Mulai Peminjaman</span>
                                    <p className="text-sm font-medium text-slate-600">
                                        {new Date(selectedSurat.borrow_start).toLocaleString("id-ID", {
                                            dateStyle: "long",
                                            timeStyle: "short"
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* ITEM TABLE WORKSPACE */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1E293B] text-lg">Daftar Manifest Perangkat</h3>

                                <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item Pendukung</th>
                                                <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[80px]">Qty</th>
                                                <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">Status</th>
                                                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[140px]">Aksi Mandiri</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-[#E2E8F0]">
                                            {detailItems.map((item) => (
                                                <tr key={item.detail_id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 font-semibold text-[#1E293B]">
                                                        {item.item_name}
                                                    </td>

                                                    <td className="p-4 text-center font-bold text-slate-700">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="p-4 text-center">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${item.STATUS && item.STATUS.toLowerCase() === "returned"
                                                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                                                : "bg-amber-50 border border-amber-200 text-amber-700"
                                                                }`}
                                                        >
                                                            {item.STATUS && item.STATUS.toLowerCase() === "returned" ? "🟢 Returned" : "🟡 Borrowed"}
                                                        </span>
                                                    </td>

                                                    <td className="p-4 text-right">
                                                        {/* Menggunakan toLowerCase() agar aman mau 'Issued' atau 'issued' */}
                                                        {item.STATUS && item.STATUS.toLowerCase() === "issued" ? (
                                                            <button
                                                                onClick={() => handleReturn(item.detail_id)}
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
                                                            >
                                                                ✓ Kembalikan
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg select-none">
                                                                Selesai
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}