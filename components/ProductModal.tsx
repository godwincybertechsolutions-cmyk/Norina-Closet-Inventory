import React, { useState, useEffect } from 'react';
import { InventoryItem, StockStatus } from '../types';

interface ProductModalProps {
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'> & { id?: string }) => void;
  productToEdit: InventoryItem | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ onClose, onSave, productToEdit }) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const isEditing = productToEdit !== null;

  useEffect(() => {
    if (isEditing) {
      setCategory(productToEdit.category);
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setQuantity(productToEdit.quantity.toString());
    }
  }, [productToEdit, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !name || !price || !quantity) {
      setError('All fields are required.');
      return;
    }
    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity, 10);

    if (isNaN(priceNum) || priceNum < 0 || isNaN(quantityNum) || quantityNum < 0) {
      setError('Please enter valid, non-negative numbers for price and quantity.');
      return;
    }

    const itemData = {
      category,
      name,
      price: priceNum,
      quantity: quantityNum,
      status: quantityNum < 10 ? StockStatus.LowStock : StockStatus.InStock,
      totalValue: priceNum * quantityNum,
    };
    
    if (isEditing) {
      onSave({ ...itemData, id: productToEdit.id });
    } else {
      onSave(itemData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-secondary p-8 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <p className="bg-red-900/50 text-red-300 p-2 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-accent border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Item Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-accent border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text-secondary mb-1">Price (Ksh)</label>
            <input
              type="number"
              id="price"
              value={price}
              min="0"
              step="any"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 bg-accent border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="0"
              step="1"
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 bg-accent border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-accent hover:bg-purple-500 text-text-primary font-bold py-2 px-4 rounded-lg transition duration-300">
              Cancel
            </button>
            <button type="submit" className="bg-accent-gold hover:bg-yellow-500 text-primary font-bold py-2 px-4 rounded-lg transition duration-300">
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
