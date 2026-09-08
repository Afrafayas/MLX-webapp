import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ShopsTable } from './components/ShopsTable';
import { EditShopModal } from './components/EditShopModal';
import { ShopDetailDrawer } from './components/ShopDetailDrawer';
import { DeleteShopModal } from './components/DeleteShopModal';
import { Shop, AdminStats } from './types';
import { fetchStats, fetchShops, fetchShopById, toggleVerifyShop, updateShop, deleteShop } from './services/adminApi';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('shops');
  const [stats, setStats] = useState<AdminStats>({
    totalShops: 0,
    verifiedShops: 0,
    pendingShops: 0,
    totalProducts: 0,
    totalLeads: 0,
    totalUsers: 0,
  });
  const [shops, setShops] = useState<Shop[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [selectedShopForEdit, setSelectedShopForEdit] = useState<Shop | null>(null);
  const [selectedShopForDrawer, setSelectedShopForDrawer] = useState<Shop | null>(null);
  const [selectedShopForDelete, setSelectedShopForDelete] = useState<Shop | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load stats and shops from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, shopsData] = await Promise.all([fetchStats(), fetchShops()]);
      setStats(statsData);
      setShops(shopsData);
    } catch (err: any) {
      console.error('Failed to fetch admin data:', err);
      showToast(err.message || 'Failed to connect to backend server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Toggle Verification Switch
  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const updatedShop = await toggleVerifyShop(id, !currentStatus);
      showToast(`Store "${updatedShop.name}" ${!currentStatus ? 'Verified' : 'Unverified'} successfully!`);
      // Update local state immediately
      setShops((prev) => prev.map((s) => (s.id === id ? { ...s, verified: !currentStatus } : s)));
      // Refresh stats
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err: any) {
      showToast(err.message || 'Failed to update verification status', 'error');
    }
  };

  // Handler: Open View Details Drawer
  const handleOpenDetails = async (shop: Shop) => {
    try {
      const fullShop = await fetchShopById(shop.id);
      setSelectedShopForDrawer(fullShop);
    } catch (err) {
      setSelectedShopForDrawer(shop);
    }
  };

  // Handler: Save Shop Edit
  const handleSaveEdit = async (updatedData: Partial<Shop>) => {
    if (!selectedShopForEdit) return;
    setIsActionLoading(true);
    try {
      const updated = await updateShop(selectedShopForEdit.id, updatedData);
      showToast(`Store "${updated.name}" details updated successfully!`);
      setSelectedShopForEdit(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update shop details', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handler: Delete Shop Confirm
  const handleConfirmDelete = async () => {
    if (!selectedShopForDelete) return;
    setIsActionLoading(true);
    try {
      await deleteShop(selectedShopForDelete.id);
      showToast(`Store "${selectedShopForDelete.name}" deleted successfully!`);
      setSelectedShopForDelete(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete shop', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={stats.pendingShops} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadData}
          isLoading={isLoading}
        />

        {/* Toast Notification Banner */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold glass-panel ${
                toast.type === 'success'
                  ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/80'
                  : 'border-red-500/40 text-red-300 bg-red-950/80'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Dashboard Main View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Cbez Shop Management Hub
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitor platform analytics, verify seller shop applications, and maintain quality store listings.
              </p>
            </div>
          </div>

          {/* Stats KPI Overview */}
          <StatsOverview
            stats={stats}
            onFilterStatus={setFilterStatus}
            selectedStatus={filterStatus}
          />

          {/* Shops Table Component */}
          <ShopsTable
            shops={shops}
            onToggleVerify={handleToggleVerify}
            onEdit={(shop) => setSelectedShopForEdit(shop)}
            onDelete={(shop) => setSelectedShopForDelete(shop)}
            onViewDetails={handleOpenDetails}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchTerm={searchTerm}
          />
        </main>
      </div>

      {/* Modals & Drawers */}
      <EditShopModal
        shop={selectedShopForEdit}
        isOpen={Boolean(selectedShopForEdit)}
        onClose={() => setSelectedShopForEdit(null)}
        onSave={handleSaveEdit}
        isLoading={isActionLoading}
      />

      <ShopDetailDrawer
        shop={selectedShopForDrawer}
        isOpen={Boolean(selectedShopForDrawer)}
        onClose={() => setSelectedShopForDrawer(null)}
      />

      <DeleteShopModal
        shop={selectedShopForDelete}
        isOpen={Boolean(selectedShopForDelete)}
        onClose={() => setSelectedShopForDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
};
export default App;
