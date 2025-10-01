import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface SalesModalProps {
  onClose: () => void;
  onRecordSale: (productId: string, quantity: number) => void;
  productToSell: InventoryItem;
}

const SalesModal: React.FC<SalesModalProps> = ({ onClose, onRecordSale, productToSell }) => {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantityNum = parseInt(quantity, 10);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Please enter a valid, positive quantity.');
      return;
    }
    
    if (quantityNum > productToSell.quantity) {
      setError(`Cannot sell more than the ${productToSell.quantity} items in stock.`);
      return;
    }

    onRecordSale(productToSell.id, quantityNum);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-secondary p-8 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Record Sale</h2>
        <p className="text-text-secondary mb-6">
            Selling: <span className="font-bold text-accent-gold">{productToSell.name}</span>
            <span className="text-xs ml-2">(In Stock: {productToSell.quantity})</span>
        </p>

        {error && <p className="bg-red-900/50 text-red-300 p-2 rounded-md mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Quantity to Sell</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 bg-accent border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent hover:bg-purple-500 text-text-primary font-bold py-2 px-4 rounded-lg transition duration-300">
              Cancel
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              Record Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesModal;