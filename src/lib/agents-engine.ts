// ==============================================================================
// ORLANDO CARS — AGENTS ENGINE (MOTOR TÁCTICO DE AGENTES IA)
// Motor de generación especializado en el mercado español de VO (Vehículos de Ocasión)
// ==============================================================================

export interface VehicleInput {
  make: string;
  model: string;
  year: number;
  km: number;
  price: number;
  fuel: string;
  cv: number;
  transmission: string;
  extras?: string;
  plate?: string;
}

export interface LeadReplyInput {
  clientName?: string;
  question: string;
  vehicleName: string;
  price?: number;
}

export interface TasacionInput {
  make: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  condition: "impecable" | "bueno" | "regular";
  askingPrice?: number;
}

export interface MarketingInput {
  vehicleName: string;
  price: number;
  extras: string;
  promoType: "novedad" | "oferta_semana" | "liquidacion";
}

// ------------------------------------------------------------------------------
// 1. AGENTE PORTALES MULTI-WEB (Wallapop, Coches.net, Milanuncios, Web)
// ------------------------------------------------------------------------------
export function generatePortalTexts(v: VehicleInput) {
  const extrasList = v.extras
    ? v.extras.split(/[,;\n]+/).map((e) => e.trim()).filter(Boolean)
    : [
        "Pantalla Multimedia con Apple CarPlay / Android Auto",
        "Sensores de aparcamiento y cámara trasera",
        "Control de crucero adaptativo",
        "Climatizador bizona digital",
        "Llantas de aleación originales",
        "Volante multifunción en cuero",
      ];

  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v.price);

  const formattedKm = new Intl.NumberFormat("es-ES").format(v.km);

  // Estimación de cuota mensual (ej. 7 años, 8.99% TIN estándar Santander/BBVA)
  const estimatedCuota = Math.round((v.price * 1.25) / 84);

  // --- WALLAPOP ---
  const wallapop = `🔥 ${v.make.toUpperCase()} ${v.model.toUpperCase()} — ¡IMPECABLE ESTADO! 🔥

📍 Disponible en Orlando Cars (Exposición y entrega inmediata)
💶 Precio: ${formattedPrice} (Financiación a tu medida desde ${estimatedCuota} €/mes SIN entrada)

✅ Año: ${v.year}
✅ Kilómetros: ${formattedKm} km certificados por contrato y DGT
✅ Motor: ${v.fuel} ${v.cv} CV (${v.transmission})
✅ Distintivo ambiental DGT

⭐ EQUIPAMIENTO DESTACADO:
${extrasList.map((e) => `• ${e}`).join("\n")}

🛡️ INCLUIDO EN EL PRECIO:
- 12 MESES DE GARANTÍA MECÁNICA OFICIAL A NIVEL NACIONAL
- Revisión completa de 100 puntos y mantenimiento recién hecho
- Cambio de titularidad y gestoría incluido
- Aceptamos tu coche actual como parte de pago (Tasación en el acto)

📲 Escríbenos por WhatsApp o chat para venir a verlo o solicitar vídeo personalizado sin compromiso. ¡Corre que vuela!`;

  // --- COCHES.NET ---
  const cochesNet = `CONCESIONARIO OFICIAL ORLANDO CARS S.L.
VEHÍCULO PROCEDENTE DE CONCESIONARIO OFICIAL — HISTORIAL CERTIFICADO

${v.make.toUpperCase()} ${v.model.toUpperCase()} ${v.cv}CV ${v.transmission.toUpperCase()}

• Precio al contado: ${formattedPrice}
• Precio financiado: ${formattedPrice} (Consulta condiciones con cuotas desde ${estimatedCuota} €/mes sin entrada)
• IVA incluido en régimen especial REBU (Arts. 135-139 Ley del IVA).

CARACTERÍSTICAS TÉCNICAS:
- Matriculación: ${v.year}
- Kilometraje: ${formattedKm} km (Certificados en factura y contrato de compraventa)
- Motorización: ${v.fuel} / ${v.cv} CV / Cambio ${v.transmission}
- Libro de revisiones e historial de mantenimiento al día
- Libre de siniestros estructurales y cargas administrativas (Informe Carfax / DGT disponible)

EQUIPAMIENTO DE SERIE Y OPCIONAL:
${extrasList.map((e) => `• ${e}`).join("\n")}

COMPROMISO Y GARANTÍA ORLANDO CARS:
1. 12 Meses de Garantía Mecánica con cobertura en cualquier taller oficial de España.
2. Certificación pericial de kilometraje y ausencia de golpes estructurales.
3. Posibilidad de entrega a domicilio en cualquier punto de la península.
4. Gestión de financiación inmediata en 24h con las principales entidades bancarias.

Visita nuestras instalaciones o contacta con nuestro equipo comercial para solicitar una videollamada demostrativa.`;

  // --- MILANUNCIOS ---
  const milanuncios = `${v.make} ${v.model} ${v.cv}cv año ${v.year} con ${formattedKm}km en perfecto estado. Vehículo nacional con libro de revisiones al día.

Equipado con: ${extrasList.join(", ")}.

Precio final con todo incluido: ${formattedPrice} (IVA REBU, transferencia a tu nombre y 1 año de garantía incluidos sin letra pequeña).
Financiamos el 100% sin entrada desde ${estimatedCuota}€/mes.
Recogemos vehículos como parte de pago. Tasamos en el acto.

Vehículo disponible en stock real en Orlando Cars. Teléfono y WhatsApp de atención directa.
Palabras clave: ocasion, segunda mano, oferta, impecable, garantia, audi, bmw, mercedes, volkswagen, seat, ford, peugeot, renault.`;

  // --- WEB OFICIAL ---
  const web = `Presentamos este excelente ${v.make} ${v.model} (${v.year}), una unidad rigurosamente seleccionada por el equipo de compras de Orlando Cars. Cuenta con ${formattedKm} km certificados y una configuración de alta demanda con ${v.cv} CV y cambio ${v.transmission}. Se entrega totalmente reacondicionado, con revisión integral, limpieza de tapicería con desinfección de ozono y 12 meses de garantía premium nacional. Financiación flexible disponible desde ${estimatedCuota} €/mes.`;

  return { wallapop, cochesNet, milanuncios, web, estimatedCuota };
}

// ------------------------------------------------------------------------------
// 2. AGENTE VENTAS & LEADS WHATSAPP CLOSER
// ------------------------------------------------------------------------------
export function generateWhatsAppReply(input: LeadReplyInput) {
  const q = input.question.toLowerCase();
  const client = input.clientName ? input.clientName.trim() : "¡Hola!";
  const car = input.vehicleName;
  const price = input.price
    ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(input.price)
    : "";

  let fullMessage = "";
  let quickMessage = "";

  if (q.includes("disponible") || q.includes("sigue") || q.includes("tienes")) {
    fullMessage = `¡Hola${input.clientName ? ` ${input.clientName}` : ""}! Sí, el ${car} sigue totalmente disponible en nuestra exposición de Orlando Cars.

Es una unidad que ha entrado recientemente y está impecable (kilometraje certificado y 12 meses de garantía oficial incluidos). 

Para que no te lo quiten, ¿te vendría bien pasar a verlo y arrancarlo mañana por la mañana o prefieres por la tarde? También te puedo enviar un vídeo detallado si no eres de la zona. 🚗✨`;
    quickMessage = `Hola! Sí, el ${car} está disponible en exposición. ¿Cuándo te vendría bien pasar a verlo o te preparo un vídeo?`;
  } else if (q.includes("financ") || q.includes("cuota") || q.includes("mes") || q.includes("banco")) {
    fullMessage = `¡Buenas${input.clientName ? ` ${input.clientName}` : ""}! Por supuesto, en Orlando Cars trabajamos con las principales financieras para conseguirte la mejor cuota con o sin entrada.

Para el ${car}${price ? ` (${price})` : ""}, podemos plantearte cuotas muy cómodas desde aproximadamente 220€ - 280€/mes según los años que elijas y si deseas aportar alguna entrada.

La aprobación la solemos tener en menos de 24 horas solo con la nómina y el DNI. ¿Quieres que te pase una simulación exacta a tu medida sin ningún compromiso?`;
    quickMessage = `Buenas! Sí, financiamos el 100% del ${car} con cuotas súper cómodas y respuesta en 24h. ¿Te preparo una simulación rápida?`;
  } else if (q.includes("cambio") || q.includes("entrego") || q.includes("tasar") || q.includes("recog")) {
    fullMessage = `¡Hola${input.clientName ? ` ${input.clientName}` : ""}! Sí, en Orlando Cars aceptamos tu coche actual como parte de pago sin problema. Te lo tasamos al mejor valor de mercado y se descuenta directamente del precio del ${car}.

Para darte una valoración exacta hoy mismo, ¿me podrías indicar qué marca, modelo, año y cuántos kilómetros tiene tu coche? Si tienes alguna foto, pásamela por aquí y lo vemos en 10 minutos. 👍`;
    quickMessage = `Hola! Sí aceptamos tu coche como parte de pago. Dime marca, modelo, año y km y te lo taso en 10 minutos.`;
  } else if (q.includes("precio") || q.includes("rebaj") || q.includes("descuent") || q.includes("menos")) {
    fullMessage = `Hola${input.clientName ? ` ${input.clientName}` : ""}. En Orlando Cars ajustamos los precios al límite para ofrecer la mejor relación calidad-precio del mercado nacional. 

El precio del ${car}${price ? ` (${price})` : ""} ya incluye:
- 12 meses de garantía mecánica oficial nacional
- Cambio de nombre y gestoría
- Revisión completa de taller con filtros y aceite nuevos

Lo que sí podemos hacer es valorar si financias para ajustar condiciones o si entregas coche a cambio para mejorarte la tasación. Te invito a venir a verlo en persona, probarlo y lo hablamos con el coche delante. ¿Te encaja mañana?`;
    quickMessage = `Hola! El precio es cerrado porque ya incluye garantía de 1 año, revisión completa y cambio de nombre. Ven a probarlo y lo vemos en persona.`;
  } else {
    fullMessage = `¡Hola${input.clientName ? ` ${input.clientName}` : ""}! Gracias por tu interés en el ${car} de Orlando Cars.

Respecto a tu consulta: el vehículo está en perfecto estado, con kilometraje certificado por contrato, revisión integral recién pasada y 12 meses de garantía oficial incluidos.

¿Te gustaría que te envíe un vídeo detallado mostrando el interior y el arranque, o prefieres agendar una cita para probarlo en nuestras instalaciones?`;
    quickMessage = `Hola! El ${car} está impecable y listo para entrega. ¿Te mando un vídeo o prefieres venir a probarlo?`;
  }

  return { fullMessage, quickMessage };
}

// ------------------------------------------------------------------------------
// 3. AGENTE TASADOR EXPRESS & MARGEN REBU (COMPRAS VO)
// ------------------------------------------------------------------------------
export function calculateTasacion(input: TasacionInput) {
  const currentYear = 2026;
  const age = Math.max(1, currentYear - input.year);

  // Estimador de PVP medio en el mercado español según antigüedad y kilometraje
  // Modelo base de depreciación automotriz española
  let basePVP = 28000;
  const lowerMake = input.make.toLowerCase();
  if (lowerMake.includes("mercedes") || lowerMake.includes("bmw") || lowerMake.includes("audi") || lowerMake.includes("porsche")) {
    basePVP = 45000;
  } else if (lowerMake.includes("volkswagen") || lowerMake.includes("volvo") || lowerMake.includes("cupra")) {
    basePVP = 32000;
  } else if (lowerMake.includes("dacia") || lowerMake.includes("fiat") || lowerMake.includes("kia") || lowerMake.includes("hyundai")) {
    basePVP = 20000;
  }

  // Depreciación por año (~12% anual los primeros años, estabilizando luego)
  let pvpEstimado = basePVP * Math.pow(0.86, age);

  // Corrección por kilometraje (referencia 15.000 km/año estándar)
  const kmEsperados = age * 15000;
  const kmDiff = input.km - kmEsperados;
  const kmCorrection = (kmDiff / 10000) * 450;
  pvpEstimado = Math.max(2500, Math.round(pvpEstimado - kmCorrection));

  // Costes de Reacondicionamiento en Orlando Cars
  let costePinturaChapa = 250;
  let costeMecanicaRevision = 350;
  if (input.condition === "regular") {
    costePinturaChapa = 550;
    costeMecanicaRevision = 600;
  } else if (input.condition === "impecable") {
    costePinturaChapa = 120;
    costeMecanicaRevision = 250;
  }

  const tasaDGT = 55.7; // Tasa 4.1 de la DGT para cambio de titularidad
  const seguroGarantiaVO = 320; // Póliza de garantía mecánica obligatoria 12 meses VO
  const limpiezaDesinfeccion = 80;

  const totalReacondicionamiento = Math.round(
    costePinturaChapa + costeMecanicaRevision + tasaDGT + seguroGarantiaVO + limpiezaDesinfeccion
  );

  // Margen Comercial Objetivo Orlando Cars (15% del PVP o mínimo 1.800€)
  const margenObjetivo = Math.max(1800, Math.round(pvpEstimado * 0.15));

  // Oferta recomendada de compra
  const techoMaximo = Math.max(1000, Math.round(pvpEstimado - totalReacondicionamiento - margenObjetivo));
  const ofertaInicial = Math.round(techoMaximo * 0.9); // Dejamos un 10% de margen de regateo

  const argumentario = `«Estimado cliente: Para poder ofrecerle un servicio 100% profesional y seguro, en Orlando Cars calculamos la tasación de forma totalmente transparente. 
El valor de venta en el mercado de su ${input.make} ${input.model} se sitúa en torno a los ${pvpEstimado.toLocaleString("es-ES")} €. 
A este importe, nosotros como concesionario profesional debemos aplicar por ley:
1. Una revisión mecánica completa y reacondicionamiento certificado (${costeMecanicaRevision + costePinturaChapa} €).
2. Póliza obligatoria de 12 meses de garantía mecánica para el futuro comprador (${seguroGarantiaVO} €).
3. Tasas de gestoría y cambio de titularidad en la DGT (${Math.round(tasaDGT)} €).
4. El margen comercial del negocio con IVA en régimen REBU.

Por ello, nuestra oferta de compra directa e inmediata, con pago al contado y cambio de nombre hoy mismo, es de ${ofertaInicial.toLocaleString("es-ES")} € (pudiendo llegar a ${techoMaximo.toLocaleString("es-ES")} € si cerramos la operación hoy). Usted se olvida de garantías a particulares, posibles averías futuras y trámites en Tráfico.»`;

  return {
    pvpEstimado,
    totalReacondicionamiento,
    costesDetalle: {
      chapaPintura: costePinturaChapa,
      mecanica: costeMecanicaRevision,
      garantia: seguroGarantiaVO,
      dgt: tasaDGT,
      limpieza: limpiezaDesinfeccion,
    },
    margenObjetivo,
    ofertaInicial,
    techoMaximo,
    argumentario,
  };
}

// ------------------------------------------------------------------------------
// 4. AGENTE MARKETING, REELS & ADS
// ------------------------------------------------------------------------------
export function generateMarketingPack(input: MarketingInput) {
  const reelScript = `🎬 GUION DE REEL / TIKTOK (30-35 SEGUNDOS)
📍 Localización: Campa o entrada de Orlando Cars
📱 Dispositivo: Grabación vertical 9:16 con cámara en mano

[00:00 - 00:03] GANCHO / HOOK (Impacto inicial):
• Imagen: Cámara rápida acercándose al frontal del coche con las luces diurnas encendidas.
• Voz en off / Tú a cámara: "¿Buscando un coche fiable sin dejarte el sueldo? Ojo a lo que acaba de entrar en Orlando Cars."

[00:04 - 00:15] EL PRODUCTO (3 Detalles Clave):
• Imagen: Corte rápido a las llantas y perfil -> Corte al interior mostrando el cuadro digital y tapicería -> Arrancada del motor.
• Voz: "Hablamos de este ${input.vehicleName}. Viene cargado de extras: ${input.extras}. Está prácticamente nuevo y revisado de arriba a abajo."

[00:16 - 00:24] TRANSPARENCIA Y CONFIANZA:
• Imagen: Plano detalle del cuentakilómetros y la pegatina de la ITV.
• Voz: "Kilómetros 100% certificados por contrato, historial limpio de accidentes y te lo llevas con 12 meses de garantía mecánica nacional incluida."

[00:25 - 00:32] LLAMADA A LA ACCIÓN (CTA):
• Imagen: Tú sonriendo junto al coche con el logotipo de Orlando Cars de fondo.
• Voz: "Precio final: ${input.price.toLocaleString("es-ES")} € al contado o con financiación a tu medida sin entrada. Escríbenos por mensaje privado antes de que vuele. ¡Te esperamos en Orlando Cars!"`;

  const metaAdCopy = `🚗 ¿BUSCAS COCHE EN EXCELENTE ESTADO Y CON GARANTÍA REAL?

En Orlando Cars te presentamos este flamante ${input.vehicleName.toUpperCase()}.

💶 Precio: ${input.price.toLocaleString("es-ES")} € (Financiación a tu medida sin entrada)
🛡️ 1 Año de Garantía Oficial Nacional
📋 Historial de revisiones y kilometraje 100% certificado
🔄 Aceptamos tu vehículo actual como parte de pago

📍 Ven a probarlo a nuestra exposición o solicita vídeo demostrativo por WhatsApp.
👉 Haz clic en "Más Información" o envíanos un mensaje directo para reservar tu cita.`;

  const hashtags = `#orlandocars #cochesocasion #cochessegundamano #compraventacoches #vo #cochesespaña #motor #seminuevo #${input.vehicleName.split(" ")[0].toLowerCase()}`;

  return { reelScript, metaAdCopy, hashtags };
}
