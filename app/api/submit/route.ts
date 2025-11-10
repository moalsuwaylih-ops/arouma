// app/api/submit/route.ts
import { NextResponse } from "next/server";

// اجبر المعالجة ديناميكية (مهم مع App Router)
export const dynamic = "force-dynamic";

// استخدم متغير سري (بدل NEXT_PUBLIC_)
const SHEET_URL = process.env.SHEET_URL || process.env.NEXT_PUBLIC_SHEET_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body?.answers ?? {};
    const meta = body?.meta ?? {};

    // إن وُجد Webhook/Sheet، أرسل له
    if (SHEET_URL) {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // أرسل answers + meta معًا مفيدًا للّوائح
        body: JSON.stringify({ answers, meta }),
        // لو الـ SHEET_URL خارجي بطيء، حدّد مهلة معقولة
        // @ts-ignore
        next: { revalidate: 0 }, // لا كاش
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: data?.error || `Upstream error: ${res.status}` },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true, result: data });
    }

    // بدون Webhook: رجّع OK للتجربة المحلية
    console.log("Arouma submission (local mock):", { answers, meta });
    return NextResponse.json({ ok: true, mocked: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "خطأ أثناء الإرسال" },
      { status: 400 }
    );
  }
}
