import {
  User,
  CondoUnit,
  ViewingBooking,
  LeaseContract,
  Invoice,
  MaintenanceTicket
} from '../types';

import {
  MOCK_UNITS,
  MOCK_BOOKINGS,
  MOCK_CONTRACTS,
  MOCK_INVOICES,
  MOCK_TICKETS
} from '../data/mockData';

export interface UserAccount extends User {
  password?: string;
}

export const SEED_USERS: UserAccount[] = [
  {
    id: 'usr_admin_seree',
    name: 'คุณเสรี (ผู้ดูแลระบบสูงสุด)',
    email: 'seree999@gmail.com',
    phone: '089-999-9999',
    password: 'password123',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isKycVerified: true,
    nationalIdMasked: '1-1009-XXXXX-99-9'
  },
  {
    id: 'usr_tenant_01',
    name: 'กฤษณะ วงศ์ประเสริฐ (ผู้เช่า)',
    email: 'tenant@condorent.com',
    phone: '081-234-5678',
    password: 'password123',
    role: 'TENANT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isKycVerified: true,
    nationalIdMasked: '1-1002-XXXXX-89-1'
  },
  {
    id: 'usr_owner_01',
    name: 'คุณสมชาย ธนกิจ (เจ้าของห้อง)',
    email: 'owner@condorent.com',
    phone: '089-999-8877',
    password: 'password123',
    role: 'OWNER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isKycVerified: true,
    nationalIdMasked: '3-1005-XXXXX-12-3'
  },
  {
    id: 'usr_admin_01',
    name: 'นิติบุคคล / ผู้ดูแลระบบ (Admin)',
    email: 'admin@condorent.com',
    phone: '02-777-8888',
    password: 'password123',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isKycVerified: true,
    nationalIdMasked: '1-1001-XXXXX-00-1'
  }
];

// LocalStorage Keys
const STORAGE_KEYS = {
  USERS: 'condo_db_users_v2',
  CURRENT_USER: 'condo_db_current_user_v2',
  UNITS: 'condo_db_units_v2',
  BOOKINGS: 'condo_db_bookings_v2',
  CONTRACTS: 'condo_db_contracts_v2',
  INVOICES: 'condo_db_invoices_v2',
  TICKETS: 'condo_db_tickets_v2'
};

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    // Note: Do NOT set CURRENT_USER automatically - guest starts as not logged in
    if (!localStorage.getItem(STORAGE_KEYS.UNITS)) {
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(MOCK_UNITS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTRACTS)) {
      localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(MOCK_CONTRACTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(MOCK_INVOICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(MOCK_TICKETS));
    }
  }

  // Auth Operations
  getUsers(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : SEED_USERS;
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  login(emailOrPhone: string, password: string): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const cleanInput = emailOrPhone.trim().toLowerCase();
    
    // Check for user
    const user = users.find(
      (u) => (u.email.toLowerCase() === cleanInput || u.phone === cleanInput) && u.password === password
    );

    if (user) {
      // seree999@gmail.com is always Admin
      const effectiveRole = user.email.toLowerCase() === 'seree999@gmail.com' ? 'ADMIN' : user.role;

      const safeUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: effectiveRole,
        avatar: user.avatar,
        isKycVerified: user.isKycVerified,
        nationalIdMasked: user.nationalIdMasked
      };
      this.setCurrentUser(safeUser);
      return { success: true, user: safeUser };
    }

    return { success: false, message: 'อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง' };
  }

  loginWithGoogle(customProfile?: { name: string; email: string; avatar?: string; role?: 'TENANT' | 'OWNER' }): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const email = customProfile?.email || 'google.user@gmail.com';
    const name = customProfile?.name || 'Google User';
    const avatar = customProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    
    // Give Admin role if seree999@gmail.com
    const isAdmin = email.toLowerCase() === 'seree999@gmail.com';
    const role = isAdmin ? 'ADMIN' : (customProfile?.role || 'TENANT');

    let existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existingUser) {
      existingUser = {
        id: `usr_google_${Date.now()}`,
        name: isAdmin ? 'คุณเสรี (ผู้ดูแลระบบ)' : name,
        email: email,
        phone: '089-999-9999',
        role: role,
        avatar: avatar,
        isKycVerified: true,
        nationalIdMasked: '1-1009-XXXXX-99-9'
      };
      users.push(existingUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else if (isAdmin && existingUser.role !== 'ADMIN') {
      existingUser.role = 'ADMIN';
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    const safeUser: User = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      role: existingUser.role,
      avatar: existingUser.avatar,
      isKycVerified: existingUser.isKycVerified,
      nationalIdMasked: existingUser.nationalIdMasked
    };

    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }

  register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'TENANT' | 'OWNER';
    nationalId?: string;
  }): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();
    
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' };
    }

    const isAdmin = cleanEmail === 'seree999@gmail.com';
    const assignedRole = isAdmin ? 'ADMIN' : userData.role;

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: cleanEmail,
      phone: userData.phone,
      password: userData.password,
      role: assignedRole,
      avatar: assignedRole === 'ADMIN'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : assignedRole === 'OWNER' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isKycVerified: Boolean(userData.nationalId) || isAdmin,
      nationalIdMasked: userData.nationalId 
        ? `${userData.nationalId.slice(0, 1)}-${userData.nationalId.slice(1, 5)}-XXXXX-${userData.nationalId.slice(-4)}`
        : undefined
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const safeUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar,
      isKycVerified: newUser.isKycVerified,
      nationalIdMasked: newUser.nationalIdMasked
    };
    this.setCurrentUser(safeUser);

    return { success: true, user: safeUser };
  }

  logout() {
    this.setCurrentUser(null);
  }

  // Condo Units CRUD
  getUnits(): CondoUnit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.UNITS);
    return raw ? JSON.parse(raw) : MOCK_UNITS;
  }

  saveUnits(units: CondoUnit[]) {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }

  // Bookings CRUD
  getBookings(): ViewingBooking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : MOCK_BOOKINGS;
  }

  saveBookings(bookings: ViewingBooking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  // Contracts CRUD
  getContracts(): LeaseContract[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    return raw ? JSON.parse(raw) : MOCK_CONTRACTS;
  }

  saveContracts(contracts: LeaseContract[]) {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  }

  // Invoices CRUD
  getInvoices(): Invoice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return raw ? JSON.parse(raw) : MOCK_INVOICES;
  }

  saveInvoices(invoices: Invoice[]) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  // Tickets CRUD
  getTickets(): MaintenanceTicket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return raw ? JSON.parse(raw) : MOCK_TICKETS;
  }

  saveTickets(tickets: MaintenanceTicket[]) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }

  // Reset database to initial seed
  resetDatabase() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(MOCK_UNITS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(MOCK_CONTRACTS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(MOCK_INVOICES));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(MOCK_TICKETS));
  }
}

export const db = new DatabaseService();
