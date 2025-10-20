"use client";

import { useEffect, useState } from "react";

type MiEntry = { sum: number; max: number; percent: number };
type ResultsPayload = {
  mi?: { result: Record<string, MiEntry>; ranking: string[] };
  vak?: { percent: Record<"visual"|"auditory"|"kinesthetic", number>; ranking: string[] };
  big5?: { percent: Record<"E"|"O"|"A"|"C"|"N", number> };
  environment?: { level: string; supportPercent: number };
  recs?: string[];
};

const MI_AR: Record<string, string> = {
  logical: "منطقي/رياضي",
  spatial: "بصري/فراغي",
  musical: "موسيقي",
  bodily: "حركي",
  interpersonal: "اجتماعي/تفاعلي",
  intrapersonal: "ذاتي/داخلي",
  naturalist: "طبيعي/بيئي",
  linguistic: "لغوي",
};

const VAK_AR: Record<"visual"|"auditory"|"kinesthetic", string> = {
  visual: "مرئي/تصويري",
  auditory: "سمعي/لفظي",
  kinesthetic: "حسّي حركي",
};

const BIG5_AR: Record<"E"|"O"|"A"|"C"|"N", string> = {
  E: "الانبساط",
  O: "الانفتاح على الخبرة",
  A: "التوافقية",
  C: "الضبط الذاتي",
  N: "الاستقرار الانفعالي (عكس العصابية)",
};

function Bar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("arouma_last_results") : null;
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center text-gray-700 p-6">
        <p>جارِ تحميل النتائج…</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center text-gray-700 p-6">
        <div className="text-center">
          <p>🚫 لم يتم العثور على نتائج.</p>
          <a href="/" className="text-purple-600 underline mt-4 block">العودة للصفحة الرئيسية</a>
        </div>
      </main>
    );
  }

  const { mi, vak, big5, environment, recs } = data;

  const handlePrint = () => window.print();
  const handleReset = () => {
    try { localStorage.removeItem("arouma_last_results"); localStorage.removeItem("arouma_answers"); } catch {}
    window.location.href = "/";
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-gray-800 p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-purple-100">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-purple-800">🧠 نتائج تحليل أرومة</h1>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">طباعة / PDF</button>
            <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">إعادة التقييم</button>
          </div>
        </div>

        {/* الذكاءات المتعددة */}
        {mi?.result && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">الذكاءات المتعددة</h2>
            <div className="space-y-2">
              {Object.entries(mi.result).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span>{MI_AR[k] ?? k}</span>
                  <div className="flex items-center gap-3">
                    <Bar value={v?.percent ?? 0} />
                    <span className="tabular-nums">{(v?.percent ?? 0)}%</span>
                  </div>
                </div>
              ))}
            </div>
            {mi.ranking?.length ? (
              <p className="mt-3 text-sm text-gray-600">
                أقوى الذكاءات: {mi.ranking.slice(0, 3).map(k => MI_AR[k] ?? k).join("، ")}
              </p>
            ) : null}
          </section>
        )}

        {/* أنماط التعلم */}
        {vak?.percent && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">أنماط التعلم (VAK)</h2>
            <div className="space-y-2">
              {Object.entries(vak.percent).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span>{VAK_AR[k as keyof typeof VAK_AR] ?? k}</span>
                  <div className="flex items-center gap-3">
                    <Bar value={Number(v)} />
                    <span className="tabular-nums">{Number(v) || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
            {vak.ranking?.[0] && (
              <p className="mt-3 text-sm text-gray-600">
                النمط الأقوى: {VAK_AR[vak.ranking[0] as keyof typeof VAK_AR] ?? vak.ranking[0]}
              </p>
            )}
          </section>
        )}

        {/* العوامل الخمسة */}
        {big5?.percent && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">العوامل الخمسة الكبرى</h2>
            <div className="space-y-2">
              {Object.entries(big5.percent).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span>{BIG5_AR[k as keyof typeof BIG5_AR] ?? k}</span>
                  <div className="flex items-center gap-3">
                    <Bar value={Number(v)} />
                    <span className="tabular-nums">{Number(v) || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* البيئة الأسرية */}
        {environment && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">البيئة الأسرية والدعم</h2>
            <p className="text-gray-700">
              مستوى الدعم الأسري: <strong>{environment.level || "غير محدد"}</strong> ({environment.supportPercent ?? 0}%)
            </p>
          </section>
        )}

        {/* التوصيات */}
        {Array.isArray(recs) && recs.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">التوصيات التربوية 💡</h2>
            <ul className="list-disc pr-6 space-y-2 text-gray-700">
              {recs.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}

        {/* رجوع */}
        <div className="text-center mt-10 print:hidden">
          <a
            href="/"
            className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-md transition"
          >
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}
