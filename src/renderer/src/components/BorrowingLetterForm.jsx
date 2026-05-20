import { useState } from "react";
import { FileText, Send, Download, Calendar, User, Edit, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import jsPDF from "jspdf";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "./ui/dialog";
const availablePeminjam = [
    { id: "1", namaLengkap: "Dr. Budi Santoso", nrpNid: "NIP 198501012010011001" },
    { id: "2", namaLengkap: "Ahmad Rizki", nrpNid: "NIM 2023110001" },
    { id: "3", namaLengkap: "Siti Nurhaliza", nrpNid: "NIM 2023110025" },
    { id: "4", namaLengkap: "Dr. Andi Wijaya", nrpNid: "NIP 197803152008011002" },
];
const availableItemIDs = [
    { id: "1", itemType: "Monitor", itemCode: "D305", location: "Lab E4" },
    { id: "2", itemType: "Monitor", itemCode: "D306", location: "Lab E4" },
    { id: "3", itemType: "PC", itemCode: "E4-PC-001", location: "Lab E4" },
    { id: "4", itemType: "PC", itemCode: "E4-PC-003", location: "Lab E4" },
    { id: "5", itemType: "Keyboard", itemCode: "KB-E4-01", location: "Lab E4" },
    { id: "6", itemType: "Keyboard", itemCode: "KB-E4-02", location: "Lab E4" },
    { id: "7", itemType: "Mouse", itemCode: "MS-E4-01", location: "Lab E4" },
    { id: "8", itemType: "Mouse", itemCode: "MS-E4-02", location: "Lab E4" },
    { id: "9", itemType: "Monitor", itemCode: "D401", location: "Lab L4" },
    { id: "10", itemType: "PC", itemCode: "L4-PC-001", location: "Lab L4" },
    { id: "11", itemType: "Headset", itemCode: "HS-001", location: "Storage" },
    { id: "12", itemType: "Headset", itemCode: "HS-002", location: "Storage" },
    { id: "13", itemType: "Webcam", itemCode: "WC-001", location: "Storage" },
    { id: "14", itemType: "Speaker", itemCode: "SP-001", location: "Storage" },
    { id: "15", itemType: "Microphone", itemCode: "MIC-001", location: "Storage" },
];
const recentLetters = [
    {
        id: "SRT-2026-001",
        borrowerName: "Dr. Budi Santoso",
        borrowerId: "NIP 198501012010011001",
        borrowingType: "lab",
        lab: "E4",
        purpose: "Praktikum Pemrograman Web - Kelas TI-3A",
        startDate: "2026-05-15",
        endDate: "2026-05-15",
        startTime: "08:00",
        endTime: "10:00",
        createdDate: "2026-05-08",
        status: "Approved",
    },
    {
        id: "SRT-2026-002",
        borrowerName: "Ahmad Rizki",
        borrowerId: "NIM 2023110001",
        borrowingType: "item",
        items: [
            { itemType: "PC", itemCode: "E4-PC-001" },
            { itemType: "Monitor", itemCode: "D305" },
            { itemType: "Keyboard", itemCode: "KB-E4-01" },
        ],
        purpose: "Tugas Akhir - Pengembangan Sistem Inventory",
        startDate: "2026-05-10",
        endDate: "2026-05-12",
        startTime: "13:00",
        endTime: "17:00",
        createdDate: "2026-05-07",
        status: "Approved",
    },
];
export function BorrowingLetterForm() {
    const [letters, setLetters] = useState(recentLetters);
    const [showPreview, setShowPreview] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingLetter, setEditingLetter] = useState(null);
    const [formData, setFormData] = useState({
        status: "Pending",
        borrowingType: "lab",
        items: [],
    });
    const [selectedPeminjam, setSelectedPeminjam] = useState("");
    const [itemSearchQuery, setItemSearchQuery] = useState("");
    const [itemTypeFilter, setItemTypeFilter] = useState("all");
    const handlePeminjamChange = (peminjamId) => {
        setSelectedPeminjam(peminjamId);
        const peminjam = availablePeminjam.find((p) => p.id === peminjamId);
        if (peminjam) {
            setFormData({
                ...formData,
                borrowerName: peminjam.namaLengkap,
                borrowerId: peminjam.nrpNid,
            });
        }
    };
    const handleItemIDToggle = (itemID) => {
        const currentItems = formData.items || [];
        const existingIndex = currentItems.findIndex((i) => i.itemCode === itemID.itemCode);
        if (existingIndex !== -1) {
            setFormData({
                ...formData,
                items: currentItems.filter((i) => i.itemCode !== itemID.itemCode),
            });
        }
        else {
            setFormData({
                ...formData,
                items: [
                    ...currentItems,
                    { itemType: itemID.itemType, itemCode: itemID.itemCode },
                ],
            });
        }
    };
    const filteredAvailableItems = availableItemIDs.filter((item) => {
        const matchSearch = item.itemCode.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
            item.itemType.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(itemSearchQuery.toLowerCase());
        const matchType = itemTypeFilter === "all" || item.itemType === itemTypeFilter;
        return matchSearch && matchType;
    });
    const uniqueItemTypes = Array.from(new Set(availableItemIDs.map((item) => item.itemType)));
    const handleSubmit = (e) => {
        e.preventDefault();
        const newLetter = {
            id: `SRT-2026-${String(letters.length + 1).padStart(3, "0")}`,
            borrowerName: formData.borrowerName || "",
            borrowerId: formData.borrowerId || "",
            borrowingType: formData.borrowingType || "lab",
            lab: formData.borrowingType === "lab" ? formData.lab : undefined,
            items: formData.borrowingType === "item" ? formData.items : undefined,
            purpose: formData.purpose || "",
            startDate: formData.startDate || "",
            endDate: formData.endDate || "",
            startTime: formData.startTime || "",
            endTime: formData.endTime || "",
            createdDate: new Date().toISOString().split("T")[0],
            status: "Pending",
        };
        setLetters([newLetter, ...letters]);
        setShowPreview(true);
    };
    const handleReset = () => {
        setFormData({ status: "Pending", borrowingType: "lab", items: [] });
        setSelectedPeminjam("");
        setEditingLetter(null);
    };
    const handleEditLetter = (letter) => {
        setEditingLetter(letter);
        setFormData({
            ...letter,
            items: letter.items || [],
        });
        const peminjam = availablePeminjam.find((p) => p.nrpNid === letter.borrowerId);
        if (peminjam) {
            setSelectedPeminjam(peminjam.id);
        }
        setShowEditDialog(true);
    };
    const handleUpdateLetter = () => {
        if (!editingLetter)
            return;
        const updatedLetter = {
            ...editingLetter,
            borrowerName: formData.borrowerName || editingLetter.borrowerName,
            borrowerId: formData.borrowerId || editingLetter.borrowerId,
            borrowingType: formData.borrowingType || editingLetter.borrowingType,
            lab: formData.borrowingType === "lab" ? formData.lab : undefined,
            items: formData.borrowingType === "item" ? formData.items : undefined,
            purpose: formData.purpose || editingLetter.purpose,
            startDate: formData.startDate || editingLetter.startDate,
            endDate: formData.endDate || editingLetter.endDate,
            startTime: formData.startTime || editingLetter.startTime,
            endTime: formData.endTime || editingLetter.endTime,
        };
        setLetters(letters.map((l) => (l.id === editingLetter.id ? updatedLetter : l)));
        setShowEditDialog(false);
        handleReset();
    };
    const handleDownloadPDF = (letter) => {
        const doc = new jsPDF();
        // Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("SURAT PEMINJAMAN LABORATORIUM", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Laboratorium Komputer", 105, 28, { align: "center" });
        // ID and Status
        doc.setFontSize(10);
        doc.text(`ID Surat: ${letter.id}`, 20, 45);
        doc.text(`Tanggal Dibuat: ${new Date(letter.createdDate).toLocaleDateString("id-ID")}`, 20, 52);
        doc.text(`Status: ${letter.status}`, 20, 59);
        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 65, 190, 65);
        // Data Peminjam
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("DATA PEMINJAM", 20, 75);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Nama: ${letter.borrowerName}`, 20, 85);
        doc.text(`NRP/NID: ${letter.borrowerId}`, 20, 92);
        // Line separator
        doc.line(20, 98, 190, 98);
        // Detail Peminjaman
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("DETAIL PEMINJAMAN", 20, 108);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        let yPos = 118;
        doc.text(`Tipe: ${letter.borrowingType === "lab" ? "Peminjaman Lab" : "Peminjaman Item"}`, 20, yPos);
        yPos += 7;
        if (letter.borrowingType === "lab" && letter.lab) {
            doc.text(`Laboratorium: Lab ${letter.lab}`, 20, yPos);
            yPos += 7;
        }
        if (letter.borrowingType === "item" && letter.items && letter.items.length > 0) {
            const itemsText = letter.items.map((item) => `${item.itemCode} (${item.itemType})`).join(", ");
            const itemsLines = doc.splitTextToSize(`Perangkat: ${itemsText}`, 170);
            doc.text(itemsLines, 20, yPos);
            yPos += itemsLines.length * 7;
        }
        doc.text(`Tanggal: ${new Date(letter.startDate).toLocaleDateString("id-ID")} - ${new Date(letter.endDate).toLocaleDateString("id-ID")}`, 20, yPos);
        yPos += 7;
        doc.text(`Waktu: ${letter.startTime} - ${letter.endTime}`, 20, yPos);
        yPos += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Keperluan:", 20, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        const purposeLines = doc.splitTextToSize(letter.purpose, 170);
        doc.text(purposeLines, 20, yPos);
        yPos += (purposeLines.length * 7) + 15;
        // Footer
        doc.line(20, yPos, 190, yPos);
        yPos += 7;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("Dokumen ini dibuat secara elektronik dari Sistem Lkomp Hardware Overview", 105, yPos, { align: "center" });
        // Save PDF
        doc.save(`Surat-Peminjaman-${letter.id}.pdf`);
    };
    const canSubmit = formData.borrowerName &&
        formData.borrowerId &&
        ((formData.borrowingType === "lab" && formData.lab) ||
            (formData.borrowingType === "item" && formData.items && formData.items.length > 0)) &&
        formData.purpose &&
        formData.startDate &&
        formData.endDate &&
        formData.startTime &&
        formData.endTime;
    const getStatusBadge = (status) => {
        const styles = {
            Pending: "bg-orange-50 text-orange-700 border-orange-200",
            Approved: "bg-green-50 text-green-700 border-green-200",
            Rejected: "bg-red-50 text-red-700 border-red-200",
        };
        return styles[status];
    };
    return (<div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2F438F] to-[#5D7CEB] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <FileText className="w-10 h-10"/>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Surat Peminjaman Laboratorium</h1>
            <p className="text-white/90 text-lg">Form pengajuan surat peminjaman lab komputer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5D7CEB]"/>
              Form Peminjaman
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Data Peminjam */}
              <div className="space-y-4 pb-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Data Peminjam</h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground"/>
                    Pilih Peminjam *
                  </label>
                  <Select value={selectedPeminjam} onValueChange={handlePeminjamChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dari Master Peminjam"/>
                    </SelectTrigger>
                    <SelectContent>
                      {availablePeminjam.map((p) => (<SelectItem key={p.id} value={p.id}>
                          {p.namaLengkap} - {p.nrpNid}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPeminjam && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <strong>Nama:</strong> {formData.borrowerName}
                    </p>
                    <p className="text-sm text-blue-900">
                      <strong>NRP/NID:</strong> {formData.borrowerId}
                    </p>
                  </div>)}
              </div>

              {/* Detail Peminjaman */}
              <div className="space-y-4 pb-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Detail Peminjaman</h3>

                {/* Borrowing Type Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipe Peminjaman *</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setFormData({ ...formData, borrowingType: "lab", items: [] })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.borrowingType === "lab"
            ? "border-[#5D7CEB] bg-blue-50 text-[#5D7CEB]"
            : "border-border bg-card text-muted-foreground hover:bg-muted/30"}`}>
                      <div className="text-sm font-semibold">Peminjaman Lab</div>
                      <div className="text-xs mt-1">Satu laboratorium lengkap</div>
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, borrowingType: "item", lab: undefined })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.borrowingType === "item"
            ? "border-[#5D7CEB] bg-blue-50 text-[#5D7CEB]"
            : "border-border bg-card text-muted-foreground hover:bg-muted/30"}`}>
                      <div className="text-sm font-semibold">Peminjaman Item</div>
                      <div className="text-xs mt-1">Pilih perangkat tertentu</div>
                    </button>
                  </div>
                </div>

                {/* Lab Selection (only for lab borrowing) */}
                {formData.borrowingType === "lab" && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Laboratorium *</label>
                      <Select value={formData.lab} onValueChange={(value) => setFormData({ ...formData, lab: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Lab"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="E4">Lab E4</SelectItem>
                          <SelectItem value="L4">Lab L4</SelectItem>
                          <SelectItem value="L3">Lab L3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Jumlah Peserta</label>
                      <Input type="number" min="1" placeholder="35" value={formData.attendees || ""} onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) })}/>
                    </div>
                  </div>)}

                {/* Item Selection (only for item borrowing) */}
                {formData.borrowingType === "item" && (<div className="space-y-4">
                    <label className="text-sm font-medium">Pilih Perangkat (ID Spesifik) *</label>

                    {/* Search and Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                        <Input placeholder="Cari kode item..." value={itemSearchQuery} onChange={(e) => setItemSearchQuery(e.target.value)} className="pl-10"/>
                      </div>
                      <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter Tipe"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Tipe</SelectItem>
                          {uniqueItemTypes.map((type) => (<SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Item ID List */}
                    <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                      {filteredAvailableItems.map((itemID) => {
                const isSelected = formData.items?.some((i) => i.itemCode === itemID.itemCode);
                return (<label key={itemID.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                        ? "border-[#5D7CEB] bg-blue-50"
                        : "border-border bg-card hover:bg-muted/30"}`}>
                            <Checkbox checked={isSelected} onCheckedChange={() => handleItemIDToggle(itemID)}/>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">
                                  {itemID.itemCode}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-muted rounded">
                                  {itemID.itemType}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {itemID.location}
                              </span>
                            </div>
                          </label>);
            })}
                    </div>

                    {formData.items && formData.items.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900 mb-2">
                          <strong>Terpilih ({formData.items.length} item):</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.items.map((item, idx) => (<span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs">
                              <strong>{item.itemCode}</strong>
                              <span className="text-muted-foreground">({item.itemType})</span>
                            </span>))}
                        </div>
                      </div>)}
                  </div>)}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground"/>
                      Tanggal Mulai *
                    </label>
                    <Input type="date" value={formData.startDate || ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground"/>
                      Tanggal Selesai *
                    </label>
                    <Input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jam Mulai *</label>
                    <Input type="time" value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jam Selesai *</label>
                    <Input type="time" value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Keperluan / Tujuan *</label>
                  <Textarea placeholder="Praktikum Pemrograman Web - Kelas TI-3A" value={formData.purpose || ""} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="min-h-[100px]" required/>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Reset Form
                </Button>
                <Button type="submit" disabled={!canSubmit} className="flex-1 bg-[#5D7CEB] hover:bg-[#4a6bd8]">
                  <Send className="w-4 h-4 mr-2"/>
                  Buat Surat
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Letters */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Surat Terbaru</h2>
            <div className="space-y-3">
              {letters.slice(0, 5).map((letter) => (<div key={letter.id} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{letter.id}</p>
                      <p className="text-xs text-muted-foreground">{letter.borrowerName}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadge(letter.status)}`}>
                      {letter.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-2">
                    {letter.borrowingType === "lab" && letter.lab && (<span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                        Lab {letter.lab}
                      </span>)}
                    {letter.borrowingType === "item" && letter.items && letter.items.length > 0 && (<span className="px-2 py-0.5 bg-green-50 text-green-700 rounded">
                        {letter.items.length} Item{letter.items.length > 1 ? "s" : ""}
                      </span>)}
                    <span>•</span>
                    <span>{new Date(letter.startDate).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleEditLetter(letter)}>
                      <Edit className="w-3 h-3 mr-1"/>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs bg-[#5D7CEB] text-white hover:bg-[#4a6bd8] border-[#5D7CEB]" onClick={() => handleDownloadPDF(letter)}>
                      <Download className="w-3 h-3 mr-1"/>
                      PDF
                    </Button>
                  </div>
                </div>))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"/>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Informasi</h3>
                <p className="text-sm text-blue-700">
                  Surat peminjaman yang sudah dibuat dapat diunduh dalam format PDF.
                  Pastikan semua data terisi dengan benar sebelum submit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Surat Peminjaman - {editingLetter?.id}</DialogTitle>
            <DialogDescription>
              Perbarui informasi surat peminjaman yang sudah dibuat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Data Peminjam */}
            <div className="space-y-4 pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Data Peminjam</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground"/>
                  Pilih Peminjam *
                </label>
                <Select value={selectedPeminjam} onValueChange={handlePeminjamChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dari Master Peminjam"/>
                  </SelectTrigger>
                  <SelectContent>
                    {availablePeminjam.map((p) => (<SelectItem key={p.id} value={p.id}>
                        {p.namaLengkap} - {p.nrpNid}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPeminjam && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Nama:</strong> {formData.borrowerName}
                  </p>
                  <p className="text-sm text-blue-900">
                    <strong>NRP/NID:</strong> {formData.borrowerId}
                  </p>
                </div>)}
            </div>

            {/* Detail Peminjaman */}
            <div className="space-y-4 pb-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Detail Peminjaman</h3>

              {/* Borrowing Type Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Peminjaman *</label>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, borrowingType: "lab", items: [] })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.borrowingType === "lab"
            ? "border-[#5D7CEB] bg-blue-50 text-[#5D7CEB]"
            : "border-border bg-card text-muted-foreground hover:bg-muted/30"}`}>
                    <div className="text-sm font-semibold">Peminjaman Lab</div>
                    <div className="text-xs mt-1">Satu laboratorium lengkap</div>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, borrowingType: "item", lab: undefined })} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.borrowingType === "item"
            ? "border-[#5D7CEB] bg-blue-50 text-[#5D7CEB]"
            : "border-border bg-card text-muted-foreground hover:bg-muted/30"}`}>
                    <div className="text-sm font-semibold">Peminjaman Item</div>
                    <div className="text-xs mt-1">Pilih perangkat tertentu</div>
                  </button>
                </div>
              </div>

              {/* Lab Selection */}
              {formData.borrowingType === "lab" && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Laboratorium *</label>
                    <Select value={formData.lab} onValueChange={(value) => setFormData({ ...formData, lab: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Lab"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E4">Lab E4</SelectItem>
                        <SelectItem value="L4">Lab L4</SelectItem>
                        <SelectItem value="L3">Lab L3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>)}

              {/* Item Selection */}
              {formData.borrowingType === "item" && (<div className="space-y-4">
                  <label className="text-sm font-medium">Pilih Perangkat (ID Spesifik) *</label>

                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                      <Input placeholder="Cari kode item..." value={itemSearchQuery} onChange={(e) => setItemSearchQuery(e.target.value)} className="pl-10"/>
                    </div>
                    <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter Tipe"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        {uniqueItemTypes.map((type) => (<SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item ID List */}
                  <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                    {filteredAvailableItems.map((itemID) => {
                const isSelected = formData.items?.some((i) => i.itemCode === itemID.itemCode);
                return (<label key={itemID.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                        ? "border-[#5D7CEB] bg-blue-50"
                        : "border-border bg-card hover:bg-muted/30"}`}>
                          <Checkbox checked={isSelected} onCheckedChange={() => handleItemIDToggle(itemID)}/>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {itemID.itemCode}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded">
                                {itemID.itemType}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {itemID.location}
                            </span>
                          </div>
                        </label>);
            })}
                  </div>

                  {formData.items && formData.items.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900 mb-2">
                        <strong>Terpilih ({formData.items.length} item):</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.items.map((item, idx) => (<span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs">
                            <strong>{item.itemCode}</strong>
                            <span className="text-muted-foreground">({item.itemType})</span>
                          </span>))}
                      </div>
                    </div>)}
                </div>)}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground"/>
                    Tanggal Mulai *
                  </label>
                  <Input type="date" value={formData.startDate || ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground"/>
                    Tanggal Selesai *
                  </label>
                  <Input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Mulai *</label>
                  <Input type="time" value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Selesai *</label>
                  <Input type="time" value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}/>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keperluan / Tujuan *</label>
                <Textarea placeholder="Praktikum Pemrograman Web - Kelas TI-3A" value={formData.purpose || ""} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="min-h-[100px]"/>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {
            setShowEditDialog(false);
            handleReset();
        }} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleUpdateLetter} className="flex-1 bg-[#5D7CEB] hover:bg-[#4a6bd8]" disabled={!canSubmit}>
              <Send className="w-4 h-4 mr-2"/>
              Update Surat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Surat Peminjaman</DialogTitle>
            <DialogDescription>
              Surat peminjaman berhasil dibuat. Anda dapat mengunduh dalam format PDF.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div className="text-center border-b border-border pb-4">
              <h3 className="font-bold text-lg">SURAT PEMINJAMAN LABORATORIUM</h3>
              <p className="text-sm text-muted-foreground">Laboratorium Komputer</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nama Peminjam:</p>
                <p className="font-semibold">{formData.borrowerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">NIM/NIP:</p>
                <p className="font-semibold">{formData.borrowerId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipe Peminjaman:</p>
                <p className="font-semibold">
                  {formData.borrowingType === "lab" ? "Peminjaman Lab" : "Peminjaman Item"}
                </p>
              </div>
              {formData.borrowingType === "lab" && formData.lab && (<>
                  <div>
                    <p className="text-muted-foreground">Laboratorium:</p>
                    <p className="font-semibold">Lab {formData.lab}</p>
                  </div>
                  {formData.attendees && (<div>
                      <p className="text-muted-foreground">Peserta:</p>
                      <p className="font-semibold">{formData.attendees} orang</p>
                    </div>)}
                </>)}
              {formData.borrowingType === "item" && formData.items && formData.items.length > 0 && (<div className="col-span-2">
                  <p className="text-muted-foreground">Perangkat yang Dipinjam:</p>
                  <p className="font-semibold">
                    {formData.items.map((item) => `${item.itemCode} (${item.itemType})`).join(", ")}
                  </p>
                </div>)}
              <div>
                <p className="text-muted-foreground">Tanggal:</p>
                <p className="font-semibold">
                  {formData.startDate && new Date(formData.startDate).toLocaleDateString("id-ID")} -{" "}
                  {formData.endDate && new Date(formData.endDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Waktu:</p>
                <p className="font-semibold">{formData.startTime} - {formData.endTime}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Keperluan:</p>
                <p className="font-semibold">{formData.purpose}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
              Tutup
            </Button>
            <Button className="flex-1 bg-[#5D7CEB] hover:bg-[#4a6bd8]">
              <Download className="w-4 h-4 mr-2"/>
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
}
