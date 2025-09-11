// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

type Row = {
  id: string;
  sku: string;
  name: string;
  price: number;
  status: string;
  updatedAt: string;
};

// Simulated query over your DB; replace with real DB logic
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startRow = Number(url.searchParams.get("startRow") || 0);
  const endRow = Number(url.searchParams.get("endRow") || 50);
  const sortModel = safeParse<any[]>(url.searchParams.get("sort"), []);
  const filterModel = safeParse<Record<string, any>>(url.searchParams.get("filter"), {});
  const q = url.searchParams.get("q") || "";
  const limit = Number(url.searchParams.get("limit") || 50);

  // Map AG Grid sort to DB sort (example for Mongo)
  const sort: Record<string, 1 | -1> = {};
  for (const s of sortModel) {
    if (!s.colId || !s.sort) continue;
    sort[s.colId] = s.sort === "asc" ? 1 : -1;
  }

  // Map AG Grid filter model to DB filters (simplified; extend per filter type)
  const filters: any = {};
  Object.entries(filterModel).forEach(([field, cfg]: any) => {
    const type = cfg?.type || cfg?.filterType;
    const val = cfg?.filter;
    if (!val) return;
    if (type?.includes("number")) {
      filters[field] = Number(val);
    } else if (type?.includes("date")) {
      filters[field] = { $gte: new Date(val) };
    } else {
      // text
      filters[field] = { $regex: String(val), $options: "i" };
    }
  });

  // Global search: OR across fields
  const searchOr = q
    ? [
        { sku: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { status: { $regex: q, $options: "i" } },
      ]
    : [];

  // Build DB query
  const where = {
    ...filters,
    ...(searchOr.length ? { $or: searchOr } : {}),
  };

  // Replace with your DB layer. Below is a mock dataset.
  const all: Row[] = mockData();

  // Filter in-memory (replace with DB query)
  const filtered = all.filter((r) => {
    // naive filter/search for demo only
    const passesFilters = Object.entries(filters).every(([k, v]: any) => {
      if (typeof v === "object" && "$regex" in v) {
        return String((r as any)[k]).match(new RegExp(v.$regex, v.$options));
      }
      if (typeof v === "object" && "$gte" in v) {
        return new Date((r as any)[k]) >= new Date(v.$gte);
      }
      return (r as any)[k] == v;
    });
    const passesSearch =
      !q ||
      String(r.sku).toLowerCase().includes(q.toLowerCase()) ||
      String(r.name).toLowerCase().includes(q.toLowerCase()) ||
      String(r.status).toLowerCase().includes(q.toLowerCase());
    return passesFilters && passesSearch;
  });

  // Sort (replace with DB sort)
  const sorted = filtered.sort((a, b) => {
    const entries = Object.entries(sort);
    if (!entries.length) return 0;
    for (const [field, dir] of entries) {
      const av = (a as any)[field];
      const bv = (b as any)[field];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
    }
    return 0;
  });

  // Slice for infinite model
  const rows = sorted.slice(startRow, Math.min(endRow, sorted.length));
  const total = sorted.length;

  return NextResponse.json({ rows, total });
}

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function mockData(): Row[] {
  const now = Date.now();
  return Array.from({ length: 1234 }).map((_, i) => ({
    id: `id_${i}`,
    sku: `SKU-${1000 + i}`,
    name: `Product ${i}`,
    price: Math.round(1000 + Math.random() * 9000) / 100,
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "draft" : "archived",
    updatedAt: new Date(now - i * 86400000).toISOString(),
  }));
}