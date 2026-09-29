export type UserRole = 'TENANT' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  isKycVerified: boolean;
  nationalIdMasked?: string;
}

export type UnitStatus = 'AVAILABLE' | 'RENTED' | 'RESERVED';

export interface CondoUnit {
  id: string;
  title: string;
  projectName: string;
  location: string;
  district: string;
  station: string;
  stationDistance: string;
  floor: number;
  sizeSqM: number;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  depositAmount: number;
  advanceRentAmount: number;
  status: UnitStatus;
  images: string[];
  amenities: string[];
  description: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED';

export interface ViewingBooking {
  id: string;
  unitId: string;
  unitTitle: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export type ContractStatus = 'DRAFT' | 'PENDING_TENANT_SIGN' | 'PENDING_OWNER_SIGN' | 'ACTIVE' | 'TERMINATED';

export interface LeaseContract {
  id: string;
  contractNumber: string;
  unitId: string;
  unitTitle: string;
  unitLocation: string;
  tenantId: string;
  tenantName: string;
  tenantIdCard: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  advancePayment: number;
  status: ContractStatus;
  tenantSignature?: string;
  ownerSignature?: string;
  signedAt?: string;
  terms: string[];
}

export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  unitTitle: string;
  tenantName: string;
  monthYear: string;
  rentAmount: number;
  waterUnit: number;
  waterRate: number;
  waterTotal: number;
  electricityUnit: number;
  electricityRate: number;
  electricityTotal: number;
  commonFee: number;
  lateFee: number;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

export type MaintenanceCategory = 'AIR_CONDITIONER' | 'PLUMBING' | 'ELECTRICAL' | 'APPLIANCES' | 'FURNITURE' | 'OTHER';
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  unitTitle: string;
  tenantName: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  status: MaintenanceStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  technicianNote?: string;
}
