import { User, CondoUnit, ViewingBooking, LeaseContract, Invoice, MaintenanceTicket } from '../types';

export const CURRENT_USER: User = {
  id: 'usr_tenant_01',
  name: 'กฤษณะ วงศ์ประเสริฐ',
  email: 'kritsana.w@example.com',
  phone: '081-234-5678',
  role: 'TENANT',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isKycVerified: true,
  nationalIdMasked: '1-1002-XXXXX-89-1'
};

export const MOCK_UNITS: CondoUnit[] = [
  {
    id: 'unit-101',
    title: 'Ideo Q Sukhumvit 36 - High Floor วิวเมือง 360 องศา',
    projectName: 'Ideo Q Sukhumvit 36',
    location: 'สุขุมวิท 36, คลองเตย, กรุงเทพฯ',
    district: 'สุขุมวิท / คลองเตย',
    station: 'BTS ทองหล่อ',
    stationDistance: '450 ม.',
    floor: 28,
    sizeSqM: 45,
    bedrooms: 1,
    bathrooms: 1,
    monthlyRent: 28000,
    depositAmount: 56000,
    advanceRentAmount: 28000,
    status: 'AVAILABLE',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['สระว่ายน้ำลอยฟ้า', 'ฟิตเนส 24 ชม.', 'Smart Door Lock', 'เครื่องซักผ้า', 'ที่จอดรถ 1 คัน', 'ลิฟต์ล็อคชั้น', 'EV Charger'],
    description: 'ห้องตกแต่งสไตล์ Modern Luxury เฟอร์นิเจอร์นำเข้าครบครัน เครื่องใช้ไฟฟ้า Smart TV, ตู้เย็น 2 ประตู, ไมโครเวฟ, ประตูดิจิตอลล็อค เดินทางสะดวกใกล้ BTS ทองหล่อ พร้อมเข้าอยู่ทันที',
    ownerId: 'usr_owner_01',
    ownerName: 'คุณสมชาย ธนกิจ',
    ownerPhone: '089-999-8877'
  },
  {
    id: 'unit-102',
    title: 'The Monument Thong Lo - 2 ห้องนอน เพนต์เฮาส์สเปซ',
    projectName: 'The Monument Thong Lo',
    location: 'ซอยทองหล่อ (สุขุมวิท 55), วัฒนา, กรุงเทพฯ',
    district: 'ทองหล่อ / วัฒนา',
    station: 'BTS ทองหล่อ',
    stationDistance: '800 ม.',
    floor: 35,
    sizeSqM: 125,
    bedrooms: 2,
    bathrooms: 2,
    monthlyRent: 85000,
    depositAmount: 170000,
    advanceRentAmount: 85000,
    status: 'AVAILABLE',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Private Lift', 'สระว่ายน้ำระบบเกลือ', 'ห้องโยคะ', 'Pet Friendly', 'ที่จอดรถ 2 คัน', 'Concierge Service 24h'],
    description: 'คอนโดระดับ Ultimate Luxury เลี้ยงสัตว์ได้ (Pet Friendly) เพดานสูงโปร่ง 3 เมตร พร้อมระเบียงกว้าง วิวเมืองโปร่งโล่งไม่มีตึกบัง',
    ownerId: 'usr_owner_02',
    ownerName: 'คุณวราภรณ์ จิตต์กุศล',
    ownerPhone: '086-555-1234'
  },
  {
    id: 'unit-103',
    title: 'Rhythm Asoke 2 - ห้องสตูดิโอ ใกล้ MRT พระราม 9 แต่งครบ',
    projectName: 'Rhythm Asoke 2',
    location: 'ถนนอโศก-ดินแดง, ห้วยขวาง, กรุงเทพฯ',
    district: 'พระราม 9 / ห้วยขวาง',
    station: 'MRT พระราม 9',
    stationDistance: '350 ม.',
    floor: 14,
    sizeSqM: 28,
    bedrooms: 1,
    bathrooms: 1,
    monthlyRent: 16000,
    depositAmount: 32000,
    advanceRentAmount: 16000,
    status: 'AVAILABLE',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'Sauna', 'Keycard Access', 'CCTV 24 ชม.'],
    description: 'เดินทางสะดวกเพียง 350 เมตรจาก MRT พระราม 9 ใกล้เซ็นทรัลพระราม 9 และ ฟอร์จูนทาวน์ ห้องทิศตะวันออกแดดเช้าไม่ร้อน',
    ownerId: 'usr_owner_01',
    ownerName: 'คุณสมชาย ธนกิจ',
    ownerPhone: '089-999-8877'
  },
  {
    id: 'unit-104',
    title: 'Noble Around Ari - ติดบันได BTS อารีย์ ตกแต่ง Minimal',
    projectName: 'Noble Around Ari',
    location: 'พหลโยธิน ซอย 7, พญาไท, กรุงเทพฯ',
    district: 'อารีย์ / พญาไท',
    station: 'BTS อารีย์',
    stationDistance: '90 ม.',
    floor: 19,
    sizeSqM: 35,
    bedrooms: 1,
    bathrooms: 1,
    monthlyRent: 23000,
    depositAmount: 46000,
    advanceRentAmount: 23000,
    status: 'RENTED',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['Co-Working Space', 'Sky Lounge', 'Infinite Pool', 'Auto Parking'],
    description: 'ทำเลใจกลางย่านอารีย์ เดิน 1 นาทีถึงสถานีรถไฟฟ้า ห้องจัดสัดส่วนดีมาก พร้อม Walk-in Closet',
    ownerId: 'usr_owner_03',
    ownerName: 'คุณอนันต์ พัฒนทรัพย์',
    ownerPhone: '081-888-4433'
  }
];

export const MOCK_BOOKINGS: ViewingBooking[] = [
  {
    id: 'bk-2026-001',
    unitId: 'unit-101',
    unitTitle: 'Ideo Q Sukhumvit 36 - High Floor',
    tenantId: 'usr_tenant_01',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    tenantPhone: '081-234-5678',
    bookingDate: '2026-10-05',
    bookingTime: '14:00 น.',
    status: 'CONFIRMED',
    notes: 'ขอนัดดูช่วงบ่าย อยากดูทิศระเบียงและวิวเมือง',
    createdAt: '2026-09-28'
  },
  {
    id: 'bk-2026-002',
    unitId: 'unit-103',
    unitTitle: 'Rhythm Asoke 2 - ห้องสตูดิโอ',
    tenantId: 'usr_tenant_01',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    tenantPhone: '081-234-5678',
    bookingDate: '2026-10-08',
    bookingTime: '11:00 น.',
    status: 'PENDING',
    notes: 'ต้องการชมห้องผ่านวิดีโอคอล หรือไปดูหน้างานจริง',
    createdAt: '2026-09-29'
  }
];

export const MOCK_CONTRACTS: LeaseContract[] = [
  {
    id: 'ctr-2026-098',
    contractNumber: 'CTR-BK-2026/10-001',
    unitId: 'unit-101',
    unitTitle: 'Ideo Q Sukhumvit 36 - High Floor',
    unitLocation: 'ห้องเลขที่ 188/280 ชั้น 28 Ideo Q Sukhumvit 36, กทม.',
    tenantId: 'usr_tenant_01',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    tenantIdCard: '1-1002-XXXXX-89-1',
    ownerId: 'usr_owner_01',
    ownerName: 'คุณสมชาย ธนกิจ',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    monthlyRent: 28000,
    securityDeposit: 56000,
    advancePayment: 28000,
    status: 'ACTIVE',
    tenantSignature: 'กฤษณะ ว.',
    ownerSignature: 'สมชาย ธ.',
    signedAt: '2026-09-25 15:30:00 (Digital Timestamped)',
    terms: [
      'สัญญาเช่ามีกำหนดระยะเวลา 1 ปี เริ่มตั้งแต่วันที่ 1 ต.ค. 2026 ถึง 30 ก.ย. 2027',
      'ผู้เช่าตกลงชำระค่าเช่าล่วงหน้าทุกวันที่ 1-5 ของเดือน ผ่านระบบ CondoRent Hub',
      'เงินประกันความเสียหาย 56,000 บาท จะได้รับคืนภายใน 15 วันหลังสิ้นสุดสัญญาและตรวจสภาพห้องแล้ว',
      'ห้ามสูบบุหรี่ภายในห้องชุด และปฏิบัติตามระเบียบนิติบุคคลอย่างเคร่งครัด'
    ]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-10',
    invoiceNumber: 'INV-202610-0441',
    contractId: 'ctr-2026-098',
    unitTitle: 'Ideo Q Sukhumvit 36 (#280)',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    monthYear: 'ตุลาคม 2026',
    rentAmount: 28000,
    waterUnit: 6,
    waterRate: 20,
    waterTotal: 120,
    electricityUnit: 180,
    electricityRate: 7,
    electricityTotal: 1260,
    commonFee: 0,
    lateFee: 0,
    totalAmount: 29380,
    dueDate: '2026-10-05',
    status: 'UNPAID'
  },
  {
    id: 'inv-2026-09',
    invoiceNumber: 'INV-202609-0210',
    contractId: 'ctr-2026-098',
    unitTitle: 'Ideo Q Sukhumvit 36 (#280)',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    monthYear: 'กันยายน 2026 (ค่าแรกเข้า + เงินประกัน)',
    rentAmount: 28000,
    waterUnit: 0,
    waterRate: 20,
    waterTotal: 0,
    electricityUnit: 0,
    electricityRate: 7,
    electricityTotal: 0,
    commonFee: 0,
    lateFee: 0,
    totalAmount: 84000,
    dueDate: '2026-09-25',
    status: 'PAID',
    paidAt: '2026-09-25 14:22:15',
    paymentMethod: 'PromptPay QR (Omise Gateway)',
    receiptNumber: 'RCP-202609-0112'
  }
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-001',
    unitId: 'unit-101',
    unitTitle: 'Ideo Q Sukhumvit 36 (#280)',
    tenantName: 'กฤษณะ วงศ์ประเสริฐ',
    category: 'AIR_CONDITIONER',
    title: 'เครื่องปรับอากาศห้องนอนมีน้ำหยด และมีเสียงดังเล็กน้อย',
    description: 'เปิดแอร์ประมาณ 2 ชั่วโมงแล้วเริ่มมีหยดน้ำไหลลงมาตามผนัง และพัดลมมีเสียงหวึ่งๆ',
    status: 'IN_PROGRESS',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    createdAt: '2026-09-27 10:15 น.',
    updatedAt: '2026-09-28 09:00 น.',
    technicianNote: 'นิติส่งช่างแอร์เข้าตรวจเช็ควันศุกร์ที่ 2 ต.ค. เวลา 10:30 น.'
  }
];
