
export enum StockStatus {
  InStock = 'In Stock',
  LowStock = 'Low Stock',
}

export interface InventoryItem {
  id: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
  status: StockStatus;
  totalValue: number;
}
