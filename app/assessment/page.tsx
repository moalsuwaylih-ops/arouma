"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import AssessmentPage, { formSections } from "./arouma-form";

export default function Page() {
  const [started, setStarted] = useState(false);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);

  // حساب الأرقام ديناميكيًا من نموذج الأسئلة
  const { visibleSections, totalQuestions, estMinutes } = useMemo(() => {
    const sectionsWithQs = formSections.filter((s) => (s.questions?.length ?? 0) > 0);
    const qs = sectionsWithQs.reduce((sum, s) => sum + (s.questions?.length ?? 0), 0);
    const est = Math.min(18, Math.max(10, Math.round(qs * 0.2))); // تقدير سريع
    return { visibleSections: sectionsWithQs.length, totalQuestions: qs, estMinutes: est };
  }, []);

  useEffect(() => {
    if (started) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [started]);

  if (started) return <AssessmentPage />;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F7F4FF] to-white text-gray-800 p-6 md:p-12"
    >
      <div className="relative max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)] p-8 md:p-10 border border-[#f0ecfa] overflow-visible">
        {/* الشعار أعلى البطاقة */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="شعار أرومة"
            width={120}
            height={120}
            className="object-contain drop-shadow-md select-none"
            priority
          />
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-center leading-relaxed">
          <span className="bg-gradient-to-r from-[#6D28D9] to-[#10B981] bg-clip-text text-transparent">
            اختبار أرومة لتحليل شخصية وذكاءات طفلك
          </span>
        </h1>

        {/* فقرة تمهيدية عامة لوليّ الأمر */}
        <p className="mt-5 text-lg md:text-xl text-center text-[#4b4863] leading-8">
          نقدم لك <strong>تحليلًا علميًا دقيقًا</strong> لشخصية طفلك وميوله ونقاط قوته.
          <br />
          يقيس <strong>اختبار أرومة</strong> الجوانب <strong>الشخصية</strong>،
          و<strong>الذكاءات المتعددة</strong>، و<strong>أنماط التعلّم</strong>،
          و<strong>التفاعل الاجتماعي والانفعالي</strong>، و<strong>الدافعية</strong>،
          و<strong>الدعم الأسري البيئي</strong> مستندًا إلى مجموعة من النظريات التربوية والنفسية المعتمدة.
        </p>

        {/* الإطار العلمي المستخدم (كل النظريات) */}
        <div className="mt-8 bg-[#faf9ff] rounded-2xl p-6 border border-[#efeafd]">
          <h2 className="text-xl font-semibold text-[#3c2e7e] mb-3">الإطار العلمي المستخدم</h2>
          <p className="text-[#4b4863] leading-7">
            يعتمد الاختبار على المراجع والنماذج التالية:
          </p>
          <ul className="list-disc pr-6 space-y-2 text-[#4b4863] leading-7 mt-3">
            <li>
              <strong>سمات الشخصية العامة:</strong> المزاج (Temperament) &amp;{" "}
              العوامل الخمسة الكبرى <em>(Big Five)</em>.
            </li>
            <li>
              <strong>التفاعل الاجتماعي والانفعالي:</strong> نظرية النمو النفسي-الاجتماعي لإريكسون{" "}
              <em>(Erikson)</em>، النظرية الاجتماعية-الثقافية لفيجوتسكي <em>(Vygotsky)</em>، والذكاء العاطفي
              لقولمان <em>(Goleman)</em>.
            </li>
            <li>
              <strong>أنماط التعلّم:</strong> نموذج <em>VAK</em> (بصري/سمعي/حركي) ونموذج كولب{" "}
              <em>(Kolb’s Experiential Learning)</em>.
            </li>
            <li>
              <strong>الدافعية:</strong> هرم ماسلو للحاجات <em>(Maslow)</em> ونظرية تحديد الذات{" "}
              <em>(Self-Determination Theory: Deci &amp; Ryan)</em>.
            </li>
            <li>
              <strong>الذكاءات والميول:</strong> نظرية الذكاءات المتعددة لــغاردنر{" "}
              <em>(Gardner’s Multiple Intelligences)</em>.
            </li>
            <li>
              <strong>البيئة والأسرة:</strong> نظرية الأنظمة البيئية لبروفنبرنر{" "}
              <em>(Bronfenbrenner’s Ecological Systems Theory)</em>.
            </li>
          </ul>

          {/* شارات صغيرة للأسماء (للمظهر فقط) */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Big Five",
              "Temperament",
              "Erikson",
              "Vygotsky",
              "Goleman (EI)",
              "VAK",
              "Kolb",
              "Maslow",
              "Self-Determination",
              "Gardner (MI)",
              "Bronfenbrenner",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs rounded-full border border-[#efeafd] bg-[#fbfaff] px-3 py-1 text-[#3c2e7e]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* نقاط القيمة السريعة (أرقام ديناميكية) */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#efeafd] bg-[#faf9ff] p-5">
            <p className="text-2xl">🗂️</p>
            <p className="mt-2 font-semibold text-[#3c2e7e]">9 أقسام تربوية</p>
            <p className="text-[#6b64a3] text-sm mt-1">تغطي الجوانب النفسية والسلوكية والتعليمية.</p>
          </div>
          <div className="rounded-2xl border border-[#e2f6ee] bg-[#f3fffb] p-5">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold text-[#2f6e5d]">53 سؤالًا علميًا</p>
            <p className="text-[#5b5672] text-sm mt-1">أسئلة مبنية على أدوات قياس حديثة وواضحة.</p>
          </div>
          <div className="rounded-2xl border border-[#fff1d7] bg-[#fff9eb] p-5">
            <p className="text-2xl">⏰</p>
            <p className="mt-2 font-semibold text-[#7a5a1e]">10–15 دقيقة فقط</p>
            <p className="text-[#5b5672] text-sm mt-1">تجربة خفيفة بعمق علمي وأثر طويل المدى.</p>
          </div>
        </div>

        {/* لماذا هذا مفيد لوليّ الأمر؟ */}
        <div className="mt-8 bg-[#faf9ff] rounded-2xl p-6 border border-[#efeafd]">
          <h2 className="text-xl font-semibold text-[#3c2e7e] mb-3">بماذا ستفيدك أرومة؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-[#4b4863] leading-7">
            <li>لغة بسيطة وتجربة سريعة بدون تعقيد.</li>
            <li>نتائج تساعدك على اختيار الأنشطة المناسبة في البيت والمدرسة.</li>
            <li>اكتشاف نقاط قوة طفلك وتعزيزها.</li>
            <li>اقتراحات عملية قابلة للتطبيق ضمن الروتين اليومي للأسرة.</li>
          </ul>
        </div>

        {/* تعليمات عامة */}
        <div className="mt-6 bg-[#f3fffb] rounded-2xl p-6 border border-[#e2f6ee]">
          <h3 className="text-lg font-semibold text-[#2f6e5d] mb-2">تعليمات سريعة قبل البدء</h3>
          <ul className="list-disc pr-6 space-y-2 text-[#4b4863] leading-7">
            <li>أجب بصدق عمّا يحدث فعليًا مع الطفل، لا ما نتمناه.</li>
            <li>يمكنك إيقاف الاستبانة والعودة لاحقًا دون فقدان الإجابات.</li>
            <li>جميع المعلومات <strong>سرّية</strong> وتُستخدم لأغراض التقييم والتخطيط فقط.</li>
            <li>الاختبار مناسب لأي وليّ أمر على معرفة جيدة بالطفل.</li>
          </ul>
        </div>

        {/* رسالة اطمئنان وختام */}
        <p className="mt-6 text-center text-[#4b4863] font-medium">
          شكرًا لثقتك بأرومة… سنكون معك خطوة بخطوة لاكتشاف ما يميّز طفلك وتنميته بحب ووعي
        </p>

        {/* زر البدء */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <button
            ref={startBtnRef}
            onClick={() => setStarted(true)}
            className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#10B981] to-[#6D28D9] hover:opacity-95 shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9]"
            aria-label="ابدأ اختبار أرومة الآن"
          >
            ابدأ
          </button>
          <span className="text-xs text-gray-500">
            بالضغط على البدء أنت توافق على سياسات الخصوصية واستخدام البيانات لأغراض التقييم.
          </span>
        </div>
      </div>
    </main>
  );
}
