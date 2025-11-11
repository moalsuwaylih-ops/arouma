"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formSections, Section } from "./form-data";
import { scoreArouma } from "@/lib/scoring";

/** ================= أنواع محلية ================= */
type Ans = Record<string, string | string[]>;

/** ================= تحقق البريد/الهاتف ================= */
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()); }
function isValidPhone(v: string) { const d = (v || "").replace(/[^\d]/g, ""); return d.length >= 9 && d.length <= 15; }

export default function AssessmentPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Ans>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = formSections.length;
  const current = formSections[step];

  /** تحميل محلي */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("arouma_answers");
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, []);

  /** حفظ محلي (debounce) */
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem("arouma_answers", JSON.stringify(answers)); } catch {}
    }, 300);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [answers]);

  /** تمرير لأعلى عند تغيير القسم */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  /** تحقق القسم الحالي */
  const requiredIds = useMemo(
    () => current.questions.filter((q) => q.required).map((q) => q.id),
    [current]
  );

  const isStepValid = useMemo(() => {
    const baseValid = requiredIds.every((id) => {
      const q = current.questions.find((qq) => qq.id === id);
      const v = answers[id];
      if (Array.isArray(v)) return v.length > 0;
      const sv = (v ?? "").toString().trim();
      if (!sv) return false;
      if (q?.type === "email") return isValidEmail(sv);
      if (q?.type === "phone") return isValidPhone(sv);
      return true;
    });
    if (!baseValid) return false;

    if (current.id === "basic") {
      const diagFlag = String(answers["diagnosis_flag"] || "");
      const therapy = String(answers["therapy"] || "");
      if (diagFlag === "نعم" && !String(answers["diagnosis_details"] || "").trim()) return false;
      if (therapy === "نعم" && !String(answers["therapy_details"] || "").trim()) return false;
    }
    return true;
  }, [answers, requiredIds, current]);

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const handleChange = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrorMsg(null);
  }, []);

  const goNext = useCallback(() => {
    if (!isStepValid) { setErrorMsg("رجاءً أكمل الحقول المطلوبة في هذا القسم."); return; }
    if (step < totalSteps - 1) setStep(step + 1);
  }, [isStepValid, step, totalSteps]);

  const goPrev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  /** ================= الإرسال ================= */
  const handleSubmit = useCallback(async () => {
    if (loading) return;
    if (!isStepValid) { setErrorMsg("رجاءً أكمل الحقول المطلوبة قبل الإرسال."); return; }
    setLoading(true); setErrorMsg(null);

    try {
      // 1) تحليل موحّد عبر scoreArouma (بدون لمس معادلاتك)
      const { results, flat } = scoreArouma(answers);

      // 2) حمولة موّحدة للإرسال/الحفظ
      const payload = {
        answers: { ...answers, ...flat },
        meta: {
          progress: `${step + 1}/${totalSteps}`,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          locale: typeof navigator !== "undefined" ? navigator.language : "ar",
        },
        results, // يحتوي mi/vak/big5/environment/recs
      };

      // 3) حفظ محلي دائم
      try {
        localStorage.setItem("arouma_last_results", JSON.stringify(payload.results));
        const historyRaw = localStorage.getItem("arouma_submissions");
        const history: any[] = historyRaw ? JSON.parse(historyRaw) : [];
        history.push(payload);
        localStorage.setItem("arouma_submissions", JSON.stringify(history));
      } catch (e) {
        console.warn("LocalStorage failed:", e);
      } finally {
        try { localStorage.removeItem("arouma_answers"); } catch {}
      }

      // 4) مزامنة Google Sheets — لا توقف التجربة عند الفشل
      try {
        console.log("[Arouma] POST /api/submit …", payload.meta);
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ answers: payload.answers, meta: payload.meta }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          console.warn("Sheets sync failed:", data?.error || res.status);
        } else {
          console.log("Sheets sync ok:", data);
        }
      } catch (err) {
        console.warn("Sheets unreachable:", err);
      }

      // 5) الانتقال لصفحة النتائج
      router.push("/assessment/results?submitted=1");

    } catch (err: any) {
      setErrorMsg(err?.message || "تعذر إتمام العملية.");
    } finally {
      setLoading(false);
    }
  }, [answers, isStepValid, loading, step, totalSteps, router]);

  /** ================= الواجهة ================= */
  return (
    <main dir="rtl" className="min-h-screen text-[var(--flw-text)] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* الهيدر */}
        <div className="flw-card p-5 md:p-6 mb-6">
          <div className="flex justify-center items-center">
            <img src="/logo.png" alt="شعار أرومة" className="h-24 md:h-28 w-auto object-contain drop-shadow-md" />
          </div>
          <h1 className="sr-only">اختبار أرومة</h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1" style={{ color: "var(--flw-sub)" }}>
              <span>القسم {step + 1} من {totalSteps}</span>
              <span>{progress}%</span>
            </div>
            <div className="flw-progress"><i style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* بطاقة القسم */}
        <div className="flw-card p-6">
          <h2 className="text-xl font-semibold mb-3">{current.title}</h2>
          {current.description && <p className="text-sm mb-4 whitespace-pre-line" style={{ color: "var(--flw-sub)" }}>{current.description}</p>}

          <div className="space-y-6">
            {current.questions.map((q) => {
              const val = answers[q.id];
              const isInvalid =
                q.required &&
                ((Array.isArray(val) && val.length === 0) ||
                  (!Array.isArray(val) && (!val || String(val).trim() === "")) ||
                  (q.type === "email" && typeof val === "string" && val && !isValidEmail(val)) ||
                  (q.type === "phone" && typeof val === "string" && val && !isValidPhone(val)));

              const hideDiagnosis = q.id === "diagnosis_details" && String(answers["diagnosis_flag"] || "") !== "نعم";
              const hideTherapy = q.id === "therapy_details" && String(answers["therapy"] || "") !== "نعم";
              if (hideDiagnosis || hideTherapy) return null;

              return (
                <div key={q.id}>
                  <label className="block font-medium mb-2" htmlFor={q.id}>
                    {q.title} {q.required && <span className="text-red-500">*</span>}
                  </label>

                  {q.type === "single" && q.options?.map((opt, idx) => {
                    const inputId = `${q.id}_${idx}`;
                    return (
                      <div key={opt} className="mb-2">
                        <input
                          id={inputId}
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={val === opt}
                          onChange={() => handleChange(q.id, opt)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={inputId}
                          className="ml-2 cursor-pointer rounded-xl border px-3 py-2 inline-block"
                          style={{ borderColor: "var(--flw-line)", color: "var(--flw-sub)" }}
                        >
                          {opt}
                        </label>
                      </div>
                    );
                  })}

                  {q.type === "multi" && q.options?.map((opt, idx) => {
                    const arr = Array.isArray(val) ? (val as string[]) : [];
                    const checked = arr.includes(opt);
                    const inputId = `${q.id}_${idx}`;
                    return (
                      <div key={opt} className="mb-2">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(arr);
                            e.target.checked ? next.add(opt) : next.delete(opt);
                            handleChange(q.id, Array.from(next));
                          }}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={inputId}
                          className="ml-2 cursor-pointer rounded-xl border px-3 py-2 inline-block"
                          style={{ borderColor: "var(--flw-line)", color: "var(--flw-sub)" }}
                        >
                          {opt}
                        </label>
                      </div>
                    );
                  })}

                  {(q.type === "text" || q.type === "email" || q.type === "phone") && (
                    <input
                      id={q.id}
                      dir="auto"
                      type={q.type === "phone" ? "tel" : q.type}
                      placeholder="أدخل الإجابة هنا..."
                      value={typeof val === "string" ? (val as string) : ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className={`flw-input ${isInvalid ? "outline-none ring-0" : ""}`}
                    />
                  )}

                  {isInvalid && (
                    <p className="mt-1 text-sm text-rose-500">
                      {q.type === "email" ? "رجاءً أدخل بريدًا إلكترونيًا صحيحًا."
                        : q.type === "phone" ? "رجاءً أدخل رقم جوال صحيح (9–15 رقمًا)."
                        : "هذا الحقل مطلوب."}
                    </p>
                  )}
                  {q.helper && <p className="text-xs mt-1" style={{ color: "var(--flw-sub)" }}>{q.helper}</p>}
                </div>
              );
            })}
          </div>

          {/* أزرار التحكم */}
          <div className="mt-8 flex items-center justify-between">
            <button onClick={goPrev} disabled={step === 0 || loading} className="flw-btn-ghost disabled:opacity-50">السابق</button>
            {step < totalSteps - 1 ? (
              <button onClick={goNext} disabled={!isStepValid || loading} className="flw-btn disabled:opacity-50">التالي</button>
            ) : (
              <button onClick={handleSubmit} disabled={!isStepValid || loading} className="flw-btn disabled:opacity-50">
                {loading ? "جاري الإرسال..." : "إرسال الإجابات"}
              </button>
            )}
          </div>

          {!isStepValid && <p className="mt-3 text-sm text-rose-500">رجاءً أكمل الحقول المطلوبة في هذا القسم قبل المتابعة.</p>}
          {errorMsg && <p className="mt-3 text-sm text-rose-500">{errorMsg}</p>}
        </div>
      </div>
    </main>
  );
}
