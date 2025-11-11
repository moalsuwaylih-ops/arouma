// app/api/submit/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// سرّ السيرفر (لا تستخدم NEXT_PUBLIC_* في الإنتاج)
const SHEET_URL = process.env.SHEET_URL || ""; 
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_APP_ORIGIN || "", // ضع دومين الإنتاج هنا .env.local
].filter(Boolean);

type JsonVal = string | number | boolean | null;
type Dict = Record<string, JsonVal>;

function sanitize(obj: Record<string, any> | undefined | null): Dict {
  const out: Dict = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof k !== "string") continue;
    const key = k.slice(0, 128);
    if (typeof v === "string") out[key] = v.slice(0, 5000);
    else if (typeof v === "number" || typeof v === "boolean" || v === null) out[key] = v;
    else out[key] = String(v).slice(0, 5000);
  }
  return out;
}

export async function OPTIONS() {
  // CORS مبسّط (للبيئة المحلية/الإنتاج)
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0] || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: Request) {
  try {
    // فحص المصدر (Origin)
    const origin = req.headers.get("origin") || "";
    if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({} as any));
    const answers = sanitize(body?.answers);
    const meta = sanitize(body?.meta);

    // التجربة المحلية بدون ورقة Google
    if (!SHEET_URL) {
      console.warn("SHEET_URL not set. Skipping remote sync.");
      return NextResponse.json({ ok: true, mocked: true });
    }

    // إرسال إلى Google Apps Script / أي Webhook آخر
    const resp = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // منع الكاش مهما كان
      cache: "no-store",
      body: JSON.stringify({ answers, meta }),
      // مهلة قصيرة حتى لا تتأثر تجربة المستخدم
      signal: (AbortSignal as any).timeout?.(5000) ?? undefined,
      // إلغاء إعادة التحقق (احتياط مع Next)
      // @ts-ignore
      next: { revalidate: 0 },
    }).catch((e) => {
      console.warn("Upstream unreachable:", e);
      return null;
    });

    if (!resp) {
      return NextResponse.json({ ok: true, synced: false, error: "network" }, { status: 200 });
    }

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return NextResponse.json(
        { ok: true, synced: false, error: data?.error || `upstream ${resp.status}` },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, synced: true, result: data }, { status: 200 });
  } catch (e: any) {
    console.error("submit error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
