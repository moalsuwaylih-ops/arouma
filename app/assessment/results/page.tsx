"use client";

import ResultsContent from "@/app/components/ResultsContent";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  return (
    <>
      <ResultsExtras />   {/* الشريط العلوي */}
      <ResultsContent />  {/* صفحة النتائج الحالية كما هي */}
    </>
  );
}

// === إضافة شريط أدوات النتائج (لا يغيّر تنسيق صفحتك) ===
function ResultsExtras() {
  const [prev, setPrev] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("arouma_last_results");
      if (raw) setPrev(JSON.parse(raw));
    } catch {}
  }, []);

  const miList = useMemo(() => {
    const r = prev?.mi?.result || {};
    return Object.keys(r)
      .map((k) => ({ key: k, p: r[k]?.percent ?? 0 }))
      .sort((a, b) => b.p - a.p);
  }, [prev]);

  const vak = prev?.vak;
  const big5 = prev?.big5?.percent;
  const env = prev?.environment;

  return (
    <>
      {/* شريط علوي صغير ثابت */}
      <div
        className="fixed right-4 left-4 md:left-auto md:right-6 top-4 z-[60] flex gap-2 items-center"
        style={{ direction: "rtl" }}
      >
        {prev && (
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-xl bg-white/90 shadow border hover:bg-white text-[13px]"
          >
            عرض آخر نتيجة محفوظة
          </button>
        )}
        <button
          onClick={() => (window.location.href = "/assessment")}
          className="px-3 py-2 rounded-xl bg-[#6D28D9] text-white shadow hover:opacity-90 text-[13px]"
        >
          إعادة الاختبار
        </button>
      </div>

      {/* نافذة سريعة لاستعراض/طباعة آخر نتيجة */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/30 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-5 md:p-7"
            style={{ direction: "rtl" }}
            onClick={(e) => e.stopPropagation()}
            id="arouma-prev-modal"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">آخر نتيجة محفوظة</h3>
              <div className="flex gap-2">
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

            {!prev ? (
              <p className="text-gray-500 text-sm">لا توجد نتيجة محفوظة.</p>
            ) : (
              <div className="space-y-6 print:space-y-3">
                {/* MI */}
                <section>
                  <h4 className="font-medium mb-2">الذكاءات المتعددة (ترتيبًا):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {miList.map((it) => (
                      <div key={it.key} className="p-3 rounded-xl border">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">
                            {labelMi(it.key)}
                          </span>
                          <span className="text-gray-500">{it.p}%</span>
                        </div>
                        <div className="h-2 rounded bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${it.p}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* VAK */}
                {vak && (
                  <section>
                    <h4 className="font-medium mb-2">نمط التعلّم (VAK):</h4>
                    <Bar label="بصري" value={vak.absolute?.visual ?? 0} />
                    <Bar label="سمعي" value={vak.absolute?.auditory ?? 0} />
                    <Bar label="حسي/حركي" value={vak.absolute?.kinesthetic ?? 0} />
                    <p className="text-xs text-gray-500 mt-2">
                      النمط الأبرز:{" "}
                      <span className="font-semibold">
                        {vakTopLabel(vak?.ranking?.[0])}
                      </span>
                    </p>
                  </section>
                )}

                {/* Big Five */}
                {big5 && (
                  <section>
                    <h4 className="font-medium mb-2">سمات Big Five:</h4>
                    <Bar label="الانبساط (E)" value={big5.E} />
                    <Bar label="الانفتاح (O)" value={big5.O} />
                    <Bar label="القبول/التوافق (A)" value={big5.A} />
                    <Bar label="الضمير/الانضباط (C)" value={big5.C} />
                    <Bar label="العصابية/الحساسية (N)" value={big5.N} />
                  </section>
                )}

                {/* البيئة */}
                {env && (
                  <section>
                    <h4 className="font-medium mb-2">بيئة الدعم الأسري:</h4>
                    <Bar label="مستوى الدعم" value={env.supportPercent ?? 0} />
                    <p className="text-xs text-gray-500 mt-1">
                      التصنيف: <span className="font-semibold">{env.level}</span>
                    </p>
                  </section>
                )}

                {/* توصيات مختصرة */}
                {Array.isArray(prev?.recs) && prev.recs.length > 0 && (
                  <section>
                    <h4 className="font-medium mb-2">اقتراحات مختصرة:</h4>
                    <ul className="list-disc pr-5 text-sm text-gray-700 space-y-1">
                      {prev.recs.slice(0, 8).map((t: string, i: number) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{v}%</span>
      </div>
      <div className="h-2 rounded bg-gray-100 overflow-hidden">
        <div className="h-full bg-purple-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
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
