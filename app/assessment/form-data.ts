// app/assessment/form-data.ts
export type QuestionType = "single" | "multi" | "text" | "email" | "phone";

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  helper?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export const LIKERT_5 = ["أبدًا", "نادرًا", "أحيانًا", "غالبًا", "دائمًا"];

// ملاحظة: إذا عدّلت هنا، تنعكس التغييرات تلقائيًا في كل الواجهة
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

  // 1) بيانات أساسية
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

  // 2) الشخصية (Big Five/Temperament)
  {
    id: "personality",
    title: "القسم الثاني: وصف شخصية الطفل العامة",
    description: "يركز هذا القسم على الانفتاح، الانضباط الذاتي، الانبساط، والمرونة الانفعالية.",
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
      // انفتاح (O) مضافة
      { id: "p_openness_1", title: "يحب تجربة أفكار أو أنشطة جديدة وغير مألوفة", type: "single", required: true, options: LIKERT_5 },
      { id: "p_openness_2", title: "يستمتع بالخيال والابتكار أثناء اللعب أو الرسم", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // 3) السلوك والتفاعل الاجتماعي
  {
    id: "social",
    title: "القسم الثالث: السلوك والتفاعل الاجتماعي",
    description: "التفاعل مع الآخرين، التعبير الانفعالي، والتعاطف (Erikson/Vygotsky/Goleman).",
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

  // 4) أنماط التعلّم (VAK/Kolb)
  {
    id: "learning_styles",
    title: "القسم الرابع: أنماط التعلّم المفضلة",
    description: "لتحديد الطريقة المثلى (بصري/سمعي/حركي-عملي).",
    questions: [
      { id: "l_visual_1", title: "يلاحظ الصور والرسومات أكثر من الكلمات", type: "single", required: true, options: LIKERT_5 },
      { id: "l_visual_2", title: "يتذكر شكل الصفحة أو مكان الشيء بسهولة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_auditory_1", title: "يفهم أكثر عندما يسمع شرحًا صوتيًا", type: "single", required: true, options: LIKERT_5 },
      { id: "l_auditory_2", title: "يكرر المعلومات بصوت منخفض ليتذكرها", type: "single", required: true, options: LIKERT_5 },
      { id: "l_kinesthetic_1", title: "يتعلم أفضل عندما يجرب بيديه أو يتحرك أثناء التعلّم", type: "single", required: true, options: LIKERT_5 },
      { id: "l_kinesthetic_2", title: "يجد صعوبة في التركيز إذا جلس دون حركة طويلة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_visual_3", title: "يحب استخدام الألوان والرسم أثناء الدراسة", type: "single", required: true, options: LIKERT_5 },
      { id: "l_imagery_1", title: "يتخيل الصور والمشاهد في ذهنه عند التعلّم", type: "single", required: true, options: LIKERT_5 },
      { id: "l_media_1", title: "يفضل القصص أو الفيديوهات أكثر من الشرح النظري", type: "single", required: true, options: LIKERT_5 },
      { id: "l_hands_on_1", title: "يطلب تجربة الشيء بنفسه لفهمه", type: "single", required: true, options: LIKERT_5 },
      { id: "l_modeling_1", title: "يتعلم من خلال ملاحظة وتقليد الآخرين", type: "single", required: true, options: LIKERT_5 },
      { id: "l_dual_1", title: "يفهم أكثر عندما يجمع بين السماع والرؤية معًا", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // 5) الدافعية (Maslow/SDT)
  {
    id: "motivation",
    title: "القسم الخامس: الدافعية والتحفيز",
    description: "ما الذي يدفع الطفل للتعلّم والإنجاز.",
    questions: [
      { id: "m_reward_1", title: "ينجز المهام عندما يحصل على تشجيع أو جائزة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_challenge_1", title: "يحب التحدي ويندفع لإثبات قدرته", type: "single", required: true, options: LIKERT_5 },
      { id: "m_attention_drop", title: "يفقد الحماس بسرعة إذا لم ينتبه أحد لجهده", type: "single", required: true, options: LIKERT_5 },
      { id: "m_persistence_1", title: "يستمر في المحاولة حتى ينجح دون أن يُطلب منه", type: "single", required: true, options: LIKERT_5 },
      { id: "m_intrinsic_1", title: "يواصل أداء المهمة حتى دون مكافأة أو مديح", type: "single", required: true, options: LIKERT_5 },
      { id: "m_pride_1", title: "يشعر بالفخر عند سماع كلمات تشجيعية مثل “أحسنت”", type: "single", required: true, options: LIKERT_5 },
      { id: "m_relevance_1", title: "يتعلّم أكثر عندما يفهم سبب أهمية المهمة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_feedback_1", title: "يطلب معرفة النتيجة أو تقييم أدائه بعد كل مهمة", type: "single", required: true, options: LIKERT_5 },
      { id: "m_group_1", title: "يتحمس أكثر عند العمل ضمن مجموعة", type: "single", required: true, options: LIKERT_5 },
    ],
  },

  // 6) البيئة والدعم الأسري (Bronfenbrenner)
  {
    id: "family_environment",
    title: "القسم السادس: البيئة والدعم الأسري",
    description: "نوع الدعم العاطفي والتربوي داخل الأسرة (Ecological Systems).",
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

  // 7) الميول والذكاءات المتعددة
  {
    id: "interests",
    title: "القسم السابع: الميول والهوايات العامة",
    description: "لتحديد الذكاءات الطبيعية والأنشطة المفضلة (Multiple Intelligences).",
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

  // 8) الأهداف التربوية
  {
    id: "goals",
    title: "القسم الثامن: الطموحات والأهداف التربوية",
    description: "لفهم تطلعات ولي الأمر وتوجيه الخطة (Maslow/تنمية متكاملة).",
    questions: [
      {
        id: "priority_dev",
        title: "ما أكثر جانب ترغب في تنميته لدى طفلك في هذه المرحلة؟",
        type: "single",
        required: true,
        options: [
          "تعزيز المهارات الاجتماعية",
          "ضبط الانفعالات والتحكم العاطفي",
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

  // 9) الخاتمة
  {
    id: "final",
    title: "خاتمة الاستبانة",
    description: "🟣 شكرًا لك على وقتك. نستخدم البيانات بسرية لتحليل شخصية وذكاءات طفلك وتقديم خطة تعليمية مخصصة. للاستفسار: aroumaEd@gmail.com",
    questions: [{ id: "notes", title: "هل لديك أي ملاحظات إضافية أو معلومات تود مشاركتها؟", type: "text" }],
  },
];