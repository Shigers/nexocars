export type FuelType = 'gasolina' | 'diesel' | 'hibrido' | 'hibrido_enchufable' | 'electrico' | 'glp' | 'gnc';
export type TransmissionType = 'manual' | 'automatico';
export type VehicleStatus = 'en_preparacion' | 'disponible' | 'reservado' | 'vendido' | 'baja';
export type EnvironmentalBadge = '0' | 'ECO' | 'C' | 'B' | 'SIN_DISTINTIVO';
export type TaxScheme = 'REBU' | 'GENERAL_IVA' | 'EXENTO';

export interface Company {
  id: string;
  name: string;
  cif_nif: string;
  slug: string;
  legal_name: string;
  address: string;
  city: string;
  postal_code: string;
  province: string;
  phone: string;
  email: string;
  website: string;
  logo_url?: string;
  currency: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  brand: string;
  model: string;
  version: string;
  plate: string;
  vin: string;
  year: number;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  power_hp: number;
  color: string;
  doors: number;
  seats: number;
  environmental_badge: EnvironmentalBadge;
  body_type: string;
  
  // Financials & Margins
  purchase_price: number;
  preparation_costs: number;
  additional_costs: number;
  total_cost: number;
  selling_price: number;
  financed_price?: number;
  min_selling_price?: number;
  tax_scheme: TaxScheme;
  
  // Status & Location
  status: VehicleStatus;
  location: string;
  purchase_date: string;
  supplier_name?: string;
  
  // Showcase
  title: string;
  description: string;
  images: string[];
  equipment_list: string[];
  is_featured: boolean;
  published_on_web: boolean;
  days_in_stock: number;
  created_at: string;
}

export interface Expense {
  id: string;
  vehicle_id: string;
  vehicle_plate?: string;
  vehicle_title?: string;
  category: 'mecanica' | 'chapa_pintura' | 'limpieza' | 'itv' | 'transporte' | 'garantia_mecanica' | 'tasas_dgt' | 'gestoria' | 'otros';
  description: string;
  amount: number;
  invoice_number?: string;
  provider_name: string;
  invoice_date: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  dni_cif: string;
  email: string;
  phone: string;
  city: string;
  customer_type: 'particular' | 'empresa' | 'autonomo';
  created_at: string;
}

export type LeadStage = 'nuevo' | 'contactado' | 'visita_agendada' | 'prueba_realizada' | 'oferta_enviada' | 'financiacion' | 'ganado' | 'perdido';
export type LeadSource = 'web' | 'whatsapp' | 'coches_net' | 'autoscout24' | 'wallapop' | 'milanuncios' | 'llamada' | 'visita_campa' | 'referido';

export interface Lead {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  vehicle_id?: string;
  vehicle_title?: string;
  vehicle_plate?: string;
  title: string;
  stage: LeadStage;
  source: LeadSource;
  budget?: number;
  assigned_to_name: string;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  created_at: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  appointment_type: 'visita' | 'prueba_dinamica' | 'entrega' | 'firma_contrato' | 'taller';
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
  vehicle_plate?: string;
  vehicle_title?: string;
  status: 'programada' | 'completada' | 'cancelada';
}

export interface PortalPublication {
  portal: string;
  name: string;
  logo: string;
  status: 'publicado' | 'pendiente' | 'borrador' | 'error' | 'retirado';
  last_synced?: string;
  ad_url?: string;
  type?: 'api' | 'xml_feed' | 'ftp' | 'webhook';
  feed_url?: string;
  is_custom?: boolean;
  enabled?: boolean;
}
