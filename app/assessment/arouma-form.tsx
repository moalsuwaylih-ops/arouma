"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ================== الأنواع & الداتا ================== */
export type QuestionType = "single" | "multi" | "text" | "email" | "phone";

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: string[]; // لأسئلة الاختيار
  helper?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

type Ans = Record<string, string | string[]>;

export const formSections: Section[] = [
  {
    id: "intro",
    title: "اختبار أرومة",
    description:
      "🟣 أهلاً بكم في منصة أرومة.\nعدد الأقسام: 8 — عدد الأسئلة: 48 — الوقت: 10–15 دقيقة.\nأجب بصدق؛ البيانات سرية وتُستخدم للتقييم فقط.",
    questions: [
      { id: "respondent_role", title: "من يجيب على هذا النموذج؟", type: "single", required: true, options: ["الأم", "الأب", "ولي أمر آخر"] },
      { id: "guardian_name", title: "اسم ولي الأمر", type: "text", required: true },
      { id: "familiarity", title: "مدى المعرفة بالطفل", type: "single", required: true, options: ["ممتازة", "جيدة جداً", "متوسطة", "ضعيفة"] },
      { id: "phone", title: "رقم الجوال", type: "phone", required: true },
      { id: "email", title: "البريد الإلكتروني", type: "email", required: true },
      { id: "child_name", title: "اسم الطفل", type: "text", required: true },
    ],
  },
  {
    id: "basic",
    title: "القسم الأول: بيانات أساسية عن الطفل",
    questions: [
      { id: "age", title: "عمر الطفل", type: "single", required: true, options: ["أقل من 4 سنوات", "4–6 سنوات", "7–9 سنوات", "10–13 سنة"] },
      { id: "gender", title: "الجنس", type: "single", required: true, options: ["ذكر", "أنثى"] },
      {
        id: "grade",
        title: "المرحلة الدراسية",
        type: "single",
        required: true,
        options: [
          "لم يبدأ المدرسة (أقل من روضة)",
          "روضة أو تمهيدي",
          "الصف الأول الابتدائي",
          "الصف الثاني الابتدائي",
          "الصف الثالث الابتدائي",
          "الصف الرابع الابتدائي",
          "الصف الخامس الابتدائي",
          "الصف السادس الابتدائي",
        ],
      },
      {
        id: "diagnosis",
        title: "هل لدى الطفل أي احتياجات خاصة أو تشخيصات تعليمية أو سلوكية؟ (اكتبها إن وجدت)",
        type: "text",
        required: false,
      },
      { id: "therapy", title: "هل يتناول الطفل أي علاج نفسي أو دوائي حالياً؟", type: "single", required: true, options: ["نعم", "لا"] },
    ],
  },
  {
    id: "personality",
    title: "القسم الثاني: وصف شخصية الطفل العامة",
    questions: [
      {
        id: "overall_trait",
        title: "كيف تصف شخصية طفلك بشكل عام؟ (الصفة الأقرب)",
        type: "single",
        required: true,
        options: [
          "هادئ ومتحفظ",
          "اجتماعي ويحب التفاعل",
          "خجول ويتردد في التفاعل",
          "حساس وعاطفي",
          "قيادي ومبادر",
          "متعاون ويحب العمل الجماعي",
          "مستقل ويفضل إنجاز المهام بنفسه",
        ],
      },
      {
        id: "change_response",
        title: "كيف يستجيب طفلك للمواقف الجديدة أو التغيرات المفاجئة؟",
        type: "single",
        required: true,
        options: ["يتأقلم بسرعة دون قلق", "يحتاج إلى بعض الوقت للتأقلم", "يظهر ترددًا أو قلقًا واضحًا", "يرفض التغيير أو ينسحب تمامًا"],
      },
      {
        id: "emotion_expression",
        title: "هل يميل طفلك إلى إظهار عواطفه؟",
        type: "single",
        required: true,
        options: ["نعم، يعبر عنها بوضوح وبكثرة", "أحيانًا، في مواقف محددة فقط", "لا، يميل إلى كتمان مشاعره"],
      },
      {
        id: "free_time",
        title: "عند وجود وقت فراغ، ما نوع الأنشطة التي يفضلها طفلك غالبًا؟",
        type: "single",
        required: true,
        options: [
          "أنشطة هادئة (رسم، قراءة، تركيب مكعبات)",
          "أنشطة حركية (ركض، قفز، ألعاب جسدية)",
          "أنشطة اجتماعية (اللعب مع أطفال آخرين)",
          "أنشطة فردية (اللعب وحده، تأمل، خيال)",
        ],
      },
      {
        id: "mood_stability",
        title: "ما مدى ثبات مزاج طفلك خلال اليوم؟",
        type: "single",
        required: true,
        options: ["ثابت ومزاجه متوازن", "يتقلب قليلًا حسب الموقف", "سريع الانفعال ويصعب التنبؤ بمزاجه"],
      },
      {
        id: "fears",
        title: "هل لدى الطفل أي من هذه المخاوف؟ (اختر ما ينطبق)",
        type: "multi",
        options: [
          "الخوف من الظلام",
          "الأصوات المرتفعة",
          "الحيوانات",
          "الأشخاص الغرباء أو الأماكن الجديدة",
          "القلق عند الانفصال عن الأهل",
          "حساسية من روائح/أقمشة/لمس",
          "لا توجد مخاوف واضحة",
        ],
      },
    ],
  },
  {
    id: "social",
    title: "القسم الثالث: السلوك والتفاعل الاجتماعي",
    questions: [
      {
        id: "initiate_interaction",
        title: "في المدرسة أو المناسبات، كيف يبادر طفلك بالتفاعل؟",
        type: "single",
        required: true,
        options: ["يبدأ بالتحدث واللعب مع الآخرين دون تردد", "يراقب أولاً ثم ينضم تدريجيًا", "ينتظر أن يدعوه الآخرون للمشاركة", "يفضل الانسحاب والبقاء وحده"],
      },
      { id: "rules", title: "كيف يتعامل طفلك مع القواعد والتعليمات الاجتماعية (الدور، الاستئذان...)", type: "single", required: true, options: ["يلتزم بها", "يحتاج تذكيرًا أحيانًا", "غالبًا يخالف القواعد"] },
      { id: "strangers", title: "كيف يتعامل طفلك مع الأشخاص الجدد؟", type: "single", required: true, options: ["يتحدث معهم بسهولة", "يتردد في البداية ثم يعتاد", "يرفض التفاعل ويطلب الانسحاب"] },
      { id: "diversity", title: "استجابة الطفل لأطفال من أعمار/خلفيات مختلفة", type: "single", required: true, options: ["يتقبل الجميع ويتفاعل بسهولة", "يفضل من هم في عمره فقط", "يتجنب من يختلفون عنه"] },
      {
        id: "empathy_behavior",
        title: "تصرفه عند رؤية شخص حزين",
        type: "single",
        required: true,
        options: ["يساعد أو يواسيه", "يتحدث ويسأل ما الأمر", "يُظهر اهتمامًا دون تدخل", "لا يلاحظ", "يبتعد", "يتأثر نفسيًا"],
      },
      {
        id: "friendships",
        title: "ما مدى سهولة تكوين علاقات أو صداقات جديدة؟",
        type: "single",
        required: true,
        options: ["يحب التعرف على أصدقاء جدد دائمًا", "يفضل البقاء مع أصدقائه الحاليين", "لا يهتم كثيرًا", "يجد صعوبة في الحفاظ على الأصدقاء"],
      },
    ],
  },
  {
    id: "learning_styles",
    title: "القسم الرابع: أنماط التعلم المفضلة (VAK)",
    questions: [
      {
        id: "senses",
        title: "أي من الحواس يعتمد عليها طفلك أكثر عند التعلم؟ (يمكن اختيار أكثر من خيار)",
        type: "multi",
        options: ["النظر", "السمع", "الحركة واللمس", "الكتابة أو الرسم", "التكرار اللفظي"],
      },
      { id: "new_skill_approach", title: "عند تعلم مهارة جديدة، كيف يتعامل معها؟", type: "single", required: true, options: ["يريد المشاهدة أولًا", "يجرب مباشرة", "يسأل كثيرًا ويستمع جيدًا", "لا يُظهر رغبة واضحة"] },
      { id: "content_pref", title: "نوع القصص/البرامج المفضلة", type: "single", required: true, options: ["قصص مصورة/رسوم متحركة", "قصص صوتية", "برامج أنشطة وتجارب", "لا يهتم كثيرًا"] },
      { id: "hands_on", title: "هل يُظهر اهتمامًا بتجريب الأشياء بيديه؟ (تركيب، لمس المواد، طين/رمل)", type: "single", required: true, options: ["دائمًا", "أحيانًا", "نادرًا", "لا يهتم"] },
      { id: "best_explain", title: "أفضل أسلوب لشرح شيء للطفل", type: "single", required: true, options: ["صور/رسومات", "الشرح بالكلام/القصة", "أن يجرب بنفسه", "غير واضح بعد"] },
    ],
  },
  {
    id: "multiple_intelligences",
    title: "القسم الخامس: تقييم الذكاءات المتعددة",
    questions: [
      ...[
        "يحب حل الألغاز أو الألعاب الذهنية والمنطقية",
        "يطرح الكثير من الأسئلة ويحب الاكتشاف",
        "يستمتع بالرسم أو التلوين أو الأعمال الفنية",
        "يتذكر القرآن أو الأغاني أو الأناشيد بسرعة",
        "يتذكر الأماكن والاتجاهات جيدًا",
        "يحب العمل مع الآخرين والتعاون",
        "يفضل اللعب منفردًا ولا يمل من الجلوس لوحده",
        "يعبر عن مشاعره بسهولة",
        "يتحرك كثيرًا ويحب الأنشطة البدنية",
        "يحب الحيوانات أو البيئة أو الطبيعة",
        "يظهر تعاطفًا مع مشاعر الآخرين",
        "يحب تأليف القصص أو تمثيلها أو سماعها",
      ].map((t, i) => ({
        id: `mi_${i + 1}`,
        title: t,
        type: "single" as const,
        required: true,
        options: ["دائماً", "أحياناً", "نادراً", "أبداً"],
      })),
    ],
  },
  {
    id: "communication_emotions",
    title: "القسم السادس: التواصل والانفعالات",
    questions: [
      {
        id: "peer_style",
        title: "كيف يتفاعل غالبًا مع الأطفال الآخرين؟",
        type: "single",
        required: true,
        options: [
          "يحب اللعب الجماعي ويشارك",
          "يفضل اللعب الفردي",
          "يقود المجموعة وينظم اللعب",
          "يتبع الآخرين ولا يبادر",
          "يتعاون عند وجود تعليمات واضحة",
          "يُظهر عنادًا أحيانًا",
        ],
      },
      {
        id: "obey_adults",
        title: "استجابته لأوامر/تعليمات البالغين",
        type: "single",
        required: true,
        options: ["يستجيب مباشرة", "يحتاج تكرار التوجيه", "يُظهر مقاومة أحيانًا", "يتجاهل عمدًا", "حسب مزاجه", "بعد شرح السبب والمنطق"],
      },
      {
        id: "express_when_upset",
        title: "عندما يشعر بالحزن/الغضب، كيف يعبّر؟",
        type: "single",
        required: true,
        options: ["بالكلام", "بالبكاء", "بعنف أحيانًا", "بالانسحاب/الصمت", "بالرسم/الكتابة/اللعب", "لا يعبّر بسهولة"],
      },
      {
        id: "conflict_style",
        title: "عند خلاف مع طفل آخر، السلوك الغالب؟",
        type: "single",
        required: true,
        options: ["يحاول الحل بالكلام", "يغضب أو ينسحب فورًا", "يشتكي لشخص بالغ", "يدافع جسديًا", "يتجاهل", "يعتمد على الآخر"],
      },
      {
        id: "empathy_level",
        title: "ما مدى قدرته على التعاطف؟",
        type: "single",
        required: true,
        options: [
          "يلاحظ ويتفاعل بسهولة",
          "يتعاطف مع القريبين فقط",
          "لا يهتم كثيرًا",
          "أحيانًا حسب حالته النفسية",
          "يسخر/يستهين بمشاعر غيره",
          "يحتاج تذكيرًا للتفهم",
        ],
      },
      {
        id: "mood_swings",
        title: "هل يُظهر تقلبات في المزاج؟",
        type: "single",
        required: true,
        options: ["نادرًا، مزاجه مستقر", "انفعالات شديدة أحيانًا", "يتنقل بين مشاعر بسرعة", "استجابات متوازنة", "يتوتر في التغيير/الضغط", "يصعب التنبؤ بردود فعله"],
      },
    ],
  },
  {
    id: "family_environment",
    title: "القسم السابع: البيئة الأسرية والدعم",
    questions: [
      { id: "main_caregiver", title: "من أكثر شخص يقضي معه الطفل معظم الوقت؟", type: "single", required: true, options: ["الأم", "الأب", "الجد/الجدة", "المربية", "الإخوة", "شخص آخر"] },
      {
        id: "relationship_quality",
        title: "كيف تصف علاقتك بالطفل؟",
        type: "single",
        required: true,
        options: ["قوية جدًا ومليئة بالثقة", "جيدة وفيها تواصل", "متوترة أو متقلبة", "محدودة بسبب ظروف", "لا توجد علاقة مباشرة"],
      },
      {
        id: "daily_time",
        title: "هل تخصص وقتًا يوميًا للعب/الحديث معه؟",
        type: "single",
        required: true,
        options: ["يوميًا ومنتظم", "نعم ولكن ليس كل يوم", "نادرًا", "لا وقت منتظم", "يعتمد على الفراغ"],
      },
      {
        id: "decisions",
        title: "من يتخذ القرارات التربوية؟",
        type: "single",
        required: true,
        options: ["أحد الوالدين", "كلا الوالدين", "الجد/الجدة", "المربية", "لا نمط محدد", "لا قرارات واضحة"],
      },
      {
        id: "parenting_style",
        title: "أسلوب التربية الغالب في المنزل",
        type: "single",
        required: true,
        options: ["حازم مع حوار", "صارم يعتمد على العقاب", "متساهل غالبًا بدون حدود", "متوازن ومرن", "غير واضح/غير متماسك"],
      },
      {
        id: "behavior_handling",
        title: "عند ظهور مشكلات سلوكية، كيف يتم التعامل؟",
        type: "single",
        required: true,
        options: ["التحدث وشرح الخطأ", "العقاب المباشر", "التجاهل", "التهديد/الصراخ", "اللجوء لجهة أخرى"],
      },
    ],
  },
  {
    id: "goals",
    title: "القسم الثامن: الطموحات والأهداف التربوية",
    questions: [
      {
        id: "priority_dev",
        title: "أكثر جانب ترغب في تنميته",
        type: "single",
        required: true,
        options: [
          "تعزيز المهارات الاجتماعية",
          "ضبط الانفعالات",
          "رفع التحصيل الدراسي",
          "تنمية الثقة بالنفس",
          "تطوير مهارات التواصل",
          "زيادة الاستقلالية",
          "لا أعلم، أحتاج توجيهًا",
        ],
      },
      {
        id: "activities_wanted",
        title: "نوع الأنشطة المرغوبة بشكل منتظم",
        type: "multi",
        options: ["أنشطة رياضية أو حركية", "أنشطة فنية", "أنشطة ذهنية", "أنشطة اجتماعية", "دورات مهارية", "أنشطة دينية أو قيمية", "لا أعلم"],
      },
      {
        id: "plan_interest",
        title: "مدى اهتمامك بالحصول على خطة تعليمية/تربوية مخصصة تساعد في تنمية طفلك",
        type: "single",
        required: true,
        options: ["مهتم جدًا وأرغب بتنفيذها الآن", "مهتم وأحتاج توضيحًا", "مهتم على المدى الطويل", "غير مهتم حاليًا", "لست متأكدًا"],
      },
    ],
  },
  { id: "final", title: "خاتمة الاستبانة", questions: [{ id: "notes", title: "هل لديك أي ملاحظات إضافية أو معلومات تود مشاركتها؟", type: "text" }] },
];

/* ================== دوال مساعدة ================== */
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function isValidPhone(v: string) { const digits = v.replace(/[^\d]/g, ""); return digits.length >= 8; }

/* ======== MI (الذكاءات المتعددة) ======== */
const MI_CATEGORY_MAP: Record<string, string> = {
  mi_1: "logical", mi_2: "logical",
  mi_3: "spatial", mi_4: "musical", mi_5: "spatial",
  mi_6: "interpersonal", mi_7: "intrapersonal", mi_8: "intrapersonal",
  mi_9: "bodily", mi_10: "naturalist", mi_11: "interpersonal", mi_12: "linguistic",
};
const MI_SCORE_MAP: Record<string, number> = { "دائماً": 4, "أحياناً": 3, "نادراً": 2, "أبداً": 1 };
const MI_MAX_ITEMS: Record<string, number> = {
  logical: 2, spatial: 2, musical: 1, bodily: 1, interpersonal: 2, intrapersonal: 2, naturalist: 1, linguistic: 1,
};

function computeMiScores(ans: Record<string, any>) {
  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};

  Object.entries(ans).forEach(([qid, val]) => {
    if (!qid.startsWith("mi_")) return;
    const cat = MI_CATEGORY_MAP[qid];
    if (!cat) return;
    const score = MI_SCORE_MAP[(val ?? "") as string] ?? 0;
    totals[cat] = (totals[cat] || 0) + score;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const result: Record<string, { sum: number; max: number; percent: number }> = {};
  Object.keys(MI_MAX_ITEMS).forEach((cat) => {
    const sum = totals[cat] || 0;
    const max = (counts[cat] || 0) * 4 || (MI_MAX_ITEMS[cat] * 4);
    const percent = max ? Math.round((sum / max) * 100) : 0;
    result[cat] = { sum, max, percent };
  });

  const ranking = Object.entries(result).sort((a, b) => b[1].percent - a[1].percent || b[1].sum - a[1].sum).map(([cat]) => cat);
  return { result, ranking };
}

/* ======== VAK ======== */
function computeVAK(ans: Record<string, any>) {
  const selected = new Set<string>(Array.isArray(ans.senses) ? ans.senses : []);
  const vak = {
    visual: Number(selected.has("النظر")) + Number(selected.has("الكتابة أو الرسم")),
    auditory: Number(selected.has("السمع")) + Number(selected.has("التكرار اللفظي")),
    kinesthetic: Number(selected.has("الحركة واللمس")),
  };
  const best = String(ans.best_explain || "");
  if (best.includes("صور") || best.includes("رسومات")) vak.visual += 1;
  if (best.includes("الشرح بالكلام") || best.includes("القصة")) vak.auditory += 1;
  if (best.includes("يجرب")) vak.kinesthetic += 1;

  const max = Math.max(vak.visual, vak.auditory, vak.kinesthetic, 1);
  const percent = {
    visual: Math.round((vak.visual / max) * 100),
    auditory: Math.round((vak.auditory / max) * 100),
    kinesthetic: Math.round((vak.kinesthetic / max) * 100),
  };
  const ranking = (Object.keys(percent) as Array<keyof typeof percent>).sort((a, b) => percent[b] - percent[a]);
  return { raw: vak, percent, ranking };
}

/* ======== Big Five (تقريبي لـ MVP) ======== */
function computeBigFive(ans: Record<string, any>) {
  let E = 0, O = 0, A = 0, C = 0, N = 0, cntE = 0, cntO = 0, cntA = 0, cntC = 0, cntN = 0;

  if (ans.overall_trait) {
    const m: Record<string, Partial<Record<'E'|'O'|'A'|'C', number>>> = {
      "اجتماعي ويحب التفاعل": { E: 2 },
      "خجول ويتردد في التفاعل": { E: -2 },
      "قيادي ومبادر": { E: 1, C: 1 },
      "متعاون ويحب العمل الجماعي": { A: 2 },
      "مستقل ويفضل إنجاز المهام بنفسه": { C: 1, O: 1 },
      "حساس وعاطفي": { N: 1, A: 1 },
      "هادئ ومتحفظ": { E: -1 },
    };
    const w = m[String(ans.overall_trait)];
    if (w) { E += w.E || 0; O += w.O || 0; A += w.A || 0; C += w.C || 0; cntE++; cntO++; cntA++; cntC++; }
  }

  if (ans.change_response) {
    const m = {
      "يتأقلم بسرعة دون قلق": { N: -2, C: 1 },
      "يحتاج إلى بعض الوقت للتأقلم": { N: -1 },
      "يظهر ترددًا أو قلقًا واضحًا": { N: 1 },
      "يرفض التغيير أو ينسحب تمامًا": { N: 2, C: -1 },
    } as any;
    const w = m[String(ans.change_response)];
    if (w) { N += w.N || 0; C += w.C || 0; cntN++; cntC++; }
  }

  if (ans.emotion_expression) {
    const m = {
      "نعم، يعبر عنها بوضوح وبكثرة": { N: 1, A: 1 },
      "أحيانًا، في مواقف محددة فقط": { N: 0 },
      "لا، يميل إلى كتمان مشاعره": { N: -1 },
    } as any;
    const w = m[String(ans.emotion_expression)];
    if (w) { N += w.N || 0; A += w.A || 0; cntN++; cntA++; }
  }

  if (ans.free_time) {
    const m = {
      "أنشطة هادئة (رسم، قراءة، تركيب مكعبات)": { O: 1 },
      "أنشطة حركية (ركض، قفز، ألعاب جسدية)": { E: 1 },
      "أنشطة اجتماعية (اللعب مع أطفال آخرين)": { E: 2 },
      "أنشطة فردية (اللعب وحده، تأمل، خيال)": { O: 1, E: -1 },
    } as any;
    const w = m[String(ans.free_time)];
    if (w) { O += w.O || 0; E += w.E || 0; cntO++; cntE++; }
  }

  if (ans.mood_stability) {
    const m = { "ثابت ومزاجه متوازن": -2, "يتقلب قليلًا حسب الموقف": -1, "سريع الانفعال ويصعب التنبؤ بمزاجه": 2 } as any;
    N += m[String(ans.mood_stability)] ?? 0; cntN++;
  }

  if (ans.rules) {
    const m = { "يلتزم بها": 2, "يحتاج تذكيرًا أحيانًا": 0, "غالبًا يخالف القواعد": -2 } as any;
    C += m[String(ans.rules)] ?? 0; cntC++;
  }

  if (ans.empathy_behavior) {
    const m = {
      "يساعد أو يواسيه": 2,
      "يتحدث ويسأل ما الأمر": 1,
      "يُظهر اهتمامًا دون تدخل": 0,
      "لا يلاحظ": -1,
      "يبتعد": -2,
      "يتأثر نفسيًا": 1,
    } as any;
    A += m[String(ans.empathy_behavior)] ?? 0; cntA++;
  }
  if (ans.empathy_level) {
    const m = {
      "يلاحظ ويتفاعل بسهولة": 2,
      "يتعاطف مع القريبين فقط": 0,
      "لا يهتم كثيرًا": -1,
      "أحيانًا حسب حالته النفسية": 0,
      "يسخر/يستهين بمشاعر غيره": -2,
      "يحتاج تذكيرًا للتفهم": -1,
    } as any;
    A += m[String(ans.empathy_level)] ?? 0; cntA++;
  }

  function norm(v: number, cnt: number) {
    if (!cnt) return 50;
    const min = -2 * cnt, max = 2 * cnt;
    const p = (v - min) / (max - min);
    return Math.round(p * 100);
  }
  const percent = { E: norm(E, cntE), O: norm(O, cntO), A: norm(A, cntA), C: norm(C, cntC), N: norm(N, cntN) };
  return { raw: { E, O, A, C, N }, percent, counts: { cntE, cntO, cntA, cntC, cntN } };
}

/* ======== بيئة Bronfenbrenner (تلخيص مؤشرات) ======== */
function computeEnvironment(ans: Record<string, any>) {
  const relation = String(ans.relationship_quality || "");
  const daily = String(ans.daily_time || "");
  const parenting = String(ans.parenting_style || "");
  const decisions = String(ans.decisions || "");
  let support = 0;

  if (relation.includes("قوية")) support += 2;
  else if (relation.includes("جيدة")) support += 1;

  if (daily.includes("يوميًا")) support += 2;
  else if (daily.includes("نعم ولكن")) support += 1;

  if (parenting.includes("حازم") || parenting.includes("متوازن")) support += 2;

  if (decisions.includes("كلا الوالدين")) support += 1;

  const percent = Math.round((support / 7) * 100);
  let level = "متوسط";
  if (percent >= 70) level = "عالي";
  else if (percent <= 35) level = "منخفض";

  return { supportScore: support, supportPercent: percent, level };
}

/* ======== توليد توصيات نصية مختصرة ======== */
function generateRecommendations(
  miRank: string[],
  vak: ReturnType<typeof computeVAK>,
  big5: ReturnType<typeof computeBigFive>,
  goals: Record<string, any>
) {
  const topMi = miRank.slice(0, 3);
  const vakTop = vak.ranking[0]; // "visual" | "auditory" | "kinesthetic"
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
  if (vakTop === "kinesthetic") lines.push("ادمج التجريب باليد ومختبر منزلي وألعاب تركيب.");

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

/* ================== المكون الرئيسي ================== */
export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Ans>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // تحميل محلي
  useEffect(() => {
    try {
      const saved = localStorage.getItem("arouma_answers");
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, []);

  // حفظ محلي مع debounce
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem("arouma_answers", JSON.stringify(answers));
      } catch {}
    }, 300);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [answers]);

  // تمرير لأعلى عند تغيير القسم
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const totalSteps = formSections.length;
  const current = formSections[step];

  const requiredIds = useMemo(
    () => current.questions.filter((q) => q.required).map((q) => q.id),
    [current]
  );

  const isStepValid = useMemo(() => {
    return requiredIds.every((id) => {
      const q = current.questions.find((qq) => qq.id === id);
      const v = answers[id];

      if (Array.isArray(v)) return v.length > 0;
      const sv = (v ?? "").toString().trim();
      if (!sv) return false;

      if (q?.type === "email") return isValidEmail(sv);
      if (q?.type === "phone") return isValidPhone(sv);
      return true;
    });
  }, [answers, requiredIds, current]);

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const handleChange = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrorMsg(null);
  };

  const goNext = () => {
    if (!isStepValid) {
      setErrorMsg("رجاءً أكمل الحقول المطلوبة في هذا القسم.");
      return;
    }
    if (step < totalSteps - 1) setStep(step + 1);
  };
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  /* ======== الإرسال مع كل التحليلات ======== */
  const handleSubmit = async () => {
    if (!isStepValid) {
      setErrorMsg("رجاءً أكمل الحقول المطلوبة قبل الإرسال.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1) حساب كل التحليلات
      const { result: miRes, ranking: miRanking } = computeMiScores(answers);
      const vak = computeVAK(answers);
      const big5 = computeBigFive(answers);
      const env = computeEnvironment(answers);
      const recs = generateRecommendations(miRanking, vak, big5, { priority_dev: answers["priority_dev"] });

      // 2) فَلط MI
      const miFlat: Record<string, string | number> = {};
      Object.entries(miRes).forEach(([cat, v]) => {
        miFlat[`mi_${cat}_sum`] = v.sum;
        miFlat[`mi_${cat}_max`] = v.max;
        miFlat[`mi_${cat}_percent`] = v.percent;
      });
      miFlat["mi_rank_1"] = miRanking[0] ?? "";
      miFlat["mi_rank_2"] = miRanking[1] ?? "";
      miFlat["mi_rank_3"] = miRanking[2] ?? "";

      // 3) فَلط VAK / BigFive / Environment / Recs
      const vakFlat = {
        vak_visual: vak.percent.visual,
        vak_auditory: vak.percent.auditory,
        vak_kinesthetic: vak.percent.kinesthetic,
        vak_top: vak.ranking[0] ?? "",
      };
      const big5Flat = {
        big5_E: big5.percent.E,
        big5_O: big5.percent.O,
        big5_A: big5.percent.A,
        big5_C: big5.percent.C,
        big5_N: big5.percent.N,
      };
      const envFlat = {
        env_support_score: env.supportScore,
        env_support_percent: env.supportPercent,
        env_level: env.level,
      };
      const recsFlat: Record<string, string> = {};
      recs.forEach((r, i) => (recsFlat[`rec_${i + 1}`] = r));

      // 4) بناء Payload للإرسال
      const payload = {
        answers: { ...answers, ...miFlat, ...vakFlat, ...big5Flat, ...envFlat, ...recsFlat },
        meta: {
          progress: `${step + 1}/${totalSteps}`,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          locale: typeof navigator !== "undefined" ? navigator.language : "ar",
        },
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data && data.ok === false)) {
        throw new Error(data?.message || "تعذر الإرسال، حاول لاحقًا.");
      }

      // خزّن آخر نتيجة محليًا لصفحة النتائج (اختياري لاستخدام لاحق)
      try {
        localStorage.setItem(
          "arouma_last_results",
          JSON.stringify({
      mi: { result: miRes, ranking: miRanking },
      vak,
      big5,
      environment: env,
      recs,
    })
  );
} catch (err) {
  console.error("تعذر حفظ النتائج محليًا:", err);
}

      localStorage.removeItem("arouma_answers");
      window.location.href = "/thank-you"; // بدّل إلى /assessment/results إذا جهزت صفحة النتائج
    } catch (err: any) {
      setErrorMsg(err?.message || "تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  /* ================== الواجهة ================== */
  return (
    <main dir="rtl" className="min-h-screen text-[var(--flw-text)] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* العنوان + شريط التقدم */}
        <div className="flw-card p-6 mb-6">
          <h1 className="text-4xl font-extrabold text-center leading-snug">
            <span className="text-purple-700">أرومة</span> — نفهم طفلك بعمق، ونبني حوله خطة تُشبِهُه
          </h1>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1" style={{ color: "var(--flw-sub)" }}>
              <span>القسم {step + 1} من {totalSteps}</span>
              <span>{progress}%</span>
            </div>
            <div className="flw-progress"><i style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* بطاقة القسم الحالي */}
        <div className="flw-card p-6">
          <h2 className="text-xl font-semibold mb-3">{current.title}</h2>
          {current.description && (
            <p className="text-sm mb-4 whitespace-pre-line" style={{ color: "var(--flw-sub)" }}>
              {current.description}
            </p>
          )}

          <div className="space-y-6">
            {current.questions.map((q) => {
              const val = answers[q.id];
              const isInvalid =
                q.required &&
                ((Array.isArray(val) && val.length === 0) ||
                  (!Array.isArray(val) && (!val || String(val).trim() === "")) ||
                  (q.type === "email" && typeof val === "string" && val && !isValidEmail(val)) ||
                  (q.type === "phone" && typeof val === "string" && val && !isValidPhone(val)));

              return (
                <div key={q.id}>
                  <label className="block font-medium mb-2">
                    {q.title} {q.required && <span className="text-red-500">*</span>}
                  </label>

                  {q.type === "single" && q.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 mb-2 cursor-pointer rounded-xl border px-3 py-2"
                      style={{ borderColor: "var(--flw-line)" }}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={val === opt}
                        onChange={() => handleChange(q.id, opt)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span style={{ color: "var(--flw-sub)" }}>{opt}</span>
                    </label>
                  ))}

                  {q.type === "multi" && q.options?.map((opt) => {
                    const arr = Array.isArray(val) ? (val as string[]) : [];
                    const checked = arr.includes(opt);
                    return (
                      <label
                        key={opt}
                        className="flex items-center gap-2 mb-2 cursor-pointer rounded-xl border px-3 py-2"
                        style={{ borderColor: "var(--flw-line)" }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(arr);
                            e.target.checked ? next.add(opt) : next.delete(opt);
                            handleChange(q.id, Array.from(next));
                          }}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span style={{ color: "var(--flw-sub)" }}>{opt}</span>
                      </label>
                    );
                  })}

                  {(q.type === "text" || q.type === "email" || q.type === "phone") && (
                    <input
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
                      {q.type === "email"
                        ? "رجاءً أدخل بريدًا إلكترونيًا صحيحًا."
                        : q.type === "phone"
                        ? "رجاءً أدخل رقم جوال صحيح."
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
            <button onClick={goPrev} disabled={step === 0 || loading} className="flw-btn-ghost disabled:opacity-50">
              السابق
            </button>

            {step < totalSteps - 1 ? (
              <button onClick={goNext} disabled={!isStepValid || loading} className="flw-btn disabled:opacity-50">
                التالي
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!isStepValid || loading} className="flw-btn disabled:opacity-50">
                {loading ? "جاري الإرسال..." : "إرسال الإجابات"}
              </button>
            )}
          </div>

          {!isStepValid && (
            <p className="mt-3 text-sm text-rose-500">رجاءً أكمل الحقول المطلوبة في هذا القسم قبل المتابعة.</p>
          )}
          {errorMsg && <p className="mt-3 text-sm text-rose-500">{errorMsg}</p>}
        </div>
      </div>
    </main>
  );
}