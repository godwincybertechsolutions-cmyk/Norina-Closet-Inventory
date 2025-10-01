import React, { useState, useMemo } from 'react';
import { InventoryItem, StockStatus } from '../types';

interface InventoryTableProps {
  data: InventoryItem[];
  onAddProductClick: () => void;
  onEditProductClick: (product: InventoryItem) => void;
  onDeleteProductClick: (productId: string) => void;
  onSellProductClick: (product: InventoryItem) => void;
  onExportClick: () => void;
}

type SortKeys = keyof InventoryItem;
type SortOrder = 'asc' | 'desc';

const SortableHeader: React.FC<{
  column: SortKeys;
  title: string;
  sortConfig: { key: SortKeys; order: SortOrder } | null;
  requestSort: (key: SortKeys) => void;
}> = ({ column, title, sortConfig, requestSort }) => {
  const isSorted = sortConfig?.key === column;
  const arrow = isSorted ? (sortConfig?.order === 'asc' ? '▲' : '▼') : '';

  return (
    <th
      className="p-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer select-none"
      onClick={() => requestSort(column)}
    >
      {title} <span className="text-accent-gold">{arrow}</span>
    </th>
  );
};

const InventoryTable: React.FC<InventoryTableProps> = ({ 
    data, 
    onAddProductClick, 
    onEditProductClick,
    onDeleteProductClick,
    onSellProductClick,
    onExportClick 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; order: SortOrder } | null>(null);

  const requestSort = (key: SortKeys) => {
    let order: SortOrder = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };

  const sortedAndFilteredData = useMemo(() => {
    let items = [...data];

    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return items;
  }, [data, searchTerm, sortConfig]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-text-primary flex-shrink-0">Full Inventory</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full sm:w-auto p-2 bg-accent border border-gray-600 rounded-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={onAddProductClick} className="w-full sm:w-auto flex-1 bg-accent-gold hover:bg-yellow-500 text-primary font-bold py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap">
              Add Product
            </button>
            <button onClick={onExportClick} className="w-full sm:w-auto flex-1 bg-accent hover:bg-purple-500 text-text-primary font-bold py-2 px-4 rounded-lg transition duration-300">
              Export CSV
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-accent">
          <thead className="bg-gray-700/50">
            <tr>
              <SortableHeader column="category" title="Category" sortConfig={sortConfig} requestSort={requestSort} />
              <SortableHeader column="name" title="Item Name" sortConfig={sortConfig} requestSort={requestSort} />
              <SortableHeader column="price" title="Price" sortConfig={sortConfig} requestSort={requestSort} />
              <SortableHeader column="quantity" title="Quantity" sortConfig={sortConfig} requestSort={requestSort} />
              <SortableHeader column="status" title="Status" sortConfig={sortConfig} requestSort={requestSort} />
              <SortableHeader column="totalValue" title="Total Value" sortConfig={sortConfig} requestSort={requestSort} />
              <th className="p-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-secondary divide-y divide-accent">
            {sortedAndFilteredData.map((item) => (
              <tr key={item.id} className="hover:bg-accent/50">
                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">{item.category}</td>
                <td className="p-3 text-sm text-text-primary font-medium whitespace-nowrap">{item.name}</td>
                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">Ksh {item.price.toLocaleString()}</td>
                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">{item.quantity}</td>
                <td className="p-3 text-sm whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === StockStatus.LowStock
                        ? 'bg-red-900 text-red-100'
                        : 'bg-green-900 text-green-100'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">Ksh {item.totalValue.toLocaleString()}</td>
                <td className="p-3 text-sm text-text-secondary whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onSellProductClick(item)} className="text-green-400 hover:text-green-200 transition duration-300" title="Record Sale">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0v-1.43zM11.567 7.151c.22.071.412.164.567.267v1.43a2.5 2.5 0 00-1.134 0V7.151z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.879 3.407A1 1 0 009 9.5v-1a2.5 2.5 0 011.879-2.407V5zM10 13a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button onClick={() => onEditProductClick(item)} className="text-accent-gold hover:text-yellow-300 transition duration-300" title="Edit Product">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button onClick={() => onDeleteProductClick(item.id)} className="text-red-500 hover:text-red-300 transition duration-300" title="Delete Product">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;