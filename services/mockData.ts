
import { Farm, InventoryItem, Transaction, User, Requisition, ExportOrder } from '../types';

export const MOCK_FARMS: Farm[] = [
  { 
    id: 'f1', 
    name: 'Green Valley Coffee', 
    location: 'Nairobi North', 
    size: '50 Acres', 
    farmingType: 'CROP', 
    staffIds: [], 
    initialAssets: [] 
  },
  { 
    id: 'f2', 
    name: 'Sunny Side Mangoes', 
    location: 'Mombasa Coastal', 
    size: '20 Acres', 
    farmingType: 'CROP', 
    staffIds: [], 
    initialAssets: [] 
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', productName: 'Arabica Coffee', grade: 'AA', quantity: 5000, unit: 'kg', location: 'Warehouse 1', lastUpdated: '2023-10-25' },
  { id: 'inv2', productName: 'Dried Mango', grade: 'Premium', quantity: 1200, unit: 'kg', location: 'Cold Storage', lastUpdated: '2023-10-26' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'INCOME', category: 'Export', amount: 15000, description: 'Payment for INV-2023-001', date: '2023-10-20', paymentMethod: 'BANK_TRANSFER' },
  { id: 't2', type: 'EXPENSE', category: 'Logistics', amount: 500, description: 'Truck maintenance', date: '2023-10-22', paymentMethod: 'CASH' },
];

export const MOCK_REQUISITIONS: Requisition[] = [
  { id: 'r1', staffId: 'u2', staffName: 'John Doe', farmId: 'f1', amount: 300, category: 'FERTILIZER', reason: 'NPK Fertilizer for Plot A', status: 'PENDING', priority: 'STANDARD', date: new Date().toISOString() }
];

export const MOCK_EXPORTS: ExportOrder[] = [
  { 
    id: 'ex1', 
    // Fix: Added missing missionType property to satisfy ExportOrder interface
    missionType: 'EXPORT',
    buyerName: 'Global Beans Ltd', 
    buyerCountry: 'Germany', 
    buyerEmail: 'purchasing@globalbeans.de',
    productName: 'Arabica Coffee',
    grade: 'AA',
    quantity: 1000,
    unit: 'kg',
    // Fix: Changed 'SHIPPED' to 'IN_TRANSIT' to match valid ExportOrder.status values
    status: 'IN_TRANSIT',
    shipmentNumber: 'SHP-998877',
    shippingCost: 1200,
    totalValue: 18000,
    amountPaid: 9000,
    date: '2023-10-15'
  }
];

export const MOCK_ADMIN: User = {
  id: 'u1',
  name: 'Sarah Director',
  email: 'admin@nexaagri.com', // Updated mock email
  role: 'ADMIN',
  sector: 'EXPORT',
  businessCategory: 'Agri-Trade & Export',
  businessType: 'Coffee Export',
  companyName: 'NexaAgri Demo Ltd',
  setupComplete: true
};
