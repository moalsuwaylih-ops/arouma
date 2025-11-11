"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formSections, Section, LIKERT_5 } from "./form-data";

/** ================= أنواع محلية ================= */
type Ans = Record<string, string | string[]>;

/** ================= تحقق البريد/الهاتف ================= */
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()); }
function isValidPhone(v: string) { const d = (v || "").replace(/[^\d]/g, ""); return d.length >= 9 && d.length <= 15; }

/** ================= تحويلات Likert ================= */
function likertToNum(v: string): number { const i = LIKERT_5.indexOf((v || "").trim()); return i >= 0 ? i : 0; } // 0..4
function likertToScore(v: string): number { return likertToNum(v) - 2; } // -2..+2

/** ================= MI mapping ================= */
const MI_FROM_INTERESTS: Record<
  string,
  "musical" | "bodily" | "logical" | "naturalist" | "spatial" | "linguistic" | "interpersonal" | "intrapersonal"
> = {
  i_music: "musical",
  i_physical: "bodily",
  i_puzzles: "logical",
  i_nature: "naturalist",
  i_art: "spatial",
  i_storytelling: "linguistic",
  i_team: "interpersonal",
  i_introspective: "intrapersonal",
};

function computeMiScores(ans: Record<string, any>) {
  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};
  Object.entries(MI_FROM_INTERESTS).forEach(([qid, cat]) => {
    const score = likertToNum(String(ans[qid] || "")) + 1; // 1..5
    totals[cat] = (totals[cat] || 0) + score;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const result: Record<string, { sum: number; max: number; percent: number }> = {};
  new Set(Object.values(MI_FROM_INTERESTS)).forEach((cat) => {
    const sum = totals[cat] || 0;
    const max = (counts[cat] || 0) * 5;
    result[cat] = { sum, max, percent: max ? Math.round((sum / max) * 100) : 0 };
  });

  const ranking = Object.entries(result)
    .sort((a, b) => b[1].percent - a[1].percent || b[1].sum - a[1].sum)
    .map(([k]) => k);

  return { result, ranking };
}

function computeVAK(ans: Record<string, any>) {
  const visualIds = ["l_visual_1", "l_visual_2", "l_visual_3", "l_imagery_1"];
  const auditoryIds = ["l_auditory_1", "l_auditory_2"];
  const kinestheticIds = ["l_kinesthetic_1", "l_kinesthetic_2", "l_hands_on_1", "l_modeling_1"];
  const dual = ["l_media_1", "l_dual_1"];

  const sum = (ids: string[]) => ids.reduce((s, id) => s + likertToNum(String(ans[id] || "")), 0);

  let visual = sum(visualIds) + 0.5 * sum(dual);
  let auditory = sum(auditoryIds) + 0.5 * sum(dual);
  let kinesthetic = sum(kinestheticIds);

  const maxVisual = visualIds.length * 4 + 0.5 * dual.length * 4;
  const maxAud = auditoryIds.length * 4 + 0.5 * dual.length * 4;
  const maxKin = kinestheticIds.length * 4;

  const absolute = {
    visual: Math.round((visual / Math.max(1, maxVisual)) * 100),
    auditory: Math.round((auditory / Math.max(1, maxAud)) * 100),
    kinesthetic: Math.round((kinesthetic / Math.max(1, maxKin)) * 100),
  };

  const max = Math.max(visual, auditory, kinesthetic, 1);
  const percent = {
    visual: Math.round((visual / max) * 100),
    auditory: Math.round((auditory / max) * 100),
    kinesthetic: Math.round((kinesthetic / max) * 100),
  };
  const ranking = (Object.keys(percent) as Array<keyof typeof percent>).sort((a, b) => percent[b] - percent[a]);
  return { raw: { visual, auditory, kinesthetic }, percent, absolute, ranking };
}

function computeBigFive(ans: Record<string, any>) {
  let E = 0, O = 0, A = 0, C = 0, N = 0, cntE = 0, cntO = 0, cntA = 0, cntC = 0, cntN = 0;
  const map: Array<[string, "E" | "O" | "A" | "C" | "N", 1 | -1]> = [
    ["p_extraversion_1", "E", 1],
    ["p_introversion_1", "E", -1],
    ["p_agreeableness_1", "A", 1],
    ["p_assertiveness_1", "E", 1],
    ["p_cautious_1", "N", 1],
    ["p_calm_1", "N", -1],
    ["p_expressive_1", "E", 1],
    ["p_boredom_1", "C", -1],
    ["p_detail_1", "C", 1],
    ["p_order_1", "C", 1],
    ["p_openness_1", "O", 1],
    ["p_openness_2", "O", 1],
  ];

  for (const [qid, dim, sign] of map) {
    const s = likertToScore(String(ans[qid] || ""));
    if (dim === "E") { E += sign * s; cntE++; }
    if (dim === "O") { O += sign * s; cntO++; }
    if (dim === "A") { A += sign * s; cntA++; }
    if (dim === "C") { C += sign * s; cntC++; }
    if (dim === "N") { N += sign * s; cntN++; }
  }

  const norm = (v: number, cnt: number) => {
    if (!cnt) return 50;
    const min = -2 * cnt, max = 2 * cnt;
    return Math.round(((v - min) / (max - min)) * 100);
  };

  return {
    raw: { E, O, A, C, N },
    percent: { E: norm(E, cntE), O: norm(O, cntO), A: norm(A, cntA), C: norm(C, cntC), N: norm(N, cntN) },
    counts: { cntE, cntO, cntA, cntC, cntN },
  };
}

function computeEnvironment(ans: Record<string, any>) {
  const ids = ["f_talk_time","f_parent_participation","f_autonomy","f_praise","f_opinion","f_guidance_over_punish","f_routine","f_disclosure"];
  const scores = ids.map((id) => likertToNum(String(ans[id] || "")));
  const sum = scores.reduce((a, b) => a + b, 0);
  const max = ids.length * 4;
  const percent = Math.round((sum / max) * 100);
  let level: "منخفض" | "متوسط" | "عال" = "متوسط";
  if (percent >= 66) level = "عال";
  else if (percent <= 33) level = "منخفض";
  return { supportScore: sum, supportPercent: percent, level };
}

function generateRecommendations(
  miRank: string[],
  vak: ReturnType<typeof computeVAK>,
  big5: ReturnType<typeof computeBigFive>,
  goals: Record<string, any>
) {
  const topMi = miRank.slice(0, 3);
  const vakTop = vak.ranking[0];
  const goal = String(goals.priority_dev || "");
  const lines: string[] = [];

  if (topMi.includes("linguistic")) lines.push("نشّط الجانب اللغوي عبر قصص يومية وسرد أحداث اليوم وتمارين مفردات.");
  if (topMi.includes("logical")) lines.push("أضف ألغازًا رقمية وبازل وأسئلة لماذا؛ واطلب منه شرح طريقة الحل.");
  if (topMi.includes("spatial")) lines.push("وفّر مكعّبات/ليغو وخرائط ذهنية وبطاقات صورتية للتعلّم.");
  if (topMi.includes("musical")) lines.push("استخدم أغانٍ وإيقاعات لحفظ المعلومات ووقتًا للغناء/الإيقاع.");
  if (topMi.includes("bodily")) lines.push("حوّل التعلّم إلى أنشطة حركية قصيرة (قفز عددي، تهجئة بالحركة).");
  if (topMi.includes("interpersonal")) lines.push("فعّل تعلمًا تعاونيًا وأدوارًا اجتماعية وتمثيل مواقف.");
  if (topMi.includes("intrapersonal")) lines.push("دفتر مشاعر وخيارات عمل فردية ووقت هادئ للتفكير.");
  if (topMi.includes("naturalist")) lines.push("خرجات للطبيعة، زراعة نبتة، وتصنيف عناصر من البيئة.");

  if (vakTop === "visual") lines.push("استخدم صورًا وبطاقات وخططًا/خرائط ذهنية وألوانًا كودية.");
  if (vakTop === "auditory") lines.push("اعتمد السرد الشفهي والمناقشة القصيرة والتكرار اللفظي.");
  if (vakTop === "kinesthetic") lines.push("ادمج التجريب باليد ومختبرًا منزليًا وألعاب تركيب.");

  if (big5.percent.N >= 65) lines.push("خفّض مفاجآت الروتين وهيّئ انتقالات سلسة بين الأنشطة.");
  if (big5.percent.C >= 65) lines.push("قسّم المهام لقوائم صغيرة مع متابعة ذاتية وملصقات إنجاز.");
  if (big5.percent.E >= 65) lines.push("ادمج أنشطة جماعية ودور قيادة يتبادلونه.");
  if (big5.percent.A >= 65) lines.push("فعّل مهام تعاونية وتمارين تعاطف موجّهة.");
  if (big5.percent.O >= 65) lines.push("نوّع الوسائط وقدّم تجارب جديدة باستمرار.");

  if (goal.includes("المهارات الاجتماعية")) lines.push("رتّب لعبًا ثنائيًا ثم جماعيًا مع قواعد بسيطة وواضحة.");
  if (goal.includes("ضبط الانفعالات")) lines.push("درّب على تسمية المشاعر وبطاقات حلول بديلة قبل السلوك.");
  if (goal.includes("التحصيل الدراسي")) lines.push("استخدم جلسات قصيرة موقّتة مع مكافآت صغيرة لكل إنجاز.");
  if (goal.includes("الثقة بالنفس")) lines.push("كافئ المحاولة والجهد وليس النتيجة فقط.");
  if (goal.includes("مهارات التواصل")) lines.push("قصص أدوار وأسئلة مفتوحة لتوسيع الحوار.");
  if (goal.includes("الاستقلالية")) lines.push("سلّم مهام روتينية يومية بتسلسل بصري (تحضير الحقيبة/اللبس).");

  return lines.slice(0, 8);
}

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
      // 1) احسب النتائج
      const { result: miRes, ranking: miRanking } = computeMiScores(answers);
      const vak = computeVAK(answers);
      const big5 = computeBigFive(answers);
      const env = computeEnvironment(answers);
      const recs = generateRecommendations(miRanking, vak, big5, { priority_dev: answers["priority_dev"] });

      // 2) مسطّح للإرسال
      const miFlat: Record<string, string | number> = {};
      Object.entries(miRes).forEach(([cat, v]) => {
        miFlat[`mi_${cat}_sum`] = v.sum;
        miFlat[`mi_${cat}_max`] = v.max;
        miFlat[`mi_${cat}_percent`] = v.percent;
      });
      miFlat["mi_rank_1"] = miRanking[0] ?? "";
      miFlat["mi_rank_2"] = miRanking[1] ?? "";
      miFlat["mi_rank_3"] = miRanking[2] ?? "";

      const vakFlat = {
        vak_visual_rel: vak.percent.visual,
        vak_auditory_rel: vak.percent.auditory,
        vak_kinesthetic_rel: vak.percent.kinesthetic,
        vak_visual_abs: vak.absolute.visual,
        vak_auditory_abs: vak.absolute.auditory,
        vak_kinesthetic_abs: vak.absolute.kinesthetic,
        vak_top: vak.ranking[0] ?? "",
      };
      const big5Flat = {
        big5_E: big5.percent.E, big5_O: big5.percent.O, big5_A: big5.percent.A, big5_C: big5.percent.C, big5_N: big5.percent.N
      };
      const envFlat = {
        env_support_score: env.supportScore, env_support_percent: env.supportPercent, env_level: env.level
      };
      const recsFlat: Record<string, string> = {};
      recs.forEach((r, i) => (recsFlat[`rec_${i + 1}`] = r));

      const flatAnswers = { ...answers, ...miFlat, ...vakFlat, ...big5Flat, ...envFlat, ...recsFlat };

      // 3) حمولة موّحدة
      const payload = {
        answers: flatAnswers,
        meta: {
          progress: `${step + 1}/${totalSteps}`,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          locale: typeof navigator !== "undefined" ? navigator.language : "ar",
        },
        results: { mi: { result: miRes, ranking: miRanking }, vak, big5, environment: env, recs },
      };

      // 4) حفظ محلي دائم
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

      // 5) محاولة مزامنة Google Sheets — لا توقف التجربة عند الفشل
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

      // 6) الانتقال لصفحة النتائج (يظهر POST أولًا في Network)
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
          <h1 className="sr-only">أرومة</h1>
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
