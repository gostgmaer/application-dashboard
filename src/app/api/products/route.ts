// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5055/api";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startRow = Number(url.searchParams.get("startRow") || 0);
  const endRow = Number(url.searchParams.get("endRow") || 50);
  const sortModel = safeParse<any[]>(url.searchParams.get("sort"), []);
  const filterModel = safeParse<Record<string, any>>(url.searchParams.get("filter"), {});
  const q = url.searchParams.get("q") || "";
  const limit = endRow - startRow;
  const page = Math.floor(startRow / limit) + 1;

  // Build query params for backend
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (q) params.set("search", q);

  // Map sort
  if (sortModel.length > 0) {
    const s = sortModel[0];
    params.set("sortBy", s.colId);
    params.set("sortOrder", s.sort);
  }

  // Map filters
  Object.entries(filterModel).forEach(([field, cfg]: any) => {
    const val = cfg?.filter;
    if (val) params.set(field, String(val));
  });

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "") || "";
    const backendRes = await fetch(`${BASE_URL}/products?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await backendRes.json();

    if (data.success) {
      const products = data.data || [];
      const total = data.meta?.total || products.length;
      const rows = products.map((p: any) => ({
        id: p._id,
        sku: p.sku || "",
        name: p.title || p.name || "",
        price: p.finalPrice || p.basePrice || 0,
        status: p.status || "active",
        updatedAt: p.updatedAt || p.createdAt || new Date().toISOString(),
      }));

      return NextResponse.json({ rows, total });
    }

    return NextResponse.json({ rows: [], total: 0 });
  } catch (error) {
    console.error("Products proxy error:", error);
    return NextResponse.json({ rows: [], total: 0 }, { status: 500 });
  }
}

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}