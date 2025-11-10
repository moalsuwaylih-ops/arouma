// app/api/submit/route.ts
import { NextResponse } from "next/server";

// اجبر المعالجة ديناميكية (مهم مع App Router)
export const dynamic = "force-dynamic";

// الأفضل استخدام متغير سري SHEET_URL في الخادم
const SHEET_URL = process.env.SHEET_URL || process.env.NEXT_PUBLIC_SHEET_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body?.answers ?? {};
    const meta = body?.meta ?? {};

    // إن وُجد Webhook/Sheet، أرسل له (لا كاش)
    if (SHEET_URL) {
      try {
        const res = await fetch(SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, meta }),
          // @ts-ignore
          next: { revalidate: 0 },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // نرجّع ok:true لكن نوضح أن المزامنة فشلت — لا نعطّل الواجهة الأمامية
          return NextResponse.json(
            { ok: true, synced: false, error: data?.error || `Upstream ${res.status}` },
            { status: 200 }
          );
        }

        return NextResponse.json({ ok: true, synced: true, result: data });
      } catch (err: any) {
        // الشبكة فشلت — نرجّع ok:true مع synced:false
        return NextResponse.json(
          { ok: true, synced: false, error: err?.message || "Network error" },
          { status: 200 }
        );
      }
    }

    // لا يوجد SHEET_URL — نرجّع OK كتجربة محلية
    console.log("Arouma submission (local only):", { answers, meta });
    return NextResponse.json({ ok: true, mocked: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "خطأ أثناء الإرسال" },
      { status: 400 }
    );
  }
}
