import { NextResponse } from "next/server";
import { getPublicVehicles } from "@/lib/connectors";

export async function GET() {
  try {
    const vehicles = await getPublicVehicles();
    return NextResponse.json(
      {
        concesionario: "Orlando Cars & Loewe Car",
        ubicacion: "Paterna, Valencia",
        total: vehicles.length,
        actualizado: new Date().toISOString(),
        vehiculos: vehicles,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error generating public catalog:", error);
    return NextResponse.json(
      { error: "Error al obtener catálogo público" },
      { status: 500 }
    );
  }
}
