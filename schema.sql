-- ==============================================================================
-- Condo Rental Management System Database Schema (PostgreSQL / Cloudflare D1 SQL)
-- Designed using Skill: 04-database-design
-- ==============================================================================

-- 1. Users Table (ผู้ใช้งานและสิทธิ์)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('TENANT', 'OWNER', 'ADMIN')),
    avatar_url TEXT,
    is_kyc_verified BOOLEAN DEFAULT FALSE,
    national_id_masked VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Condo Units Table (ข้อมูลห้องชุดและประกาศ)
CREATE TABLE IF NOT EXISTS condo_units (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    station VARCHAR(100) NOT NULL,
    station_distance VARCHAR(50) NOT NULL,
    floor INT NOT NULL CHECK (floor > 0),
    size_sq_m DECIMAL(6,2) NOT NULL CHECK (size_sq_m > 0),
    bedrooms INT NOT NULL DEFAULT 1 CHECK (bedrooms >= 0),
    bathrooms INT NOT NULL DEFAULT 1 CHECK (bathrooms >= 0),
    monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
    deposit_amount DECIMAL(10,2) NOT NULL CHECK (deposit_amount >= 0),
    advance_rent_amount DECIMAL(10,2) NOT NULL CHECK (advance_rent_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RENTED', 'RESERVED')),
    images TEXT[] NOT NULL,
    amenities TEXT[] NOT NULL,
    description TEXT,
    owner_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_condo_units_station ON condo_units(station);
CREATE INDEX IF NOT EXISTS idx_condo_units_price ON condo_units(monthly_rent);
CREATE INDEX IF NOT EXISTS idx_condo_units_status ON condo_units(status);

-- 3. Viewing Bookings Table (การนัดหมายเข้าดูห้อง)
CREATE TABLE IF NOT EXISTS viewing_bookings (
    id VARCHAR(64) PRIMARY KEY,
    unit_id VARCHAR(64) NOT NULL REFERENCES condo_units(id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_unit_datetime UNIQUE (unit_id, booking_date, booking_time)
);

CREATE INDEX IF NOT EXISTS idx_viewing_bookings_unit ON viewing_bookings(unit_id);
CREATE INDEX IF NOT EXISTS idx_viewing_bookings_tenant ON viewing_bookings(tenant_id);

-- 4. Lease Contracts Table (สัญญาเช่าและ E-Signature)
CREATE TABLE IF NOT EXISTS lease_contracts (
    id VARCHAR(64) PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    unit_id VARCHAR(64) NOT NULL REFERENCES condo_units(id),
    tenant_id VARCHAR(64) NOT NULL REFERENCES users(id),
    owner_id VARCHAR(64) NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL CHECK (monthly_rent > 0),
    security_deposit DECIMAL(10,2) NOT NULL CHECK (security_deposit >= 0),
    advance_payment DECIMAL(10,2) NOT NULL CHECK (advance_payment >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_TENANT_SIGN' CHECK (status IN ('DRAFT', 'PENDING_TENANT_SIGN', 'PENDING_OWNER_SIGN', 'ACTIVE', 'TERMINATED')),
    tenant_signature TEXT,
    owner_signature TEXT,
    signed_at TIMESTAMP,
    terms TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lease_contracts_tenant ON lease_contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lease_contracts_owner ON lease_contracts(owner_id);

-- 5. Invoices & Payments Table (ใบแจ้งหนี้และการชำระเงิน)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    contract_id VARCHAR(64) NOT NULL REFERENCES lease_contracts(id) ON DELETE CASCADE,
    month_year VARCHAR(100) NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    water_unit INT DEFAULT 0,
    water_rate DECIMAL(6,2) DEFAULT 20.00,
    water_total DECIMAL(10,2) DEFAULT 0.00,
    electricity_unit INT DEFAULT 0,
    electricity_rate DECIMAL(6,2) DEFAULT 7.00,
    electricity_total DECIMAL(10,2) DEFAULT 0.00,
    common_fee DECIMAL(10,2) DEFAULT 0.00,
    late_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'OVERDUE')),
    paid_at TIMESTAMP,
    payment_method VARCHAR(100),
    receipt_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_contract ON invoices(contract_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 6. Maintenance Tickets Table (การแจ้งซ่อมแซมห้อง)
CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id VARCHAR(64) PRIMARY KEY,
    unit_id VARCHAR(64) NOT NULL REFERENCES condo_units(id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('AIR_CONDITIONER', 'PLUMBING', 'ELECTRICAL', 'APPLIANCES', 'FURNITURE', 'OTHER')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED')),
    image_url TEXT,
    technician_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_unit ON maintenance_tickets(unit_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_tickets(status);
