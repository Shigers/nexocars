import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, agentType, apiKey } = await req.json();

    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

    if (effectiveKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Eres Nexo, el copiloto de IA automotriz y director de operaciones de Orlando Cars S.L. Tu usuario trabaja en el concesionario gestionando ventas, tasaciones, stock multi-portal y marketing. Responde siempre con tono ultra-profesional, directo, comercial y adaptado al mercado automotriz español (garantía 12 meses, DGT, régimen fiscal REBU, cuotas de financiación).
                      
Consulta del usuario: ${prompt}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Operación procesada con éxito por el núcleo de Gemini.";
          return NextResponse.json({ reply: replyText, source: "gemini" });
        }
      } catch (err) {
        console.error("Gemini API direct call failed, falling back to local engine:", err);
      }
    }

    // Respuesta inteligente determinista local para Orlando Cars
    const p = prompt.toLowerCase();
    let reply = "";

    if (p.includes("tasar") || p.includes("compra") || p.includes("cuanto pagar")) {
      reply = `[NEXO TASACIÓN VO]: Para compras en Orlando Cars, la regla de oro es asegurar un margen bruto mínimo del 15% o 1.800€. Recuerda descontar de la tasación: 250€ pintura básica, 350€ revisión y aceite, 55.70€ tasa DGT y 320€ póliza de garantía mecánica de 1 año. ¿Qué vehículo te están ofreciendo?`;
    } else if (p.includes("rebu") || p.includes("factura") || p.includes("iva")) {
      reply = `[NEXO FISCALIDAD REBU]: En Orlando Cars, la venta a particulares se acoge al Régimen Especial de Bienes Usados (Arts. 135 a 139 Ley del IVA). La factura NO desglosa IVA al cliente final y debe llevar la mención: "Operación sujeta al régimen especial de bienes usados". El IVA se tributa únicamente sobre el margen comercial de beneficio neto.`;
    } else if (p.includes("lead") || p.includes("cliente") || p.includes("whatsapp")) {
      reply = `[NEXO COMERCIAL]: Ante cualquier lead entrante, responde en menos de 5 minutos. Tu objetivo número 1 no es vender el coche por chat, es CERRAR LA VISITA o enviar un vídeo personalizado para que no se enfríe. Ofrece siempre dos opciones horarias: "¿Prefieres mañana a las 11:00 o a las 17:30 para probarlo?".`;
    } else {
      reply = `[NEXO COMANDANTE]: He recibido tu instrucción: "${prompt}". Los 4 agentes de Orlando Cars (Portales, WhatsApp, Tasador y Marketing) están listos para ejecutar. Selecciona el agente correspondiente arriba para rellenar los datos o déjame coordinar la operación.`;
    }

    return NextResponse.json({ reply, source: "nexo-local-core" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando solicitud en el servidor" },
      { status: 500 }
    );
  }
}
