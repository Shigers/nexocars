import { NextRequest, NextResponse } from "next/server";
import { getPublicVehicles, buildFeedXml } from "@/lib/connectors";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) {
  const { channel } = await params;
  const channelKey = (channel || "").toLowerCase();

  // Opcional: verificación de token si se pasa en query string
  const token = req.nextUrl.searchParams.get("token");
  const configuredSecret = process.env.PORTAL_FEED_SECRET;
  if (configuredSecret && token && token !== configuredSecret) {
    return new NextResponse("Token de acceso no válido", { status: 401 });
  }

  try {
    const cars = await getPublicVehicles();
    const dealerName = "Orlando Cars & Loewe Car";
    const xml = buildFeedXml(channelKey, dealerName, cars);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating portal feed:", error);
    return new NextResponse("Error interno al generar feed", { status: 500 });
  }
}
