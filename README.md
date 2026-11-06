# NEXO-CAR / AUTOPILOT CRM 🚗💨
> **El ERP + CRM Integral para Compraventas de Vehículos de Ocasión (VO)**  
> *Diseñado y optimizado para **Orlando Cars**, **Loewe Cars** y preparado para escalado SaaS multi-concesionario.*

---

## 🌟 Visión del Producto
Nexo-Car centraliza y revoluciona las operaciones diarias de un concesionario de vehículos de ocasión:
- **Gestión 360° de Stock e Inventario:** Control por matrícula, número de bastidor (VIN), kilometraje, fotos de alta resolución y días de rotación en campa.
- **Motor Financiero con REBU:** Desglose en cascada de costes de adquisición, reacondicionamiento en taller, chapa/pintura y garantías mecánicas con cálculo automático de margen neto e IVA repercutido.
- **Distribuidor Multi-portal Automotriz:** Arquitectura desacoplada para sincronización de anuncios con **Coches.net**, **AutoScout24**, **Wallapop**, **Milanuncios** y catálogo web propio.
- **CRM Comercial & Pipeline Kanban:** Conversión fluida de leads procedentes de portales, web y llamadas con vinculación directa al coche de interés.
- **WhatsApp Business Cloud Platform:** Bandeja comercial en tiempo real para resolver dudas y enviar fichas técnicas en un clic.
- **Copiloto IA Automotriz (GPT-4o):** Tres agentes especializados (Ventas, Compras/Tasación y Marketing) con acceso contextual al stock.
- **Multi-tenancy Nativo:** Estructura preparada para gestionar de forma independiente **Orlando Cars Selección** y **Loewe Cars Exclusive**.

---

## 🛠️ Stack Tecnológico
- **Frontend / Framework:** [Next.js 15+](https://nextjs.org/) (App Router, React 19, TypeScript).
- **Estilos & UI:** Tailwind CSS, Lucide Icons, diseño Dark/Light tecnológico inspirado en Linear/Stripe.
- **Base de Datos & Auth:** PostgreSQL en [Supabase](https://supabase.com/) con Row Level Security (RLS) en 21 tablas.
- **Métricas & Gráficos:** Recharts para curvas de evolución de ventas y rentabilidad.
- **Automatización:** Webhooks preparados para [n8n](https://n8n.io/).
- **Despliegue:** 100% optimizado para Vercel.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Requisitos previos
- Node.js v18+ o v20+ instalado.
- NPM o PNPM.

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```
Rellena las credenciales de tu proyecto de Supabase y OpenAI.

### 4. Inicializar la Base de Datos (Supabase)
Ejecuta el script SQL maestro ubicado en:
`supabase/schema.sql` en el SQL Editor de tu proyecto de Supabase.

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 📂 Mapa de Rutas de la Aplicación

| Ruta | Módulo | Función |
| :--- | :--- | :--- |
| `/dashboard` | **Panel de Control** | KPIs en tiempo real, valor de stock, margen proyectado y agenda |
| `/vehicles` | **Inventario Stock** | Listado de flota, filtros por combustible/estado, vistas Grid y Tabla |
| `/vehicles/new` | **Alta de Vehículo** | Formulario con calculadora en vivo de margen REBU |
| `/vehicles/[id]` | **Ficha 360°** | 7 pestañas: Datos, Fotos, Gastos taller, Portales, Leads, PDFs |
| `/purchases` | **Compras & Tasaciones**| Valoración de coches usados y cálculo de oferta máxima |
| `/expenses` | **Gastos & Costes** | Facturas de taller y costes imputados por bastidor |
| `/customers` | **Clientes** | Directorio de compradores y particulares |
| `/crm` | **Pipeline CRM** | Tablero Kanban con etapas comerciales |
| `/calendar` | **Agenda** | Citas de pruebas dinámicas, firmas y entregas |
| `/sales` | **Ventas Cerradas** | Registro transaccional inmutable con margen congelado |
| `/publications`| **Multi-Portal** | Matriz de sincronización con Coches.net, Wallapop, etc. |
| `/whatsapp` | **WhatsApp Chat** | Conversaciones comerciales oficiales de Meta |
| `/documents` | **Documentación** | Plantillas de contratos de compraventa y reserva en PDF |
| `/invoices` | **Facturación** | Libro oficial de facturas REBU y Régimen General |
| `/ai-assistant`| **Copiloto IA** | 3 agentes: Ventas, Compras y Marketing con GPT-4o |
| `/analytics` | **Estadísticas** | Rentabilidad por marca y días medios de rotación |
| `/settings` | **Configuración** | Concesionarios, sedes y parámetros fiscales |

---

## 🛡️ Seguridad & Multi-Tenant
- **Row Level Security (RLS)** estricto en cada tabla vinculada por `company_id`.
- Separación contable y de stock entre **Orlando Cars** y **Loewe Cars**.
- Políticas de permisos basadas en roles (`owner`, `manager`, `sales`, `workshop`).
