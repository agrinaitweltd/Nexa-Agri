
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Farm, InventoryItem, Transaction, Requisition, ExportOrder, Notification, Harvest, Crop, Animal, StaffMember, StaffPayment, Client, DashboardWidget, Theme, DashboardTheme, SubscriptionPlanId, CropStatus, AppDocument, Message, Announcement, PurchaseOrder, PendingSignup, ActivationStatus, Department, Permission, StaffTask
} from '../types';

interface AppContextType {
  user: User | null;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  logout: () => void;
  
  // Real DB Data
  companyData: { company_name: string; crops: any[] } | null;
  
  // Operational State (Mocked or extended from user_data)
  farms: Farm[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  notifications: Notification[];
  requisitions: Requisition[];
  crops: Crop[];
  staff: StaffMember[];
  harvests: Harvest[];
  exports: ExportOrder[];
  animals: Animal[];
  clients: Client[];
  purchaseOrders: PurchaseOrder[];
  staffPayments: StaffPayment[];
  documents: AppDocument[];
  messages: Message[];
  announcements: Announcement[];
  pendingSignups: PendingSignup[];
  departments: Department[];
  
  // Actions
  login: (email: string, pass: string) => Promise<{success: boolean, error?: string}>;
  register: (email: string, pass: string, metadata: any) => Promise<{success: boolean, error?: string}>;
  updateCloudData: (updates: { company_name?: string; crops?: any[] }) => Promise<void>;
  
  addFarm: (farm: Farm) => Promise<void>;
  addToInventory: (item: InventoryItem, financeOptions?: any) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addNotification: (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;

  // Missing methods used in pages
  addCrop: (crop: Crop) => Promise<void>;
  updateCropStatus: (id: string, status: CropStatus) => Promise<void>;
  addHarvest: (harvest: Harvest, options?: any) => Promise<void>;
  updateHarvest: (harvest: Harvest) => Promise<void>;
  bulkUpdateInventory: (ids: string[], updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItems: (ids: string[]) => Promise<void>;
  createExport: (order: ExportOrder, initialPayment: number, method: string) => Promise<boolean>;
  updateExportPayment: (id: string, amount: number, method: string) => Promise<void>;
  updateExportStatus: (id: string, status: ExportOrder['status']) => Promise<void>;
  updateRequisitionStatus: (id: string, status: Requisition['status']) => Promise<void>;
  addRequisition: (req: Requisition) => Promise<void>;
  approvePurchaseOrder: (id: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  addAnimal: (animal: Animal) => Promise<void>;
  addStaff: (staff: StaffMember, pass: string) => Promise<void>;
  payStaff: (payment: StaffPayment) => Promise<void>;
  // Fix: Added missing StaffTask import to satisfy type usage
  assignTask: (staffId: string, task: StaffTask) => Promise<void>;
  updateStaffPermissions: (staffId: string, perms: Permission[]) => Promise<void>;
  addDepartment: (dept: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  replayTutorial: () => void;
  updateDashboardTheme: (theme: DashboardTheme) => void;
  addPurchaseOrder: (order: PurchaseOrder, payment: number, method: string) => Promise<boolean>;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => Promise<void>;
  payPurchaseOrder: (id: string, amount: number, method: string) => Promise<void>;
  selectSubscription: (planId: SubscriptionPlanId) => Promise<void>;
  addDocument: (doc: AppDocument) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  sendMessage: (msg: Message) => Promise<void>;
  addAnnouncement: (ann: Announcement) => Promise<void>;
  approveSignup: (id: string) => Promise<void>;
  rejectSignup: (id: string) => Promise<void>;
  getAllUsers: () => User[];
  deleteUser: (id: string) => Promise<void>;
  changeUserStatus: (id: string, status: ActivationStatus) => Promise<void>;
  
  balance: number;
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [companyData, setCompanyData] = useState<any>(null);

  // Operational State
  const [farms, setFarms] = useState<Farm[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [exports, setExports] = useState<ExportOrder[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncementState] = useState<Announcement[]>([]);
  const [pendingSignups, setPendingSignups] = useState<PendingSignup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // 1. Initial Session Check - Casting to any to bypass library-specific type issues in the environment
    (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (session) fetchUserData(session.user);
      setLoading(false);
    });

    // 2. Auth State Listener
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setCompanyData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (sbUser: any) => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', sbUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Map Supabase User to Application User type
      setUser({
        id: sbUser.id,
        email: sbUser.email || '',
        name: sbUser.user_metadata?.full_name || 'Nexa User',
        role: 'ADMIN',
        sector: sbUser.user_metadata?.sector || 'GENERAL',
        companyName: data?.company_name || sbUser.user_metadata?.company_name || 'Agribusiness Hub',
        setupComplete: !!data,
        activationStatus: 'ACTIVE'
      });

      if (data) {
        setCompanyData(data);
        if (data.crops) setCrops(data.crops);
      }
    } catch (err) {
      console.error("Cloud Fetch Error:", err);
    }
  };

  const updateCloudData = async (updates: { company_name?: string; crops?: any[] }) => {
    if (!session?.user) return;
    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: session.user.id,
        ...updates,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) console.error("Cloud Sync Error:", error);
    else fetchUserData(session.user);
  };

  const login = async (email: string, pass: string) => {
    const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password: pass });
    return { success: !error, error: error?.message };
  };

  const register = async (email: string, pass: string, metadata: any) => {
    const { data, error } = await (supabase.auth as any).signUp({
      email,
      password: pass,
      options: { data: metadata }
    });
    return { success: !error, error: error?.message };
  };

  const logout = async () => {
    await (supabase.auth as any).signOut();
    setUser(null);
  };

  const formatCurrency = (amount: number) => {
    const cur = user?.preferredCurrency || 'UGX';
    return `${cur} ${amount.toLocaleString()}`;
  };

  const balance = transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME' || curr.type === 'INITIAL_CAPITAL') return acc + curr.amount;
    return acc - curr.amount;
  }, 0);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const addNotification = (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => {
    setNotifications(prev => [...prev, { id: Math.random().toString(), message, type, date: new Date().toISOString(), read: false, link }]);
  };
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const updateUser = async (updates: Partial<User>) => setUser(prev => prev ? { ...prev, ...updates } : null);
  const addFarm = async (farm: Farm) => setFarms(prev => [...prev, farm]);
  
  const addToInventory = async (item: InventoryItem, financeOptions?: any) => {
    setInventory(prev => [...prev, item]);
    if (financeOptions?.cost > 0) {
        addTransaction({
            id: Math.random().toString(),
            type: 'EXPENSE',
            category: 'Inventory Acquisition',
            amount: financeOptions.cost,
            description: `Stock: ${item.productName} from ${financeOptions.supplierName || 'Supplier'}`,
            date: new Date().toISOString(),
            paymentMethod: financeOptions.method
        });
    }
  };

  const addTransaction = async (tx: Transaction) => setTransactions(prev => [tx, ...prev]);

  // Operational Action Implementations
  const addCrop = async (crop: Crop) => setCrops(prev => [...prev, crop]);
  const updateCropStatus = async (id: string, status: CropStatus) => setCrops(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  const addHarvest = async (harvest: Harvest, options?: any) => {
    setHarvests(prev => [...prev, harvest]);
    if (options?.cost > 0) {
      addTransaction({
        id: Math.random().toString(),
        type: 'EXPENSE',
        category: 'Production',
        amount: options.cost,
        description: `Harvest cost for ${harvest.cropName}`,
        date: new Date().toISOString(),
        paymentMethod: options.method
      });
    }
  };
  const updateHarvest = async (harvest: Harvest) => setHarvests(prev => prev.map(h => h.id === harvest.id ? harvest : h));
  const bulkUpdateInventory = async (ids: string[], updates: Partial<InventoryItem>) => setInventory(prev => prev.map(i => ids.includes(i.id) ? { ...i, ...updates } : i));
  const deleteInventoryItems = async (ids: string[]) => setInventory(prev => prev.filter(i => !ids.includes(i.id)));
  
  const createExport = async (order: ExportOrder, initialPayment: number, method: string) => {
    setExports(prev => [...prev, order]);
    if (initialPayment > 0) {
      addTransaction({
        id: Math.random().toString(),
        type: 'INCOME',
        category: 'Export Payment',
        amount: initialPayment,
        description: `Advance for ${order.shipmentNumber}`,
        date: new Date().toISOString(),
        paymentMethod: method as any
      });
    }
    return true;
  };

  const updateExportPayment = async (id: string, amount: number, method: string) => {
    setExports(prev => prev.map(e => {
        if (e.id === id) {
            const newPaid = e.amountPaid + amount;
            addTransaction({
                id: Math.random().toString(),
                type: 'INCOME',
                category: 'Export Payment',
                amount: amount,
                description: `Installment for ${e.shipmentNumber}`,
                date: new Date().toISOString(),
                paymentMethod: method as any
            });
            return { ...e, amountPaid: newPaid, status: newPaid >= e.totalValue ? 'PAID' : e.status };
        }
        return e;
    }));
  };

  const updateExportStatus = async (id: string, status: ExportOrder['status']) => setExports(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  
  const updateRequisitionStatus = async (id: string, status: Requisition['status']) => {
    setRequisitions(prev => prev.map(r => {
        if (r.id === id && status === 'APPROVED') {
            addTransaction({
                id: Math.random().toString(),
                type: 'EXPENSE',
                category: r.category,
                amount: r.amount,
                description: `Requisition: ${r.reason}`,
                date: new Date().toISOString(),
                paymentMethod: 'CASH'
            });
        }
        return r.id === id ? { ...r, status } : r;
    }));
  };

  const addRequisition = async (req: Requisition) => setRequisitions(prev => [...prev, req]);
  const approvePurchaseOrder = async (id: string) => setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'ORDERED' } : po));
  const completeOnboarding = async () => updateUser({ setupComplete: true });
  const addAnimal = async (animal: Animal) => setAnimals(prev => [...prev, animal]);
  
  const addStaff = async (member: StaffMember, pass: string) => setStaff(prev => [...prev, { ...member, status: 'ACTIVE' }]);
  const payStaff = async (payment: StaffPayment) => {
    setStaffPayments(prev => [...prev, payment]);
    addTransaction({
        id: Math.random().toString(),
        type: 'EXPENSE',
        category: 'Payroll',
        amount: payment.amount,
        description: `Salary: ${payment.staffName} (${payment.period})`,
        date: new Date().toISOString(),
        paymentMethod: payment.method
    });
  };
  // Fix: Added missing StaffTask import to satisfy type usage
  const assignTask = async (staffId: string, task: StaffTask) => setStaff(prev => prev.map(s => s.id === staffId ? { ...s, tasks: [...s.tasks, task] } : s));
  const updateStaffPermissions = async (staffId: string, perms: Permission[]) => setStaff(prev => prev.map(s => s.id === staffId ? { ...s, permissions: perms } : s));
  const addDepartment = async (dept: Department) => setDepartments(prev => [...prev, dept]);
  const deleteDepartment = async (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));
  const addClient = async (client: Client) => setClients(prev => [...prev, client]);
  const replayTutorial = () => addNotification("Replaying tutorial walkthrough...", "INFO");
  const updateDashboardTheme = (newTheme: DashboardTheme) => setUser(prev => prev ? { ...prev, dashboardTheme: newTheme } : null);
  
  const addPurchaseOrder = async (order: PurchaseOrder, payment: number, method: string) => {
    setPurchaseOrders(prev => [...prev, order]);
    if (payment > 0) {
        addTransaction({
            id: Math.random().toString(),
            type: 'INCOME',
            category: 'Sales Payment',
            amount: payment,
            description: `Payment for ${order.orderNumber}`,
            date: new Date().toISOString(),
            paymentMethod: method as any
        });
    }
    return true;
  };

  const updatePurchaseOrderStatus = async (id: string, status: PurchaseOrder['status']) => setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status } : po));
  const payPurchaseOrder = async (id: string, amount: number, method: string) => {
    setPurchaseOrders(prev => prev.map(po => {
        if (po.id === id) {
            const newPaid = po.amountPaid + amount;
            addTransaction({
                id: Math.random().toString(),
                type: 'INCOME',
                category: 'Sales Payment',
                amount: amount,
                description: `Installment for ${po.orderNumber}`,
                date: new Date().toISOString(),
                paymentMethod: method as any
            });
            return { ...po, amountPaid: newPaid, paymentStatus: newPaid >= po.totalAmount ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'UNPAID') };
        }
        return po;
    }));
  };

  const selectSubscription = async (planId: SubscriptionPlanId) => updateUser({ subscriptionPlan: planId });
  const addDocument = async (doc: AppDocument) => setDocuments(prev => [...prev, doc]);
  const deleteDocument = async (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));
  const sendMessage = async (msg: Message) => setMessages(prev => [msg, ...prev]);
  const addAnnouncement = async (ann: Announcement) => setAnnouncementState(prev => [ann, ...prev]);
  const approveSignup = async (id: string) => setPendingSignups(prev => prev.filter(r => r.id !== id));
  const rejectSignup = async (id: string) => setPendingSignups(prev => prev.filter(r => r.id !== id));
  const getAllUsers = () => [MOCK_ADMIN]; // Fallback for admin portal view
  const deleteUser = async (id: string) => {};
  const changeUserStatus = async (id: string, status: ActivationStatus) => {};

  const MOCK_ADMIN: User = {
    id: 'u1',
    name: 'Sarah Director',
    email: 'admin@nexaagri.com',
    role: 'ADMIN',
    sector: 'EXPORT',
    companyName: 'NexaAgri Demo Ltd',
    setupComplete: true,
    activationStatus: 'ACTIVE'
  };

  return (
    <AppContext.Provider value={{
      user, loading, theme, toggleTheme, logout, companyData,
      farms, inventory, transactions, notifications, requisitions, crops, staff, harvests, exports, animals, clients, documents, messages, announcements, purchaseOrders, staffPayments, pendingSignups, departments,
      login, register, updateCloudData,
      addFarm, addToInventory, addTransaction, addNotification, markNotificationRead, markAllNotificationsRead, updateUser,
      addCrop, updateCropStatus, addHarvest, updateHarvest, bulkUpdateInventory, deleteInventoryItems, createExport, updateExportPayment, updateExportStatus, updateRequisitionStatus, addRequisition, approvePurchaseOrder, completeOnboarding, addAnimal, addStaff, payStaff, assignTask, updateStaffPermissions, addDepartment, deleteDepartment, addClient, replayTutorial, updateDashboardTheme, addPurchaseOrder, updatePurchaseOrderStatus, payPurchaseOrder, selectSubscription, addDocument, deleteDocument, sendMessage, addAnnouncement, approveSignup, rejectSignup, getAllUsers, deleteUser, changeUserStatus,
      balance, formatCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
