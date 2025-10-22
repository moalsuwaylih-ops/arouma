"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type MiResult = Record<string, { sum: number; max: number; percent: number }>;
type VAK = {
  percent: { visual: number; auditory: number; kinesthetic: number };
  ranking: Array<"visual" | "auditory" | "kinesthetic" | string>;
};
type Big5 = { percent: { E: number; O: number; A: number; C: number; N: number } };
type Env = { supportScore: number; supportPercent: number; level: "عالي" | "متوسط" | "منخفض" };

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("arouma_last_results");
      if (saved) setData(JSON.parse(saved));
    } catch {}
  }, []);

  // ✅ لا نُرجِع مبكرًا. بدله فلاغ + قيم افتراضية آمنة
  const hasData = !!data;

  const childName: string = data?.childName || "طفلك";
  const mi: { result: MiResult; ranking: string[] } =
    data?.mi || { result: {}, ranking: [] };
  const vak: VAK =
    data?.vak || { percent: { visual: 0, auditory: 0, kinesthetic: 0 }, ranking: [] };
  const big5: Big5 =
    data?.big5 || { percent: { E: 0, O: 0, A: 0, C: 0, N: 0 } };
  const env: Env =
    data?.environment || { supportScore: 0, supportPercent: 0, level: "منخفض" };
  const recs: string[] = data?.recs || [];

  /** ==== الهوية: ألوان/ستايلات متناسقة مع المشروع ==== */
  const brand = {
    gradFrom: "#7b5fe8",
    gradTo: "#49d5a3",
    ink: "#3c2e7e",
    sub: "#5b5672",
    cardBorder: "#efeafd",
    cardGlow: "0 10px 40px rgba(125,115,185,0.12)",
  };

  /** ==== خرائط تسميات وشرح مبسّط ==== */
  const miLabels: Record<string, string> = {
    linguistic: "لغوي/لساني",
    logical: "منطقي/رياضي",
    spatial: "بصري/فراغي",
    musical: "موسيقي/إيقاعي",
    bodily: "حركي/جسدي",
    interpersonal: "اجتماعي/تفاعلي",
    intrapersonal: "ذاتي/تأمّلي",
    naturalist: "طبيعي/بيئي",
  };
  const miExplain: Record<string, string> = {
    linguistic: "يميل للفهم عبر الكلمات والقصص والحوار ويحب سرد الأحداث والتعبير اللفظي",
    logical: "يفكر بخطوات وتسلسل، ويستمتع بالألغاز والمنطق والأرقام و”كيف تعمل الأشياء؟“",
    spatial: "يتعلّم أفضل عبر الصور والألوان والمكعبات والخرائط الذهنية والتخيل",
    musical: "يلتقط الإيقاعات بسرعة ويستفيد من المسموعات لحفظ المعلومات",
    bodily: "يتعلم بالممارسة والحركة ولمس الأشياء ويناسبه تحويل التعلم إلى نشاط جسدي",
    interpersonal: "يزدهر في العمل الجماعي والتفاعل ويتعلم عبر الأدوار الاجتماعية والنقاش",
    intrapersonal: "يحب العمل الهادئ والتفكير الذاتي ويناسبه أن يكون له دفتر يعبر فيه كتابةً أفكاره ومشاعره وتجربته اليومية ",
    naturalist: "تجذبه الطبيعة والزراعة والحيوانات والأنشطة الخارجية ويحب تصنيف الأشياء وترتيبها ",
  };

  const vakLabel: Record<keyof VAK["percent"], string> = {
    visual: "بصري",
    auditory: "سمعي",
    kinesthetic: "حركي",
  };
  const vakExplain: Record<keyof VAK["percent"], string> = {
    visual: "يفهم أكثر مع الصور والبطاقات والألوان والمخططات.",
    auditory: "يتعلم من الشرح الشفهي والقصص والتكرار اللفظي.",
    kinesthetic: "يتقن عند التجريب واللعب العملي والأنشطة الحركية.",
  };

  const big5Label = {
    E: "الانبساط/الاجتماعية",
    O: "الانفتاح للتجربة",
    A: "التوافق/التعاطف",
    C: "الاجتهاد/الانضباط",
    N: "الحساسية الانفعالية",
  } as const;
  const big5Explain: Record<keyof Big5["percent"], string> = {
    E: " كلما ارتفعت النسبة، دل ذلك على ميل للمشاركة واللعب مع الآخرين",
    O: " كلما ارتفعت النسبة، دل ذلك على حب الاكتشاف والتعلم الذاتي والفضول والتجارب الجديدة",
    A: "كلما ارتفعت النسبة، دل ذلك على انسجام عاطفي أكبر مع الآخرين",
    C: " كلما ارتفعت النسبة، دل ذلك على التزام بالمهام والتعليمات",
    N: "كلما ارتفعت النسبة، دل ذلك على حساسية عاطفية أكبر ",
  };

  /** ==== فقرة سردية مُبسّطة ==== */
  const narrative = useMemo(() => {
    if (!hasData) return []; // ✅ حراسة لمنع إنشاء نصوص بدون بيانات
    const topMI = (mi?.ranking || []).slice(0, 3);
    const topMIText = topMI.map((k) => miLabels[k] || k).join("، ");
    const vakTop = vak?.ranking?.[0] as keyof VAK["percent"] | undefined;

    const parts: string[] = [];
    parts.push(
      `هذه خلاصة مبسّطة تساعدك على فهم ميول ${childName} التعلميّة والسلوكيّة، مع اقتراحات قصيرة قابلة للتطبيق في المنزل.`
    );
    if (topMI?.length) {
      parts.push(
        `تبرُز لدى ${childName}: ${topMIText}. كلما صممنا الأنشطة بما يناسب هذه الجوانب صار التعلم أسهل ومتعة أكبر.`
      );
    }
    if (vakTop) {
      parts.push(`في أنماط التعلم، النمط الغالب: **${vakLabel[vakTop]}** — ${vakExplain[vakTop]}.`);
    }
    const topTraits = Object.entries(big5?.percent || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([k, v]) => `**${big5Label[k as keyof Big5["percent"]]} (${v}%)**`)
      .join(" و ");
    if (topTraits) parts.push(`سمات الشخصية الأبرز: ${topTraits}.`);
    if (env) {
      parts.push(
        `الدعم الأسري حاليًا **${env.level}** (${env.supportPercent}%). كلما ارتفع، سهل تنفيذ الأنشطة بثبات وطمأنينة.`
      );
    }
    return parts;
  }, [hasData, childName, mi, vak, big5, env]);

  /** ==== خطة أسبوعية منوّعة (تبديل حسب أعلى MI + تعزيزات VAK + بهارات Big5) ==== */
  const weeklyPlan = useMemo(() => {
    const weekDays = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];

    const topMIs = (mi?.ranking || []).slice(0, 2);
    const primaryMI = topMIs[0] || "linguistic";
    const secondaryMI = topMIs[1] || primaryMI;

    const vakTop = (vak?.ranking?.[0] as keyof VAK["percent"]) || "visual";

    const byMI: Record<string, string[]> = {
      linguistic: [
        "قصة قصيرة ثم يسرد ${الطفل} أحداثها بثلاث جُمل.",
        "لعبة مفردات: 5 كلمات جديدة + جملة لكل كلمة.",
        "تأليف عنوان/سطرين لملصق صغير عن موضوع تعلمناه.",
      ],
      logical: [
        "لغز عددي بسيط أو بازل وترتيب خطوات الحل.",
        "تحدّي “لماذا/كيف تعمل؟” حول شيء في البيت.",
        "تصنيف 6 أشياء لمجموعتين وشرح سبب التصنيف.",
      ],
      spatial: [
        "ليغو/مكعبات لصناعة شكل ثم وصفه.",
        "خريطة ذهنية صغيرة لدرس أو قصة.",
        "رسم ملصق قبل/بعد لنفس الفكرة.",
      ],
      musical: [
        "أنشودة/إيقاع لحفظ 3 معلومات.",
        "العد على إيقاع والتصفيق بالنمط.",
        "تسجيل صوتي يلخّص ما تعلّمناه بنغمة خفيفة.",
      ],
      bodily: [
        "تعلم بالحركة: تهجئة بالحركات/قفز عددي.",
        "تجربة يدوية سريعة (طين/رمل/ماء).",
        "ترتيب خطوات نشاط على الأرض ومشيها.",
      ],
      interpersonal: [
        "لعب ثنائي بدورين مع تبادل الدور.",
        "حوار قصير عن موقف وتقمص الأدوار.",
        "شرح الفكرة لشخص في البيت (المعلم الصغير).",
      ],
      intrapersonal: [
        "دفتر مشاعر: أرسم وجهي اليوم + سببان.",
        "وقت هادئ: 10 دقائق عمل فردي يختاره.",
        "هدف صغير لليوم + نجمة إن أنجزه.",
      ],
      naturalist: [
        "مراقبة نبات/حشرة وتسجيل ملاحظتين.",
        "جمع/تصنيف أشياء طبيعية (أوراق/حصى).",
        "سقي/رعاية نبتة + صورة قبل/بعد.",
      ],
    };

    // تعزيزات متنوّعة حسب VAK (تدور خلال الأسبوع)
    const boosters: Record<keyof VAK["percent"], string[]> = {
      visual: [
        "أضف بطاقة/رسم/لون لكل خطوة.",
        "صُوِّر ملصق قبل/بعد للنشاط.",
        "استخدم مخططًا صغيرًا بنقاط/أسهم.",
      ],
      auditory: [
        "اشرح شفهيًا أولًا ثم ناقش بصوتٍ عالٍ.",
        "سجّل ملخصًا صوتيًا في نهاية النشاط.",
        "كرّر الكلمات المفتاحية كـ “كلمة اليوم”.",
      ],
      kinesthetic: [
        "حوّل كل خطوة إلى حركة/لمس/تجريب.",
        "استراحة حركة 30 ثانية كل 3 دقائق.",
        "استخدم أدوات ملموسة قدر الإمكان.",
      ],
    };

    const b = big5?.percent || { N:50, C:50, E:50, O:50, A:50 };

    return weekDays.map((day, i) => {
      // نبدّل بين أعلى MI وأعلى MI ثاني
      const miKey = i % 2 === 0 ? primaryMI : secondaryMI;
      const bank = byMI[miKey] || byMI.linguistic;

      // نختار نشاطين مختلفين كل يوم بالدوران على القائمة
      const act1 = bank[i % bank.length];
      const act2 = bank[(i + 1) % bank.length];

      // نعزّز ببوستر VAK متغيّر
      const boosterPack = boosters[vakTop];
      const booster = boosterPack[i % boosterPack.length];

      // “بهارات” شخصية خفيفة من Big5 (نضيف واحدة فقط يوميًا)
      const spices: string[] = [];
      if (b.N >= 65 && i % 2 === 0) spices.push("ابدأ بدقيقتين تنفّس هادئ وانتقال واضح بين المهام.");
      if (b.C < 45 && spices.length === 0)  spices.push("قسّم المهمة إلى 3 خطوات قصيرة مع متابعة لطيفة.");
      if (b.E >= 65 && spices.length === 0)  spices.push("أدخل عنصرًا اجتماعيًا: تبادل أدوار/شرح لشخص آخر.");
      if (b.O >= 65 && spices.length === 0)  spices.push("اختر طريقة جديدة اليوم لنفس الهدف (تنويع بسيط).");

      return {
        day,
        items: [
          act1.replace("${الطفل}", childName),
          act2.replace("${الطفل}", childName),
          `تعزيز VAK: ${booster}`,
          ...(spices[0] ? [`مراعاة شخصية: ${spices[0]}`] : []),
        ],
      };
    });
  }, [mi, vak, big5, childName]);

  /** ==== عناصر واجهة مساعدة ==== */
  const Bar = ({ value }: { value: number }) => (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className="h-2 rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${brand.gradFrom}, ${brand.gradTo})`,
        }}
      />
    </div>
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen text-gray-800 p-6 md:p-12"
      style={{ background: "linear-gradient(to bottom, #f7f6ff, #ffffff)" }}
    >
      <div
        className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-10"
        style={{ border: `1px solid ${brand.cardBorder}`, boxShadow: brand.cardGlow }}
      >
        {/* شعار + عنوان */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="شعار أرومة"
            width={120}
            height={120}
            className="object-contain select-none"
            priority
          />
          <h1 className="text-3xl font-extrabold text-center mt-2" style={{ color: brand.ink }}>
            نتائج تحليل أرومة
          </h1>
          <p className="text-sm mt-1" style={{ color: brand.sub }}>
            تفسير مبسّط & ماذا يعني عمليًا في البيت
          </p>
        </div>

        {/* ✅ رسالة عدم وجود بيانات (بدون return مبكر) */}
        {!hasData && (
          <div className="text-center rounded-2xl p-6" style={{ border: `1px solid ${brand.cardBorder}`, background: "#fbfaff" }}>
            <p className="text-gray-700">🚫 لم يتم العثور على نتائج.</p>
            <a href="/" className="text-[#7b5fe8] underline mt-4 inline-block">
              العودة للصفحة الرئيسية
            </a>
          </div>
        )}

        {/* بقية المحتوى يُعرض فقط عند وجود بيانات */}
        {hasData && (
          <>
            {/* فقرة سردية */}
            {narrative?.length ? (
              <div
                className="rounded-2xl p-5 mb-8"
                style={{ border: `1px solid ${brand.cardBorder}`, background: "#fbfaff" }}
              >
                {narrative.map((p: string, i: number) => (
                  <p key={i} className="text-[0.98rem] leading-8 mb-2" style={{ color: brand.ink }}>
                    <span dangerouslySetInnerHTML={{ __html: p }} />
                  </p>
                ))}
              </div>
            ) : null}

            {/* الذكاءات المتعددة */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2" style={{ color: brand.ink }}>
                الذكاءات المتعددة
              </h2>
              <div className="space-y-3">
                {Object.entries(mi.result).map(([k, v]) => (
                  <div key={k} className="rounded-xl p-3" style={{ border: "1px solid #f0f0f5" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{miLabels[k] || k}</span>
                      <span className="text-sm text-gray-600">{v.percent}%</span>
                    </div>
                    <Bar value={v.percent} />
                    {miExplain[k] && <p className="text-sm text-gray-600 mt-2">{miExplain[k]}</p>}
                  </div>
                ))}
              </div>
              {mi.ranking?.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  الأقوى: {mi.ranking.slice(0, 3).map((k) => miLabels[k] || k).join("، ")}
                </p>
              )}
            </section>

            {/* VAK */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2" style={{ color: brand.ink }}>
                أنماط التعلم (VAK)
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {(Object.entries(vak.percent) as Array<[keyof VAK["percent"], number]>).map(([k, v]) => (
                  <div key={k} className="rounded-xl p-3" style={{ border: "1px solid #f0f0f5" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{vakLabel[k]}</span>
                      <span className="text-sm text-gray-600">{v}%</span>
                    </div>
                    <Bar value={v} />
                    <p className="text-sm text-gray-600 mt-2">{vakExplain[k]}</p>
                  </div>
                ))}
              </div>
              {vak.ranking?.[0] && (
                <p className="mt-2 text-sm text-gray-600">
                  النمط الأقوى: {vakLabel[vak.ranking[0] as keyof VAK["percent"]] || vak.ranking[0]}
                </p>
              )}
            </section>

            {/* Big Five */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2" style={{ color: brand.ink }}>
                السمات الخمس الكبرى (تقريبي مبسّط)
              </h2>
              <div className="space-y-3">
                {(Object.entries(big5.percent) as Array<[keyof Big5["percent"], number]>).map(([k, v]) => (
                  <div key={k} className="rounded-xl p-3" style={{ border: "1px solid #f0f0f5" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{big5Label[k]}</span>
                      <span className="text-sm text-gray-600">{v}%</span>
                    </div>
                    <Bar value={v} />
                    <p className="text-sm text-gray-600 mt-2">{big5Explain[k]}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* البيئة الأسرية */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2" style={{ color: brand.ink }}>
                البيئة الأسرية والدعم
              </h2>
              <div className="rounded-xl p-4" style={{ border: "1px solid #f0f0f5" }}>
                <p className="text-gray-700 mb-2">
                  مستوى الدعم: <strong>{env.level}</strong> ({env.supportPercent}%)
                </p>
                <Bar value={env.supportPercent} />
                <p className="text-sm text-gray-600 mt-3">
                 <strong>ما معنى هذه النسبة؟ </strong>  
   هي درجة توضّح مدى تهيئة البيئة المنزلية لدعم تعلّم ونمو الطفل وتم احتسابها بناءً على إجاباتك.
  كلما كانت النسبة أعلى، دلَّ ذلك على أن البيئة المنزلية داعمة ومعززة للطفل.
               </p>
              {/* نصائح حسب المستوى */}
            <ul className="list-disc pr-5 mt-3 text-sm text-gray-700">
              {env.level === "عالي" && (
                <>
                  <li>استمر على روتين يومي قصير (10–15 دقيقة) وثبّت موعده.</li>
                  <li>امنح الطفل مساحة اختيار نشاط واحد يوميًا لزيادة الدافعية.</li>
                </>
              )}
              {env.level === "متوسط" && (
                <>
                  <li>ابدأ بنشاط واحد صغير بعد وقت هادئ ثابت (مثلاً بعد العشاء).</li>
                  <li>حضّر الأدوات مسبقًا في صندوق صغير لتقليل التشتت.</li>
                </>
              )}
              {env.level === "منخفض" && (
                <>
                  <li>خفّض التوقعات: 5–7 دقائق نشاط بسيط تكفي كبداية.</li>
                  <li>ركّز على جو آمن ومشجّع قبل جودة الأداء، ثم زد بالتدرّج.</li>
                </>
              )}
            </ul>
          </div>
        </section>
              

            {/* التوصيات السريعة */}
            {recs?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2" style={{ color: brand.ink }}>
                  ماذا أفعل الآن؟ 💡
                </h2>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  {recs.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* الخطة الأسبوعية */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3" style={{ color: brand.ink }}>
                خطة أسبوعية مقترحة (10–15 دقيقة يوميًا)
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {weeklyPlan.map(({ day, items }) => (
                  <div
                    key={day}
                    className="rounded-2xl p-4"
                    style={{ border: `1px solid ${brand.cardBorder}`, background: "#ffffff" }}
                  >
                    <div
                      className="inline-flex items-center justify-center rounded-xl px-3 py-1 text-white text-sm font-semibold mb-3"
                      style={{ background: `linear-gradient(90deg, ${brand.gradFrom}, ${brand.gradTo})` }}
                    >
                      {day}
                    </div>
                    <ul className="list-disc pr-5 space-y-1 text-[0.95rem]" style={{ color: brand.sub }}>
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: brand.sub }}>
                تلميح: يمكنك تبديل الأيام بحرية. المهم الثبات على وقت قصير يومي مع أجواء هادئة ومشجّعة.
              </p>
            </section>
          </>
        )}

        {/* أزرار إجراء (تظهر دائمًا) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a
            href="/"
            className="px-6 py-3 rounded-xl text-white font-semibold shadow-md transition"
            style={{ background: `linear-gradient(90deg, ${brand.gradFrom}, ${brand.gradTo})` }}
          >
            العودة إلى الصفحة الرئيسية
          </a>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl font-semibold border"
            style={{ borderColor: brand.cardBorder, color: brand.ink }}
          >
            طباعة/حفظ PDF
          </button>
        </div>
      </div>
    </main>
  );
}
