import React, { useState, useMemo, useCallback } from 'react';
import { inventoryData } from '../data/inventoryData';
import { InventoryItem, StockStatus } from '../types';
import StatCard from './StatCard';
import CategoryChart from './CategoryChart';
import InventoryTable from './InventoryTable';
import GeminiInsights from './GeminiInsights';
import ProductModal from './ProductModal';
import SalesModal from './SalesModal';
import Toast from './Toast';

const Dashboard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryData);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [sellingProduct, setSellingProduct] = useState<InventoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + item.totalValue, 0), [inventory]);
  const totalItems = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity, 0), [inventory]);
  const lowStockItems = useMemo(() => inventory.filter(item => item.status === 'Low Stock').length, [inventory]);
  const uniqueCategories = useMemo(() => new Set(inventory.map(item => item.category)).size, [inventory]);
  
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: InventoryItem) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenSalesModal = (product: InventoryItem) => {
    setSellingProduct(product);
    setIsSalesModalOpen(true);
  };
  
  const handleSaveProduct = useCallback((itemToSave: Omit<InventoryItem, 'id'> & { id?: string }) => {
    setInventory(prevInventory => {
      if (itemToSave.id && prevInventory.some(p => p.id === itemToSave.id)) {
        return prevInventory.map(p => p.id === itemToSave.id ? { ...p, ...itemToSave } : p);
      } else {
        const newItem: InventoryItem = {
            ...itemToSave,
            id: `new-${Date.now()}`
        };
        return [newItem, ...prevInventory];
      }
    });
    setToastMessage(itemToSave.id ? 'Product updated successfully!' : 'Product added successfully!');
    setIsProductModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        setInventory(prevInventory => prevInventory.filter(p => p.id !== productId));
        setToastMessage('Product deleted successfully!');
    }
  }, []);

  const handleRecordSale = useCallback((productId: string, quantitySold: number) => {
    setInventory(prevInventory => {
      return prevInventory.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity - quantitySold;
          return {
            ...item,
            quantity: newQuantity,
            totalValue: newQuantity * item.price,
            status: newQuantity < 10 ? StockStatus.LowStock : StockStatus.InStock,
          };
        }
        return item;
      });
    });
    setToastMessage(`Sale of ${quantitySold} items recorded!`);
    setIsSalesModalOpen(false);
    setSellingProduct(null);
  }, []);

  const handleExport = useCallback(() => {
    const headers = ['id', 'category', 'name', 'price', 'quantity', 'status', 'totalValue'];
    const csvContent = [
      headers.join(','),
      ...inventory.map(item => 
        headers.map(header => item[header as keyof InventoryItem]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'norina-fashions-inventory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [inventory]);

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory Value" value={`Ksh ${totalValue.toLocaleString()}`} icon="cash" />
        <StatCard title="Total Items in Stock" value={totalItems.toLocaleString()} icon="collection" />
        <StatCard title="Low Stock Alerts" value={lowStockItems.toString()} icon="exclamation" />
        <StatCard title="Unique Categories" value={uniqueCategories.toString()} icon="tag" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-secondary p-4 rounded-lg shadow-lg">
           <h2 className="text-xl font-bold mb-4 text-text-primary">Inventory Value by Category</h2>
           <CategoryChart data={inventory} />
        </div>
        <div className="lg:col-span-1 bg-secondary p-4 rounded-lg shadow-lg">
            <GeminiInsights data={inventory} />
        </div>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        <InventoryTable 
          data={inventory} 
          onAddProductClick={handleOpenAddModal}
          onEditProductClick={handleOpenEditModal}
          onDeleteProductClick={handleDeleteProduct}
          onSellProductClick={handleOpenSalesModal}
          onExportClick={handleExport}
        />
      </div>

      {isProductModalOpen && <ProductModal 
                        onClose={() => setIsProductModalOpen(false)} 
                        onSave={handleSaveProduct}
                        productToEdit={editingProduct} 
                      />}
      
      {isSalesModalOpen && sellingProduct && <SalesModal
                        onClose={() => setIsSalesModalOpen(false)}
                        onRecordSale={handleRecordSale}
                        productToSell={sellingProduct}
                      />}
    </div>
  );
};

export default Dashboard;