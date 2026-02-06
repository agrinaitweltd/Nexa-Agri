export type Sector = 'FARMING' | 'LIVESTOCK' | 'PROCESSING' | 'EXPORT' | 'LOGISTICS' | 'GENERAL';
export type UserRole = 'ADMIN' | 'STAFF';
export type Unit = 'kg' | 'tonnes' | 'bags' | 'liters' | 'pieces' | 'heads';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHEQUE';
export type Theme = 'light' | 'dark';
export type DashboardTheme = 'emerald' | 'blue' | 'indigo' | 'rose' | 'amber' | 'slate';
export type ActivationStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';
export type SubscriptionPlanId = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type WidgetType = 
  | 'FINANCIAL_STATS' 
  | 'RECENT_ACTIVITY' 
  | 'LOW_STOCK' 
  | 'PENDING_TASKS' 
  | 'RECENT_HARVESTS' 
  | 'QUICK_ACTIONS' 
  | 'PENDING_REQUISITIONS'
  | 'PRODUCTION_OVERVIEW'
  | 'MARKET_PRICES'
  | 'INVENTORY_TURNOVER'
  | 'WEATHER_FORECAST'
  | 'DOCUMENT_PREVIEW'
  | 'INBOX_PREVIEW'
  | 'ACTIVATION_REQUESTS';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  passwordSalt?: string;
  phone?: string;
  location?: string; 
  sector: Sector;
  businessCategory?: string;
  businessType?: string;
  companyName?: string;
  companyAddress?: string;
  employeeCount?: string;
  contactEmail?: string;
  assignedFarmIds?: string[]; 
  departmentId?: string;
  setupComplete?: boolean;
  tutorialCompleted?: boolean;
  theme?: Theme;
  dashboardTheme?: DashboardTheme;
  dashboardWidgets?: DashboardWidget[];
  subscriptionPlan?: SubscriptionPlanId;
  permissions?: Permission[];
  preferredCurrency?: string;
  initialBalance?: number;
  activationStatus?: ActivationStatus;
  rejectionCount?: number;
  regNumber?: string;
  tin?: string;
  directors?: string;
  businessSize?: string;
  ucdaNumber?: string; 
}

export interface PendingSignup {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionId: string;
  paymentPhone: string;
  paymentMethod: 'MTN' | 'AIRTEL' | 'BANK';
  bankName?: string;
  accountName?: string;
  date: string;
}

export type Permission = 
  | 'MANAGE_INVENTORY' 
  | 'MANAGE_FINANCE' 
  | 'MANAGE_STAFF' 
  | 'LOG_HARVEST' 
  | 'VIEW_REPORTS'
  | 'APPROVE_ORDERS' 
  | 'VIEW_FINANCE' 
  | 'MANAGE_EXPORTS'
  | 'MANAGE_DOCUMENTS'
  | 'MANAGE_COMMUNICATION';

export interface AppDocument {
  id: string;
  name: string;
  type: 'CONTRACT' | 'INVOICE' | 'RECEIPT' | 'REPORT' | 'DOWNLOAD';
  category: string;
  size: string;
  date: string;
  url: string;
  uploadedBy: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  type: 'INBOX' | 'SENT' | 'ANNOUNCEMENT';
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Client {
  id: string;
  name: string;
  type: 'BUYER' | 'SUPPLIER';
  country: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalValue: number;
  joinedDate: string;
}

export interface StaffTask {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate: string;
  assignedBy: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string; 
  salary: number;
  currency: string;
  frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'CASUAL';
  phone: string;
  email?: string;
  assignedFarmIds?: string[];
  departmentId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
  permissions: Permission[];
  tasks: StaffTask[];
  password?: string;
  passwordSalt?: string;
}

export interface StaffPayment {
  id: string;
  staffId: string;
  staffName: string;
  amount: number;
  date: string;
  period: string;
  method: PaymentMethod;
  reference?: string;
}

export type FarmingType = 'CROP' | 'LIVESTOCK' | 'MIXED';

export interface Farm {
  id: string;
  name: string;
  location: string;
  size: string; 
  farmingType: FarmingType;
  staffIds: string[]; 
  initialAssets: string[]; 
  notes?: string;
}

export type CropStatus = 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED';

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  status: CropStatus;
  plantedDate: string;
}

export interface Animal {
  id: string;
  type: string;
  breed: string;
  quantity: number;
  status: 'HEALTHY' | 'SICK' | 'QUARANTINE' | 'SOLD';
  location: string;
  age: string;
  notes?: string;
}

export interface HarvestHistory {
  description: string;
  changedBy: string;
  timestamp: string;
}

export interface Harvest {
  id: string;
  farmId: string;
  cropId: string;
  cropName: string;
  grade: string;
  quantity: number;
  unit: Unit;
  date: string;
  status: 'COLLECTED' | 'STORED' | 'PROCESSED';
  notes?: string;
  history?: HarvestHistory[];
}

export interface InventoryItem {
  id: string;
  productName: string;
  grade: string;
  quantity: number;
  unit: Unit;
  location: string;
  lastUpdated: string;
  costPerUnit?: number;
  lowStockThreshold?: number;
}

export interface ExportOrder {
  id: string;
  missionType: 'EXPORT' | 'LOCAL';
  clientId?: string;
  buyerName: string;
  buyerCountry: string;
  buyerEmail: string;
  buyerPhone?: string;
  productName: string;
  grade: string;
  quantity: number;
  unit: Unit;
  pricePerUnit?: number;
  status: 'PENDING_APPROVAL' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'PAYMENT_PENDING' | 'PAID';
  shipmentNumber: string;
  shippingCost: number;
  totalValue: number;
  amountPaid: number;
  date: string;
  originWarehouse?: string; 
  originLocation?: string;
  destinationPort?: string;
  destinationCountry?: string;
  transitPorts?: string;
  transportProvider?: string;
  transportMethod?: 'SEA' | 'AIR' | 'ROAD' | 'RAIL';
  portOfExit?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDate?: string;
  status: 'PENDING_APPROVAL' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  items: POItem[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  orderNumber: string;
  notes?: string;
}

export interface POItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Requisition {
  id: string;
  staffId: string;
  staffName: string;
  farmId?: string;
  amount: number;
  reason: string;
  category: 'FERTILIZER' | 'FEED' | 'WATER' | 'LABOR' | 'TRANSPORT' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: 'STANDARD' | 'HIGH';
  date: string;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'INITIAL_CAPITAL';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  reference?: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
  link?: string;
}