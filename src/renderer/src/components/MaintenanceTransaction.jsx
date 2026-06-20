import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useOutletContext } from "react-router-dom";

export function MaintenanceTransaction() {
    const {user} = useOutletContext()
    const [brokenPCs, setBrokenPCs] = useState([]);
    const [availableComponents, setAvailableComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedPC, setSelectedPC] = useState("");
    const [issue, setIssue] = useState("");
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [componentSearch, setComponentSearch] = useState("");
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    const loadData = async () => {
        setIsLoading(true);
        try {
            const labId = user?.role_name === 'SuperAdmin' ? null : user?.lab_id;
            const pcs = await window.api.getPCs(labId);
            setBrokenPCs(pcs.filter(pc => pc.STATUS === 'Broken'));

            const components = await window.api.getComponents();
            setAvailableComponents(components);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const filteredComponents = availableComponents.filter((comp) => 
        comp.component_name.toLowerCase().includes(componentSearch.toLowerCase())
    );

    const handleAddComponent = (component) => {
        const existing = selectedComponents.find((c) => c.component_id === component.component_id);
        if (existing) {
            setSelectedComponents(selectedComponents.map((c) => c.component_id === component.component_id
                ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setSelectedComponents([
                ...selectedComponents,
                {
                    component_id: component.component_id,
                    name: component.component_name,
                    quantity: 1,
                    stock: component.stock
                },
            ]);
        }
    };

    const handleRemoveComponent = (componentId) => {
        setSelectedComponents(selectedComponents.filter((c) => c.component_id !== componentId));
    };

    const handleQuantityChange = (componentId, quantity) => {
        if (quantity < 1 || isNaN(quantity)) return;
        const compInStock = availableComponents.find(c => c.component_id === componentId);
        if (compInStock && quantity > compInStock.stock) return;

        setSelectedComponents(selectedComponents.map((c) => c.component_id === componentId
            ? { ...c, quantity } : c));
    };

    const handleFinishMaintenance = async () => {
        if (!selectedPC || !issue || selectedComponents.length === 0) return;
        
        setIsSubmitting(true);
        try {
            const maintenanceData = {
                pc_id: brokenPCs.find(pc => pc.pc_code === selectedPC)?.pc_id,
                complaint: issue,
                handled_by: user.user_id
            };
            const maintenanceRes = await window.api.createMaintenance(maintenanceData);
            
            if (!maintenanceRes.success) throw new Error(maintenanceRes.message);
            const newMaintenanceId = maintenanceRes.maintenance_id;

            for (const comp of selectedComponents) {
                await window.api.addMaintenanceDetail({
                    maintenance_id: newMaintenanceId,
                    component_id: comp.component_id,
                    quantity: comp.quantity
                });
            }

            const finishRes = await window.api.finishMaintenance(newMaintenanceId);
            if (!finishRes.success) throw new Error(finishRes.message);

            setTransactionId(`MNT-${newMaintenanceId}`);
            setShowSuccessModal(true);

            loadData();

            setTimeout(() => {
                setSelectedPC("");
                setIssue("");
                setSelectedComponents([]);
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            alert("Error finishing maintenance: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canFinish = selectedPC && issue && selectedComponents.length > 0 && !isSubmitting;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <AutorenewIcon className="animate-spin text-[#5D7CEB]" style={{ fontSize: 40 }} />
                <span className="ml-3 text-slate-500">Loading data...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Maintenance Transaction</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Workflow transaksi maintenance dan penggantian komponen
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                                1
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Pilih PC Rusak</h3>
                        </div>
                        <select 
                            value={selectedPC} 
                            onChange={(e) => setSelectedPC(e.target.value)}
                            className="w-full flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5D7CEB] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled className="text-slate-500">Pilih PC yang rusak</option>
                            {brokenPCs.length === 0 && <option value="none" disabled className="text-slate-500">Tidak ada PC rusak</option>}
                            {brokenPCs.map((pc) => (
                                <option key={pc.pc_code} value={pc.pc_code} className="text-slate-900">
                                    {pc.pc_code} - {pc.lab_name || 'Unknown Lab'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                                2
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Input Keluhan</h3>
                        </div>
                        <textarea 
                            placeholder="Deskripsikan keluhan atau masalah yang terjadi..." 
                            value={issue} 
                            onChange={(e) => setIssue(e.target.value)} 
                            className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7CEB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#5D7CEB] text-white flex items-center justify-center text-sm font-semibold">
                                3
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Tambah Komponen Pengganti</h3>
                        </div>

                        <div className="relative mb-4">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 20 }} />
                            <input 
                                placeholder="Cari komponen..." 
                                value={componentSearch} 
                                onChange={(e) => setComponentSearch(e.target.value)} 
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7CEB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                            {filteredComponents.map((component) => {
                                const isLowStock = component.stock < component.min_stock;
                                const isOutOfStock = component.stock === 0;
                                return (
                                    <div key={component.component_id} className={`border border-slate-200 rounded-lg p-3 transition-colors ${isOutOfStock ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50'}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800">{component.component_name}</p>
                                            </div>
                                            <button 
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7CEB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-7 px-2" 
                                                onClick={() => handleAddComponent(component)}
                                                disabled={isOutOfStock}
                                            >
                                                <AddIcon style={{ fontSize: 16 }} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs ${isOutOfStock ? "text-red-600 font-bold" : isLowStock ? "text-orange-600" : "text-green-600"}`}>
                                                Stock: {component.stock}
                                            </span>
                                            {isOutOfStock ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold">
                                                    <ErrorIcon style={{ fontSize: 14 }} /> Out of Stock
                                                </span>
                                            ) : isLowStock && (
                                                <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                                                    <ErrorIcon style={{ fontSize: 14 }} /> Low
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredComponents.length === 0 && (
                                <div className="col-span-full text-center text-sm text-slate-500 py-4">
                                    Tidak ada komponen yang ditemukan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Komponen Terpilih</h3>
                        {selectedComponents.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AddIcon className="text-slate-400" style={{ fontSize: 32 }} />
                                </div>
                                <p className="text-sm text-slate-500">
                                    Belum ada komponen dipilih
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedComponents.map((comp) => (
                                    <div key={comp.component_id} className="border border-slate-200 rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-sm font-medium text-slate-800 flex-1">{comp.name}</p>
                                            <button 
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-red-50 hover:text-red-600 h-6 w-6 p-0 text-red-500" 
                                                onClick={() => handleRemoveComponent(comp.component_id)}
                                            >
                                                <DeleteIcon style={{ fontSize: 16 }} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-slate-500">Quantity:</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max={comp.stock}
                                                value={comp.quantity} 
                                                onChange={(e) => handleQuantityChange(comp.component_id, parseInt(e.target.value))} 
                                                className="flex h-8 w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7CEB] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                                            />
                                            <span className="text-xs text-slate-500">/ {comp.stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">PC Code:</span>
                                <span className="text-sm font-medium text-slate-800">
                                    {selectedPC || "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Components:</span>
                                <span className="text-sm font-medium text-slate-800">
                                    {selectedComponents.length} items
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                <span className="text-sm font-semibold text-slate-800">Total Quantity:</span>
                                <span className="text-lg font-bold text-[#5D7CEB]">
                                    {selectedComponents.reduce((sum, c) => sum + c.quantity, 0)} pcs
                                </span>
                            </div>
                        </div>

                        <button 
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7CEB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 w-full mt-6 h-10 px-4 py-2" 
                            disabled={!canFinish} 
                            onClick={handleFinishMaintenance}
                        >
                            {isSubmitting ? (
                                <AutorenewIcon className="mr-2 animate-spin" style={{ fontSize: 16 }} />
                            ) : (
                                <CheckCircleIcon className="mr-2" style={{ fontSize: 16 }} />
                            )}
                            {isSubmitting ? "Processing..." : "Finish Maintenance"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleIcon className="text-green-600" style={{ fontSize: 40 }} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Maintenance Completed!</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Transaksi maintenance berhasil diselesaikan.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Transaction ID:</span>
                                <span className="text-sm font-semibold text-slate-800">{transactionId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">PC Code:</span>
                                <span className="text-sm font-semibold text-slate-800">{selectedPC}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Components Used:</span>
                                <span className="text-sm font-semibold text-[#5D7CEB]">
                                    {selectedComponents.reduce((sum, c) => sum + c.quantity, 0)} pcs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
