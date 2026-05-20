import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./ui/alert-dialog";
const initialItems = [
    { id: "1", name: "PC", category: "Hardware", totalUnits: 225 },
    { id: "2", name: "Monitor", category: "Hardware", totalUnits: 225 },
    { id: "3", name: "Keyboard", category: "Peripheral", totalUnits: 225 },
    { id: "4", name: "Mouse", category: "Peripheral", totalUnits: 225 },
    { id: "5", name: "Headset", category: "Audio", totalUnits: 50 },
    { id: "6", name: "Webcam", category: "Video", totalUnits: 30 },
    { id: "7", name: "Speaker", category: "Audio", totalUnits: 40 },
    { id: "8", name: "Microphone", category: "Audio", totalUnits: 25 },
    { id: "9", name: "Printer", category: "Office", totalUnits: 10 },
    { id: "10", name: "Scanner", category: "Office", totalUnits: 8 },
];
export function MasterItem() {
    const [items, setItems] = useState(initialItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({});
    const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleAdd = () => {
        setCurrentItem(null);
        setFormData({});
        setIsAddEditOpen(true);
    };
    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData(item);
        setIsAddEditOpen(true);
    };
    const handleDelete = (item) => {
        setCurrentItem(item);
        setIsDeleteOpen(true);
    };
    const handleSave = () => {
        if (currentItem) {
            setItems(items.map((item) => item.id === currentItem.id ? { ...item, ...formData } : item));
        }
        else {
            const newItem = {
                id: Date.now().toString(),
                name: formData.name || "",
                category: formData.category || "",
                totalUnits: formData.totalUnits || 0,
            };
            setItems([...items, newItem]);
        }
        setIsAddEditOpen(false);
    };
    const confirmDelete = () => {
        if (currentItem) {
            setItems(items.filter((item) => item.id !== currentItem.id));
        }
        setIsDeleteOpen(false);
    };
    return (<div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Master Item</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen jenis perangkat yang tersedia untuk dipinjam
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
          <Plus className="w-4 h-4 mr-2"/>
          Tambah Item
        </Button>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Cari nama item atau kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Nama Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Kategori
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total Unit
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (<tr key={item.id} className="border-t border-border hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600"/>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{item.category}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                      {item.totalUnits} unit
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
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
              {currentItem ? "Edit Item" : "Tambah Item Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Item *</label>
              <Input placeholder="Monitor" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori *</label>
              <Input placeholder="Hardware" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Unit *</label>
              <Input type="number" min="0" placeholder="225" value={formData.totalUnits || ""} onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) })}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
              {currentItem ? "Update" : "Simpan"}
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
              Apakah Anda yakin ingin menghapus item{" "}
              <strong>{currentItem?.name}</strong>? Tindakan ini tidak dapat
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
