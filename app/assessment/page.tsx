"use client";

import { useState } from "react";
import AssessmentPage from "./arouma-form";
import Image from "next/image";

export default function Page() {
  const [started, setStarted] = useState(false);

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
          </span>{" "}
        </h1>

        {/* فقرة تمهيدية عامة لوليّ الأمر */}
        <p className="mt-5 text-lg md:text-xl text-center text-[#4b4863] leading-8">
           <strong></strong> نقدم لك <strong>تحليلًا علميًا دقيقًا</strong> لشخصية طفلك 
          وميوله ونقاط قوّته، ثم نترجم ذلك إلى <strong> خطة تربوية </strong> 
          وأنشطة منزلية ممتعة تدعم  <strong> نموّه بثقة وطمأنينة</strong>.  
          <br /><br />
          يقيس <strong>اختبار أرومة</strong> الجوانب <strong>الشخصية</strong>، 
          و<strong>الذكاءات المتعددة</strong>، 
          و<strong>الأساليب السلوكية والتعليمية</strong> لطفلك، 
          عبر منهجية تربوية <strong>مبنية على نظريات علمية راسخة</strong> مثل:  
          <strong> نظرية العوامل الخمسة الكبرى (Big Five)</strong>،  
          و<strong> نظرية الذكاءات المتعددة (Multiple Intelligences)</strong>،  
          و<strong> أنماط التعلّم (VAK)</strong>،  
          و<strong> النظرية البيئية لبروفنبرنر (Bronfenbrenner’s Ecological Theory)</strong>.  
          <br /><br />
          هدفنا في <strong>أرومة</strong> هو أن نساعدك على <strong>فهم طفلك بعمق</strong>، 
          وتوجيهه نحو بيئة تعليمية وحياتية <strong>تحتضن قدراته وتُبرز تفرّده</strong>.
        </p>

        {/* نقاط القيمة السريعة */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#efeafd] bg-[#faf9ff] p-5">
            <p className="text-2xl">🗂️</p>
            <p className="mt-2 font-semibold text-[#3c2e7e]">8 أقسام خفيفة</p>
            <p className="text-[#6b64a3] text-sm mt-1">تصنع صورة شاملة بلا إرهاق.</p>
          </div>
          <div className="rounded-2xl border border-[#e2f6ee] bg-[#f3fffb] p-5">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold text-[#2f6e5d]">48 سؤالًا علمياً</p>
            <p className="text-[#5b5672] text-sm mt-1">أسئلة مبنية على خبرات تربوية.</p>
          </div>
          <div className="rounded-2xl border border-[#fff1d7] bg-[#fff9eb] p-5">
            <p className="text-2xl">⏰</p>
            <p className="mt-2 font-semibold text-[#7a5a1e]">10–15 دقيقة فقط</p>
            <p className="text-[#5b5672] text-sm mt-1">تبدأ الآن… وتحصُل على فائدة طويلة الأثر.</p>
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
            onClick={() => setStarted(true)}
            className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#10B981] to-[#6D28D9] hover:opacity-95 shadow-md transition"
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
