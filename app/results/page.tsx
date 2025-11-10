"use client";

import { useEffect, useMemo, useState } from "react";

/** ===================== أنواع البيانات ===================== */
type MIKey =
  | "linguistic"
  | "logical"
  | "spatial"
  | "musical"
  | "bodily"
  | "interpersonal"
  | "intrapersonal"
  | "naturalist";

type Big5Key = "E" | "A" | "C" | "N" | "O";
type VAKKey = "visual" | "auditory" | "kinesthetic";

type StoredResults = {
  mi: {
    result: Record<
      MIKey,
      { sum: number; max: number; percent: number }
    >;
    ranking: MIKey[];
  };
  vak: {
    raw: Record<VAKKey, number>;
    percent: Record<VAKKey, number>;
    absolute: Record<VAKKey, number>;
    ranking: VAKKey[];
  };
  big5: {
    raw: Record<Big5Key, number>;
    percent: Record<Big5Key, number>;
    counts: Record<`cnt${Big5Key}`, number>;
  };
  environment: {
    supportScore: number;
    supportPercent: number;
    level: "منخفض" | "متوسط" | "عال";
  };
  recs: string[];
};

type StoredPayload = StoredResults | null;

/** ===================== عناصر واجهة بسيطة ===================== */
function Bar({
  value,
  labelLeft,
  labelRight,
  colorClass,
}: {
  value: number;
  labelLeft?: string;
  labelRight?: string;
  colorClass?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full">
      <div
        className="flex justify-between text-xs mb-1"
        style={{ color: "var(--flw-sub)" }}
      >
        <span>{labelLeft ?? ""}</span>
        <span>{labelRight ?? `${v}%`}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full ${colorClass ?? "bg-gradient-to-r from-[#6D28D9] to-[#10B981]"}`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  right,
}: {
  title?: string;
  subtitle?: string;
  children: any;
  right?: any;
}) {
  return (
    <div className="rounded-2xl border border-[#efeafd] bg-white p-5 md:p-6 shadow-[0_2px_20px_rgba(130,120,160,0.06)]">
      {title ? (
        <div className="mb-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[#3c2e7e]">{title}</h3>
            {right}
          </div>
          {subtitle ? (
            <p className="text-sm mt-2 text-[#4b4863] leading-6">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function Pill({ children }: { children: any }) {
  return (
    <span className="inline-block text-sm rounded-full border border-[#efeafd] bg-[#fbfaff] px-3 py-1.5 text-[#3c2e7e]">
      {children}
    </span>
  );
}

/** ===================== تسميات ووصف MI ===================== */
const labelsMIshort: Record<MIKey, string> = {
  linguistic: "لغوي/لساني",
  logical: "منطقي/رياضي",
  spatial: "بصري/فراغي",
  musical: "موسيقي/إيقاعي",
  bodily: "حركي/عملي",
  interpersonal: "اجتماعي/تعاوني",
  intrapersonal: "تأملي/ذاتي",
  naturalist: "طبيعي/بيئي",
};

const labelsMI: Record<MIKey, string> = {
  linguistic: "ذكاء لغوي — يميل للكلام والقراءة والتعبير بالكلمات",
  logical: "ذكاء منطقي — يفكر بالأرقام والأسباب ويبحث عن القواعد",
  spatial: "ذكاء بصري — يتعلّم بالصور والألوان والأشكال والخرائط",
  musical: "ذكاء موسيقي — يحسّ بالإيقاع ويحب الأصوات والأغاني",
  bodily: "ذكاء حركي — يتعلّم بالحركة والتجربة واللمس",
  interpersonal: "ذكاء اجتماعي — يتعلّم مع الآخرين ومنهم",
  intrapersonal: "ذكاء تأمّلي — يفهم نفسه ومشاعره ويحب الهدوء",
  naturalist: "ذكاء طبيعي — يحب الطبيعة والكائنات ويصنّف ما حوله",
};

/** اقتراحات عامة مفصّلة لكل MI (بخطاب موجّه لوليّ الأمر) */
const baseTipsMI: Record<MIKey, string[]> = {
  linguistic: [
    "نفّذ «قصة اليوم»: اختر قصة قصيرة مناسبة للعمر، اقرأها بصوت واضح، ثم اطلب من طفلك أن يعيد سرد الفكرة الأساسية بجملة أو جملتين. إذا واجه صعوبة، وجّه بأسئلة محدّدة مثل: «من بدأ القصة؟ ماذا حدث بعد ذلك؟ كيف انتهت؟»، ثم اكتب معه كلمة جديدة من القصة وضعا مثالًا من حياتكما.",
    "طبّق «لعبة البائع والعميل»: جهّز على الطاولة 4–5 أغراض منزلية آمنة، عرّف لكل غرض سعرًا بسيطًا، وتحدث بجمل كاملة: «أريد كتابًا من فضلك»، «كم السعر؟». بعد دقيقتين بدّل الأدوار مع الطفل ليجرّب الحديث بطلاقة.",
    "أنشئ «دفتر كلمات العائلة»: خصّص دفتراً صغيرًا، وأضِف كل يوم كلمة جديدة مع رسم بسيط يوضّح معناها. راجع الكلمات نهاية الأسبوع في دقيقة.",
  ],
  logical: [
    "نفّذ «سبب ونتيجة»: اختر موقفًا من اليوم (تأخرنا ففاتنا الحافلة). اسأل: «ما السبب؟ ما النتيجة؟ ما الخطة لمنع التكرار؟». اكتب ثلاث خطوات عملية وطبّق خطوة واحدة في اليوم التالي.",
    "استثمر «الرياضيات في المطبخ»: أثناء إعداد ساندويتش، اطلب العدّ والتقسيم: «لدينا 4 شرائح خبز، كم ساندويتش نستطيع صنعه؟». شجّع الطفل على شرح طريقة الحساب بلسانه.",
    "جرّب «ترتيب الصور»: اطبع 3–4 صور لقصة، اخلطها، واطلب من الطفل ترتيبها مع تبرير اختياره بجملة واضحة.",
  ],
  spatial: [
    "اصنع «خريطة غرفته»: ارسم مع طفلك مخططًا مبسّطًا لغرفته بألوان مختلفة لكل عنصر. في النهاية اطلب منه تحديد مكان لعبة معيّنة على الخريطة ثم إيجادها فعليًا.",
    "طبّق «تنظيم بالألوان»: خصّص لونًا لكل نوع من الأدوات (أقلام/دفاتر/ألعاب)، وضع ملصقات بنفس اللون على الصناديق، ثم درّبه على إعادة الأشياء لأماكنها الصحيحة يوميًا في دقيقتين.",
    "استخدم «خريطة ذهنية لفكرة»: عند حفظ درس/سورة، اكتب الفكرة في المنتصف وارسم ثلاثة فروع: «أهم كلمة»، «مثال»، «سؤال». دَع الطفل يملأ الفروع برسم أو كلمة.",
  ],
  musical: [
    "حوّل المعلومة إلى «لحن قصير»: اختر معلومة بسيطة (أيام الأسبوع/حروف)، وضع لها نغمة مع تصفيق. كرّرها صباحًا ومساءً لدقيقتين.",
    "افتح «صندوق الأصوات»: شغّل أصواتًا طبيعية (مطر/ريح/قطار)، واسأل: «متى نسمع هذا؟ كيف نميّزه؟». اطلب من الطفل تقليد الإيقاع بالتصفيق أو على الطاولة.",
    "استخدم «إيقاع للمذاكرة»: شغّل صوتًا هادئًا في الخلفية أثناء تلوين أو واجب سهل، وأوقفه دقيقة عند التشتت ثم أعد تشغيله لربط الصوت بالتركيز.",
  ],
  bodily: [
    "نفّذ «مختبر منزلي سريع»: وفّر وعاء ماء صغيرًا وأغراضًا آمنة خفيفة وثقيلة. اطلب توقّع: «سيطفو أم سيغرق؟ ولماذا؟». جرّب وسجّل النتائج في جدول بسيط.",
    "طبّق «قفز إلى الإجابة»: اكتب على أوراق أرضية ثلاث إجابات محتملة. اطرح سؤالًا بسيطًا واطلب من الطفل القفز على الإجابة الصحيحة. بدّل الأدوار ليطرح هو سؤالًا عليك.",
    "درّب على «الحروف بالحركة»: اكتب حرفًا كبيرًا على ورقة لاصقة وضعها على الحائط. اطلب من الطفل رسم الحرف بالهواء بذراعيه، ثم كتابته على الرمل/العجين.",
  ],
  interpersonal: [
    "نظّم «مشروعًا ثنائيًا بسيطًا» مع شخص من العائلة أو صديق (ترتيب رف/إعداد طاولة). قسّم الأدوار بوضوح: «أنت تضع الأكواب وأنا الأطباق، ثم نتبادل». امدح التعاون مباشرة: «أعجبني طلبك للمساعدة بلطف».",
    "أجرِ «نقاشًا منظمًا»: اختر موضوعًا يهم الطفل (لعبة/رحلة). امنح كل طرف دقيقة للكلام دون مقاطعة ثم دقيقة للرد. اختِم بجملة اتفاق واحدة مثل: «سنجرّب اللعبة خمس دقائق ثم نقرر».",
    "فعّل «قائد المهمة»: خصّص يومًا يكون فيه الطفل قائد ترتيب مهمة محددة قبل الخروج. علّمه كيف يطلب الدعم بأدب ويشكر من يتعاون معه.",
  ],
  intrapersonal: [
    "ابدأ «دفتر المشاعر»: قبل النوم اطرح سؤالين ثابتين: «ما أجمل لحظة اليوم؟ ما الشيء الذي أزعجك؟». ساعد الطفل على تسمية الشعور (فرح/خوف/غضب) واقترحا خطوة بسيطة للتعامل غدًا.",
    "هيّئ «زاوية هدوء»: ركن صغير فيه وسادة/كتاب تلوين/كرة ضغط. اتفق على استخدامها دقيقتين عندما ترتفع المشاعر ثم العودة للنشاط.",
    "حدّد «هدف الأسبوع»: هدف واحد صغير (ترتيب السرير). ارسم جدول 7 مربعات وضع نجمة عند النجاح. اختتم الأسبوع بنشاط بسيط تحفيزي مشترك.",
  ],
  naturalist: [
    "نفّذ «سفاري شرفة/حديقة»: اجمع مع الطفل 5 أشياء من الطبيعة حسب مهمة محددة (أشياء خضراء فقط/ناعمة فقط). التقط صورة ورتّب الأشياء حسب التشابه.",
    "ازرع «نبتة الكوب»: دوّن «يوم الريّ» على التقويم وسجّل ملاحظة أسبوعية قصيرة لما يتغير في النبتة.",
    "خصّص «دقيقة فضول»: شاهد مقطعًا قصيرًا عن كائن/ظاهرة. اسأل: «ما المعلومة الجديدة؟ ما سؤالنا لليوم القادم؟»، واكتب السؤال للبحث عنه لاحقًا.",
  ],
};

/** اقتراحات مراعية للعمر تُضاف فوق العامة */
type AgeBand = "younger" | "primary" | "older" | "generic";
const ageBandTipsMI: Record<
  MIKey,
  { younger: string[]; primary: string[]; older: string[] }
> = {
  linguistic: {
    younger: [
      "اعرض صور القصة دون نص واطلب من الطفل وصف الصورة بكلمتين. أعد صياغته بجملة صحيحة ليسمع النموذج.",
      "قدّم لعبة قافية بسيطة: اذكر كلمة، ثم اعرض خيارين لقافية، وعلى الطفل أن يختار المشابه في الصوت.",
    ],
    primary: [
      "بعد قراءة فقرة قصيرة اطلب «ملخصًا من ثلاث جمل»: بداية — أهم نقطة — خاتمة. زوّد الطفل بكلمات ربط: أولًا/ثم/أخيرًا.",
      "اكتب قائمة مشتريات من 5 عناصر واطلب وضع علامة ✓ عند العثور على كل عنصر في البيت.",
    ],
    older: [
      "اطلب فقرة رأي من 4–5 جمل مع بنية واضحة: رأيي — سبب 1 — سبب 2 — مثال — خاتمة.",
      "سجّل بودكاست عائلي دقيقتين: افتتاحية — فكرتان — خاتمة. استمع وسجل ملاحظة تحسين واحدة.",
    ],
  },
  logical: {
    younger: [
      "صنّف مكعبات حسب اللون ثم الحجم واشرح الفارق بجملة قصيرة.",
      "ركّب بازل 4–6 قطع مع تسمية الأشكال أثناء التركيب.",
    ],
    primary: [
      "استخدم جملة «إذا… فـ…» في روتين المنزل: إن أنهينا الواجب مبكرًا فسنلعب 10 دقائق. ناقش نتائج بديلة.",
      "ألعاب عدّ بسيطة لمدة دقيقتين ثم وصف كيفيّة الحل بكلمتين.",
    ],
    older: [
      "سودوكو مبتدئ مع شرح سبب صحّة كل خانة رئيسية.",
      "صمّم تجربة تبخّر الماء: توقّع — تجربة — ملاحظة — استنتاج بجملة واحدة.",
    ],
  },
  spatial: {
    younger: [
      "استخدم بازل صور كبيرة ثم اسأل: أين أعلى الصورة؟ أين اليسار؟",
      "فرز أشكال هندسية في أطباق مختلفة مع تسمية السمة.",
    ],
    primary: [
      "ارسم خريطة بسيطة للمنزل، ثم حدّد طريقًا ملوّنًا من الغرفة إلى المطبخ.",
      "ضع ملصقات لونية للمواد الدراسية ودرّب على إرجاع الدفاتر لصناديقها.",
    ],
    older: [
      "استخدم خرائط ذهنية للفصول: فكرة مركزية — ثلاث أفكار — مثال لكل فكرة.",
      "صمّم ملصقًا بصريًا لمفهوم مع صور وعناوين واضحة.",
    ],
  },
  musical: {
    younger: [
      "غنِّ أغانٍ قصيرة للحروف/الأرقام مع حركة يد متكررة ليومين متتاليين.",
      "قلّد إيقاعًا بسيطًا (قصير-قصير-طويل) ثم اطلب من الطفل ابتكار إيقاع مشابه.",
    ],
    primary: [
      "حوّل قاعدة بسيطة إلى لحن مرِح وكرّرها ثلاث مرات ثم اسأل دون لحن.",
      "طبّق تكرارًا لفظيًا مع طرق خفيف على الطاولة لإسناد الذاكرة السمعية.",
    ],
    older: [
      "اكتب أنشودة تعليمية قصيرة لقائمة أو تعريف وقدّمها للعائلة.",
      "قسّم نصًا طويلًا إلى مقاطع ولكل مقطع لحن بسيط للحفظ.",
    ],
  },
  bodily: {
    younger: [
      "نفّذ لعبة «قف/اجلس» وفق إشارة لونية، وبدّل الإشارات كل 20 ثانية.",
      "شكّل حرفًا أو رقمًا بالعجين مع تكرار اسمه بصوت مرتفع.",
    ],
    primary: [
      "سجّل توقّعات الطفو/الغرق ✓ قبل التجربة ثم قارن بالنتيجة.",
      "طبّق تهجئة بالحركة ثم اكتب على ورقة لتثبيت التعلم.",
    ],
    older: [
      "نفّذ نشاط DIY بسيطًا (مثل تركيب بطارية لعبة) ثم اكتب الخطوات التي اتُّبعت.",
      "استخدم دورة: 5 دقائق حركة + 15 دقيقة تركيز، وتكرّر مرتين.",
    ],
  },
  interpersonal: {
    younger: [
      "بدّل الأدوار لدقيقتين: الطفل يعلّمك شيئًا بسيطًا ثم تشكره على شرحه.",
      "دع الطفل يقود لعبة حرة 3 دقائق وامتدح تعليماته الواضحة.",
    ],
    primary: [
      "اعرض موضوعًا شفهيًا 60 ثانية مع شخص من العائلة أو صديق. جهّز 3 نقاط فقط.",
      "اكتبوا قاعدتين للّعبة والتزموا بهما 10 دقائق ثم قيّموا التجربة.",
    ],
    older: [
      "وزّع مهام مشروع منزلي صغير (جمع معلومات/تنسيق/تقديم) مع خطة واضحة.",
      "حلّ خلاف بسيط: حدّد المشكلة، استمع للرأيين، اتفق على خطوة واحدة للتجربة.",
    ],
  },
  intrapersonal: {
    younger: [
      "استخدم لوحة الوجوه للتعبير عن الشعور الحالي ثم اسأل: «ما الذي ساعدك/أزعجك؟».",
      "طبّق دقيقتي هدوء في ركن هادئ مع مؤقت رملي صغير.",
    ],
    primary: [
      "قيّم الهدوء/الإنجاز يوميًا من 1–5 واسأل: «كيف نرفعها درجة غدًا؟».",
      "هدف أسبوعي واحد مع نجوم ومراجعة نهائية لما ساعد على النجاح.",
    ],
    older: [
      "اكتب ثلاثة أسطر: ما حدث — ما شعرت — ما ستفعله المرة القادمة.",
      "أعد تسمية الفكرة المقلقة بعبارة واقعية ثم خطّتان بسيطتان للتعامل.",
    ],
  },
  naturalist: {
    younger: [
      "اجمع 3 أشياء من لون واحد في الحديقة/الشرفة وناقش الشبه بينها.",
      "ميّز أصواتًا طبيعية (مطر/ريح) ثم صفّق إيقاع الصوت.",
    ],
    primary: [
      "ضع جدول ريّ للنبتة مع صورة أسبوعية للمقارنة.",
      "صنّف أحجارًا/أوراقًا حسب الخشونة/اللون واشرح السبب بجملة.",
    ],
    older: [
      "اكتب بحثًا قصيرًا من 5 جمل عن كائن مفضّل مع صورة، وقدّمه للأسرة.",
      "قارن بيئتين (صحراء/غابة) في جدول: حرارة/مطر/حيوانات ثم استنتج جملة واحدة.",
    ],
  },
};

/** ===================== Big Five ===================== */
const labelsBig5: Record<Big5Key, string> = {
  E: "الانبساط الاجتماعي — سهولة التفاعل والتعبير مع الآخرين",
  A: "التعاطف والتعاون — الميل للمساعدة والتفاهم",
  C: "الاجتهاد والانضباط — تنظيم المهام والالتزام",
  N: "الاستقرار الانفعالي — الهدوء وإدارة المشاعر",
  O: "الانفتاح للتجربة — حب الاكتشاف وتقبّل الجديد",
};

const baseTipsBig5: Record<Big5Key, string[]> = {
  E: [
    "امنح الطفل دقيقة تقديم قصيرة داخل العائلة يشرح فيها لعبة يحبها. زوّده بجملة افتتاحية وخاتمة، ثم امدح وضوح صوته ونظره للحضور.",
    "استخدم لعبة جماعية صغيرة بقاعدة إنصات واضحة: من يمسك الكرة يتكلم 20 ثانية. بدّل الأدوار حتى يأخذ الجميع فرصته.",
  ],
  A: [
    "قدّم مدحًا فوريًا لأي سلوك تعاوني: «أعجبني أنك أعطيت القلم بلطف». هذا يعزّز التكرار.",
    "نفّذ مهام منزلية مشتركة بسيطة (مثل ترتيب طاولة) مع تقسيم أدوار واضح. اختتم بشكر متبادل محدّد.",
  ],
  C: [
    "جهّز جدول خطوات مصوّر لمهمة يومية (تحضير الحقيبة) مع علامة ✓ لكل خطوة فور إنجازها.",
    "خصص وقت تحضير مسائي ثابت لعشر دقائق دون مشتّتات، ثم احتفل بنهاية الوقت بنشاط قصير.",
  ],
  N: [
    "قبل أي تغيير في الروتين، اخبر الطفل بالخطوات: «سنخرج — نركب السيارة — نزور المكان 30 دقيقة — نعود». اسأله: «هل لديك سؤال؟».",
    "عند التوتر، درّبه على 3 أنفاس بطيئة: شهيق 3 ثوانٍ — حبس 2 — زفير 4. امدح المحاولة حتى لو لم يهدأ فورًا.",
  ],
  O: [
    "بدّل وسيلة التعلّم أحيانًا: قصة → فيديو قصير → مناقشة. اسأل: «ما الذي ساعدك على الفهم أكثر؟».",
    "اطلب من الطفل اقتراح طريقة مختلفة لإنجاز نفس الواجب، جرّبها لدقائق ثم قيّم المزايا والعيوب بجملتين.",
  ],
};

const ageBandTipsBig5: Record<
  Big5Key,
  { younger: string[]; primary: string[]; older: string[] }
> = {
  E: {
    younger: [
      "نادِ اسم الطفل بابتسامة ودرّبه على الرد بجملة كاملة مثل «أنا هنا» خمس مرات.",
      "غنّوا تحية صباحية قصيرة ثم طبّقوها مع شخص من العائلة.",
    ],
    primary: [
      "قدم موضوعًا شفهيًا 30–60 ثانية عن شيء يحبه مع ثلاث نقاط رئيسية.",
      "اجعل الطفل «قائد اليوم» لاختيار ترتيب تنفيذ مهمتين بسيطتين.",
    ],
    older: [
      "نفّذ نقاشًا منظمًا دقيقتين حول موضوع بسيط بمؤقّت ومن دون مقاطعة.",
      "لخّص فصلًا/فكرة بخريطة ذهنية وقدمها شفهيًا للأسرة.",
    ],
  },
  A: {
    younger: [
      "اطلب من الطفل مساعدتك في حمل غرض خفيف ثم قدّم شكرًا محددًا للسلوك.",
      "مثّل موقفًا قصيرًا (طفل فقد قلمه) واسأل: «كيف نواسيه؟».",
    ],
    primary: [
      "حدّد مناوبة أسبوعية لمهمة بسيطة (سقاية نبتة/ترتيب أحذية) مع بطاقة «القائد هذا الأسبوع».",
      "طبّق تبادل أدوار لفهم مشاعر الآخرين: شخص يروي موقفًا والآخر يعبّر بجملة تعاطف مناسبة.",
    ],
    older: [
      "انشط تطوعي عائلي صغير (تنظيف ركن/جمع كتب للتبرع) ثم ناقش المشاعر بعده.",
      "دفتر «موقف تعاطف» أسبوعي: تدوين موقف واحد ساعد فيه الطفل شخصًا آخر.",
    ],
  },
  C: {
    younger: [
      "استخدم سلالًا ملوّنة للتنظيم ودقّتين يوميًا لإعادة الأشياء إلى أماكنها.",
      "طبّق مؤقتًا رمليًا صغيرًا للتركيز أثناء نشاط قصير ثم راحة دقيقة.",
    ],
    primary: [
      "قسّم الواجب إلى خطوات صغيرة واشرح أن المطلوب الالتزام بالخطوات أكثر من الدرجة.",
      "ذكّر مساءً بتحضير الأغراض لليوم التالي وفق قائمة ثابتة.",
    ],
    older: [
      "صمّم تقويمًا أسبوعيًا بثلاث مهام أساسية ومواعيد محددة ومراجعة أسبوعية.",
      "قسّم مشروعًا إلى مراحل (بحث — مسودة — مراجعة) بتواريخ لكل مرحلة.",
    ],
  },
  N: {
    younger: [
      "بطاقات تهدئة بسيطة: «تنفّس — اشرب ماء — اجلس في ركن الهدوء». استخدم بطاقة واحدة في كل مرة.",
      "حافظ على روتين نوم ثابت يتضمن قصة قصيرة هادئة.",
    ],
    primary: [
      "حضّر مسبقًا لانتقال النشاط: «بعد 5 دقائق سنغلق التلفاز — نرتّب — نتجه للطاولة».",
      "سمِّ الشعور أولًا: «أرى أنك منزعج. هل تفضّل دقيقة هدوء أم حضنًا؟».",
    ],
    older: [
      "نفّذ ثلاثة أسطر تأمّل قبل النوم: حدث — شعور — خطة بسيطة.",
      "أعد صياغة الفكرة المقلقة بواقعية ثم اكتب خطوتين للتعامل معها غدًا.",
    ],
  },
  O: {
    younger: [
      "قدّم صندوق مفاجآت حسّية آمنة (ملمس/شكل) للتجربة لدقائق مع وصف ما يلاحظ.",
      "جرّب وسيلة رسم جديدة (أسفنجة/قطن) لنفس الفكرة.",
    ],
    primary: [
      "قم برحلة تعلمية قصيرة (مكتبة/حديقة) ثم جملة واحدة عمّا تعلّم الطفل.",
      "دع الطفل يختار وسيلة الشرح المفضلة: رسم/قصة/تمثيل قصير.",
    ],
    older: [
      "مشروع صغير يختار فكرته وينفّذ خطوة أسبوعية ثابتة.",
      "قارن طريقتين للتعلّم جرّبهما: أيهما زاد الفهم؟ ولماذا؟",
    ],
  },
};

/** ===================== VAK ===================== */
const VAKLabels: Record<VAKKey, string> = {
  visual: "بصري (يتعلّم بالصور والألوان والخرائط)",
  auditory: "سمعي (يتعلّم بالشرح والسماع والتكرار اللفظي)",
  kinesthetic: "حركي (يتعلّم بالتجربة واللمس والحركة)",
};

const VAKQuick: Record<VAKKey, string> = {
  visual:
    "لوليّ الأمر: استخدم خرائط ذهنية بألوان ثابتة لكل مادة، وبطاقات مصوّرة للمفاهيم. عند الشرح، قدّم مثالًا مرسومًا قبل الحديث المطوّل.",
  auditory:
    "لوليّ الأمر: قدّم الفكرة بجملة واضحة ثم اطلب إعادة صياغتها بصوت الطفل. استخدم تسجيلاً صوتيًا قصيرًا عند صعوبة الحفظ.",
  kinesthetic:
    "لوليّ الأمر: حوّل المعلومة إلى نشاط عملي (لمس/تركيب/تجربة). طبّق دورة (5 دقائق حركة + 10 دقائق تركيز) مرتين ثم استراحة.",
};

/** اختيار فئة العمر من إجابات النموذج (إن وُجدت) */
function pickAgeBand(ans: Record<string, any> | null): AgeBand {
  const ageAns = (ans?.["age"] ?? "") as string;
  if (ageAns.includes("أقل من 4")) return "younger";
  if (ageAns.includes("4–6")) return "younger";
  if (ageAns.includes("7–9")) return "primary";
  if (ageAns.includes("10–13")) return "older";
  return "generic";
}

/** أداة دمج الاقتراحات حسب العمر */
function ageAware(
  band: AgeBand,
  genericList: string[],
  bandMap?: { younger?: string[]; primary?: string[]; older?: string[] }
) {
  if (!bandMap) return genericList;
  if (band === "younger" && bandMap.younger?.length)
    return [...bandMap.younger, ...genericList];
  if (band === "primary" && bandMap.primary?.length)
    return [...bandMap.primary, ...genericList];
  if (band === "older" && bandMap.older?.length)
    return [...bandMap.older, ...genericList];
  return genericList;
}

/** لون شريط الدعم الأسري */
function envColor(level: "منخفض" | "متوسط" | "عال") {
  if (level === "عال") return "bg-green-500";
  if (level === "متوسط") return "bg-yellow-400";
  return "bg-red-500";
}

/** يبني ملخّصًا قصيرًا شخصيًا */
function buildSummary(miKey: MIKey, vakKey: VAKKey, topTrait: Big5Key) {
  const miTxt = labelsMIshort[miKey];
  const vakTxt =
    vakKey === "visual" ? "بصري" : vakKey === "auditory" ? "سمعي" : "حركي";
  const traitTxt: Record<Big5Key, string> = {
    E: "يميل للتعبير والتفاعل الاجتماعي عندما تُتاح له فرصة آمنة ومنظمة",
    A: "يميل للتعاطف والتعاون ويستجيب للمدح المحدّد",
    C: "يُظهر قابلية للالتزام عند تقسيم المهام إلى خطوات واضحة وزمن محدد",
    N: "يستفيد من التهيئة المسبقة والروتين الواضح لخفض التوتّر",
    O: "ينجذب للتجربة وطرق التعلّم الجديدة إذا كانت منظمة",
  };
  return `يميل طفلك إلى نمط تعلّم ${vakTxt}، وأقوى ذكاء لديه ${miTxt}. ${
    traitTxt[topTrait]
  }. ابدأ بأنشطة قصيرة (10–15 دقيقة)، وثبّت طريقة عرض المعلومة بما يناسب هذا النمط، ثم زِد الصعوبة تدريجيًا.`;
}

/** مولّد «مهمة اليوم» دقيقة واحدة */
function generateTodayTask(
  topMI: MIKey,
  topVAK: VAKKey,
  envLevel: "منخفض" | "متوسط" | "عال"
) {
  const envPrefix =
    envLevel === "عال"
      ? "ابدأ مباشرة دون تمهيد طويل: "
      : envLevel === "متوسط"
      ? "ثبّت مؤقّتًا لدقيقة وقل: «سنجرّب خطوة سريعة»: "
      : "هيّئ الجو أولًا بإغلاق المشتتات لثلاثين ثانية، ثم: ";

  const vakCue: Record<VAKKey, string> = {
    visual: "استخدم بطاقة/رسمًا صغيرًا قبل الكلام.",
    auditory: "ابدأ بجملة واضحة واطلب تكرارها بصوت الطفل.",
    kinesthetic: "حوّل الخطوة إلى لمس/تركيب/حركة بسيطة.",
  };

  const miStep: Record<MIKey, string> = {
    linguistic:
      "اكتب كلمة جديدة على بطاقة وارسم معها مثالًا واحدًا، ثم اطلب من الطفل استخدامها في جملة قصيرة.",
    logical:
      "اطرح سؤال «لماذا/كيف» عن موقف اليوم واسمح بإجابة جملة واحدة مع سبب واحد واضح.",
    spatial:
      "ارسم خريطة صغيرة لفكرة/مكان بثلاث خانات فقط (عنوان/سهم/رمز)، ودع الطفل يضيف رمزًا واحدًا يوضّح الفكرة.",
    musical:
      "قل المعلومة بلحن قصير مع تصفيق مرة واحدة، ثم اطلب من الطفل تكرارها بنفس الإيقاع.",
    bodily:
      "قدّم اختيارًا عمليًا: ضع 3 بطاقات على الأرض بإجابات محتملة ودَع الطفل يقفز على الإجابة الصحيحة.",
    interpersonal:
      "قسّم دورين بسيطين (أنت تشرح وأنا أسمع لمدة 20 ثانية)، ثم بدّل الأدوار مرة واحدة.",
    intrapersonal:
      "اسأل: «ما أجمل لحظة اليوم؟» واكتب كلمة شعور واحدة على ورقة صغيرة واتفقا على خطوة واحدة للغد.",
    naturalist:
      "اطلب إحضار شيء من الطبيعة داخل المنزل/الشرفة وذكر صفة واحدة عنه (لون/ملمس) وربطه بفكرة درس اليوم.",
  };

  return `${envPrefix}${vakCue[topVAK]} ${miStep[topMI]}`;
}

/** خطة أسبوعية مبنية تلقائيًا */
function weeklyPlan(
  miTop: MIKey,
  vakTop: VAKKey,
  level: "منخفض" | "متوسط" | "عال"
) {
  const focus =
    vakTop === "visual"
      ? "خريطة/رسم/بطاقات"
      : vakTop === "auditory"
      ? "شرح شفهي/تسجيل صوتي"
      : "نشاط عملي/حركة";
  const envHint =
    level === "عال"
      ? "يمكنك رفع التحدي تدريجيًا بنهاية الأسبوع."
      : level === "متوسط"
      ? "حافظ على وقت يومي ثابت 10–15 دقيقة دون شاشات."
      : "ابدأ بخطوة واحدة فقط يوميًا وثبّت الروتين قبل زيادة التحدي.";
  const miCue = labelsMIshort[miTop];

  const days = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  const items = days.map((d, i) => {
    const step =
      i % 3 === 0
        ? `نشاط ${focus} يوضّح فكرة قصيرة مرتبطة بـ«${miCue}».`
        : i % 3 === 1
        ? `تكرار سريع لنشاط الأمس مع إضافة سؤال «لماذا؟» أو «كيف؟».`
        : `تطبيق عملي في الحياة اليومية وتصوير النتيجة أو تلخيصها بجملة.`;
    return { day: d, text: step };
  });
  return { envHint, items };
}

/** زر موحّد: «حوّل إلى مهمة اليوم» */
function TodayTaskButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-[#efeafd] text-[#3c2e7e] bg-[#fbfaff] hover:bg-white"
      title="توليد خطوة دقيقة واحدة لوليّ الأمر اليوم"
    >
      حوّل إلى مهمة اليوم
    </button>
  );
}

/** ===================== الصفحة ===================== */
export default function ResultsPage() {
  const [data, setData] = useState<StoredPayload>(null);
  const [answers, setAnswers] = useState<Record<string, any> | null>(null);
  const [todayTask, setTodayTask] = useState<string>(""); // الشريط السفلي

  useEffect(() => {
    try {
      const saved = localStorage.getItem("arouma_last_results");
      if (saved) setData(JSON.parse(saved));
    } catch {}
    try {
      const ans = localStorage.getItem("arouma_answers");
      if (ans) setAnswers(JSON.parse(ans));
    } catch {}
  }, []);

  const band: AgeBand = useMemo(() => pickAgeBand(answers), [answers]);

  if (!data) {
    return (
      <main dir="rtl" className="min-h-screen p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <p className="text-center">لا توجد نتائج محفوظة. فضلاً أعد الاختبار.</p>
          </Card>
        </div>
      </main>
    );
  }

  const { mi, vak, big5, environment } = data;

  const miSorted = Object.entries(mi.result).sort(
    (a, b) => b[1].percent - a[1].percent
  ) as [MIKey, (typeof mi)["result"][MIKey]][];

  const topMI = miSorted[0][0];
  const secondMI = miSorted[1]?.[0] ?? topMI;
  const topVAK = vak.ranking[0];
  const topTrait = (Object.entries(big5.percent).sort(
    (a, b) => (b[1] as number) - (a[1] as number)
  )[0][0] ?? "C") as Big5Key;

  const summary = buildSummary(topMI, topVAK, topTrait);
  const plan = weeklyPlan(topMI, topVAK, environment.level);

  /** أداة دمج اقتراحات حسب العمر */
  const mergeAge = (
    generic: string[],
    bandMap: { younger?: string[]; primary?: string[]; older?: string[] } | undefined
  ) => ageAware(band, generic, bandMap);

  /** توليد مهمة اليوم وإظهار الشريط */
  const makeTask = () => {
    const t = generateTodayTask(topMI, topVAK, environment.level);
    setTodayTask(t);
    // تمرير المهمة للذاكرة إن رغبت لاحقًا
    try {
      localStorage.setItem("arouma_today_task", t);
    } catch {}
  };

  /** أداة نسخ للمهمة */
  const copyTask = async () => {
    try {
      await navigator.clipboard.writeText(todayTask);
      // وميض بسيط
      alert("تم نسخ مهمة اليوم.");
    } catch {}
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F7F4FF] text-gray-800 p-6 md:p-12"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* رأس الصفحة الكبير + الملخص */}
        <div className="rounded-3xl border border-[#e9e3ff] bg-white p-6 md:p-8 shadow-[0_6px_30px_rgba(133,121,200,0.12)]">
          <div className="flex flex-col items-center text-center">
            <img alt="شعار أرومة" src="/logo.png" className="h-16 w-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#10B981] bg-clip-text text-transparent">
                نتائج تحليل أرومة
              </span>
            </h1>
            <p className="text-sm md:text-base text-[#4b4863] max-w-3xl">
              هذا التقرير يشرح ميول طفلك التعلمية والسلوكية ويقدّم لأنشطة منزلية قصيرة واضحة قابلة للتطبيق.
            </p>
            <div className="mt-4 flex gap-2 md:gap-3 justify-center flex-wrap">
              <Pill>النمط الأقوى: {VAKLabels[topVAK]}</Pill>
              <Pill>أقوى ذكاء: {labelsMIshort[topMI]}</Pill>
              <Pill>الثاني: {labelsMIshort[secondMI]}</Pill>
              <Pill>أبرز سمة: {labelsBig5[topTrait]}</Pill>
            </div>
            <div className="mt-5 max-w-3xl text-[#2f2c43] text-sm md:text-base leading-7 bg-[#fbfaff] border border-[#efeafd] rounded-2xl px-4 py-3">
              <strong className="text-[#3c2e7e]">ملخّص سريع لوليّ الأمر: </strong>
              {summary}
            </div>
          </div>
        </div>

        {/* ===== الذكاءات المتعددة ===== */}
        <Card
          title="الذكاءات المتعددة (من الأعلى إلى الأقل)"
          subtitle="يقصد بها الطرق التي يسهل بها التعلّم لدى الطفل: لغوي، منطقي، بصري، موسيقي، حركي، اجتماعي، تأمّلي، طبيعي. ارتفاع النسبة لا يعني «أفضلية» بل يعني أن هذا الأسلوب يسهّل الفهم ويزيد الدافعية."
          right={<TodayTaskButton onClick={makeTask} />}
        >
          <div className="space-y-4">
            {miSorted.map(([key, v]) => {
              const generic = baseTipsMI[key];
              const withAge = mergeAge(generic, ageBandTipsMI[key]);
              return (
                <div key={key} className="rounded-xl border border-[#efeafd] p-4 bg-white">
                  <Bar value={v.percent} labelLeft={labelsMI[key]} />
                  <details className="mt-3 group">
                    <summary className="cursor-pointer text-sm text-[#3c2e7e] select-none flex items-center gap-1">
                      <span className="opacity-60">▾</span>
                      أنشطة عملية واضحة لوليّ الأمر
                    </summary>
                    <div className="mt-2 space-y-3 text-sm leading-7 text-[#4b4863]">
                      {withAge.map((t, i) => (
                        <p key={i} className="bg-[#fbfaff] rounded-lg p-3 border border-[#efeafd]">
                          {t}
                        </p>
                      ))}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ===== أنماط التعلّم ===== */}
        <Card
          title="أنماط التعلّم (VAK)"
          subtitle="ثلاث طرق أساسية لعرض المعلومة: بصري بالصور والألوان والخرائط، سمعي بالشرح والسماع والتكرار اللفظي، حركي بالتجربة واللمس والحركة. اختر الطريقة الأقرب لطفلك ثم دعّمها بالطريقتين الأخريين تدريجيًا."
          right={<TodayTaskButton onClick={makeTask} />}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.keys(vak.absolute) as VAKKey[]).map((k) => (
              <div key={k} className="rounded-xl border border-[#efeafd] p-4 bg-white">
                <Bar value={vak.absolute[k]} labelLeft={VAKLabels[k]} />
                <p className="text-xs mt-2 text-[#4b4863]">{VAKQuick[k]}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-[#3c2e7e]">
            النمط الأقوى حاليًا: <strong>{VAKLabels[topVAK]}</strong>.
          </div>
        </Card>

        {/* ===== السمات الخمس الكبرى ===== */}
        <Card
          title="السمات الخمس الكبرى (تفسير مبسّط)"
          subtitle="هي توجهات سلوكية عامة تساعد وليّ الأمر على اختيار أسلوب التعامل اليومي: الانبساط الاجتماعي، التعاطف والتعاون، الاجتهاد والانضباط، الاستقرار الانفعالي، والانفتاح للتجربة. ليست أحكامًا ثابتة بل مؤشرات قابلة للتنمية."
          right={<TodayTaskButton onClick={makeTask} />}
        >
          <div className="space-y-4">
            {(Object.entries(big5.percent) as [Big5Key, number][]).map(
              ([k, val]) => {
                const generic = baseTipsBig5[k];
                const withAge = mergeAge(generic, ageBandTipsBig5[k]);
                return (
                  <div key={k} className="rounded-xl border border-[#efeafd] p-4 bg-white">
                    <Bar value={val} labelLeft={labelsBig5[k]} />
                    <details className="mt-3 group">
                      <summary className="cursor-pointer text-sm text-[#3c2e7e] select-none flex items-center gap-1">
                        <span className="opacity-60">▾</span>
                        كيف يطبّق وليّ الأمر ذلك يوميًا؟
                      </summary>
                      <div className="mt-2 space-y-3 text-sm leading-7 text-[#4b4863]">
                        {withAge.map((t, i) => (
                          <p key={i} className="bg-[#f3fffb] rounded-lg p-3 border border-[#e2f6ee]">
                            {t}
                          </p>
                        ))}
                      </div>
                    </details>
                  </div>
                );
              }
            )}
          </div>
        </Card>

        {/* ===== البيئة والدعم الأسري ===== */}
        <Card
          title="البيئة والدعم الأسري"
          subtitle="تقيس هذه النسبة جودة الجو المنزلي: وقت للحوار اليومي، تنظيم بسيط للروتين، تشجيع لفظي مباشر، وتصحيح السلوك بالحديث قبل العقاب. ارتفاعها يرتبط بثقة أعلى ودافعية أفضل وتقدم أكاديمي أسرع."
          right={<TodayTaskButton onClick={makeTask} />}
        >
          <Bar
            value={environment.supportPercent}
            labelLeft={`مستوى الدعم الأسري: ${environment.level}`}
            colorClass={envColor(environment.level)}
          />
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#efeafd] p-4 bg-[#faf9ff]">
              <h4 className="font-medium text-[#3c2e7e] mb-1 text-sm">
                خطوات عملية لرفع المستوى
              </h4>
              <p className="text-sm text-[#4b4863] leading-7">
                ثبّت وقت «حديث عائلي» 10 دقائق يوميًا دون شاشات (سؤالان ثابتان:
                «ما أجمل لحظة؟» و«هل تحتاج مساعدة؟»). جهّز جدولًا مصورًا
                للنوم/الدراسة/اللعب والتزم به 5 أيام متتالية ثم قيّم ما الذي نجح.
                امدح الجهد مباشرة («أعجبني التزامك بالوقت») وابتعد عن المقارنة بين الأطفال.
              </p>
            </div>
            <div className="rounded-xl border border-[#efeafd] p-4 bg-[#f3fffb]">
              <h4 className="font-medium text-[#2f6e5d] mb-1 text-sm">معلومة تربوية</h4>
              <p className="text-sm leading-7 text-[#2f6e5d]">
                الانتظام أهم من الكمال: تأثير 10 دقائق ثابتة يوميًا يفوق جلسة طويلة متباعدة.
                ركّز على خطوة واحدة واضحة كل يوم، ثم زد التحدي تدريجيًا.
              </p>
            </div>
          </div>
        </Card>

        {/* ===== خطة أسبوعية مقترحة ===== */}
        <Card
          title="خطة أسبوعية مقترحة (10–15 دقيقة يوميًا)"
          subtitle={`مبنية على أقوى ذكاء (${labelsMIshort[topMI]}) وأقوى نمط (${VAKLabels[topVAK]}). ${plan.envHint}`}
          right={<TodayTaskButton onClick={makeTask} />}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {plan.items.map((it) => (
              <div
                key={it.day}
                className="rounded-xl border border-[#efeafd] bg-white p-4"
              >
                <div className="text-xs text-[#9b97b6] mb-2">{it.day}</div>
                <p className="text-sm leading-7 text-[#4b4863]">{it.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 text-[#9b97b6]">
            * يمكن لوليّ الأمر استبدال مثال اليوم بنشاط مشابه يناسب المادة أو الدرس الحالي.
          </p>
        </Card>

        {/* ===== أزرار أسفل الصفحة ===== */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-2 rounded-xl text-white font-semibold bg-[#6D28D9] hover:opacity-95 shadow-md"
          >
            العودة إلى الصفحة الرئيسية
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-xl text-[#3c2e7e] font-semibold border border-[#efeafd] bg-white hover:bg-[#fbfaff]"
          >
            طباعة/حفظ PDF
          </button>
        </div>

        <p className="text-center text-xs text-[#9b97b6]">
          * يُفضّل إعادة قراءة هذا التقرير بعد أسبوعين مع ملاحظة ما تغيّر لتحديث الخطة.
        </p>
      </div>

      {/* ===== شريط «مهمة اليوم» السفلي ===== */}
      {todayTask && (
        <div className="fixed inset-x-0 bottom-3 px-4">
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#efeafd] bg-white shadow-[0_6px_30px_rgba(133,121,200,0.12)] p-4">
            <div className="flex items-start gap-3">
              <div className="text-[#6D28D9] mt-0.5">🗓️</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#3c2e7e] mb-1">
                  مهمة اليوم (دقيقة واحدة)
                </div>
                <div className="text-sm text-[#4b4863] leading-7">
                  {todayTask}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyTask}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#efeafd] text-[#3c2e7e] bg-[#fbfaff] hover:bg-white"
                  title="نسخ المهمة"
                >
                  نسخ
                </button>
                <button
                  onClick={() => setTodayTask("")}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#f3e7ea] text-[#7a2a36] bg-[#fff7f8] hover:bg-white"
                  title="إغلاق"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
