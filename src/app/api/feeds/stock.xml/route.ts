import { NextResponse } from "next/server";
import { getPublicVehicles, buildFeedXml } from "@/lib/connectors";

export async function GET() {
  try {
    const cars = await getPublicVehicles();
    const xml = buildFeedXml("coches_net", "Orlando Cars & Loewe Car", cars);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating stock.xml:", error);
    return new NextResponse("Error generating XML feed", { status: 500 });
  }
}
