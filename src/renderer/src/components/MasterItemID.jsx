import { useState } from "react";
import { Plus, Search, Edit, Trash2, Hash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "./ui/alert-dialog";
const initialItemIDs = [
    { id: "1", itemType: "Monitor", itemCode: "D305", location: "Lab E4", status: "Available" },
    { id: "2", itemType: "Monitor", itemCode: "D306", location: "Lab E4", status: "Available" },
    { id: "3", itemType: "PC", itemCode: "E4-PC-001", location: "Lab E4", status: "Available" },
    { id: "4", itemType: "PC", itemCode: "E4-PC-002", location: "Lab E4", status: "Borrowed" },
    { id: "5", itemType: "Keyboard", itemCode: "KB-E4-01", location: "Lab E4", status: "Available" },
    { id: "6", itemType: "Mouse", itemCode: "MS-E4-01", location: "Lab E4", status: "Available" },
    { id: "7", itemType: "Monitor", itemCode: "D401", location: "Lab L4", status: "Available" },
    { id: "8", itemType: "PC", itemCode: "L4-PC-001", location: "Lab L4", status: "Available" },
    { id: "9", itemType: "Headset", itemCode: "HS-001", location: "Storage", status: "Available" },
    { id: "10", itemType: "Webcam", itemCode: "WC-001", location: "Storage", status: "Maintenance" },
];
const itemTypes = [
    "PC",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headset",
    "Webcam",
    "Speaker",
    "Microphone",
    "Printer",
    "Scanner",
];
export function MasterItemID() {
    const [itemIDs, setItemIDs] = useState(initialItemIDs);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentItemID, setCurrentItemID] = useState(null);
    const [formData, setFormData] = useState({});
    const filteredItemIDs = itemIDs.filter((item) => {
        const matchSearch = item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === "all" || item.itemType === filterType;
        const matchStatus = filterStatus === "all" || item.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });
    const handleAdd = () => {
        setCurrentItemID(null);
        setFormData({ status: "Available" });
        setIsAddEditOpen(true);
    };
    const handleEdit = (itemID) => {
        setCurrentItemID(itemID);
        setFormData(itemID);
        setIsAddEditOpen(true);
    };
    const handleDelete = (itemID) => {
        setCurrentItemID(itemID);
        setIsDeleteOpen(true);
    };
    const handleSave = () => {
        if (currentItemID) {
            setItemIDs(itemIDs.map((item) => item.id === currentItemID.id ? { ...item, ...formData } : item));
        }
        else {
            const newItemID = {
                id: Date.now().toString(),
                itemType: formData.itemType || "",
                itemCode: formData.itemCode || "",
                location: formData.location || "",
                status: formData.status || "Available",
            };
            setItemIDs([...itemIDs, newItemID]);
        }
        setIsAddEditOpen(false);
    };
    const confirmDelete = () => {
        if (currentItemID) {
            setItemIDs(itemIDs.filter((item) => item.id !== currentItemID.id));
        }
        setIsDeleteOpen(false);
    };
    const getStatusBadge = (status) => {
        const styles = {
            Available: "bg-green-50 text-green-700 border-green-200",
            Borrowed: "bg-orange-50 text-orange-700 border-orange-200",
            Maintenance: "bg-red-50 text-red-700 border-red-200",
        };
        return styles[status];
    };
    const stats = {
        available: itemIDs.filter((i) => i.status === "Available").length,
        borrowed: itemIDs.filter((i) => i.status === "Borrowed").length,
        maintenance: itemIDs.filter((i) => i.status === "Maintenance").length,
    };
    return (<div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Master ID Item</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manajemen ID spesifik untuk setiap perangkat yang dapat dipinjam
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
          <Plus className="w-4 h-4 mr-2"/>
          Tambah ID Item
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-green-600"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-orange-600"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Borrowed</p>
              <p className="text-2xl font-bold text-orange-600">{stats.borrowed}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-red-600"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold text-red-600">{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <Input placeholder="Cari kode item atau lokasi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Tipe"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {itemTypes.map((type) => (<SelectItem key={type} value={type}>
                  {type}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Borrowed">Borrowed</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Item IDs Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Kode Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Tipe Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Lokasi
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItemIDs.map((itemID) => (<tr key={itemID.id} className="border-t border-border hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-blue-600"/>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {itemID.itemCode}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{itemID.itemType}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{itemID.location}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadge(itemID.status)}`}>
                      {itemID.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(itemID)} className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(itemID)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
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
              {currentItemID ? "Edit ID Item" : "Tambah ID Item Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe Item *</label>
              <Select value={formData.itemType} onValueChange={(value) => setFormData({ ...formData, itemType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tipe Item"/>
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map((type) => (<SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kode Item *</label>
              <Input placeholder="D305" value={formData.itemCode || ""} onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lokasi *</label>
              <Input placeholder="Lab E4" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status *</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Borrowed">Borrowed</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-[#5D7CEB] hover:bg-[#4a6bd8]">
              {currentItemID ? "Update" : "Simpan"}
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
              Apakah Anda yakin ingin menghapus ID item{" "}
              <strong>{currentItemID?.itemCode}</strong>? Tindakan ini tidak dapat
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
