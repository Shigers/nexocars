-- ==============================================================================
-- NEXO-CAR / AUTOPILOT CRM: MASTER MULTI-TENANT DATABASE SCHEMA (SUPABASE)
-- Designed for Orlando Cars, Loewe Cars & Multi-Dealership SaaS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. COMPANIES (Dealerships / Tenants)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cif_nif VARCHAR(50),
    slug VARCHAR(100) UNIQUE NOT NULL,
    legal_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    province VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    currency VARCHAR(10) DEFAULT 'EUR',
    settings JSONB DEFAULT '{"rebu_default": true, "tax_rate": 21, "theme": "dark"}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    default_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEMBERSHIPS (Tenant Roles: owner, manager, sales, workshop, admin)
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'sales' CHECK (role IN ('owner', 'admin', 'manager', 'sales', 'workshop', 'accountant')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (company_id, user_id)
);

-- 4. VEHICLES (Stock / Inventory)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(150),
    plate VARCHAR(20) NOT NULL,
    vin VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    mileage INT NOT NULL DEFAULT 0,
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('gasolina', 'diesel', 'hibrido', 'hibrido_enchufable', 'electrico', 'glp', 'gnc')),
    transmission VARCHAR(50) NOT NULL CHECK (transmission IN ('manual', 'automatico')),
    power_hp INT,
    color VARCHAR(80),
    doors INT DEFAULT 5,
    seats INT DEFAULT 5,
    environmental_badge VARCHAR(20) CHECK (environmental_badge IN ('0', 'ECO', 'C', 'B', 'SIN_DISTINTIVO')),
    body_type VARCHAR(50) DEFAULT 'berlina',
    
    -- Economics & Margins
    purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    preparation_costs NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    additional_costs NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(12, 2) GENERATED ALWAYS AS (purchase_price + preparation_costs + additional_costs) STORED,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    financed_price NUMERIC(12, 2),
    min_selling_price NUMERIC(12, 2),
    tax_scheme VARCHAR(50) DEFAULT 'REBU' CHECK (tax_scheme IN ('REBU', 'GENERAL_IVA', 'EXENTO')),
    
    -- Lifecycle & Status
    status VARCHAR(50) DEFAULT 'disponible' CHECK (status IN ('en_preparacion', 'disponible', 'reservado', 'vendido', 'baja')),
    location VARCHAR(100) DEFAULT 'Sede Principal',
    purchase_date DATE DEFAULT CURRENT_DATE,
    supplier_id UUID,
    
    -- Commercial & Description
    title VARCHAR(255),
    description TEXT,
    equipment_list TEXT[],
    is_featured BOOLEAN DEFAULT false,
    published_on_web BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (company_id, plate)
);

-- 5. VEHICLE_IMAGES
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    supplier_type VARCHAR(50) DEFAULT 'particular' CHECK (supplier_type IN ('particular', 'concesionario', 'subasta', 'renting', 'importacion')),
    cif_nif VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PURCHASES & APPRAISALS (Tasaciones / Compras)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    prospect_vehicle_info JSONB,
    requested_price NUMERIC(12, 2) DEFAULT 0.00,
    appraised_value NUMERIC(12, 2) DEFAULT 0.00,
    estimated_reconditioning NUMERIC(12, 2) DEFAULT 0.00,
    target_margin NUMERIC(12, 2) DEFAULT 0.00,
    max_purchase_price NUMERIC(12, 2) DEFAULT 0.00,
    final_purchase_price NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'tasacion' CHECK (status IN ('tasacion', 'oferta_enviada', 'negociacion', 'comprado', 'rechazado')),
    notes TEXT,
    appraised_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXPENSES (Gastos imputados por bastidor)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL CHECK (category IN ('mecanica', 'chapa_pintura', 'limpieza', 'itv', 'transporte', 'garantia_mecanica', 'tasas_dgt', 'gestoria', 'otros')),
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    invoice_number VARCHAR(100),
    provider_name VARCHAR(200),
    invoice_date DATE DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150),
    dni_cif VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    customer_type VARCHAR(50) DEFAULT 'particular' CHECK (customer_type IN ('particular', 'empresa', 'autonomo')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. LEADS & CRM PIPELINE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    stage VARCHAR(50) DEFAULT 'nuevo' CHECK (stage IN ('nuevo', 'contactado', 'visita_agendada', 'prueba_realizada', 'oferta_enviada', 'financiacion', 'ganado', 'perdido')),
    source VARCHAR(100) DEFAULT 'web' CHECK (source IN ('web', 'whatsapp', 'coches_net', 'autoscout24', 'wallapop', 'milanuncios', 'llamada', 'visita_campa', 'referido')),
    budget NUMERIC(12, 2),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lost_reason TEXT,
    priority VARCHAR(20) DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
    next_action_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONVERSATIONS (WhatsApp & Web Threads)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    channel VARCHAR(50) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'web_chat', 'email', 'sms')),
    external_chat_id VARCHAR(255),
    messages JSONB DEFAULT '[]'::jsonb,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'waiting_client', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. APPOINTMENTS (Agenda / Citas y Pruebas Dinámicas)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    appointment_type VARCHAR(50) DEFAULT 'visita' CHECK (appointment_type IN ('visita', 'prueba_dinamica', 'entrega', 'firma_contrato', 'taller')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200) DEFAULT 'Sede Principal',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'programada' CHECK (status IN ('programada', 'completada', 'cancelada', 'no_asistio')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SALES (Ventas completadas & Operaciones)
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    sold_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sale_date DATE DEFAULT CURRENT_DATE,
    
    agreed_price NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0.00,
    final_sale_price NUMERIC(12, 2) NOT NULL,
    
    -- Snapshot of costs at moment of sale (immutability)
    frozen_purchase_price NUMERIC(12, 2) NOT NULL,
    frozen_costs NUMERIC(12, 2) NOT NULL,
    frozen_total_cost NUMERIC(12, 2) NOT NULL,
    gross_margin NUMERIC(12, 2) GENERATED ALWAYS AS (final_sale_price - frozen_total_cost) STORED,
    
    tax_scheme VARCHAR(50) DEFAULT 'REBU',
    payment_method VARCHAR(50) DEFAULT 'transferencia' CHECK (payment_method IN ('transferencia', 'financiacion', 'mixto', 'efectivo', 'coche_cambio')),
    warranty_months INT DEFAULT 12,
    status VARCHAR(50) DEFAULT 'completada' CHECK (status IN ('pendiente_pago', 'reservado_con_senal', 'completada', 'cancelada')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAYMENTS (Pagos vinculados a ventas o reservas)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_type VARCHAR(50) DEFAULT 'pago_total' CHECK (payment_type IN ('senal_reserva', 'pago_parcial', 'pago_total', 'financiacion_aprobada')),
    payment_method VARCHAR(50) DEFAULT 'transferencia',
    payment_date DATE DEFAULT CURRENT_DATE,
    receipt_reference VARCHAR(100),
    is_confirmed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. DOCUMENTS (Plantillas y Contratos generados en PDF)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('contrato_compraventa', 'reserva_senal', 'mandato_venta', 'acta_entrega', 'garantia', 'tasacion_compra')),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    signature_status VARCHAR(50) DEFAULT 'borrador' CHECK (signature_status IN ('borrador', 'enviado_firma', 'firmado', 'rechazado')),
    signature_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. INVOICES (Facturación REBU y Régimen General)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) NOT NULL,
    series VARCHAR(20) DEFAULT '2026',
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE DEFAULT CURRENT_DATE,
    client_name VARCHAR(255) NOT NULL,
    client_cif VARCHAR(50) NOT NULL,
    client_address TEXT,
    tax_scheme VARCHAR(50) DEFAULT 'REBU',
    tax_base NUMERIC(12, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) DEFAULT 21.00,
    tax_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT true,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (company_id, series, invoice_number)
);

-- 17. PUBLICATIONS (Distribuidor Multi-portal Coches.net, AutoScout24, Wallapop, etc.)
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    portal VARCHAR(50) NOT NULL CHECK (portal IN ('coches_net', 'autoscout24', 'wallapop', 'milanuncios', 'web_propia')),
    external_ad_id VARCHAR(100),
    ad_url TEXT,
    status VARCHAR(50) DEFAULT 'borrador' CHECK (status IN ('borrador', 'pendiente', 'publicado', 'error', 'retirado')),
    last_synced_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (vehicle_id, portal)
);

-- 18. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ,
    priority VARCHAR(20) DEFAULT 'media',
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ACTIVITY_LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AI_INTERACTIONS (Asistente Inteligente)
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    agent_type VARCHAR(50) DEFAULT 'ventas' CHECK (agent_type IN ('ventas', 'compras', 'marketing', 'analitica')),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FAST AUTOMOTIVE QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON public.vehicles (company_id, plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles (company_id, vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (company_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads (company_id, stage);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON public.appointments (company_id, start_time);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales (company_id, sale_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Base Helper function: check membership
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(c_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.company_id = c_id
    AND m.user_id = auth.uid()
    AND m.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple vehicle policy
CREATE POLICY "Users can view vehicles belonging to their company"
ON public.vehicles FOR SELECT
USING (public.user_belongs_to_company(company_id));

CREATE POLICY "Users can insert/update vehicles in their company"
ON public.vehicles FOR ALL
USING (public.user_belongs_to_company(company_id));
