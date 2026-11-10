// Generador oficial de documentos y facturación para NexoCar (Orlando Cars & Loewe Cars)

export type DocumentType = 
  | "factura" 
  | "contrato" 
  | "reserva" 
  | "entrega" 
  | "mandato_dgt" 
  | "garantia" 
  | "notificacion_dgt";

export interface DocumentData {
  type: DocumentType;
  isBlank?: boolean; // Si es true, genera la plantilla en blanco con líneas de rellenado
  invoiceNumber?: string;
  date?: string;
  companyName?: string;
  companyCif?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  // Cliente
  clientName?: string;
  clientDni?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  // Vehículo
  brand?: string;
  model?: string;
  version?: string;
  plate?: string;
  vin?: string;
  mileage?: number;
  year?: number;
  fuelType?: string;
  color?: string;
  // Importes y Fiscalidad
  sellingPrice?: number;
  taxScheme?: "REBU" | "GENERAL";
  taxBase?: number;
  taxAmount?: number;
  depositAmount?: number; // Para reserva
  paymentMethod?: string;
}

export function generateDocumentHtml(data: DocumentData): string {
  const isBlank = !!data.isBlank;
  const companyName = data.companyName || "ORLANDO CARS S.L.";
  const companyCif = data.companyCif || "B-88492019";
  const companyAddress = data.companyAddress || "Vía Complutense 128, 28805 Alcalá de Henares (Madrid)";
  const companyPhone = data.companyPhone || "+34 918 203 944 / +34 624 56 36 95";
  const companyEmail = data.companyEmail || "administracion@orlandocars.es";
  const dateFormatted = data.date || (isBlank ? "_____ de __________________ de 2026" : new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }));
  const invoiceNum = isBlank ? "FAC-2026-________" : (data.invoiceNumber || `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);

  const isRebu = (data.taxScheme || "REBU") === "REBU";
  const total = data.sellingPrice || 0;
  const taxBase = data.taxBase || (isRebu ? total * 0.15 : total / 1.21);
  const taxAmount = data.taxAmount || (isRebu ? taxBase * 0.21 : total - taxBase);

  // Valores dinámicos o líneas en blanco
  const cName = isBlank ? "________________________________________________________" : (data.clientName || "____________________");
  const cDni = isBlank ? "____________________" : (data.clientDni || "____________________");
  const cAddress = isBlank ? "________________________________________________________" : (data.clientAddress || "____________________");
  const cPhone = isBlank ? "____________________" : (data.clientPhone || "____________________");
  
  const vBrand = isBlank ? "____________________" : (data.brand || "____________________");
  const vModel = isBlank ? "____________________" : (data.model || "____________________");
  const vPlate = isBlank ? "____________________" : (data.plate || "____________________");
  const vVin = isBlank ? "____________________________________" : (data.vin || "____________________");
  const vKm = isBlank ? "____________________ km" : `${data.mileage?.toLocaleString("es-ES") || 0} km`;
  const vYear = isBlank ? "__________" : (data.year || "____");
  const vColor = isBlank ? "____________________" : (data.color || "Gris");
  const vFuel = isBlank ? "____________________" : (data.fuelType || "Diésel / Gasolina");
  const vPrice = isBlank ? "____________________ €" : `${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`;
  const vDeposit = isBlank ? "____________________ €" : `${(data.depositAmount || 500).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`;

  // 1. FACTURA DE VENTA
  if (data.type === "factura") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">FACTURA ORDINARIA OFICIAL ${isBlank ? "(PLANTILLA)" : ""}</div>
          <div style="font-size: 13px; font-weight: 800; color: #2563eb; margin-top: 3px;">Nº Factura: ${invoiceNum}</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          NIF / CIF: ${companyCif}<br>
          ${companyAddress}<br>
          Tel: ${companyPhone}<br>
          Email: ${companyEmail}
        </div>
      </div>

      <div class="grid-2 section">
        <div class="info-box">
          <div class="section-title">DATOS DEL ADQUIRENTE / CLIENTE</div>
          <div class="info-row"><span class="info-label">Nombre / Razón Social:</span><span class="info-value">${cName}</span></div>
          <div class="info-row"><span class="info-label">DNI / NIE / CIF:</span><span class="info-value">${cDni}</span></div>
          <div class="info-row"><span class="info-label">Dirección Fiscal:</span><span class="info-value">${cAddress}</span></div>
          <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${cPhone}</span></div>
        </div>

        <div class="info-box">
          <div class="section-title">DATOS FISCALES DE FACTURACIÓN</div>
          <div class="info-row"><span class="info-label">Fecha de Expedición:</span><span class="info-value">${dateFormatted}</span></div>
          <div class="info-row"><span class="info-label">Régimen de IVA:</span><span class="info-value" style="color: #2563eb;">REBU (Arts. 135-139 Ley del IVA)</span></div>
          <div class="info-row"><span class="info-label">Forma de Pago:</span><span class="info-value">${isBlank ? "Transferencia / Financiación / Contado" : (data.paymentMethod || "Transferencia Bancaria")}</span></div>
          <div class="info-row"><span class="info-label">Estado de Cobro:</span><span class="info-value" style="color: #16a34a;">${isBlank ? "PAGADA / COBRADA" : "COBRADA"}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">DESCRIPCIÓN DEL VEHÍCULO TRANSMITIDO</div>
        <table>
          <thead>
            <tr>
              <th>Marca y Modelo</th>
              <th>Matrícula</th>
              <th>Nº Bastidor (VIN)</th>
              <th>Año / Kilometraje</th>
              <th style="text-align: right;">Total Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${vBrand} ${vModel}</strong><br>
                <span style="font-size: 11px; color: #64748b;">Color: ${vColor} • Combustible: ${vFuel}</span>
              </td>
              <td style="font-family: monospace; font-weight: bold; font-size: 13px;">${vPlate}</td>
              <td style="font-family: monospace; font-size: 11px;">${vVin}</td>
              <td>${vYear} • ${vKm}</td>
              <td style="text-align: right; font-weight: 800; font-size: 13px;">${vPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-box">
        <div class="total-card">
          ${isBlank ? `
            <div class="info-row"><span class="info-label">Base Imponible Marginal (REBU):</span><span class="info-value">____________________ €</span></div>
            <div class="info-row"><span class="info-label">Cuota IVA Marginal (21%):</span><span class="info-value">____________________ €</span></div>
            <div style="border-top: 1px solid #cbd5e1; margin: 8px 0; padding-top: 8px;" class="info-row">
              <span style="font-size: 14px; font-weight: 800; color: #0f172a;">TOTAL FACTURA:</span>
              <span style="font-size: 16px; font-weight: 900; color: #2563eb;">____________________ €</span>
            </div>
          ` : `
            <div class="info-row"><span class="info-label">Base Imponible Marginal (REBU):</span><span class="info-value">${taxBase.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div class="info-row"><span class="info-label">IVA Marginal 21%:</span><span class="info-value">${taxAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div style="border-top: 1px solid #cbd5e1; margin: 8px 0; padding-top: 8px;" class="info-row">
              <span style="font-size: 14px; font-weight: 800; color: #0f172a;">TOTAL FACTURA:</span>
              <span style="font-size: 16px; font-weight: 900; color: #2563eb;">${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
            </div>
          `}
        </div>
      </div>

      <div class="rebu-notice">
        <strong>MENCIÓN PRECEPTIVA REBU:</strong> Operación sujeta al Régimen Especial de los Bienes Usados, Objetos de Arte, Antigüedades y Objetos de Colección (Artículos 135 a 139 de la Ley 37/1992 del IVA). 
        Conforme al artículo 138 de la citada Ley, la cuota de repercusión tributaria no se desglosa en la factura emitida al comprador.
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>POR EL TRANSMITENTE (VENDEDOR)</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma y Sello Oficial</div>
        </div>
        <div class="signature-box">
          <strong>RECIBÍ CONFORME (EL ADQUIRENTE)</strong>
          <span>${isBlank ? "Firma del Comprador" : data.clientName}</span>
          <div class="stamp-placeholder">Firma y DNI</div>
        </div>
      </div>

      <div class="footer">
        Factura emitida por el sistema ERP NexoCar para Orlando Cars S.L. Registro Mercantil de Madrid.
      </div>
    `;
  }

  // 2. CONTRATO DE COMPRAVENTA VO
  if (data.type === "contrato") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">CONTRATO DE COMPRAVENTA DE VEHÍCULO USADO</div>
          <div style="font-size: 12px; color: #475569;">Garantía Legal de 12 Meses Conforme a RDL 1/2007 (Consumidores)</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          NIF: ${companyCif}<br>
          ${companyAddress}<br>
          Fecha: ${dateFormatted}
        </div>
      </div>

      <div class="section">
        <div class="section-title">REUNIDOS</div>
        <p class="clause-p">
          <strong>DE UNA PARTE (PARTE VENDEDORA):</strong> La entidad mercantil <strong>${companyName}</strong>, provista de NIF nº <strong>${companyCif}</strong>, con domicilio comercial y exposición en ${companyAddress}, representada legalmente para este acto.
        </p>
        <p class="clause-p">
          <strong>DE OTRA PARTE (PARTE COMPRADORA):</strong> D./Dña. <strong>${cName}</strong>, mayor de edad, provisto de DNI/NIE nº <strong>${cDni}</strong>, con domicilio en ${cAddress} y teléfono de contacto ${cPhone}.
        </p>
        <p class="clause-p">
          Ambas partes se reconocen mutuamente la capacidad legal necesaria para otorgar el presente contrato de compraventa y al efecto:
        </p>
      </div>

      <div class="section">
        <div class="section-title">EXPONEN & IDENTIFICACIÓN DEL VEHÍCULO OBJETO DE VENTA</div>
        <p class="clause-p">
          Que la parte vendedora es propietaria legítima del vehículo turismo usado cuyas características y estado se detallan:
        </p>
        <div class="info-box">
          <div class="grid-2">
            <div>
              <div class="info-row"><span class="info-label">Marca y Modelo:</span><span class="info-value">${vBrand} ${vModel}</span></div>
              <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${vPlate}</span></div>
              <div class="info-row"><span class="info-label">Nº Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${vVin}</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Kilometraje Actual:</span><span class="info-value">${vKm} certificados</span></div>
              <div class="info-row"><span class="info-label">Año 1ª Matriculación:</span><span class="info-value">${vYear}</span></div>
              <div class="info-row"><span class="info-label">Combustible:</span><span class="info-value">${vFuel}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">ESTIPULACIONES Y CLÁUSULAS CONTRACTUALES</div>
        <p class="clause-p">
          <strong>PRIMERA. - OBJETO Y PRECIO:</strong> El vendedor transmite la propiedad del vehículo reseñado al comprador por el precio cierto de <strong>${vPrice} (IVA incluido bajo Régimen Especial REBU)</strong>, que el comprador abona mediante ${isBlank ? "transferencia bancaria / financiación / contado" : (data.paymentMethod || "transferencia bancaria")}, sirviendo el presente documento como carta de pago y recibo formal.
        </p>
        <p class="clause-p">
          <strong>SEGUNDA. - CARGAS, GRAVÁMENES Y RESERVA DE DOMINIO:</strong> La parte vendedora declara bajo su responsabilidad que sobre el vehículo objeto de la transmisión no pesa ningún tipo de carga, gravamen, embargo, reserva de dominio, precinto ni impuesto municipal de tracción mecánica (IVTM) devengado y pendiente de pago anterior a la fecha de este contrato.
        </p>
        <p class="clause-p">
          <strong>TERCERA. - GARANTÍA MECÁNICA LEGAL (12 MESES):</strong> La parte vendedora otorga una <strong>Garantía Mecánica de 12 meses</strong> a contar desde la entrega física del vehículo, que cubre averías fortuitas de motor, caja de cambios y órganos mecánicos conforme a la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007). Quedan expresamente excluidos los desgastes naturales propios del uso, kilometraje y edad del vehículo (tales como neumáticos, pastillas de freno, embrague por desgaste o bombillas).
        </p>
        <p class="clause-p">
          <strong>CUARTA. - CAMBIO DE TITULARIDAD EN DGT:</strong> El vendedor se compromete a gestionar ante la Jefatura Central de Tráfico (DGT) el cambio de titularidad del vehículo a nombre del comprador mediante Gestoría Administrativa Colegiada, haciendo entrega al comprador del Justificante Provisional de Circulación oficial.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>LA PARTE VENDEDORA</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma y Sello</div>
        </div>
        <div class="signature-box">
          <strong>LA PARTE COMPRADORA</strong>
          <span>${isBlank ? "Firma del Comprador" : data.clientName}</span>
          <div class="stamp-placeholder">Firma y DNI</div>
        </div>
      </div>

      <div class="footer">
        Contrato de Compraventa oficial emitido para Orlando Cars S.L. Conforme al ordenamiento jurídico español.
      </div>
    `;
  }

  // 3. DOCUMENTO DE RESERVA Y ARRAS
  if (data.type === "reserva") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">DOCUMENTO DE RESERVA Y DEPÓSITO DE SEÑAL</div>
          <div style="font-size: 12px; color: #475569;">Bloqueo de Stock y Arras Penitenciales (Art. 1454 Código Civil)</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          NIF: ${companyCif}<br>
          ${companyAddress}<br>
          Fecha: ${dateFormatted}
        </div>
      </div>

      <div class="info-box section">
        <div class="section-title">DATOS DEL VEHÍCULO RESERVADO</div>
        <div class="grid-2">
          <div>
            <div class="info-row"><span class="info-label">Vehículo:</span><span class="info-value">${vBrand} ${vModel}</span></div>
            <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${vPlate}</span></div>
            <div class="info-row"><span class="info-label">Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${vVin}</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Kilometraje:</span><span class="info-value">${vKm}</span></div>
            <div class="info-row"><span class="info-label">Precio Total Pactado:</span><span class="info-value" style="color: #2563eb; font-weight: bold;">${vPrice}</span></div>
          </div>
        </div>
      </div>

      <div class="info-box section">
        <div class="section-title">DATOS DEL INTERESADO / COMPRADOR</div>
        <div class="info-row"><span class="info-label">Nombre y Apellidos:</span><span class="info-value">${cName}</span></div>
        <div class="info-row"><span class="info-label">DNI / NIE:</span><span class="info-value">${cDni}</span></div>
        <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${cPhone}</span></div>
      </div>

      <div class="section">
        <div class="section-title">ESTIPULACIONES DE LA RESERVA</div>
        <p class="clause-p">
          1. El comprador entrega en este acto a la parte vendedora en concepto de <strong>SEÑAL Y RESERVA</strong> la cantidad de <strong>${vDeposit}</strong>, comprometiéndose el concesionario a retirar el vehículo de la exposición y portales de venta, manteniéndolo reservado durante un plazo de <strong>15 días naturales</strong>.
        </p>
        <p class="clause-p">
          2. La cantidad restante para completar el precio final acordado será abonada íntegramente por el comprador en el momento de la formalización del contrato definitivo y antes de la entrega física de las llaves.
        </p>
        <p class="clause-p">
          3. Las partes pactan expresamente la condición de <strong>arras penitenciales según el artículo 1454 del Código Civil</strong>: si el comprador desiste de la adquisición perderá la cantidad entregada; si quien desiste es la parte vendedora, devolverá al comprador el duplo de la cantidad percibida.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>EL CONCESIONARIO (VENDEDOR)</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma y Recibí de la Señal</div>
        </div>
        <div class="signature-box">
          <strong>EL COMPRADOR</strong>
          <span>${isBlank ? "Firma del Interesado" : data.clientName}</span>
          <div class="stamp-placeholder">Firma de Aceptación</div>
        </div>
      </div>

      <div class="footer">
        Documento de Reserva emitido por el sistema NexoCar para Orlando Cars S.L.
      </div>
    `;
  }

  // 4. ACTA DE ENTREGA
  if (data.type === "entrega") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">ACTA DE ENTREGA Y RECEPCIÓN DE VEHÍCULO</div>
          <div style="font-size: 12px; color: #475569;">Checklist de Estado, 2 Llaves y Exención de Infracciones</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          ${companyAddress}<br>
          Fecha y Hora de Entrega: ${dateFormatted} a las _____ : _____ h
        </div>
      </div>

      <div class="info-box section">
        <div class="section-title">VEHÍCULO ENTREGADO</div>
        <div class="grid-2">
          <div>
            <div class="info-row"><span class="info-label">Marca y Modelo:</span><span class="info-value">${vBrand} ${vModel}</span></div>
            <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${vPlate}</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${vVin}</span></div>
            <div class="info-row"><span class="info-label">Kilómetros exactos en cuadro:</span><span class="info-value">${vKm}</span></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CHECKLIST PERICIAL DE ENTREGA Y EQUIPAMIENTO</div>
        <table>
          <thead>
            <tr>
              <th>Elemento Verificado</th>
              <th>Estado Físico / Documental</th>
              <th style="text-align: center;">Conformidad</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Juego de Llaves Originales</td><td>2 Mandos a distancia operativos</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
            <tr><td>Ficha Técnica y Permiso de Circulación</td><td>Original con ITV en vigor</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
            <tr><td>Manuales del Propietario</td><td>En guantera original</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
            <tr><td>Neumáticos y Llantas</td><td>Profundidad superior a 3.5 mm reglamentario</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
            <tr><td>Kit de Seguridad / Rueda</td><td>Chaleco reflectante, triángulos y kit sellado</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
            <tr><td>Carrocería, Lunas y Pintura</td><td>Lavado integral y reacondicionamiento revisado</td><td style="text-align: center; color: #16a34a; font-weight: bold;">[ X ] CONFORME</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section" style="margin-top: 15px;">
        <p class="clause-p">
          El adquirente manifiesta haber examinado a su plena satisfacción el vehículo, comprobado el funcionamiento de sus mandos, alumbrado, niveles y climatización, y recibe en este acto la posesión física, documentación y llaves del mismo, asumiendo cualquier responsabilidad derivada de su circulación, infracciones o sanciones a partir de la fecha y hora indicadas.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>ENTREGADO POR EL CONCESIONARIO</strong>
          <span>Responsable de Entrega Orlando Cars</span>
          <div class="stamp-placeholder">Firma y Sello</div>
        </div>
        <div class="signature-box">
          <strong>RECIBIDO Y CONFORME (CLIENTE)</strong>
          <span>${cName}</span>
          <div class="stamp-placeholder">Firma del Adquirente</div>
        </div>
      </div>

      <div class="footer">
        Acta oficial de entrega de Orlando Cars S.L. Expedida por NexoCar.
      </div>
    `;
  }

  // 5. CERTIFICADO DE GARANTÍA MECÁNICA 12 MESES
  if (data.type === "garantia") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">CERTIFICADO DE PÓLIZA DE GARANTÍA MECÁNICA (12 MESES)</div>
          <div style="font-size: 12px; color: #475569;">Cobertura Oficial Conforme a la Ley de Consumidores y Usuarios</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          CIF: ${companyCif}<br>
          Fecha de Emisión: ${dateFormatted}
        </div>
      </div>

      <div class="grid-2 section">
        <div class="info-box">
          <div class="section-title">TITULAR BENEFICIARIO</div>
          <div class="info-row"><span class="info-label">Nombre del Titular:</span><span class="info-value">${cName}</span></div>
          <div class="info-row"><span class="info-label">DNI / NIE:</span><span class="info-value">${cDni}</span></div>
          <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${cPhone}</span></div>
        </div>
        <div class="info-box">
          <div class="section-title">VEHÍCULO AMPARADO EN PÓLIZA</div>
          <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${vPlate}</span></div>
          <div class="info-row"><span class="info-label">Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${vVin}</span></div>
          <div class="info-row"><span class="info-label">Kilometraje Inicial:</span><span class="info-value">${vKm}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">COBERTURAS MECÁNICAS Y TÉCNICAS INCLUIDAS</div>
        <table>
          <thead>
            <tr>
              <th>Grupo Mecánico</th>
              <th>Componentes Cubiertos (Piezas y Mano de Obra)</th>
              <th>Límite de Reparación</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Motor</td><td>Bloque motor, culata, pistones, bielas, cigüeñal, árbol de levas y bomba de aceite</td><td>Hasta valor venal</td></tr>
            <tr><td>Caja de Cambios</td><td>Engranajes, sincronizadores, convertidor de par y mecatrónica (DSG/Auto)</td><td>Hasta valor venal</td></tr>
            <tr><td>Sobrealimentación</td><td>Turbocompresor, válvula wastegate y actuador de geometría variable</td><td>Hasta valor venal</td></tr>
            <tr><td>Inyección / Combustible</td><td>Bomba de alta presión inyectora e inyectores diésel / gasolina</td><td>Hasta 2.500 €</td></tr>
            <tr><td>Circuito de Refrigeración</td><td>Radiador de refrigeración, bomba de agua y termostato</td><td>Pieza y mano de obra</td></tr>
            <tr><td>Dirección y Frenos</td><td>Bomba de servodirección, cremallera, módulo ABS y servofreno</td><td>Pieza y mano de obra</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section" style="margin-top: 15px;">
        <p class="clause-p">
          <strong>Condiciones de Activación:</strong> La presente garantía surte efecto desde el momento de la entrega física del vehículo y tiene una duración improrrogable de <strong>365 días naturales</strong>. Para cualquier incidencia, el beneficiario deberá contactar previamente con Orlando Cars antes de cualquier desmontaje.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>CONCESIONARIO EMISOR</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Sello y Firma Oficial</div>
        </div>
        <div class="signature-box">
          <strong>EL BENEFICIARIO</strong>
          <span>${isBlank ? "Firma del Titular" : data.clientName}</span>
          <div class="stamp-placeholder">Firma de Conformidad</div>
        </div>
      </div>
    `;
  }

  // 6. MANDATO DGT
  if (data.type === "mandato_dgt") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">MANDATO DE REPRESENTACIÓN PARA TRÁMITES ANTE LA DGT</div>
          <div style="font-size: 12px; color: #475569;">Modelo Homologado por el Colegio Oficial de Gestores Administrativos</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          CIF: ${companyCif}<br>
          Fecha: ${dateFormatted}
        </div>
      </div>

      <div class="section">
        <div class="section-title">OTORGANTE (MANDANTE)</div>
        <p class="clause-p">
          D./Dña. <strong>${cName}</strong>, con DNI/NIE <strong>${cDni}</strong>, con domicilio en ${cAddress}.
        </p>
        <div class="section-title" style="margin-top: 15px;">MANDATARIO (GESTORÍA Y CONCESIONARIO)</div>
        <p class="clause-p">
          A la entidad mercantil <strong>${companyName}</strong> y a los Gestores Administrativos Colegiados autorizados por la misma.
        </p>
        <div class="section-title" style="margin-top: 15px;">OBJETO DEL MANDATO TELEMÁTICO</div>
        <p class="clause-p">
          Para que en su nombre y representación realice ante la Jefatura Provincial de Tráfico todas las actuaciones relativas al <strong>CAMBIO DE TITULARIDAD / TRANSFERENCIA VEHICULAR</strong> del vehículo con matrícula <strong>${vPlate}</strong> y número de bastidor <strong>${vVin}</strong>, así como para la retirada del permiso de circulación definitivo e informe telemático DGT.
        </p>
      </div>

      <div class="signatures" style="margin-top: 60px;">
        <div class="signature-box">
          <strong>EL MANDATARIO</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma Gestor / Concesionario</div>
        </div>
        <div class="signature-box">
          <strong>EL MANDANTE (CLIENTE)</strong>
          <span>${isBlank ? "Firma del Adquirente" : data.clientName}</span>
          <div class="stamp-placeholder">Firma y DNI</div>
        </div>
      </div>
    `;
  }

  // 7. NOTIFICACIÓN DE VENTA DGT
  return `
    <div class="header">
      <div>
        <div class="logo-text">ORLANDO <span>CARS</span></div>
        <div class="doc-title">COMUNICACIÓN Y NOTIFICACIÓN DE VENTA DGT</div>
        <div style="font-size: 12px; color: #475569;">Trámite de Seguridad Jurídica del Vendedor</div>
      </div>
      <div class="company-info">
        <strong>${companyName}</strong><br>
        CIF: ${companyCif}<br>
        Fecha: ${dateFormatted}
      </div>
    </div>

    <div class="section">
      <div class="section-title">DATOS DE LA TRANSMISIÓN DEL VEHÍCULO</div>
      <div class="info-box">
        <div class="grid-2">
          <div>
            <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${vPlate}</span></div>
            <div class="info-row"><span class="info-label">Nº Bastidor:</span><span class="info-value" style="font-family: monospace;">${vVin}</span></div>
            <div class="info-row"><span class="info-label">Marca y Modelo:</span><span class="info-value">${vBrand} ${vModel}</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Fecha Venta:</span><span class="info-value">${dateFormatted}</span></div>
            <div class="info-row"><span class="info-label">Comprador:</span><span class="info-value">${cName}</span></div>
            <div class="info-row"><span class="info-label">DNI Comprador:</span><span class="info-value">${cDni}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <p class="clause-p">
        Por medio del presente escrito, el transmitente notifica formalmente la venta del vehículo reseñado a favor del adquirente indicado, solicitando la anotación en el Registro de Vehículos de la DGT para la exención de responsabilidades sancionadoras e impositivas a partir de la fecha y hora de la entrega.
      </p>
    </div>

    <div class="signatures" style="margin-top: 50px;">
      <div class="signature-box">
        <strong>EL TRANSMITENTE (VENDEDOR)</strong>
        <span>${companyName}</span>
        <div class="stamp-placeholder">Firma y Sello</div>
      </div>
      <div class="signature-box">
        <strong>EL ADQUIRENTE (NOTIFICADO)</strong>
        <span>${isBlank ? "Firma del Comprador" : data.clientName}</span>
        <div class="stamp-placeholder">Firma y DNI</div>
      </div>
    </div>
  `;
}

// Descarga en Word (.doc) editable
export function downloadDocumentWord(data: DocumentData): void {
  const bodyHtml = generateDocumentHtml(data);
  const title = `${data.type.toUpperCase()}_${data.isBlank ? "PLANTILLA_BLANCO" : (data.plate || "VEHICULO").replace("-", "")}`;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.4; }
          .header { border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 12pt; }
          .logo-text { font-size: 18pt; font-weight: bold; color: #0f172a; }
          .logo-text span { color: #0284c7; }
          .doc-title { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 4pt; }
          .company-info { font-size: 9pt; color: #555; text-align: right; }
          .section-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #0284c7; border-bottom: 1pt solid #ccc; padding-bottom: 3pt; margin: 10pt 0 6pt 0; }
          .info-box { border: 1pt solid #ddd; background: #fafafa; padding: 8pt; margin-bottom: 10pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 8pt; }
          th { background: #f2f2f2; border: 1pt solid #ccc; padding: 6pt; font-size: 9pt; font-weight: bold; }
          td { border: 1pt solid #ddd; padding: 6pt; font-size: 9pt; }
          .signatures { margin-top: 35pt; width: 100%; }
          .signature-box { border-top: 1pt solid #000; padding-top: 5pt; text-align: center; font-size: 9pt; width: 45%; display: inline-block; }
          .stamp-placeholder { height: 40pt; }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
    </html>
  `;

  const blob = new Blob([wordHtml], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Descarga en archivo HTML imprimible
export function downloadDocumentHtml(data: DocumentData): void {
  const title = `${data.type.toUpperCase()}_${data.isBlank ? "PLANTILLA_BLANCO" : (data.plate || "VEHICULO").replace("-", "")}`;
  const bodyHtml = generateDocumentHtml(data);

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; font-size: 12.5px; line-height: 1.5; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
          .logo-text span { color: #0284c7; }
          .doc-title { font-size: 17px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 4px; }
          .company-info { font-size: 11px; color: #475569; text-align: right; line-height: 1.4; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
          .info-label { color: #64748b; font-weight: 500; }
          .info-value { color: #0f172a; font-weight: 700; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
          td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
          .total-box { margin-top: 15px; display: flex; justify-content: flex-end; }
          .total-card { width: 300px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
          .rebu-notice { margin-top: 15px; padding: 10px 12px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 10.5px; color: #1e40af; line-height: 1.4; border-radius: 4px; }
          .clause-p { font-size: 11px; color: #334155; text-align: justify; margin-bottom: 8px; line-height: 1.45; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; page-break-inside: avoid; }
          .signature-box { border-top: 1px solid #0f172a; padding-top: 8px; text-align: center; font-size: 11px; color: #475569; }
          .signature-box strong { display: block; font-size: 12px; color: #0f172a; margin-bottom: 2px; }
          .stamp-placeholder { height: 60px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 11px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9.5px; color: #94a3b8; text-align: center; }
          @media print { body { padding: 0; background: transparent; } }
        </style>
      </head>
      <body>
        ${bodyHtml}
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Abrir en nueva ventana e imprimir directo
export function openPrintDocument(data: DocumentData): void {
  const title = `${data.type.toUpperCase()} - ${data.isBlank ? "PLANTILLA OFICIAL EN BLANCO" : `${data.brand || ""} (${data.plate || ""})`}`;
  const bodyHtml = generateDocumentHtml(data);

  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    downloadDocumentHtml(data);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 24px; 
            font-size: 12.5px; 
            line-height: 1.5; 
            background: #f1f5f9; 
          }
          .page-canvas {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
          .logo-text span { color: #0284c7; }
          .doc-title { font-size: 17px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 4px; }
          .company-info { font-size: 11px; color: #475569; text-align: right; line-height: 1.4; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; }
          .info-label { color: #64748b; font-weight: 500; }
          .info-value { color: #0f172a; font-weight: 700; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
          td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
          .total-box { margin-top: 15px; display: flex; justify-content: flex-end; }
          .total-card { width: 300px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; }
          .rebu-notice { margin-top: 15px; padding: 10px 12px; background: #eff6ff; border-left: 3px solid #2563eb; font-size: 10.5px; color: #1e40af; line-height: 1.4; border-radius: 4px; }
          .clause-p { font-size: 11px; color: #334155; text-align: justify; margin-bottom: 8px; line-height: 1.45; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; page-break-inside: avoid; }
          .signature-box { border-top: 1px solid #0f172a; padding-top: 8px; text-align: center; font-size: 11px; color: #475569; }
          .signature-box strong { display: block; font-size: 12px; color: #0f172a; margin-bottom: 2px; }
          .stamp-placeholder { height: 60px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-style: italic; font-size: 11px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9.5px; color: #94a3b8; text-align: center; }
          
          .toolbar {
            max-width: 800px;
            margin: 0 auto 16px auto;
            padding: 12px 18px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          }
          .toolbar-btn {
            background: #2563eb;
            color: #ffffff;
            border: none;
            padding: 8px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .toolbar-btn:hover { background: #1d4ed8; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; background: transparent; }
            .page-canvas { padding: 0; box-shadow: none; max-width: 100%; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="toolbar no-print">
          <div>
            <div style="font-weight: 800; font-size: 13px;">${data.isBlank ? "Plantilla Oficial en Blanco" : "Documento Oficial"} — Orlando Cars</div>
            <div style="font-size: 11px; color: #94a3b8;">Listo para imprimir en A4 o guardar en PDF</div>
          </div>
          <button class="toolbar-btn" onclick="window.print()">
            <span>🖨️ Imprimir / Guardar en PDF</span>
          </button>
        </div>
        
        <div class="page-canvas">
          ${bodyHtml}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
}
