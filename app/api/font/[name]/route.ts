// src/app/api/font/[name]/route.ts
// Font loading and management

import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_FONTS_DATABASE } from "@/editor/data/google-fonts";

interface RouteParams {
  params: {
    name: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { name } = await params;

  const entry = GOOGLE_FONTS_DATABASE.find((font) => font.fontFamily === name);

  if (!entry) {
    return new NextResponse("Font not found", {
      status: 404,
    });
  }

  return NextResponse.json(entry, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
