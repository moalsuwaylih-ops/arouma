"use client";

import { useEffect, useMemo, useState } from "react";
import ResultsContent from "@/app/components/ResultsContent";

/* ======================= صفحة النتائج ======================= */
export default function Page() {
  return (
    <>
      <ResultsExtras />
      <ResultsContent />
    </>
  );
}

/* ======================= الشريط العلوي + المودال ======================= */
type SavedEntry = {
  answers?: Record<string, any>;
  meta?: { submittedAt?: string; progress?: string; userAgent?: string; locale?: string };
  results?: {
    mi?: { result: Record<string, { sum: number; max: number; percent: number }>; ranking: string[] };
    vak?: { raw?: any; percent?: any; absolute?: any; ranking?: string[] };
    big5?: { raw?: any; percent?: { E: number; O: number; A: number; C: number; N: number } };
    environment?: { supportScore: number; supportPercent: number; level: string };
    recs?: string[];
  };
};

function ResultsExtras() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<SavedEntry[]>([]);
  const [idx, setIdx] = useState(0);

  // حمّل كل المحفوظات (أحدثها في الأخير غالباً)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("arouma_submissions");
      if (raw) {
        const list: SavedEntry[] = JSON.parse(raw);
        // نظّمها من الأحدث إلى الأقدم
        const ordered = [...list].sort((a, b) => {
          const ta = Date.parse(a.meta?.submittedAt || "");
          const tb = Date.parse(b.meta?.submittedAt || "");
          return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
        });
        setHistory(ordered);
        setIdx(0);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const hasHistory = history.length > 0;
  const current = hasHistory ? history[idx] : null;

  // عناصر العرض الجاهزة
  const chips = useMemo(() => {
    if (!current?.results) return [];
    const miTop = (current.results.mi?.ranking || []).slice(0, 3).map(labelMi);
    const vakTop = vakTopLabel(current.results.vak?.ranking?.[0]);
    const env = current.results.environment?.level;
    return [
      miTop.length ? `أقوى ذكاءات: ${miTop.join("، ")}` : null,
      vakTop ? `نمط التعلم الأبرز: ${vakTop}` : null,
      env ? `بيئة أسرية: ${env}` : null,
    ].filter(Boolean) as string[];
  }, [current]);

  return (
    <>
      {/* شريط علوي صغير ثابت */}
      <div
        className="fixed right-4 left-4 md:left-auto md:right-6 top-4 z-[60] flex gap-2 items-center"
        style={{ direction: "rtl" }}
      >
        {hasHistory && (
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-xl bg-white/90 shadow border hover:bg-white text-[13px]"
          >
            عرض نتائج محفوظة
          </button>
        )}
        <button
          onClick={() => (window.location.href = "/assessment")}
          className="px-3 py-2 rounded-xl bg-[#6D28D9] text-white shadow hover:opacity-90 text-[13px]"
        >
          إعادة الاختبار
        </button>
      </div>

      {/* مودال النتائج المحفوظة */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-3 md:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ direction: "rtl" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* رأس: اختيار النتيجة + أزرار */}
            <div className="border-b p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base md:text-lg font-semibold">نتائج محفوظة</h3>
                {hasHistory && (
                  <div className="flex gap-2 flex-wrap">
                    {history.slice(0, 5).map((h, i) => {
                      const date = formatDate(h.meta?.submittedAt);
                      return (
                        <button
                          key={i}
                          onClick={() => setIdx(i)}
                          className={`px-2.5 py-1.5 rounded-lg border text-sm ${
                            i === idx ? "bg-[#6D28D9] text-white border-[#6D28D9]" : "bg-white"
                          }`}
                          title={h.meta?.submittedAt || ""}
                        >
                          {date || `نتيجة ${i + 1}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border text-sm"
                >
                  طباعة / PDF
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* محتوى النتيجة المختارة */}
            <div className="p-4 md:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {!current ? (
                <p className="text-gray-500 text-sm">لا توجد نتائج محفوظة.</p>
              ) : (
                <>
                  {/* شِبّات الملخص */}
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {chips.map((c, i) => (
                        <span
                          key={i}
                          className="inline-block rounded-full bg-[#F5F3FF] text-[#4C1D95] border border-[#E9D5FF] px-3 py-1 text-[12px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* الذكاءات المتعددة (كامل) */}
                  {current.results?.mi?.result && (
                    <section>
                      <h4 className="font-semibold mb-3">الذكاءات المتعددة (من الأعلى إلى الأقل)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(current.results.mi.result)
                          .sort((a, b) => (b[1]?.percent ?? 0) - (a[1]?.percent ?? 0))
                          .map(([k, v]) => (
                            <CardBar key={k} label={labelMi(k)} value={v?.percent ?? 0} />
                          ))}
                      </div>
                    </section>
                  )}

                  {/* VAK */}
                  {current.results?.vak && (
                    <section>
                      <h4 className="font-semibold mb-3">نمط التعلّم (VAK)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <CardBar label="بصري" value={current.results.vak.absolute?.visual ?? 0} />
                        <CardBar label="سمعي" value={current.results.vak.absolute?.auditory ?? 0} />
                        <CardBar label="حسي/حركي" value={current.results.vak.absolute?.kinesthetic ?? 0} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        النمط الأبرز:{" "}
                        <span className="font-semibold">
                          {vakTopLabel(current.results.vak.ranking?.[0])}
                        </span>
                      </p>
                    </section>
                  )}

                  {/* Big Five */}
                  {current.results?.big5?.percent && (
                    <section>
                      <h4 className="font-semibold mb-3">سمات الشخصية Big Five</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <CardBar label="الانبساط (E)" value={current.results.big5.percent.E ?? 0} />
                        <CardBar label="الانفتاح (O)" value={current.results.big5.percent.O ?? 0} />
                        <CardBar label="القبول/التوافق (A)" value={current.results.big5.percent.A ?? 0} />
                        <CardBar label="الضمير/الانضباط (C)" value={current.results.big5.percent.C ?? 0} />
                        <CardBar label="العصابية/الحساسية (N)" value={current.results.big5.percent.N ?? 0} />
                      </div>
                    </section>
                  )}

                  {/* البيئة الأسرية */}
                  {current.results?.environment && (
                    <section>
                      <h4 className="font-semibold mb-3">بيئة الدعم الأسري</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <CardBar label="مستوى الدعم" value={current.results.environment.supportPercent ?? 0} />
                        <CardSimple
                          title="التصنيف"
                          content={current.results.environment.level || "—"}
                        />
                        <CardSimple
                          title="الدرجة"
                          content={`${current.results.environment.supportScore ?? 0}`}
                        />
                      </div>
                    </section>
                  )}

                  {/* التوصيات */}
                  {Array.isArray(current.results?.recs) && current.results!.recs!.length > 0 && (
                    <section>
                      <h4 className="font-semibold mb-3">اقتراحات يومية قصيرة</h4>
                      <ul className="list-disc pr-5 text-[14px] text-gray-800 space-y-1.5">
                        {current.results!.recs!.slice(0, 12).map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-gray-500 mt-2">
                        * يُفضّل تنفيذ الأنشطة القصيرة بواقع 10–15 دقيقة يومياً.
                      </p>
                    </section>
                  )}

                  {/* معلومات تقنية */}
                  <p className="text-[11px] text-gray-400">
                    التاريخ: {formatDateTime(current.meta?.submittedAt)} — المتصفح:{" "}
                    {(current.meta?.userAgent || "").slice(0, 50)}
                    {current.meta?.userAgent && current.meta.userAgent.length > 50 ? "..." : ""}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ======================= مكوّنات مساعدة ======================= */
function CardBar({ label, value }: { label: string; value: number }) {
  const v = clamp01(value);
  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{v}%</span>
      </div>
      <div className="h-2 rounded bg-gray-100 overflow-hidden">
        <div className="h-full rounded bg-[#7C3AED]" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function CardSimple({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-sm font-medium">{content}</div>
    </div>
  );
}

function clamp01(v: any) {
  const n = Math.round(Number(v) || 0);
  return Math.max(0, Math.min(100, n));
}

function labelMi(k: string) {
  const map: Record<string, string> = {
    linguistic: "لغوي/لساني",
    logical: "منطقي/رياضي",
    interpersonal: "اجتماعي/تعاوني",
    intrapersonal: "داخلي",
    spatial: "بصري/فراغي",
    musical: "موسيقي/إيقاعي",
    naturalist: "طبيعي",
    bodily: "حسي/حركي",
  };
  return map[k] || k;
}

function vakTopLabel(k?: string) {
  if (k === "visual") return "بصري";
  if (k === "auditory") return "سمعي";
  if (k === "kinesthetic") return "حسي/حركي";
  return "—";
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(+d)) return "";
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "2-digit" });
}
function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(+d)) return "—";
  return d.toLocaleString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
