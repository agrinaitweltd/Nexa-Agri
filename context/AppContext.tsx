
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Farm, InventoryItem, Transaction, Requisition, ExportOrder, Notification, Harvest, Crop, Animal, StaffMember, StaffPayment, Client, StaffTask, DashboardWidget, Theme, DashboardTheme, Permission, SubscriptionPlanId, CropStatus, AppDocument, Message, Announcement, PurchaseOrder, PendingSignup, ActivationStatus, Department
} from '../types';
import { hashPassword, generateSalt } from '../lib/security';

export const MOCK_AUTH = true;
const MAX_REJECTIONS = 3;

interface AppContextType {
  user: User | null;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  logout: () => void;
  
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
  documents: AppDocument[];
  messages: Message[];
  announcements: Announcement[];
  purchaseOrders: PurchaseOrder[];
  staffPayments: StaffPayment[];
  pendingSignups: PendingSignup[];
  departments: Department[];
  
  addFarm: (farm: Farm) => Promise<void>;
  addToInventory: (item: InventoryItem, financeOptions?: any) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addNotification: (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addCrop: (crop: Crop) => Promise<void>;
  updateCropStatus: (id: string, status: CropStatus) => Promise<void>;
  addHarvest: (harvest: Harvest, financeOptions?: any) => Promise<void>;
  updateHarvest: (harvest: Harvest) => Promise<void>;
  createExport: (order: ExportOrder, initialPayment: number, method: string) => Promise<boolean>;
  updateExportPayment: (id: string, amount: number, method: string) => Promise<void>;
  updateExportStatus: (id: string, status: string) => Promise<boolean>;
  updateRequisitionStatus: (id: string, status: string) => Promise<void>;
  addRequisition: (req: Requisition) => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean | 'PENDING' | 'REJECTED' | 'LIMIT_REACHED' | 'INVALID'>;
  register: (data: any) => Promise<{ success: boolean, message: string, user?: User }>;
  submitVerification: (verification: Omit<PendingSignup, 'id' | 'date'>) => Promise<void>;
  approveSignup: (signupId: string) => Promise<void>;
  rejectSignup: (signupId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  changeUserStatus: (userId: string, status: ActivationStatus) => Promise<void>;
  resetUserStatus: (email: string) => void;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addAnimal: (animal: Animal) => Promise<void>;
  addStaff: (staff: StaffMember, pass: string) => Promise<void>;
  payStaff: (payment: StaffPayment) => Promise<void>;
  assignTask: (staffId: string, task: StaffTask) => void;
  updateTaskStatus: (staffId: string, taskId: string, status: string) => void;
  updateStaffPermissions: (staffId: string, perms: Permission[]) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  replayTutorial: () => void;
  updateDashboardWidgets: (widgets: DashboardWidget[]) => Promise<void>;
  updateDashboardTheme: (theme: DashboardTheme) => Promise<void>;
  selectSubscription: (planId: SubscriptionPlanId) => Promise<void>;
  
  addDocument: (doc: AppDocument) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  sendMessage: (msg: Message) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  addAnnouncement: (ann: Announcement) => Promise<void>;

  bulkUpdateInventory: (ids: string[], updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItems: (ids: string[]) => Promise<void>;
  deductInventory: (productName: string, grade: string, quantity: number) => Promise<void>;
  approvePurchaseOrder: (id: string) => Promise<void>;
  addPurchaseOrder: (order: PurchaseOrder, initialPayment: number, method: string) => Promise<boolean>;
  updatePurchaseOrderStatus: (id: string, status: string) => Promise<void>;
  payPurchaseOrder: (id: string, amount: number, method: string) => Promise<void>;

  addDepartment: (dept: Department) => Promise<void>;
  updateDepartment: (dept: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  
  balance: number;
  formatCurrency: (amount: number) => string;
  getAllUsers: () => User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [loading, setLoading] = useState(true);

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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pendingSignups, setPendingSignups] = useState<PendingSignup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Initial Load from Storage
  const loadState = () => {
    const savedUser = localStorage.getItem('nexa_user');
    const savedSignups = localStorage.getItem('nexa_pending_signups');
    
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        const storageKey = `nexa_data_${u.id}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            setFarms(data.farms || []);
            setInventory(data.inventory || []);
            setTransactions(data.transactions || []);
            setNotifications(data.notifications || []);
            setRequisitions(data.requisitions || []);
            setCrops(data.crops || []);
            setStaff(data.staff || []);
            setHarvests(data.harvests || []);
            setExports(data.exports || []);
            setAnimals(data.animals || []);
            setClients(data.clients || []);
            setPurchaseOrders(data.purchaseOrders || []);
            setStaffPayments(data.staffPayments || []);
            setDocuments(data.documents || []);
            setMessages(data.messages || []);
            setAnnouncements(data.announcements || []);
            setDepartments(data.departments || []);
        }
      } catch (e) {
        console.error("Critical State Corruption Detected:", e);
      }
    }
    if (savedSignups) {
      try { setPendingSignups(JSON.parse(savedSignups)); } catch (e) {}
    }
  };

  useEffect(() => {
    loadState();
    setLoading(false);

    // Cross-tab sync listener
    const syncHandler = (e: StorageEvent) => {
        if (e.key === 'nexa_user' || e.key?.startsWith('nexa_data_')) {
            loadState();
        }
    };
    window.addEventListener('storage', syncHandler);
    return () => window.removeEventListener('storage', syncHandler);
  }, []);

  // Sync state to storage on every change
  useEffect(() => {
    if (user) {
        const storageKey = `nexa_data_${user.id}`;
        const data = {
            farms, inventory, transactions, notifications, requisitions, 
            crops, staff, harvests, exports, animals, clients, 
            purchaseOrders, staffPayments, documents, messages, announcements,
            departments
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        localStorage.setItem('nexa_user', JSON.stringify(user));
    }
  }, [farms, inventory, transactions, notifications, requisitions, crops, staff, harvests, exports, animals, clients, purchaseOrders, staffPayments, documents, messages, announcements, departments, user]);

  useEffect(() => {
    localStorage.setItem('nexa_pending_signups', JSON.stringify(pendingSignups));
  }, [pendingSignups]);

  const balance = transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME' || curr.type === 'INITIAL_CAPITAL') return acc + curr.amount;
    return acc - curr.amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    const cur = user?.preferredCurrency || 'UGX';
    return `${cur} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const logout = () => { 
    setUser(null); 
    localStorage.removeItem('nexa_user');
    setFarms([]); setInventory([]); setTransactions([]); setNotifications([]);
    setRequisitions([]); setCrops([]); setStaff([]); setHarvests([]);
    setExports([]); setAnimals([]); setClients([]); setPurchaseOrders([]);
    setStaffPayments([]); setDocuments([]); setMessages([]); setAnnouncements([]);
    setDepartments([]);
  };

  const addNotification = (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => {
    setNotifications(prev => [...prev, { id: Math.random().toString(), message, type, date: new Date().toISOString(), read: false, link }]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getAllUsers = () => {
      return JSON.parse(localStorage.getItem('nexa_mock_registry') || '[]');
  };

  const login = async (email: string, pass: string): Promise<boolean | 'PENDING' | 'REJECTED' | 'LIMIT_REACHED' | 'INVALID'> => {
    if (MOCK_AUTH) {
        if (email === "oliver.amanya1@gmail.com") {
             if (pass !== "Ollya1#234") return 'INVALID';
             const mockUser: User = {
                id: "oliver-001",
                email,
                name: "Oliver Amanya Alinaitwe",
                role: "ADMIN",
                sector: "GENERAL",
                companyName: "Nexa Intelligence Global",
                setupComplete: true,
                tutorialCompleted: true,
                preferredCurrency: "UGX",
                activationStatus: 'ACTIVE',
                dashboardTheme: 'emerald'
            };
            setUser(mockUser);
            return true;
        }

        const registry = getAllUsers();
        const found = registry.find((u: User) => u.email === email);
        
        if (found) {
            let isMatch = false;
            if (found.passwordSalt) {
                const hashedInput = await hashPassword(pass, found.passwordSalt);
                isMatch = found.password === hashedInput;
            } else {
                isMatch = found.password === pass;
            }

            if (!isMatch) return 'INVALID';
            if ((found.rejectionCount || 0) >= MAX_REJECTIONS) return 'LIMIT_REACHED';
            if (found.activationStatus === 'PENDING') return 'PENDING';
            if (found.activationStatus === 'REJECTED') return 'REJECTED';
            
            setUser(found);
            return true;
        }
    }
    return 'INVALID';
  };

  const register = async (data: any) => {
    const registry = getAllUsers();
    const existing = registry.find((u: User) => u.email === data.email);
    
    if (existing && (existing.rejectionCount || 0) >= MAX_REJECTIONS) {
        return { success: false, message: "Maximum signup attempts reached." };
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);
    const newUser: User = { 
        ...data,
        password: hashedPassword,
        passwordSalt: salt,
        id: 'u-' + Math.random().toString(36).substr(2, 9), 
        setupComplete: false,
        activationStatus: 'PENDING',
        rejectionCount: existing ? (existing.rejectionCount || 0) : 0,
        role: 'ADMIN',
        dashboardTheme: 'emerald'
    };

    const updatedRegistry = registry.filter((u: User) => u.email !== data.email);
    updatedRegistry.push(newUser);
    localStorage.setItem('nexa_mock_registry', JSON.stringify(updatedRegistry));

    return { success: true, message: "Identity created.", user: newUser };
  };

  const submitVerification = async (v: Omit<PendingSignup, 'id' | 'date'>) => {
    const signup: PendingSignup = {
        ...v,
        id: 'ps-' + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
    };
    setPendingSignups(prev => [...prev, signup]);
  };

  const approveSignup = async (signupId: string) => {
    const signup = pendingSignups.find(s => s.id === signupId);
    if (!signup) return;
    await changeUserStatus(signup.userId, 'ACTIVE');
    setPendingSignups(prev => prev.filter(s => s.id !== signupId));
    addNotification(`Account for ${signup.userName} activated.`, 'SUCCESS');
  };

  const rejectSignup = async (signupId: string) => {
    const signup = pendingSignups.find(s => s.id === signupId);
    if (!signup) return;
    const registry = getAllUsers();
    const updatedRegistry = registry.map((u: User) => 
        u.id === signup.userId ? { ...u, activationStatus: 'REJECTED', rejectionCount: (u.rejectionCount || 0) + 1 } : u
    );
    localStorage.setItem('nexa_mock_registry', JSON.stringify(updatedRegistry));
    setPendingSignups(prev => prev.filter(s => s.id !== signupId));
    addNotification(`Signup rejected.`, 'ALERT');
  };

  const deleteUser = async (userId: string) => {
    const registry = getAllUsers();
    const updatedRegistry = registry.filter((u: User) => u.id !== userId);
    localStorage.setItem('nexa_mock_registry', JSON.stringify(updatedRegistry));
    addNotification(`User removed from database.`, 'ALERT');
  };

  const changeUserStatus = async (userId: string, status: ActivationStatus) => {
    const registry = getAllUsers();
    const updatedRegistry = registry.map((u: User) => 
        u.id === userId ? { ...u, activationStatus: status } : u
    );
    localStorage.setItem('nexa_mock_registry', JSON.stringify(updatedRegistry));
  };

  const resetUserStatus = (email: string) => {
      const registry = getAllUsers();
      const updatedRegistry = registry.map((u: User) => 
          u.email === email ? { ...u, activationStatus: 'PENDING' } : u
      );
      localStorage.setItem('nexa_mock_registry', JSON.stringify(updatedRegistry));
  };

  const completeOnboarding = async () => {
    if (user) {
        const updated = { ...user, setupComplete: true };
        setUser(updated);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
        const updated = { ...user, ...updates };
        setUser(updated);
    }
  };

  const addFarm = async (farm: Farm) => setFarms(prev => [...prev, farm]);

  const addToInventory = async (item: InventoryItem, financeOptions?: any) => {
    setInventory(prev => [...prev, item]);
    if (financeOptions) {
        addTransaction({
            id: Math.random().toString(),
            type: 'EXPENSE',
            category: 'Inventory',
            amount: financeOptions.cost,
            description: `Stock Acquisition: ${item.productName} (${financeOptions.supplierName || 'General Supplier'})`,
            date: new Date().toISOString(),
            paymentMethod: financeOptions.method || 'BANK_TRANSFER',
            reference: financeOptions.reference
        });
    }
  };

  const addTransaction = async (tx: Transaction) => setTransactions(prev => [tx, ...prev]);
  const addCrop = async (crop: Crop) => setCrops(prev => [...prev, crop]);
  const updateCropStatus = async (id: string, status: CropStatus) => setCrops(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  
  const addHarvest = async (harvest: Harvest, financeOptions?: any) => {
    setHarvests(prev => [...prev, harvest]);
    if (financeOptions && financeOptions.cost > 0) {
        addTransaction({
            id: Math.random().toString(),
            type: 'EXPENSE',
            category: 'Production',
            amount: financeOptions.cost,
            description: `Production/Processing Cost: ${harvest.cropName}`,
            date: new Date().toISOString(),
            paymentMethod: financeOptions.method || 'CASH'
        });
    }
  };

  const updateHarvest = async (harvest: Harvest) => setHarvests(prev => prev.map(h => h.id === harvest.id ? harvest : h));
  
  const createExport = async (order: ExportOrder, initialPayment: number, method: string) => {
    const stock = inventory.find(i => i.productName === order.productName && i.grade === order.grade);
    if (!stock || stock.quantity < order.quantity) {
        addNotification(`CRITICAL: Insufficient stock for ${order.productName} export.`, 'ALERT');
        return false;
    }

    deductInventory(order.productName, order.grade, order.quantity);
    setExports(prev => [...prev, order]);
    addNotification(`Export Mission Launched: ${order.shipmentNumber}`, 'SUCCESS', '/app/exports');
    if (initialPayment > 0) {
        addTransaction({
            id: Math.random().toString(),
            type: 'INCOME',
            category: 'Mission Settlement',
            amount: initialPayment,
            description: `Advance Settlement for Mission: ${order.shipmentNumber}`,
            date: new Date().toISOString(),
            paymentMethod: method as any
        });
    }
    return true;
  };

  const updateExportPayment = async (id: string, amount: number, method: string) => {
    setExports(prev => prev.map(e => {
        if (e.id === id) {
            const updated = { ...e, amountPaid: e.amountPaid + amount };
            if (updated.amountPaid >= e.totalValue) updated.status = 'PAID';
            
            addTransaction({
                id: Math.random().toString(),
                type: 'INCOME',
                category: 'Mission Settlement',
                amount: amount,
                description: `Remittance received for Mission: ${e.shipmentNumber}`,
                date: new Date().toISOString(),
                paymentMethod: method as any
            });
            
            return updated;
        }
        return e;
    }));
  };

  const updateExportStatus = async (id: string, status: string) => {
    setExports(prev => prev.map(e => e.id === id ? { ...e, status: status as any } : e));
    return true;
  };

  const updateRequisitionStatus = async (id: string, status: string) => {
    setRequisitions(prev => prev.map(r => {
        if (r.id === id) {
            const updated = { ...r, status: status as any };
            if (status === 'APPROVED') {
                addTransaction({
                    id: Math.random().toString(),
                    type: 'EXPENSE',
                    category: r.category,
                    amount: r.amount,
                    description: `Authorized spend: ${r.reason}`,
                    date: new Date().toISOString(),
                    paymentMethod: 'CASH'
                });
            }
            return updated;
        }
        return r;
    }));
  };

  const addRequisition = async (req: Requisition) => setRequisitions(prev => [...prev, req]);
  const bulkUpdateInventory = async (ids: string[], updates: Partial<InventoryItem>) => setInventory(prev => prev.map(item => ids.includes(item.id) ? { ...item, ...updates } : item));
  const deleteInventoryItems = async (ids: string[]) => setInventory(prev => prev.filter(item => !ids.includes(item.id)));
  const deductInventory = async (productName: string, grade: string, quantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.productName === productName && item.grade === grade) {
        return { ...item, quantity: Math.max(0, item.quantity - quantity) };
      }
      return item;
    }));
  };

  const approvePurchaseOrder = async (id: string) => setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'ORDERED' } : po));
  
  const addPurchaseOrder = async (order: PurchaseOrder, initialPayment: number, method: string) => {
      for (const item of order.items) {
          const invName = item.productName.split(' (')[0];
          const invGrade = item.productName.split('(')[1]?.replace(')', '') || 'Standard';
          const stock = inventory.find(i => i.productName === invName && i.grade === invGrade);
          if (!stock || stock.quantity < item.quantity) {
              addNotification(`CRITICAL: Insufficient stock for ${item.productName} sale.`, 'ALERT');
              return false;
          }
      }

      order.items.forEach(item => {
          const invName = item.productName.split(' (')[0];
          const invGrade = item.productName.split('(')[1]?.replace(')', '') || 'Standard';
          deductInventory(invName, invGrade, item.quantity);
      });

      setPurchaseOrders(prev => [...prev, order]);
      if (initialPayment > 0) {
          addTransaction({
              id: Math.random().toString(),
              type: 'INCOME',
              category: 'Sales',
              amount: initialPayment,
              description: `Initial Settlement for Sale: ${order.orderNumber}`,
              date: new Date().toISOString(),
              paymentMethod: method as any
          });
      }
      return true;
  };

  const updatePurchaseOrderStatus = async (id: string, status: string) => setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: status as any } : po));
  
  const payPurchaseOrder = async (id: string, amount: number, method: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === id) {
        const updated = { ...po, amountPaid: po.amountPaid + amount };
        updated.paymentStatus = updated.amountPaid >= po.totalAmount ? 'PAID' : (updated.amountPaid > 0 ? 'PARTIAL' : 'UNPAID');
        addTransaction({
            id: Math.random().toString(),
            type: 'INCOME',
            category: 'Sales',
            amount: amount,
            description: `Remittance for Sale: ${po.orderNumber}`,
            date: new Date().toISOString(),
            paymentMethod: method as any
        });
        return updated;
      }
      return po;
    }));
  };

  const addAnimal = async (animal: Animal) => setAnimals(prev => [...prev, animal]);

  const addStaff = async (member: StaffMember, pass: string) => {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(pass, salt);
    setStaff(prev => [...prev, { ...member, password: hashedPassword, passwordSalt: salt }]);
    const registry = getAllUsers();
    registry.push({
        id: member.id,
        email: member.email,
        password: hashedPassword,
        passwordSalt: salt,
        name: member.name,
        role: 'STAFF',
        sector: user?.sector || 'GENERAL',
        activationStatus: 'ACTIVE',
        setupComplete: true,
        companyName: user?.companyName,
        dashboardTheme: user?.dashboardTheme || 'emerald'
    });
    localStorage.setItem('nexa_mock_registry', JSON.stringify(registry));
  };
  
  const payStaff = async (payment: StaffPayment) => {
    setStaffPayments(prev => [...prev, payment]);
    addTransaction({
        id: Math.random().toString(),
        type: 'EXPENSE',
        category: 'Payroll',
        amount: payment.amount,
        description: `Disbursement: ${payment.staffName} (${payment.period})`,
        date: new Date().toISOString(),
        paymentMethod: payment.method
    });
  };

  const assignTask = (staffId: string, task: StaffTask) => setStaff(prev => prev.map(s => s.id === staffId ? { ...s, tasks: [...(s.tasks || []), task] } : s));
  const updateTaskStatus = (staffId: string, taskId: string, status: string) => setStaff(prev => prev.map(s => s.id === staffId ? { ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, status: status as any } : t) } : s));
  const updateStaffPermissions = async (staffId: string, permissions: Permission[]) => setStaff(prev => prev.map(s => s.id === staffId ? { ...s, permissions } : s));
  const addClient = async (client: Client) => setClients(prev => [...prev, client]);
  const replayTutorial = () => setUser(prev => prev ? { ...prev, tutorialCompleted: false } : null);
  const updateDashboardWidgets = async (dashboardWidgets: DashboardWidget[]) => updateUser({ dashboardWidgets });
  const updateDashboardTheme = async (dashboardTheme: DashboardTheme) => updateUser({ dashboardTheme });
  const selectSubscription = async (planId: SubscriptionPlanId) => updateUser({ subscriptionPlan: planId });
  const addDocument = async (doc: AppDocument) => setDocuments(prev => [doc, ...prev]);
  const deleteDocument = async (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));
  const sendMessage = async (msg: Message) => setMessages(prev => [msg, ...prev]);
  const markMessageRead = async (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  const addAnnouncement = async (ann: Announcement) => setAnnouncements(prev => [ann, ...prev]);
  const addDepartment = async (dept: Department) => setDepartments(prev => [...prev, dept]);
  const updateDepartment = async (dept: Department) => setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d));
  const deleteDepartment = async (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));

  return (
    <AppContext.Provider value={{
      user, loading, theme, toggleTheme, logout,
      farms, inventory, transactions, notifications, requisitions, crops, staff, harvests, exports, animals, clients, documents, messages, announcements, purchaseOrders, staffPayments, pendingSignups, departments,
      addFarm, addToInventory, addTransaction, addNotification, markNotificationRead, markAllNotificationsRead, addCrop, updateCropStatus, addHarvest, updateHarvest,
      createExport, updateExportPayment, updateExportStatus, updateRequisitionStatus, addRequisition, login, register, submitVerification, approveSignup, rejectSignup, deleteUser, changeUserStatus, resetUserStatus, completeOnboarding, updateUser,
      addAnimal, addStaff, payStaff, assignTask, updateTaskStatus, updateStaffPermissions, addClient, replayTutorial, updateDashboardWidgets, updateDashboardTheme,
      selectSubscription,
      addDocument, deleteDocument, sendMessage, markMessageRead, addAnnouncement, bulkUpdateInventory, deleteInventoryItems, deductInventory, approvePurchaseOrder, addPurchaseOrder, updatePurchaseOrderStatus, payPurchaseOrder,
      addDepartment, updateDepartment, deleteDepartment,
      balance, formatCurrency, getAllUsers
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
