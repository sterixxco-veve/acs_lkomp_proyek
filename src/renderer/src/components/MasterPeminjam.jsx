import { useState } from "react";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./ui/alert-dialog";
const initialPeminjam = [
    {
        id: "1",
        namaLengkap: "Dr. Budi Santoso",
        nrpNid: "NIP 198501012010011001",
        totalPeminjaman: 15,
    },
    {
        id: "2",
        namaLengkap: "Ahmad Rizki",
        nrpNid: "NIM 2023110001",
        totalPeminjaman: 8,
    },
    {
        id: "3",
        namaLengkap: "Siti Nurhaliza",
        nrpNid: "NIM 2023110025",
        totalPeminjaman: 5,
    },
    {
        id: "4",
        namaLengkap: "Dr. Andi Wijaya",
        nrpNid: "NIP 197803152008011002",
        totalPeminjaman: 22,
    },
];
export function MasterPeminjam() {
    const [peminjams, setPeminjams] = useState(initialPeminjam);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentPeminjam, setCurrentPeminjam] = useState(null);
    const [formData, setFormData] = useState({});
    const filteredPeminjams = peminjams.filter((p) => p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nrpNid.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleAdd = () => {
        setCurrentPeminjam(null);
        setFormData({});
        setIsAddEditOpen(true);
    };
    const handleEdit = (peminjam) => {
        setCurrentPeminjam(peminjam);
        setFormData(peminjam);
        setIsAddEditOpen(true);
    };
    const handleDelete = (peminjam) => {
        setCurrentPeminjam(peminjam);
        setIsDeleteOpen(true);
    };
    const handleSave = () => {
        if (currentPeminjam) {
            setPeminjams(peminjams.map((p) => p.id === currentPeminjam.id ? { ...p, ...formData } : p));
        }
        else {
            const newPeminjam = {
                id: Date.now().toString(),
                namaLengkap: formData.namaLengkap || "",
                nrpNid: formData.nrpNid || "",
                totalPeminjaman: 0,
            };
            setPeminjams([...peminjams, newPeminjam]);
        }
        setIsAddEditOpen(false);
    };
    const confirmDelete = () => {
        if (currentPeminjam) {
            setPeminjams(peminjams.filter((p) => p.id !== currentPeminjam.id));
        }
        setIsDeleteOpen(false);
    };
    return (<div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Master Peminjam</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen data peminjam laboratorium
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
          <Plus className="w-4 h-4 mr-2"/>
          Tambah Peminjam
        </Button>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Cari nama atau NRP/NID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
        </div>
      </div>

      {/* Peminjam Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  NRP / NID
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total Peminjaman
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPeminjams.map((peminjam) => (<tr key={peminjam.id} className="border-t border-border hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600"/>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {peminjam.namaLengkap}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{peminjam.nrpNid}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                      {peminjam.totalPeminjaman}x
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(peminjam)} className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(peminjam)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentPeminjam ? "Edit Peminjam" : "Tambah Peminjam Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap *</label>
              <Input placeholder="Dr. Budi Santoso" value={formData.namaLengkap || ""} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">NRP / NID *</label>
              <Input placeholder="NIP 198501012010011001" value={formData.nrpNid || ""} onChange={(e) => setFormData({ ...formData, nrpNid: e.target.value })}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
              {currentPeminjam ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data peminjam{" "}
              <strong>{currentPeminjam?.namaLengkap}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
}
