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

const LIKERT_5 = ["أبدًا", "نادرًا", "أحيانًا", "غالبًا", "دائمًا"];

/* ================== نموذج الأسئلة (الإصدار الجديد) ================== */
export const formSections: Section[] = [
  {
    id: "intro",
    title: "تقييم شخصية وذكاءات الطفل (نموذج أرومة)",
    description:
      "🟣 أهلاً بكم في منصة أرومة.\n🗂️ عدد الأقسام: 9 — ⏰ الوقت: 10–15 دقيقة.\n✅ أجب بصدق؛ البيانات سرية وتُستخدم للتقييم فقط. يمكنك إيقاف التعبئة والعودة لاحقًا.",
    questions: [
      { id: "respondent_role", title: "من يجيب على هذا النموذج؟", type: "single", required: true, options: ["الأم", "الأب", "ولي أمر آخر"] },
      { id: "guardian_name", title: "اسم ولي الأمر", type: "text", required: true },
      { id: "familiarity", title: "مدى المعرفة بالطفل", type: "single", required: true, options: ["ممتازة", "جيدة جداً", "متوسطة", "ضعيفة"] },
      { id: "phone", title: "رقم الجوال", type: "phone", required: true },
      { id: "email", title: "البريد الإلكتروني", type: "email", required: true },
      { id: "child_name", title: "اسم الطفل", type: "text", required: true },
    ],
  },

  // القسم 1: بيانات أساسية عن الطفل
  {
    id: "basic",
    title: "القسم الأول: بيانات أساسية عن الطفل",
    questions: [
      { id: "gender", title: "الجنس", type: "single", required: true, options: ["ذكر", "أنثى"] },
      { id: "age", title: "عمر الطفل", type: "single", required: true, options: ["أقل من 4 سنوات", "4–6 سنوات", "7–9 سنوات", "10–13 سنة"] },
      { id: "birth_order", title: "ترتيب الطفل بين إخوته", type: "single", required: true, options: ["الأول", "الأوسط", "الأصغر", "وحيد"] },
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
      { id: "diagnosis_flag", title: "هل لدى الطفل أي احتياجات خاصة أو تشخيصات تعليمية/سلوكية؟", type: "single", required: true, options: ["لا", "نعم"] },
      { id: "diagnosis_details", title: "اذكر أي تشخيص طبي/تربوي (مثل فرط الحركة، صعوبات تعلم، توحد، تأخر الكلام...)", type: "text" },
      { id: "therapy", title: "هل يتناول الطفل أي علاج نفسي أو دوائي حالياً؟", type: "single", required: true, options: ["لا", "نعم"] },
      { id: "therapy_details", title: "إذا كانت الإجابة نعم، اذكر نوع العلاج/الدواء", type: "text" },
    ],
  },

  // القسم 2: وصف شخصية الطفل العامة (Big Five / Temperament)
  {
    id: "personality",
    title: "القسم الثاني: وصف شخصية الطفل العامة",
    description:
      "يركز هذا القسم على السمات العامة مثل الانفتاح، الانضباط الذاتي، الانبساط، والمرونة الانفعالية.",
    questions: [
      { id: "p_extraversion_1", title: "يتفاعل الطفل بسهولة مع الآخرين ويحب التعارف", type: "single", required: true, options: LIKERT_5 },
      { id: "p_introversion_1", title: "يفضل اللعب أو العمل بمفرده", type: "single", required: true, options: LIKERT_5 },
      { id: "p_agreeableness_1", title: "يتقبل التوجيه والنصائح بسهولة", type: "single", required: true, options: LIKERT_5 },
      { id: "p_assertiveness_1", title: "يصرّ على آرائه حتى لو خالفه الآخرون", type: "single", required: true, options: LIKERT_5 },
      { id: "p_cautious_1", title: "يتعامل مع المواقف الجديدة بحذر أو تردد", type: "single", required: true, options: LIKERT_5 },
      { id: "p_calm_1", title: "يظهر عليه الهدوء أغلب الوقت", type: "single", required: true, options: LIKERT_5 },
      { id: "p_expressive_1", title: "يتحدث كثيرًا ويعبّر عن مشاعره بسهولة", type: "single", required: true, options: LIKERT_5 },
      { id: "p_boredom_1", title: "يشعر بسرعة بالملل إذا لم يكن هناك نشاط ممتع", type: "single", required: true, options: LIKERT_5 },
      { id: "p_detail_1", title: "يلاحظ التفاصيل الصغيرة في الأشياء من حوله", type: "single", required: true, options: LIKERT_5 },
      { id: "p_order_1", title: "يحب ترتيب أغراضه والمحافظة على النظام", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 3: السلوك والتفاعل الاجتماعي
  {
    id: "social",
    title: "القسم الثالث: السلوك والتفاعل الاجتماعي",
    description:
      "يهدف هذا القسم إلى فهم التفاعل مع الآخرين، التعبير الانفعالي، والتعاطف (إريكسون، فيجوتسكي، قولمان).",
    questions: [
      { id: "s_express_words", title: "يعبّر عن مشاعره بالكلمات (مثل: أنا زعلان/فرحان)", type: "single", required: true, options: LIKERT_5 },
      { id: "s_read_emotions", title: "يفهم مشاعر الآخرين من تعابير وجوههم أو نبراتهم", type: "single", required: true, options: LIKERT_5 },
      { id: "s_soothe_others", title: "يحاول تهدئة من حوله عندما يراهم حزينين أو غاضبين", type: "single", required: true, options: LIKERT_5 },
      { id: "s_frustration", title: "يبكي أو يغضب بسهولة عندما يُمنع من شيء يحبه", type: "single", required: true, options: LIKERT_5 },
      { id: "s_self_control", title: "يستطيع ضبط نفسه عندما يُطلب منه الانتظار", type: "single", required: true, options: LIKERT_5 },
      { id: "s_cooperate", title: "يتعاون بسهولة مع الأطفال الآخرين أثناء اللعب", type: "single", required: true, options: LIKERT_5 },
      { id: "s_confidence_public", title: "يُظهر ثقة عند التحدث أمام الآخرين", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 4: أنماط التعلم المفضلة (VAK & Kolb)
  {
    id: "learning_styles",
    title: "القسم الرابع: أنماط التعلم المفضلة",
    description:
      "لتحديد الطريقة التي يتعلم بها الطفل بشكل أفضل (بصري، سمعي، حركي/عملي).",
    questions: [
      { id: "l_visual_1", title: "يلاحظ الصور والرسومات أكثر من الكلمات", type: "single", required: true, options: LIKERT_5 },
      { id: "l_visual_2", title: "يتذكر شكل الصفحة أو مكان الشيء بسهولة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_auditory_1", title: "يفهم أكثر عندما يسمع شرحًا صوتيًا", type: "single", required: true, options: LIKERT_5 },
      { id: "l_auditory_2", title: "يكرر المعلومات بصوت منخفض ليتذكرها", type: "single", required: true, options: LIKERT_5 },
      { id: "l_kinesthetic_1", title: "يتعلم أفضل عندما يجرب بيديه أو يتحرك أثناء التعلم", type: "single", required: true, options: LIKERT_5 },
      { id: "l_kinesthetic_2", title: "يجد صعوبة في التركيز إذا جلس دون حركة طويلة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_visual_3", title: "يحب استخدام الألوان والرسم أثناء الدراسة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_imagery_1", title: "يتخيل الصور والمشاهد في ذهنه عند التعلم", type: "single", required: true, options: LIKERT_5 },
      { id: "l_media_1", title: "يفضل القصص أو الفيديوهات أكثر من الشرح النظري", type: "single", required: true, options: LIKERT_5 },
      { id: "l_hands_on_1", title: "يطلب تجربة الشيء بنفسه لفهمه", type: "single", required: true, options: LIKERT_5 },
      { id: "l_modeling_1", title: "يتعلم من خلال ملاحظة وتقليد الآخرين", type: "single", required: true, options: LIKERT_5 },
      { id: "l_dual_1", title: "يفهم أكثر عندما يجمع بين السماع والرؤية معًا", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 5: الدافعية والتحفيز (Maslow & SDT)
  {
    id: "motivation",
    title: "القسم الخامس: الدافعية والتحفيز",
    description: "ما الذي يدفع الطفل للتعلم والإنجاز (المكافأة، التحدي، الإنجاز الذاتي).",
    questions: [
      { id: "m_reward_1", title: "ينجز المهام عندما يحصل على تشجيع أو جائزة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_challenge_1", title: "يحب التحدي ويندفع لإثبات قدرته", type: "single", required: true, options: LIKERT_5 },
      { id: "m_attention_drop", title: "يفقد الحماس بسرعة إذا لم ينتبه أحد لجهده", type: "single", required: true, options: LIKERT_5 },
      { id: "m_persistence_1", title: "يستمر في المحاولة حتى ينجح دون أن يُطلب منه", type: "single", required: true, options: LIKERT_5 },
      { id: "m_intrinsic_1", title: "يواصل أداء المهمة حتى دون مكافأة أو مديح", type: "single", required: true, options: LIKERT_5 },
      { id: "m_pride_1", title: "يشعر بالفخر عند سماع كلمات تشجيعية مثل “أحسنت”", type: "single", required: true, options: LIKERT_5 },
      { id: "m_relevance_1", title: "يتعلم أكثر عندما يفهم سبب أهمية المهمة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_feedback_1", title: "يطلب معرفة النتيجة أو تقييم أدائه بعد كل مهمة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_group_1", title: "يتحمس أكثر عند العمل ضمن مجموعة", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 6: البيئة والدعم الأسري (Bronfenbrenner)
  {
    id: "family_environment",
    title: "القسم السادس: البيئة والدعم الأسري",
    description: "نوع الدعم العاطفي والتربوي داخل الأسرة (نموذج النظم البيئية).",
    questions: [
      { id: "f_talk_time", title: "يتم تخصيص وقت يومي للحوار مع الطفل", type: "single", required: true, options: LIKERT_5 },
      { id: "f_parent_participation", title: "يشارك أحد الوالدين الطفل في أنشطته التعليمية أو الترفيهية", type: "single", required: true, options: LIKERT_5 },
      { id: "f_autonomy", title: "يتم تشجيع الطفل على اتخاذ قرارات بسيطة بنفسه", type: "single", required: true, options: LIKERT_5 },
      { id: "f_praise", title: "يحصل على كلمات دعم وثناء من والديه بانتظام", type: "single", required: true, options: LIKERT_5 },
      { id: "f_opinion", title: "يُسمح له بالتعبير عن رأيه بحرية", type: "single", required: true, options: LIKERT_5 },
      { id: "f_guidance_over_punish", title: "يتم تصحيح السلوك بالحديث أكثر من العقاب", type: "single", required: true, options: LIKERT_5 },
      { id: "f_routine", title: "يوجد في المنزل روتين واضح للنوم والدراسة واللعب", type: "single", required: true, options: LIKERT_5 },
      { id: "f_disclosure", title: "يشعر بالراحة عند التحدث مع والديه عن مشاكله", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 7: الميول والهوايات العامة (Interests & MI)
  {
    id: "interests",
    title: "القسم السابع: الميول والهوايات العامة",
    description: "لتحديد الذكاءات الطبيعية والأنشطة التي يستمتع بها الطفل (نظرية الذكاءات المتعددة).",
    questions: [
      { id: "i_music", title: "يستمتع بالموسيقى أو الغناء أو تقليد الأصوات", type: "single", required: true, options: LIKERT_5 },
      { id: "i_physical", title: "ينجذب إلى الأنشطة الحركية (رياضة، بناء، مساعدة في المنزل)", type: "single", required: true, options: LIKERT_5 },
      { id: "i_puzzles", title: "يحب حل الألغاز أو الأسئلة التي تتطلب تفكيرًا", type: "single", required: true, options: LIKERT_5 },
      { id: "i_nature", title: "يحب الطبيعة أو الحيوانات ويهتم بمراقبتها", type: "single", required: true, options: LIKERT_5 },
      { id: "i_art", title: "يحب الرسم أو التلوين أو الأعمال الفنية", type: "single", required: true, options: LIKERT_5 },
      { id: "i_storytelling", title: "يحب النقاش أو سرد القصص", type: "single", required: true, options: LIKERT_5 },
      { id: "i_team", title: "يحب الألعاب الجماعية ويتفاعل اجتماعيًا بسهولة", type: "single", required: true, options: LIKERT_5 },
      { id: "i_introspective", title: "يميل إلى التأمل والهدوء والانعزال أحيانًا", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // القسم 8: الطموحات والأهداف التربوية
  {
    id: "goals",
    title: "القسم الثامن: الطموحات والأهداف التربوية",
    description: "لفهم تطلعات ولي الأمر وتوجيه الخطة التربوية المخصصة (هرم ماسلو وتنمية الجوانب المتكاملة).",
    questions: [
      {
        id: "priority_dev",
        title: "ما أكثر جانب ترغب في تنميته لدى طفلك في هذه المرحلة؟",
        type: "single",
        required: true,
        options: [
          "تعزيز المهارات الاجتماعية",
          "ضبط الانفعالات والتحكم العاطلي",
          "رفع مستوى التحصيل الدراسي",
          "تنمية الثقة بالنفس",
          "تطوير مهارات التواصل",
          "زيادة الاستقلالية",
          "لا أعلم تحديدًا، أحتاج مساعدة في التوجيه",
          "أخرى",
        ],
      },
      {
        id: "activities_wanted",
        title: "ما نوع الأنشطة التي تود لطفلك أن يمارسها بشكل منتظم؟",
        type: "multi",
        options: [
          "أنشطة رياضية أو حركية",
          "أنشطة فنية (رسم، موسيقى، أشغال)",
          "أنشطة ذهنية (ألعاب ذكاء، قراءة)",
          "أنشطة اجتماعية (العمل الجماعي، الرحلات)",
          "دورات مهارية (لغة، برمجة، منطق)",
          "أنشطة دينية أو قيمية",
          "لا أعلم أو لم نجرب أنشطة بعد",
          "أخرى",
        ],
      },
    ],
  },

  // قسم اختياري محجوز للتوافق (إذا كانت الواجهة تتوقع 10 أقسام)
  {
    id: "spacer_optional",
    title: "قسم اختياري (محجوز)",
    description: "لا توجد أسئلة في هذا القسم. (محجوز للتوافق مع عدد الأقسام).",
    questions: [],
  },

  // الخاتمة
  {
    id: "final",
    title: "خاتمة الاستبانة",
    description:
      "🟣 شكرًا لك على وقتك. نستخدم البيانات بسرية لتحليل شخصية وذكاءات طفلك وتقديم خطة تعليمية مخصصة. للاستفسار: aroumaEd@gmail.com",
    questions: [{ id: "notes", title: "هل لديك أي ملاحظات إضافية أو معلومات تود مشاركتها؟", type: "text" }],
  },
];

/* ================== دوال مساعدة ================== */
function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function isValidPhone(v: string) { const digits = v.replace(/[^\d]/g, ""); return digits.length >= 8; }
function likertToNum(v: string): number {
  const i = LIKERT_5.indexOf((v || "").trim());
  return i >= 0 ? i : 0; // 0..4
}
function likertToScore(v: string): number {
  // يحول 0..4 إلى -2..+2
  return likertToNum(v) - 2;
}

/* ======== MI (الذكاءات المتعددة) — وفق القسم الجديد (interests) ======== */
const MI_FROM_INTERESTS: Record<string, "musical" | "bodily" | "logical" | "naturalist" | "spatial" | "linguistic" | "interpersonal" | "intrapersonal"> = {
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
    const v = String(ans[qid] || "");
    const score = likertToNum(v) + 1; // 1..5
    totals[cat] = (totals[cat] || 0) + score;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const result: Record<string, { sum: number; max: number; percent: number }> = {};
  Object.keys(MI_FROM_INTERESTS).reduce((set, q) => (set.add(MI_FROM_INTERESTS[q]), set), new Set<string>()).forEach((cat) => {
    const sum = totals[cat] || 0;
    const max = (counts[cat] || 0) * 5;
    const percent = max ? Math.round((sum / max) * 100) : 0;
    result[cat] = { sum, max, percent };
  });

  const ranking = Object.entries(result)
    .sort((a, b) => b[1].percent - a[1].percent || b[1].sum - a[1].sum)
    .map(([k]) => k);

  return { result, ranking };
}

/* ======== VAK (من عناصر القسم الرابع) ======== */
function computeVAK(ans: Record<string, any>) {
  // جمع نقاط من 0..4 لكل بند، نجعل بعض البنود ذات دلالة مزدوجة
  const visualIds = ["l_visual_1", "l_visual_2", "l_visual_3", "l_imagery_1"];
  const auditoryIds = ["l_auditory_1", "l_auditory_2"];
  const kinestheticIds = ["l_kinesthetic_1", "l_kinesthetic_2", "l_hands_on_1", "l_modeling_1"];
  // بنود داعمة
  const dualVisual = ["l_media_1", "l_dual_1"];
  const dualAuditory = ["l_media_1", "l_dual_1"];

  const sum = (ids: string[]) => ids.reduce((s, id) => s + likertToNum(String(ans[id] || "")), 0);

  let visual = sum(visualIds) + 0.5 * sum(dualVisual);
  let auditory = sum(auditoryIds) + 0.5 * sum(dualAuditory);
  let kinesthetic = sum(kinestheticIds);

  // نسب مئوية على أساس أعلى نمط (تطبيع نسبي)
  const max = Math.max(visual, auditory, kinesthetic, 1);
  const percent = {
    visual: Math.round((visual / max) * 100),
    auditory: Math.round((auditory / max) * 100),
    kinesthetic: Math.round((kinesthetic / max) * 100),
  };
  const ranking = (Object.keys(percent) as Array<keyof typeof percent>).sort((a, b) => percent[b] - percent[a]);
  return { raw: { visual, auditory, kinesthetic }, percent, ranking };
}

/* ======== Big Five (باستخدام بنود القسم الثاني الجديدة) ======== */
function computeBigFive(ans: Record<string, any>) {
  let E = 0, O = 0, A = 0, C = 0, N = 0, cntE = 0, cntO = 0, cntA = 0, cntC = 0, cntN = 0;

  // خريطة البنود -> البعد (+ تعني يزيد البعد مع الارتفاع في الليكرت، - تعني عكسي)
  const map: Array<[string, "E" | "O" | "A" | "C" | "N", 1 | -1]> = [
    ["p_extraversion_1", "E", 1],
    ["p_introversion_1", "E", -1],
    ["p_agreeableness_1", "A", 1],
    ["p_assertiveness_1", "E", 1], // تأكيد الذات نقرّبه للانبساط
    ["p_cautious_1", "N", 1],      // حذر/تردد قرب العصابية
    ["p_calm_1", "N", -1],
    ["p_expressive_1", "E", 1],
    ["p_boredom_1", "N", 1],
    ["p_detail_1", "C", 1],
    ["p_order_1", "C", 1],
  ];

  for (const [qid, dim, sign] of map) {
    const s = likertToScore(String(ans[qid] || "")); // -2..+2
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
  const percent = { E: norm(E, cntE), O: norm(O, cntO), A: norm(A, cntA), C: norm(C, cntC), N: norm(N, cntN) };
  return { raw: { E, O, A, C, N }, percent, counts: { cntE, cntO, cntA, cntC, cntN } };
}

/* ======== بيئة Bronfenbrenner (تلخيص مؤشرات من القسم السادس) ======== */
function computeEnvironment(ans: Record<string, any>) {
  const ids = [
    "f_talk_time",
    "f_parent_participation",
    "f_autonomy",
    "f_praise",
    "f_opinion",
    "f_guidance_over_punish",
    "f_routine",
    "f_disclosure",
  ];
  const scores = ids.map((id) => likertToNum(String(ans[id] || ""))); // 0..4
  const sum = scores.reduce((a, b) => a + b, 0);
  const max = ids.length * 4;
  const percent = Math.round((sum / max) * 100);
  let level = "متوسط";
  if (percent >= 70) level = "عالي";
  else if (percent <= 35) level = "منخفض";
  return { supportScore: sum, supportPercent: percent, level };
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
      // 1) حساب كل التحليلات (اعتمادًا على المعرفات الجديدة)
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

      // خزّن آخر نتيجة محليًا لصفحة النتائج (اختياري)
      try {
        localStorage.setItem(
          "arouma_last_results",
          JSON.stringify({ mi: { result: miRes, ranking: miRanking }, vak, big5, environment: env, recs })
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
        <div className="flw-card p-5 md:p-6 mb-6">
          {/* شعار أرومة */}
          <div className="flex justify-center items-center">
            <img
              src="/logo.png"
              alt="شعار أرومة"
              className="h-24 md:h-28 w-auto object-contain drop-shadow-md"
            />
          </div>
          {/* العنوان (مخفي للمظهر، مفيد للوصولية/SEO) */}
          <h1 className="sr-only">أرومة</h1>

          <h1 className="text-4xl font-extrabold text-center leading-snug">
            <span className="text-purple-700"></span>
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
