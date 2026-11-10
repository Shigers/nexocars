// Generador oficial de documentos y facturación para NexoCar (Orlando Cars & Loewe Cars)

export interface DocumentData {
  type: "factura" | "contrato" | "reserva" | "entrega" | "mandato_dgt";
  invoiceNumber?: string;
  date?: string;
  companyName?: string;
  companyCif?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  // Cliente
  clientName: string;
  clientDni: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  // Vehículo
  brand: string;
  model: string;
  version?: string;
  plate: string;
  vin: string;
  mileage: number;
  year: number;
  fuelType?: string;
  color?: string;
  // Importes y Fiscalidad
  sellingPrice: number;
  taxScheme?: "REBU" | "GENERAL";
  taxBase?: number;
  taxAmount?: number;
  depositAmount?: number; // Para reserva
  paymentMethod?: string;
}

export function generateDocumentHtml(data: DocumentData): string {
  const companyName = data.companyName || "ORLANDO CARS S.L.";
  const companyCif = data.companyCif || "B-88492019";
  const companyAddress = data.companyAddress || "Vía Complutense 128, 28805 Alcalá de Henares (Madrid)";
  const companyPhone = data.companyPhone || "+34 918 203 944 / +34 624 56 36 95";
  const companyEmail = data.companyEmail || "administracion@orlandocars.es";
  const dateFormatted = data.date || new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const invoiceNum = data.invoiceNumber || `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  // Cálculo REBU o General
  const isRebu = (data.taxScheme || "REBU") === "REBU";
  const total = data.sellingPrice || 0;
  const taxBase = data.taxBase || (isRebu ? total * 0.15 : total / 1.21);
  const taxAmount = data.taxAmount || (isRebu ? taxBase * 0.21 : total - taxBase);

  if (data.type === "factura") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">FACTURA ORDINARIA OFICIAL</div>
          <div style="font-size: 13px; font-weight: 800; color: #2563eb; margin-top: 3px;">Nº: ${invoiceNum}</div>
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
          <div class="section-title">DATOS DEL COMPRADOR (CLIENTE)</div>
          <div class="info-row"><span class="info-label">Nombre / Razón Social:</span><span class="info-value">${data.clientName}</span></div>
          <div class="info-row"><span class="info-label">DNI / NIE / CIF:</span><span class="info-value">${data.clientDni}</span></div>
          <div class="info-row"><span class="info-label">Dirección:</span><span class="info-value">${data.clientAddress || "Calle Principal 14, 28001 Madrid"}</span></div>
          <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${data.clientPhone || "+34 600 000 000"}</span></div>
        </div>

        <div class="info-box">
          <div class="section-title">DETALLES DE LA OPERACIÓN</div>
          <div class="info-row"><span class="info-label">Fecha de Emisión:</span><span class="info-value">${dateFormatted}</span></div>
          <div class="info-row"><span class="info-label">Régimen Fiscal:</span><span class="info-value" style="color: #2563eb;">${isRebu ? "REBU (Régimen Especial Bienes Usados)" : "Régimen General IVA (21%)"}</span></div>
          <div class="info-row"><span class="info-label">Forma de Pago:</span><span class="info-value">${data.paymentMethod || "Transferencia Bancaria Inmediata"}</span></div>
          <div class="info-row"><span class="info-label">Estado:</span><span class="info-value" style="color: #16a34a;">COBRADA / PAGADA</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CONCEPTO / VEHÍCULO TRANSMITIDO</div>
        <table>
          <thead>
            <tr>
              <th>Descripción del Vehículo</th>
              <th>Matrícula</th>
              <th>Nº Bastidor (VIN)</th>
              <th>Año / Km</th>
              <th style="text-align: right;">Total Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${data.brand} ${data.model}</strong><br>
                <span style="font-size: 11px; color: #64748b;">${data.version || "Acabado de stock"} • Color: ${data.color || "Gris Metalizado"} • Combustible: ${data.fuelType || "Diésel"}</span>
              </td>
              <td style="font-family: monospace; font-weight: bold; font-size: 13px;">${data.plate}</td>
              <td style="font-family: monospace; font-size: 11px;">${data.vin}</td>
              <td>${data.year} • ${data.mileage.toLocaleString("es-ES")} km</td>
              <td style="text-align: right; font-weight: 800; font-size: 13px;">${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-box">
        <div class="total-card">
          ${isRebu ? `
            <div class="info-row"><span class="info-label">Base Imponible Marginal (REBU):</span><span class="info-value">${taxBase.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div class="info-row"><span class="info-label">IVA Marginal 21%:</span><span class="info-value">${taxAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div style="border-top: 1px solid #cbd5e1; margin: 8px 0; padding-top: 8px;" class="info-row">
              <span style="font-size: 14px; font-weight: 800; color: #0f172a;">TOTAL FACTURA:</span>
              <span style="font-size: 16px; font-weight: 900; color: #2563eb;">${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
            </div>
          ` : `
            <div class="info-row"><span class="info-label">Base Imponible:</span><span class="info-value">${taxBase.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div class="info-row"><span class="info-label">IVA (21%):</span><span class="info-value">${taxAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
            <div style="border-top: 1px solid #cbd5e1; margin: 8px 0; padding-top: 8px;" class="info-row">
              <span style="font-size: 14px; font-weight: 800; color: #0f172a;">TOTAL FACTURA:</span>
              <span style="font-size: 16px; font-weight: 900; color: #2563eb;">${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span>
            </div>
          `}
        </div>
      </div>

      ${isRebu ? `
        <div class="rebu-notice">
          <strong>MENCIÓN OBLIGATORIA REBU:</strong> Operación sujeta al Régimen Especial de los Bienes Usados, Objetos de Arte, Antigüedades y Objetos de Colección (Artículos 135 a 139 de la Ley 37/1992 del IVA). 
          Conforme al artículo 138 de la citada Ley, la cuota de repercusión tributaria no se desglosa en la factura emitida al adquirente.
        </div>
      ` : ""}

      <div class="signatures">
        <div class="signature-box">
          <strong>POR LA PARTE VENDEDORA</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma y Sello Oficial</div>
        </div>
        <div class="signature-box">
          <strong>RECIBÍ CONFORME (EL CLIENTE)</strong>
          <span>${data.clientName}</span>
          <div class="stamp-placeholder">Firma del Adquirente</div>
        </div>
      </div>

      <div class="footer">
        Documento generado electrónicamente por el sistema de gestión ERP NexoCar para Orlando Cars & Loewe Cars.<br>
        Inscrita en el Registro Mercantil de Madrid. Todos los derechos reservados.
      </div>
    `;
  }

  if (data.type === "contrato") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">CONTRATO DE COMPRAVENTA DE VEHÍCULO USADO</div>
          <div style="font-size: 12px; color: #475569;">Garantía Legal Conforme a RDL 1/2007 de Protección a Consumidores</div>
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
          <strong>DE UNA PARTE (VENDEDOR):</strong> La entidad mercantil <strong>${companyName}</strong>, con NIF <strong>${companyCif}</strong>, con domicilio comercial en ${companyAddress}, representada en este acto por su dirección comercial con facultades bastantes.
        </p>
        <p class="clause-p">
          <strong>DE OTRA PARTE (COMPRADOR):</strong> D./Dña. <strong>${data.clientName}</strong>, mayor de edad, provisto de DNI/NIE nº <strong>${data.clientDni}</strong>, con domicilio en ${data.clientAddress || "Calle Principal 14, Madrid"} y teléfono ${data.clientPhone || "+34 600 000 000"}.
        </p>
        <p class="clause-p">
          Ambas partes se reconocen mutuamente la capacidad legal necesaria para otorgar el presente contrato de compraventa y al efecto:
        </p>
      </div>

      <div class="section">
        <div class="section-title">EXPONEN & IDENTIFICACIÓN DEL VEHÍCULO</div>
        <p class="clause-p">
          Que la parte vendedora es propietaria legítima del vehículo turismo usado que a continuación se describe:
        </p>
        <div class="info-box">
          <div class="grid-2">
            <div>
              <div class="info-row"><span class="info-label">Marca y Modelo:</span><span class="info-value">${data.brand} ${data.model}</span></div>
              <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${data.plate}</span></div>
              <div class="info-row"><span class="info-label">Nº Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${data.vin}</span></div>
            </div>
            <div>
              <div class="info-row"><span class="info-label">Kilometraje Actual:</span><span class="info-value">${data.mileage.toLocaleString("es-ES")} km certificados</span></div>
              <div class="info-row"><span class="info-label">Año 1ª Matriculación:</span><span class="info-value">${data.year}</span></div>
              <div class="info-row"><span class="info-label">Combustible / Motor:</span><span class="info-value">${data.fuelType || "Diésel / Gasolina"}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">ESTIPULACIONES Y CLÁUSULAS CONTRACTUALES</div>
        <p class="clause-p">
          <strong>PRIMERA. - OBJETO Y PRECIO:</strong> El vendedor transmite la propiedad del vehículo reseñado al comprador por el precio cierto de <strong>${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} € (IVA incluido bajo Régimen REBU)</strong>, que el comprador abona en este acto mediante ${data.paymentMethod || "transferencia bancaria"}, sirviendo este documento como justificante de pago.
        </p>
        <p class="clause-p">
          <strong>SEGUNDA. - CARGAS Y GRAVÁMENES:</strong> La parte vendedora declara bajo su responsabilidad que sobre el vehículo objeto de la venta no pesa ningún tipo de carga, gravamen, embargo, reserva de dominio, precinto ni impuesto municipal devengado y pendiente de pago anterior a la fecha de este contrato.
        </p>
        <p class="clause-p">
          <strong>TERCERA. - GARANTÍA MECÁNICA LEGAL (12 MESES):</strong> La parte vendedora otorga una <strong>Garantía Mecánica de 12 meses</strong> a contar desde la entrega física del vehículo, que cubre averías imprevistas de motor, caja de cambios y componentes mecánicos principales conforme a la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007). Quedan excluidos los desgastes naturales propios del uso y kilometraje del vehículo.
        </p>
        <p class="clause-p">
          <strong>CUARTA. - TRÁFICO Y TRANSMISIÓN:</strong> El vendedor gestionará el cambio de titularidad del vehículo en la Jefatura Central de Tráfico (DGT), entregando al comprador el justificante provisional de circulación hasta la expedición del permiso de circulación definitivo a nombre del comprador.
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
          <span>${data.clientName} (DNI: ${data.clientDni})</span>
          <div class="stamp-placeholder">Firma de Conformidad</div>
        </div>
      </div>

      <div class="footer">
        Contrato de Compraventa emitido en Alcalá de Henares (Madrid) por el software NexoCar para Orlando Cars.
      </div>
    `;
  }

  if (data.type === "reserva") {
    const deposit = data.depositAmount || 500;
    const remaining = total - deposit;
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">DOCUMENTO DE RESERVA Y DEPÓSITO DE SEÑAL</div>
          <div style="font-size: 12px; color: #475569;">Compromiso de Retirada de Stock y Compraventa</div>
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
            <div class="info-row"><span class="info-label">Vehículo:</span><span class="info-value">${data.brand} ${data.model}</span></div>
            <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${data.plate}</span></div>
            <div class="info-row"><span class="info-label">Bastidor:</span><span class="info-value" style="font-family: monospace;">${data.vin}</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Kilometraje:</span><span class="info-value">${data.mileage.toLocaleString("es-ES")} km</span></div>
            <div class="info-row"><span class="info-label">Precio Final Acordado:</span><span class="info-value" style="color: #2563eb;">${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</span></div>
          </div>
        </div>
      </div>

      <div class="info-box section">
        <div class="section-title">DATOS DEL INTERESADO / COMPRADOR</div>
        <div class="info-row"><span class="info-label">Nombre Completo:</span><span class="info-value">${data.clientName}</span></div>
        <div class="info-row"><span class="info-label">DNI / NIE:</span><span class="info-value">${data.clientDni}</span></div>
        <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${data.clientPhone || "+34 600 000 000"}</span></div>
      </div>

      <div class="section">
        <div class="section-title">CONDICIONES DE LA RESERVA</div>
        <p class="clause-p">
          1. El cliente entrega en concepto de <strong>SEÑAL Y RESERVA</strong> la cantidad de <strong>${deposit.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</strong>, comprometiéndose el concesionario a retirar el vehículo de la venta en todos los portales y mantenerlo reservado durante un plazo improrrogable de <strong>15 días naturales</strong>.
        </p>
        <p class="clause-p">
          2. La cantidad restante de <strong>${remaining.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</strong> será liquidada íntegramente por el comprador con anterioridad o en el momento de la firma del contrato definitivo y entrega del vehículo.
        </p>
        <p class="clause-p">
          3. Las partes pactan expresamente que las arras entregadas tienen la consideración de arras penitenciales conforme al <strong>artículo 1454 del Código Civil</strong> español.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>EL CONCESIONARIO</strong>
          <span>${companyName}</span>
          <div class="stamp-placeholder">Firma y Justificante de Cobro</div>
        </div>
        <div class="signature-box">
          <strong>EL CLIENTE</strong>
          <span>${data.clientName}</span>
          <div class="stamp-placeholder">Firma de Aceptación</div>
        </div>
      </div>

      <div class="footer">
        Reserva generada por el software NexoCar para Orlando Cars.
      </div>
    `;
  }

  if (data.type === "entrega") {
    return `
      <div class="header">
        <div>
          <div class="logo-text">ORLANDO <span>CARS</span></div>
          <div class="doc-title">ACTA DE ENTREGA Y RECEPCIÓN DE VEHÍCULO</div>
          <div style="font-size: 12px; color: #475569;">Checklist de Conformidad y Estado de Entrega</div>
        </div>
        <div class="company-info">
          <strong>${companyName}</strong><br>
          ${companyAddress}<br>
          Fecha: ${dateFormatted}
        </div>
      </div>

      <div class="info-box section">
        <div class="section-title">VEHÍCULO ENTREGADO</div>
        <div class="info-row"><span class="info-label">Modelo:</span><span class="info-value">${data.brand} ${data.model}</span></div>
        <div class="info-row"><span class="info-label">Matrícula:</span><span class="info-value" style="font-family: monospace;">${data.plate}</span></div>
        <div class="info-row"><span class="info-label">Bastidor (VIN):</span><span class="info-value" style="font-family: monospace;">${data.vin}</span></div>
        <div class="info-row"><span class="info-label">Kilómetros exactos en cuadro:</span><span class="info-value">${data.mileage.toLocaleString("es-ES")} km</span></div>
      </div>

      <div class="section">
        <div class="section-title">CHECKLIST DE VERIFICACIÓN FÍSICA Y DOCUMENTAL</div>
        <table>
          <thead>
            <tr>
              <th>Elemento Inspeccionado</th>
              <th>Estado Verificado</th>
              <th>Conformidad</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Juegos de Llaves Originales</td><td>2 Llaves con mando a distancia</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
            <tr><td>Documentación y Ficha Técnica ITV</td><td>Original con ITV en vigor</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
            <tr><td>Manuales del Propietario y Libro</td><td>En guantera original</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
            <tr><td>Neumáticos y Llantas</td><td>Dibujo superior a 3.5mm legal</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
            <tr><td>Kit de Emergencia / Rueda</td><td>Chaleco, triángulos y kit sellado</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
            <tr><td>Carrocería e Interiores</td><td>Lavado integral y reacondicionado</td><td style="color: #16a34a; font-weight: bold;">✓ CONFORME</td></tr>
          </tbody>
        </table>
      </div>

      <div class="section" style="margin-top: 20px;">
        <p class="clause-p">
          El cliente receptor manifiesta haber examinado a su plena satisfacción el vehículo, comprobado el funcionamiento de sus mandos, luces y climatización, y recibe en este acto la posesión física y llaves del mismo en perfecto estado de funcionamiento.
        </p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <strong>ENTREGADO POR</strong>
          <span>Responsable de Campa / Entregas</span>
          <div class="stamp-placeholder">Firma Orlando Cars</div>
        </div>
        <div class="signature-box">
          <strong>RECIBIDO Y CONFORME</strong>
          <span>${data.clientName} (DNI: ${data.clientDni})</span>
          <div class="stamp-placeholder">Firma del Adquirente</div>
        </div>
      </div>

      <div class="footer">
        Acta de Entrega de NexoCar para Orlando Cars.
      </div>
    `;
  }

  // Mandato DGT
  return `
    <div class="header">
      <div>
        <div class="logo-text">ORLANDO <span>CARS</span></div>
        <div class="doc-title">MANDATO DE REPRESENTACIÓN PARA GESTIÓN EN DGT</div>
        <div style="font-size: 12px; color: #475569;">Trámite Telemático de Cambio de Titularidad</div>
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
        D./Dña. <strong>${data.clientName}</strong>, con DNI/NIE <strong>${data.clientDni}</strong>, con domicilio en ${data.clientAddress || "Calle Principal 14, Madrid"}.
      </p>
      <div class="section-title" style="margin-top: 15px;">MANDATARIO (GESTORÍA Y CONCESIONARIO)</div>
      <p class="clause-p">
        A la entidad <strong>${companyName}</strong> y a su Gestoría Administrativa Colegiada autorizada.
      </p>
      <div class="section-title" style="margin-top: 15px;">OBJETO DEL MANDATO</div>
      <p class="clause-p">
        Para que en su nombre y representación realice ante la Jefatura Provincial de Tráfico todas las actuaciones relativas al <strong>CAMBIO DE TITULARIDAD / TRANSFERENCIA</strong> del vehículo con matrícula <strong>${data.plate}</strong> y número de bastidor <strong>${data.vin}</strong>.
      </p>
    </div>

    <div class="signatures" style="margin-top: 60px;">
      <div class="signature-box">
        <strong>EL MANDATARIO</strong>
        <span>${companyName}</span>
        <div class="stamp-placeholder">Firma Gestor / Vendedor</div>
      </div>
      <div class="signature-box">
        <strong>EL MANDANTE (CLIENTE)</strong>
        <span>${data.clientName}</span>
        <div class="stamp-placeholder">Firma del Titular</div>
      </div>
    </div>
  `;
}

export function openPrintDocument(data: DocumentData): void {
  const title = `${data.type.toUpperCase()} - ${data.brand} ${data.model} (${data.plate})`;
  const bodyHtml = generateDocumentHtml(data);

  const printWindow = window.open("", "_blank", "width=900,height=1100");
  if (!printWindow) {
    alert("⚠️ Por favor permite las ventanas emergentes (pop-ups) en tu navegador para abrir el documento.");
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
          
          /* Toolbar */
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
          .toolbar-btn:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
          }
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
            <div style="font-weight: 800; font-size: 13px;">Documento Listo — NexoCar</div>
            <div style="font-size: 11px; color: #94a3b8;">Listo para descargar en PDF o enviar a impresora</div>
          </div>
          <button class="toolbar-btn" onclick="window.print()">
            <span>🖨️ Imprimir / Guardar como PDF</span>
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
