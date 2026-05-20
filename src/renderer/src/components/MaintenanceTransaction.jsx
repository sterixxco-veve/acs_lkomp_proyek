import { useState } from "react";
import { Search, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "./ui/dialog";
const brokenPCs = [
    { code: "E4-PC-025", lab: "E4", status: "Broken" },
    { code: "L4-PC-032", lab: "L4", status: "Broken" },
    { code: "L3-PC-018", lab: "L3", status: "Broken" },
    { code: "E4-PC-067", lab: "E4", status: "Broken" },
    { code: "L4-PC-041", lab: "L4", status: "Broken" },
];
const availableComponents = [
    { id: "1", name: "RAM DDR4 8GB", stock: 8 },
    { id: "2", name: "RAM DDR4 16GB", stock: 22 },
    { id: "3", name: "SSD 256GB SATA", stock: 18 },
    { id: "4", name: "HDD 500GB", stock: 5 },
    { id: "5", name: "PSU 600W", stock: 12 },
    { id: "6", name: "Motherboard H510", stock: 6 },
    { id: "7", name: "CPU Fan", stock: 4 },
];
export function MaintenanceTransaction({ userRole, userLab }) {
    const [selectedPC, setSelectedPC] = useState("");
    const [issue, setIssue] = useState("");
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [componentSearch, setComponentSearch] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    // Filter broken PCs based on user lab
    const filteredBrokenPCs = userRole === "AdminLab" && userLab
        ? brokenPCs.filter((pc) => pc.lab === userLab)
        : brokenPCs;
    const filteredComponents = availableComponents.filter((comp) => comp.name.toLowerCase().includes(componentSearch.toLowerCase()));
    const handleAddComponent = (component) => {
        const existing = selectedComponents.find((c) => c.componentId === component.id);
        if (existing) {
            setSelectedComponents(selectedComponents.map((c) => c.componentId === component.id
                ? {
                    ...c,
                    quantity: c.quantity + 1,
                }
                : c));
        }
        else {
            setSelectedComponents([
                ...selectedComponents,
                {
                    componentId: component.id,
                    name: component.name,
                    quantity: 1,
                },
            ]);
        }
    };
    const handleRemoveComponent = (componentId) => {
        setSelectedComponents(selectedComponents.filter((c) => c.componentId !== componentId));
    };
    const handleQuantityChange = (componentId, quantity) => {
        if (quantity < 1)
            return;
        setSelectedComponents(selectedComponents.map((c) => c.componentId === componentId
            ? {
                ...c,
                quantity,
            }
            : c));
    };
    const handleFinishMaintenance = () => {
        if (!selectedPC || !issue || selectedComponents.length === 0) {
            return;
        }
        const newTransactionId = `MNT-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
        setTransactionId(newTransactionId);
        setShowSuccessModal(true);
        setTimeout(() => {
            setSelectedPC("");
            setIssue("");
            setSelectedComponents([]);
            setShowSuccessModal(false);
        }, 3000);
    };
    const canFinish = selectedPC && issue && selectedComponents.length > 0;
    return (<div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Maintenance Transaction</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Workflow transaksi maintenance dan penggantian komponen
        </p>
      </div>

      {/* Main Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select Broken PC */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h3 className="text-lg font-semibold">Pilih PC Rusak</h3>
            </div>
            <Select value={selectedPC} onValueChange={setSelectedPC}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih PC yang rusak"/>
              </SelectTrigger>
              <SelectContent>
                {filteredBrokenPCs.map((pc) => (<SelectItem key={pc.code} value={pc.code}>
                    {pc.code} - {pc.lab}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Input Issue */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <h3 className="text-lg font-semibold">Input Keluhan</h3>
            </div>
            <Textarea placeholder="Deskripsikan keluhan atau masalah yang terjadi..." value={issue} onChange={(e) => setIssue(e.target.value)} className="min-h-[100px]"/>
          </div>

          {/* Step 3: Add Components */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <h3 className="text-lg font-semibold">Tambah Komponen Pengganti</h3>
            </div>

            {/* Component Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <Input placeholder="Cari komponen..." value={componentSearch} onChange={(e) => setComponentSearch(e.target.value)} className="pl-10"/>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredComponents.map((component) => {
            const isLowStock = component.stock < 5;
            return (<div key={component.id} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{component.name}</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleAddComponent(component)}>
                        <Plus className="w-3 h-3"/>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isLowStock ? "text-orange-600" : "text-green-600"}`}>
                        Stock: {component.stock}
                      </span>
                      {isLowStock && (<span className="inline-flex items-center gap-1 text-xs text-orange-600">
                          <AlertCircle className="w-3 h-3"/>
                          Low
                        </span>)}
                    </div>
                  </div>);
        })}
            </div>
          </div>
        </div>

        {/* Right Panel - Selected Components & Summary */}
        <div className="space-y-6">
          {/* Selected Components */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Komponen Terpilih</h3>
            {selectedComponents.length === 0 ? (<div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-8 h-8 text-muted-foreground"/>
                </div>
                <p className="text-sm text-muted-foreground">
                  Belum ada komponen dipilih
                </p>
              </div>) : (<div className="space-y-3">
                {selectedComponents.map((comp) => (<div key={comp.componentId} className="border border-border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground flex-1">{comp.name}</p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveComponent(comp.componentId)}>
                        <Trash2 className="w-3 h-3"/>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground">Quantity:</label>
                      <Input type="number" min="1" value={comp.quantity} onChange={(e) => handleQuantityChange(comp.componentId, parseInt(e.target.value))} className="w-16 h-8 text-sm"/>
                    </div>
                  </div>))}
              </div>)}
          </div>

          {/* Transaction Summary */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">PC Code:</span>
                <span className="text-sm font-medium text-foreground">
                  {selectedPC || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Components:</span>
                <span className="text-sm font-medium text-foreground">
                  {selectedComponents.length} items
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm font-semibold text-foreground">Total Quantity:</span>
                <span className="text-lg font-bold text-[#5D7CEB]">
                  {selectedComponents.reduce((sum, c) => sum + c.quantity, 0)} pcs
                </span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-green-600 hover:bg-green-700" disabled={!canFinish} onClick={handleFinishMaintenance}>
              <CheckCircle className="w-4 h-4 mr-2"/>
              Finish Maintenance
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600"/>
            </div>
            <DialogTitle className="text-center">Maintenance Completed!</DialogTitle>
            <DialogDescription className="text-center">
              Transaksi maintenance berhasil diselesaikan.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID:</span>
              <span className="text-sm font-semibold text-foreground">{transactionId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">PC Code:</span>
              <span className="text-sm font-semibold text-foreground">{selectedPC}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Components Used:</span>
              <span className="text-sm font-semibold text-[#5D7CEB]">
                {selectedComponents.reduce((sum, c) => sum + c.quantity, 0)} pcs
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
}
