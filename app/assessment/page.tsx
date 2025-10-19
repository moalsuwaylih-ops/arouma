"use client";

import { useState } from "react";
import AssessmentPage from "./arouma-form";

export default function Page() {
  const [started, setStarted] = useState(false);

  if (started) return <AssessmentPage />;

  return (
    <main dir="rtl" className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-gray-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10">
        {/* العنوان الرئيسي */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center leading-relaxed">
          <span className="text-purple-700">أرومة</span> — نفهم طفلك بعمق، ونبني حوله خطة تُشبِهُه
        </h1>

       {/* فقرة تمهيدية عامة لوليّ الأمر */}
<p className="mt-5 text-lg md:text-xl text-center text-gray-700 leading-8">
  بصفتك <strong>وليّ أمر</strong>، أنت الأقرب إلى فهم طفلك وملاحظة تفاصيله اليومية.  
  في <strong>أرومة</strong>، نقدّم <strong>تحليلًا علميًا دقيقًا</strong> لشخصية طفلك 
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
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <p className="text-2xl">🗂️</p>
            <p className="mt-2 font-semibold">8 أقسام خفيفة</p>
            <p className="text-gray-600 text-sm mt-1">تصنع صورة شاملة بلا إرهاق.</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold">48 سؤالًا علمياً</p>
            <p className="text-gray-600 text-sm mt-1">أسئلة مبنية على خبرات تربوية.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-2xl">⏰</p>
            <p className="mt-2 font-semibold">10–15 دقيقة فقط</p>
            <p className="text-gray-600 text-sm mt-1">تبدأ الآن… وتحصُل على فائدة طويلة الأثر.</p>
          </div>
        </div>

        {/* لماذا هذا مفيد لوليّ الأمر؟ */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-3">بماذا ستفيدك أرومة؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-gray-700 leading-7">
            <li>لغة بسيطة وتجربة سريعة بدون تعقيد.</li>
            <li>نتائج تساعدك على اختيار الأنشطة المناسبة في البيت والمدرسة.</li>
            <li>اكتشاف نقاط قوة طفلك وتعزيزها.</li>
            <li>اقتراحات عملية قابلة للتطبيق ضمن الروتين اليومي للأسرة.</li>
          </ul>
        </div>

        {/* تعليمات عامة */}
        <div className="mt-6 bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">تعليمات سريعة قبل البدء</h3>
          <ul className="list-disc pr-6 space-y-2 text-gray-700 leading-7">
            <li>أجب بصدق عمّا يحدث فعليًا مع الطفل، لا ما نتمناه.</li>
            <li>يمكنك إيقاف الاستبانة والعودة لاحقًا دون فقدان الإجابات.</li>
            <li>جميع المعلومات <strong>سرّية</strong> وتُستخدم لأغراض التقييم والتخطيط فقط.</li>
            <li>الاستبانة مناسبة لأي وليّ أمر على معرفة جيدة بالطفل.</li>
          </ul>
        </div>

        {/* رسالة اطمنان وختام */}
        <p className="mt-6 text-center text-purple-700 font-medium">
          💜 شكرًا لثقتك بأرومة… سنكون معك خطوة بخطوة لاكتشاف ما يميّز طفلك وتنميته بحب ووعي.
        </p>

        {/* زر البدء */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-md transition"
          >
            ابدأ الاستبانة الآن
          </button>
          <span className="text-xs text-gray-500">
            بالضغط على البدء، توافق على سياسات الخصوصية واستخدام البيانات لأغراض التقييم.
          </span>
        </div>
      </div>
    </main>
  );
}
