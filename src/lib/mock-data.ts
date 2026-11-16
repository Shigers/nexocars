import { Vehicle, Lead, Appointment, Expense, PortalPublication } from "@/types";

export const mockDealership = {
  name: "Orlando Cars",
  brands: ["Orlando Cars Ocasión & Comercial", "Loewe Cars Exclusive"],
  cif: "B-98392104",
  address: "C/ Ciudad de Llíria, 61 (Pol. Ind. Fuente del Jarro)",
  city: "Paterna, Valencia",
  phone: "+34 96 147 5660",
  whatsapp: "+34 658 803 533",
  email: "info@orlandocars.es",
  website: "www.orlandocars.es",
};

export const mockVehicles: Vehicle[] = [];

export const mockLeads: Lead[] = [
  {
    id: "lead-01",
    customer_id: "cust-01",
    customer_name: "Carlos Mendoza Silva",
    customer_phone: "+34 620 441 298",
    customer_email: "carlos.mendoza@gmail.com",
    vehicle_id: "veh-001",
    vehicle_title: "Mercedes-Benz Clase A 200d AMG Line",
    vehicle_plate: "4821-LXZ",
    title: "Interesado en Clase A con financiación a 72 meses",
    stage: "prueba_realizada",
    source: "coches_net",
    budget: 30000,
    assigned_to_name: "David Comercial",
    priority: "alta",
    created_at: "2026-11-04T11:20:00Z",
    notes: "Le encantó la prueba del coche. Ha enviado nóminas para estudiar la financiación con Santander Consumer."
  },
  {
    id: "lead-02",
    customer_id: "cust-02",
    customer_name: "Beatriz Fernández Morales",
    customer_phone: "+34 644 112 334",
    customer_email: "b.fernandez@outlook.es",
    vehicle_id: "veh-002",
    vehicle_title: "Audi Q5 40 TDI quattro S Line ECO",
    vehicle_plate: "9134-MBN",
    title: "Busca SUV etiqueta ECO para entrar a Madrid ZBE",
    stage: "visita_agendada",
    source: "web",
    budget: 45000,
    assigned_to_name: "David Comercial",
    priority: "urgente",
    created_at: "2026-11-05T09:45:00Z",
    notes: "Cita programada para mañana a las 11:30 en el showroom de Loewe Cars."
  },
  {
    id: "lead-03",
    customer_id: "cust-03",
    customer_name: "Alejandro Gómez Rovira",
    customer_phone: "+34 689 334 122",
    vehicle_id: "veh-loewe-101",
    vehicle_title: "Porsche Macan GTS 440CV Crayon",
    vehicle_plate: "3302-MMT",
    title: "Consulta por WhatsApp sobre garantía Porsche Approved",
    stage: "contactado",
    source: "whatsapp",
    budget: 90000,
    assigned_to_name: "Gerencia Orlando",
    priority: "alta",
    created_at: "2026-11-06T15:10:00Z",
    notes: "Tiene un BMW M2 2020 para entregar como parte de pago. Pendiente de enviarle tasación."
  },
  {
    id: "lead-04",
    customer_id: "cust-04",
    customer_name: "María del Carmen Soto",
    customer_phone: "+34 611 987 234",
    vehicle_id: "veh-003",
    vehicle_title: "BMW Serie 3 Touring 320d xDrive M",
    vehicle_plate: "1289-KVK",
    title: "Reserva abonada mediante transferencia (1.000 €)",
    stage: "financiacion",
    source: "autoscout24",
    budget: 32500,
    assigned_to_name: "David Comercial",
    priority: "alta",
    created_at: "2026-10-30T17:00:00Z",
    notes: "Señal recibida en cuenta. Financiación pre-aprobada con Cetelem."
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt-01",
    title: "Prueba Dinámica Audi Q5 S-Line",
    appointment_type: "prueba_dinamica",
    start_time: "2026-11-07T11:30:00+01:00",
    end_time: "2026-11-07T12:30:00+01:00",
    customer_name: "Beatriz Fernández Morales",
    customer_phone: "+34 644 112 334",
    vehicle_plate: "9134-MBN",
    vehicle_title: "Audi Q5 40 TDI quattro",
    status: "programada"
  },
  {
    id: "apt-02",
    title: "Entrega de Vehículo BMW 320d Touring",
    appointment_type: "entrega",
    start_time: "2026-11-07T17:00:00+01:00",
    end_time: "2026-11-07T18:00:00+01:00",
    customer_name: "María del Carmen Soto",
    customer_phone: "+34 611 987 234",
    vehicle_plate: "1289-KVK",
    vehicle_title: "BMW Serie 3 Touring",
    status: "programada"
  },
  {
    id: "apt-03",
    title: "Tasación de BMW M2 en Campa",
    appointment_type: "visita",
    start_time: "2026-11-08T10:00:00+01:00",
    end_time: "2026-11-08T10:45:00+01:00",
    customer_name: "Alejandro Gómez Rovira",
    customer_phone: "+34 689 334 122",
    status: "programada"
  }
];

export const mockExpenses: Expense[] = [
  {
    id: "exp-01",
    vehicle_id: "veh-001",
    vehicle_plate: "4821-LXZ",
    vehicle_title: "Mercedes-Benz Clase A",
    category: "chapa_pintura",
    description: "Pintado de paragolpes delantero y pulido cerámico carrocería",
    amount: 420.00,
    invoice_number: "FAC-PINT-2026-89",
    provider_name: "Carrocerías & Pintura Express S.L.",
    invoice_date: "2026-09-18"
  },
  {
    id: "exp-02",
    vehicle_id: "veh-001",
    vehicle_plate: "4821-LXZ",
    vehicle_title: "Mercedes-Benz Clase A",
    category: "mecanica",
    description: "Revisión Oficial B (aceite motor, filtros, líquido de frenos)",
    amount: 430.00,
    invoice_number: "FAC-TALLER-1029",
    provider_name: "Taller Mecánico Especializado Bosch",
    invoice_date: "2026-09-20"
  },
  {
    id: "exp-03",
    vehicle_id: "veh-002",
    vehicle_plate: "9134-MBN",
    vehicle_title: "Audi Q5 quattro",
    category: "limpieza",
    description: "Detallado integral interior con desinfección ozono e hidratación cuero",
    amount: 180.00,
    provider_name: "Detailing Car Madrid",
    invoice_date: "2026-10-03"
  },
  {
    id: "exp-04",
    vehicle_id: "veh-002",
    vehicle_plate: "9134-MBN",
    vehicle_title: "Audi Q5 quattro",
    category: "garantia_mecanica",
    description: "Póliza Garantía Mecánica Premium 12 meses cobertura total",
    amount: 550.00,
    invoice_number: "POL-GAR-77491",
    provider_name: "Garantías Mecánicas GarantiPLUS",
    invoice_date: "2026-10-05"
  }
];

export const mockPortals: PortalPublication[] = [
  {
    portal: "coches_net",
    name: "Coches.net",
    logo: "🚗",
    status: "publicado",
    last_synced: "Hace 15 min",
    ad_url: "https://www.coches.net"
  },
  {
    portal: "autoscout24",
    name: "AutoScout24",
    logo: "🟡",
    status: "publicado",
    last_synced: "Hace 35 min",
    ad_url: "https://www.autoscout24.es"
  },
  {
    portal: "wallapop",
    name: "Wallapop Motor",
    logo: "🟢",
    status: "publicado",
    last_synced: "Hace 2 horas",
    ad_url: "https://es.wallapop.com"
  },
  {
    portal: "milanuncios",
    name: "Milanuncios",
    logo: "🟡",
    status: "pendiente",
    last_synced: "En cola de sincronización"
  },
  {
    portal: "web_propia",
    name: "Web Orlando Cars & Loewe",
    logo: "🌐",
    status: "publicado",
    last_synced: "Tiempo real"
  }
];
