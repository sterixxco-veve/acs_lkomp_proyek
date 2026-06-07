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

        console.log(
            "ID YANG DICARI:",
            surat.peminjaman_id
        )

        console.log(
            "DETAIL DITEMUKAN:",
            detail
        )

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
        <div className="min-h-screen bg-slate-100 p-6">
            <style>{`body {color: #9094a0; }`}</style>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Pengembalian Barang
                </h1>

                <p className="text-slate-500">
                    Monitoring barang yang dipinjam
                </p>
            </div>

            <div className="grid grid-cols-[380px_1fr] gap-6">

                {/* LIST SURAT */}

                <div className="bg-white rounded-3xl shadow-sm border p-5">
                    <h2 className="font-bold text-xl mb-4">
                        Daftar Surat
                    </h2>

                    <div className="space-y-3">
                        {suratList.map((surat) => (
                            <div
                                key={surat.peminjaman_id}
                                onClick={() =>
                                    selectSurat(surat)
                                }
                                className={`cursor-pointer border rounded-2xl p-4 transition
                ${selectedSurat?.peminjaman_id ===
                                        surat.peminjaman_id
                                        ? "border-blue-500 bg-blue-50"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="font-bold">
                                    {surat.document_number}
                                </div>

                                <div className="text-sm text-slate-500">
                                    {surat.nama_peminjam}
                                </div>

                                <div className="text-sm text-slate-400 mt-1">
                                    {new Date(
                                        surat.borrow_start
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DETAIL */}

                <div className="bg-white rounded-3xl shadow-sm border p-6">
                    {!selectedSurat ? (
                        <div className="text-center text-slate-500 py-20">
                            Pilih surat terlebih dahulu
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4">
                                Detail Peminjaman
                            </h2>

                            <div className="mb-6">
                                <p>
                                    <strong>Nomor Surat:</strong>{" "}
                                    {selectedSurat.document_number}
                                </p>

                                <p>
                                    <strong>Peminjam:</strong>{" "}
                                    {selectedSurat.nama_peminjam}
                                </p>

                                <p>
                                    <strong>Mulai:</strong>{" "}
                                    {new Date(
                                        selectedSurat.borrow_start
                                    ).toLocaleString()}
                                </p>

                                <p>
                                    <strong>Selesai:</strong>{" "}
                                    {new Date(
                                        selectedSurat.borrow_end
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">
                                            Item
                                        </th>

                                        <th className="text-center p-3">
                                            Qty
                                        </th>

                                        <th className="text-center p-3">
                                            Status
                                        </th>

                                        <th className="text-right p-3">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {detailItems.map((item) => (
                                        <tr
                                            key={item.detail_id}
                                            className="border-b"
                                        >
                                            <td className="p-3">
                                                {item.item_name}
                                            </td>

                                            <td className="p-3 text-center">
                                                {item.quantity}
                                            </td>

                                            <td className="p-3 text-center">
                                                <span
                                                    className={
                                                        item.status ===
                                                            "Returned"
                                                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-lg"
                                                            : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg"
                                                    }
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="p-3 text-right">
                                                {item.status ===
                                                    "Issued" ? (
                                                    <button
                                                        onClick={() =>
                                                            handleReturn(
                                                                item.detail_id
                                                            )
                                                        }
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                                                    >
                                                        Return
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        Selesai
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}