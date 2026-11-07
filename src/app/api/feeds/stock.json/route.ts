import { NextResponse } from "next/server";
import { getPublicVehicles } from "@/lib/connectors";

export async function GET() {
  try {
    const vehicles = await getPublicVehicles();
    return NextResponse.json({
      dealer: "Orlando Cars & Loewe Car",
      count: vehicles.length,
      updated_at: new Date().toISOString(),
      vehicles,
    });
  } catch (error) {
    console.error("Error generating stock.json:", error);
    return NextResponse.json({ error: "Failed to generate JSON feed" }, { status: 500 });
  }
}
