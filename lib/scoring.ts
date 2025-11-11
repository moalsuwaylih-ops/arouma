// lib/scoring.ts

// ============ الأنواع ============
export type MiKey =
  | "linguistic"
  | "logical"
  | "spatial"
  | "musical"
  | "bodily"
  | "interpersonal"
  | "intrapersonal"
  | "naturalist";

export type VakKey = "visual" | "auditory" | "kinesthetic";
export type Big5Key = "E" | "O" | "A" | "C" | "N";

export interface AroumaProfile {
  miPercents: Partial<Record<MiKey, number>>;
  miRanking: MiKey[];
  vak: { percent: Record<VakKey, number>; absolute: Record<VakKey, number>; top: VakKey };
  big5: Record<Big5Key, number>;
  environment: { supportPercent: number; supportScore?: number; level: "منخفض" | "متوسط" | "عال" };
  recs: string[];
  meta?: { submittedAt?: string; locale?: string };
}

// ============ عناوين العرض ============
export const MI_LABELS: Record<MiKey, string> = {
  linguistic: "لغوي",
  logical: "منطقي",
  spatial: "بصري",
  musical: "موسيقي",
  bodily: "حركي",
  interpersonal: "اجتماعي",
  intrapersonal: "تأمّلي",
  naturalist: "طبيعي",
};

export const VAK_LABELS: Record<VakKey, string> = {
  visual: "بصري (يتعلم بالصور والألوان)",
  auditory: "سمعي (يتعلم بالاستماع)",
  kinesthetic: "حركي (يتعلم بالتجربة والحركة)",
};

export const BIG5_LABELS: Record<Big5Key, string> = {
  E: "الانبساط (ميل للتفاعل والانفتاح الاجتماعي)",
  O: "الانفتاح (حب التجارب والأفكار الجديدة)",
  A: "التوافقية (التعاون واللطف مع الآخرين)",
  C: "الاجتهاد والانضباط (التركيز والمسؤولية)",
  N: "الاستقرار الانفعالي (الهدوء والتحكم بالعواطف)",
};

// ============ أدوات عامة ============
export function band(p: number): "منخفض" | "متوسط" | "عال" {
  if (p >= 67) return "عال";
  if (p <= 33) return "منخفض";
  return "متوسط";
}

export function clamp0_100(x: number): number {
  if (Number.isNaN(x) || !Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

export function pct(n: number | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `${Math.round(n)}%`;
}

function safeParse<T = unknown>(text: string | null): T | null {
  if (!text) return null;
  try { return JSON.parse(text) as T; } catch { return null; }
}

// ============ تحويلات Likert ============
const LIKERT_5 = ["أبدًا", "نادرًا", "أحيانًا", "غالبًا", "دائمًا"];
function likertToNum(v: string): number { const i = LIKERT_5.indexOf((v || "").trim()); return i >= 0 ? i : 0; } // 0..4
function likertToScore(v: string): number { return likertToNum(v) - 2; } // -2..+2

// ============ خرائط الأسئلة ============
const MI_FROM_INTERESTS: Record<string, MiKey> = {
  i_music: "musical",
  i_physical: "bodily",
  i_puzzles: "logical",
  i_nature: "naturalist",
  i_art: "spatial",
  i_storytelling: "linguistic",
  i_team: "interpersonal",
  i_introspective: "intrapersonal",
};

const VAK_IDS = {
  visual: ["l_visual_1", "l_visual_2", "l_visual_3", "l_imagery_1"],
  auditory: ["l_auditory_1", "l_auditory_2"],
  kinesthetic: ["l_kinesthetic_1", "l_kinesthetic_2", "l_hands_on_1", "l_modeling_1"],
  dual: ["l_media_1", "l_dual_1"], // تُحسب 0.5 لكل من البصري والسمعي
};

const BIG5_MAP: Array<[string, Big5Key, 1 | -1]> = [
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

const ENV_IDS = [
  "f_talk_time","f_parent_participation","f_autonomy","f_praise",
  "f_opinion","f_guidance_over_punish","f_routine","f_disclosure",
];

// ============ حساب الذكاءات المتعددة ============
function computeMi(answers: Record<string, any>) {
  const totals: Partial<Record<MiKey, number>> = {};
  const counts: Partial<Record<MiKey, number>> = {};

  Object.entries(MI_FROM_INTERESTS).forEach(([qid, cat]) => {
    const score = likertToNum(String(answers[qid] || "")) + 1; // 1..5
    totals[cat] = (totals[cat] || 0) + score;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const result = {} as Record<MiKey, { sum: number; max: number; percent: number }>;
  (Object.values(MI_FROM_INTERESTS) as MiKey[]).forEach((cat) => {
    const sum = totals[cat] || 0;
    const max = (counts[cat] || 0) * 5;
    result[cat] = { sum, max, percent: max ? Math.round((sum / max) * 100) : 0 };
  });

  const ranking = (Object.entries(result) as [MiKey, { percent: number; sum: number }][]).sort(
    (a, b) => b[1].percent - a[1].percent || b[1].sum - a[1].sum
  ).map(([k]) => k);

  const percents: Partial<Record<MiKey, number>> = {};
  (Object.keys(result) as MiKey[]).forEach((k) => (percents[k] = result[k].percent));
  return { result, ranking, percents };
}

// ============ حساب VAK ============
function computeVAK(answers: Record<string, any>) {
  const sum = (ids: string[]) => ids.reduce((s, id) => s + likertToNum(String(answers[id] || "")), 0);

  let visual = sum(VAK_IDS.visual) + 0.5 * sum(VAK_IDS.dual);
  let auditory = sum(VAK_IDS.auditory) + 0.5 * sum(VAK_IDS.dual);
  let kinesthetic = sum(VAK_IDS.kinesthetic);

  const maxVisual = VAK_IDS.visual.length * 4 + 0.5 * VAK_IDS.dual.length * 4;
  const maxAud = VAK_IDS.auditory.length * 4 + 0.5 * VAK_IDS.dual.length * 4;
  const maxKin = VAK_IDS.kinesthetic.length * 4;

  const absolute = {
    visual: Math.round((visual / Math.max(1, maxVisual)) * 100),
    auditory: Math.round((auditory / Math.max(1, maxAud)) * 100),
    kinesthetic: Math.round((kinesthetic / Math.max(1, maxKin)) * 100),
  } as Record<VakKey, number>;

  const max = Math.max(visual, auditory, kinesthetic, 1);
  const percent = {
    visual: Math.round((visual / max) * 100),
    auditory: Math.round((auditory / max) * 100),
    kinesthetic: Math.round((kinesthetic / max) * 100),
  } as Record<VakKey, number>;

  const ranking = (Object.keys(percent) as VakKey[]).sort((a, b) => percent[b] - percent[a]);
  const top = ranking[0];

  return { raw: { visual, auditory, kinesthetic }, percent, absolute, ranking, top };
}

// ============ حساب Big Five ============
function computeBig5(answers: Record<string, any>) {
  let E = 0, O = 0, A = 0, C = 0, N = 0;
  let cntE = 0, cntO = 0, cntA = 0, cntC = 0, cntN = 0;

  for (const [qid, dim, sign] of BIG5_MAP) {
    const s = likertToScore(String(answers[qid] || ""));
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

// ============ البيئة الأسرية ============
function computeEnvironment(answers: Record<string, any>) {
  const scores = ENV_IDS.map((id) => likertToNum(String(answers[id] || "")));
  const sum = scores.reduce((a, b) => a + b, 0);
  const max = ENV_IDS.length * 4;
  const supportPercent = Math.round((sum / Math.max(1, max)) * 100);
  return { supportScore: sum, supportPercent, level: band(supportPercent) as AroumaProfile["environment"]["level"] };
}

// ============ توصيات قصيرة ============
function generateRecs(
  miRank: MiKey[],
  vakTop: VakKey,
  big5Perc: Record<Big5Key, number>,
  goal: string
) {
  const lines: string[] = [];
  if (miRank.slice(0, 3).includes("linguistic")) lines.push("نشّط الجانب اللغوي عبر قصص يومية وسرد أحداث اليوم وتمارين مفردات.");
  if (miRank.slice(0, 3).includes("logical")) lines.push("أضف ألغازًا رقمية وبازل وأسئلة لماذا؛ واطلب منه شرح طريقة الحل.");
  if (miRank.slice(0, 3).includes("spatial")) lines.push("وفّر مكعّبات/ليغو وخرائط ذهنية وبطاقات صورتية للتعلّم.");
  if (miRank.slice(0, 3).includes("musical")) lines.push("استخدم أغانٍ وإيقاعات لحفظ المعلومات ووقتًا للغناء/الإيقاع.");
  if (miRank.slice(0, 3).includes("bodily")) lines.push("حوّل التعلّم إلى أنشطة حركية قصيرة (قفز عددي، تهجئة بالحركة).");
  if (miRank.slice(0, 3).includes("interpersonal")) lines.push("فعّل تعلمًا تعاونيًا وأدوارًا اجتماعية وتمثيل مواقف.");
  if (miRank.slice(0, 3).includes("intrapersonal")) lines.push("دفتر مشاعر وخيارات عمل فردية ووقت هادئ للتفكير.");
  if (miRank.slice(0, 3).includes("naturalist")) lines.push("خرجات للطبيعة، زراعة نبتة، وتصنيف عناصر من البيئة.");

  if (vakTop === "visual") lines.push("استخدم صورًا وبطاقات وخططًا/خرائط ذهنية وألوانًا كودية.");
  if (vakTop === "auditory") lines.push("اعتمد السرد الشفهي والمناقشة القصيرة والتكرار اللفظي.");
  if (vakTop === "kinesthetic") lines.push("ادمج التجريب باليد ومختبرًا منزليًا وألعاب تركيب.");

  if (big5Perc.N >= 65) lines.push("خفّض مفاجآت الروتين وهيّئ انتقالات سلسة بين الأنشطة.");
  if (big5Perc.C >= 65) lines.push("قسّم المهام لقوائم صغيرة مع متابعة ذاتية وملصقات إنجاز.");
  if (big5Perc.E >= 65) lines.push("ادمج أنشطة جماعية ودور قيادة يتبادلونه.");
  if (big5Perc.A >= 65) lines.push("فعّل مهام تعاونية وتمارين تعاطف موجّهة.");
  if (big5Perc.O >= 65) lines.push("نوّع الوسائط وقدّم تجارب جديدة باستمرار.");

  if (goal.includes("المهارات الاجتماعية")) lines.push("رتّب لعبًا ثنائيًا ثم جماعيًا مع قواعد بسيطة وواضحة.");
  if (goal.includes("ضبط الانفعالات")) lines.push("درّب على تسمية المشاعر وبطاقات حلول بديلة قبل السلوك.");
  if (goal.includes("التحصيل الدراسي")) lines.push("استخدم جلسات قصيرة موقّتة مع مكافآت صغيرة لكل إنجاز.");
  if (goal.includes("الثقة بالنفس")) lines.push("كافئ المحاولة والجهد وليس النتيجة فقط.");
  if (goal.includes("مهارات التواصل")) lines.push("قصص أدوار وأسئلة مفتوحة لتوسيع الحوار.");
  if (goal.includes("الاستقلالية")) lines.push("سلّم مهام روتينية يومية بتسلسل بصري (تحضير الحقيبة/اللبس).");

  return lines.slice(0, 8);
}

// ============ الدالة الرئيسية: تُرجِع نتائج + حقول مسطّحة جاهزة للتخزين ============
export function scoreArouma(answers: Record<string, any>) {
  // 1) حسابات
  const mi = computeMi(answers);
  const vak = computeVAK(answers);
  const big5 = computeBig5(answers);
  const environment = computeEnvironment(answers);
  const goal = String(answers["priority_dev"] || "");
  const recs = generateRecs(mi.ranking, vak.top, big5.percent, goal);

  // 2) النتائج (بالشكل الذي تستخدمه صفحات النتائج الحالية)
  const results = {
    mi: { result: mi.result, ranking: mi.ranking },
    vak: { raw: vak.raw, percent: vak.percent, absolute: vak.absolute, ranking: vak.ranking },
    big5,
    environment,
    recs,
  };

  // 3) حقول مسطّحة (للتخزين في Google Sheets أو الدمج مع answers)
  const miFlat: Record<string, string | number> = {};
  (Object.entries(mi.result) as [MiKey, { sum: number; max: number; percent: number }][]).forEach(([cat, v]) => {
    miFlat[`mi_${cat}_sum`] = v.sum;
    miFlat[`mi_${cat}_max`] = v.max;
    miFlat[`mi_${cat}_percent`] = v.percent;
  });
  miFlat["mi_rank_1"] = mi.ranking[0] ?? "";
  miFlat["mi_rank_2"] = mi.ranking[1] ?? "";
  miFlat["mi_rank_3"] = mi.ranking[2] ?? "";

  const vakFlat = {
    vak_visual_rel: vak.percent.visual,
    vak_auditory_rel: vak.percent.auditory,
    vak_kinesthetic_rel: vak.percent.kinesthetic,
    vak_visual_abs: vak.absolute.visual,
    vak_auditory_abs: vak.absolute.auditory,
    vak_kinesthetic_abs: vak.absolute.kinesthetic,
    vak_top: vak.top ?? "",
  };
  const big5Flat = {
    big5_E: big5.percent.E, big5_O: big5.percent.O, big5_A: big5.percent.A, big5_C: big5.percent.C, big5_N: big5.percent.N
  };
  const envFlat = {
    env_support_score: environment.supportScore, env_support_percent: environment.supportPercent, env_level: environment.level
  };
  const recsFlat: Record<string, string> = {};
  recs.forEach((r, i) => (recsFlat[`rec_${i + 1}`] = r));

  const flat = { ...miFlat, ...vakFlat, ...big5Flat, ...envFlat, ...recsFlat };

  return { results, flat };
}

// ============ قراءة التخزين المحلي كـ Profile للعرض (كما هو في نتائجك) ============
export function readStoredProfile(): AroumaProfile | null {
  if (typeof window === "undefined") return null;

  type Raw = {
    mi?: { result?: Record<MiKey, { sum: number; max: number; percent: number }>; ranking?: MiKey[] };
    vak?: { percent?: Record<VakKey, number>; absolute?: Record<VakKey, number>; ranking?: VakKey[] };
    big5?: { raw?: any; percent?: Record<Big5Key, number>; counts?: any };
    environment?: { supportScore?: number; supportPercent?: number; level?: "منخفض" | "متوسط" | "عال" };
    recs?: string[];
  };

  const raw = safeParse<Raw>(localStorage.getItem("arouma_last_results"));
  if (!raw) return null;

  const miPercents: Partial<Record<MiKey, number>> = {};
  if (raw.mi?.result) (Object.keys(raw.mi.result) as MiKey[]).forEach((k) => { miPercents[k] = clamp0_100(raw.mi!.result![k].percent); });
  const miRanking: MiKey[] = (raw.mi?.ranking ?? []) as MiKey[];

  const vakPercent = {
    visual: clamp0_100(raw.vak?.percent?.visual ?? 0),
    auditory: clamp0_100(raw.vak?.percent?.auditory ?? 0),
    kinesthetic: clamp0_100(raw.vak?.percent?.kinesthetic ?? 0),
  } as Record<VakKey, number>;

  const vakAbsolute = {
    visual: clamp0_100(raw.vak?.absolute?.visual ?? 0),
    auditory: clamp0_100(raw.vak?.absolute?.auditory ?? 0),
    kinesthetic: clamp0_100(raw.vak?.absolute?.kinesthetic ?? 0),
  } as Record<VakKey, number>;

  const vakTop: VakKey =
    (raw.vak?.ranking?.[0] as VakKey) ??
    (Object.entries(vakPercent).sort((a, b) => b[1] - a[1])[0]?.[0] as VakKey) ??
    "visual";

  const big5: Record<Big5Key, number> = {
    E: clamp0_100(raw.big5?.percent?.E ?? 50),
    O: clamp0_100(raw.big5?.percent?.O ?? 50),
    A: clamp0_100(raw.big5?.percent?.A ?? 50),
    C: clamp0_100(raw.big5?.percent?.C ?? 50),
    N: clamp0_100(raw.big5?.percent?.N ?? 50),
  };

  const env = {
    supportPercent: clamp0_100(raw.environment?.supportPercent ?? 50),
    supportScore: raw.environment?.supportScore,
    level: raw.environment?.level ?? band(clamp0_100(raw.environment?.supportPercent ?? 50)),
  } as AroumaProfile["environment"];

  const recs: string[] = Array.isArray(raw.recs) ? raw.recs.filter(Boolean) : [];

  const profile: AroumaProfile = {
    miPercents,
    miRanking,
    vak: { percent: vakPercent, absolute: vakAbsolute, top: vakTop },
    big5,
    environment: env,
    recs,
  };

  return profile;
}
