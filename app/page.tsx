"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ لإظهار اللوقو

const NOTICE_KEY = "arouma_notice_v1";

export default function HomePage() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // يظهر الإشعار إذا لم يتم إخفاؤه من قبل
    const dismissed = localStorage.getItem(NOTICE_KEY) === "1";
    if (!dismissed) setShowNotice(true);
  }, []);

  const dismissNotice = () => {
    try {
      localStorage.setItem(NOTICE_KEY, "1");
    } catch {}
    setShowNotice(false);
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f7f6ff] via-white to-[#f4fff9] text-gray-800"
    >
      {/* خلفيات زخرفية */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_#c7b8ff_0%,_transparent_60%)] opacity-40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,_#bff5e3_0%,_transparent_60%)] opacity-40 blur-2xl" />

      {/* شريط علوي */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
        {/* ✅ اللوقو في الهيدر */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="شعار أرومة"
            width={120}
            height={120}
            className="object-contain select-none"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-[#3c2e7e]">
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          <a href="#why" className="hover:text-[#3c2e7e]">لماذا أرومة؟</a>
          <a href="#how" className="hover:text-[#3c2e7e]">كيف يعمل؟</a>
          <a href="#faq" className="hover:text-[#3c2e7e]">الأسئلة الشائعة</a>
        </nav>

        {/* زر الهيدر — صغير ويوجّه للدخول */}
        <Link
          href="/login"
          className="rounded-xl border border-[#dedaf5] bg-white px-4 py-2 text-[#3c2e7e] shadow-sm transition hover:bg-[#faf9ff]"
        >
          تسجيل الدخول
        </Link>
      </header>

      {/* إشعار علوي (قابل للإخفاء) */}
      {showNotice && (
        <div className="mx-auto mt-4 w-full max-w-6xl px-6">
          <div className="flex items-center justify-between rounded-2xl border border-[#efeafd] bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(125,115,185,0.10)] backdrop-blur">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-xl">🔔</span>
              <p className="text-[#3c2e7e]">
                فرصة تجريبية مبكرة — ابدأ الآن مجانًا لعدد محدود من المستخدمين.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] px-4 py-2 text-white text-sm font-semibold shadow-md hover:opacity-95"
              >
                أنشئ حسابًا
              </Link>
              <button
                onClick={dismissNotice}
                aria-label="إغلاق الإشعار"
                className="rounded-lg border border-[#e9e6fb] bg-white px-3 py-2 text-xs text-gray-500 hover:bg-[#faf9ff]"
              >
                إخفاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* بطل الصفحة */}
      <section className="relative mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-[#e9e6fb] bg-white/60 px-3 py-1 text-xs text-[#6b64a3]">
              تحليل تربوي مبني على نظريات راسخة
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-[1.2] text-[#31255f]">
              نفهم طفلك{" "}
              <span className="bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] bg-clip-text text-transparent">
                بعمق 
              </span>
                 <span className="whitespace-nowrap"> </span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-8 text-[#5b5672]">
              في <strong>أرومة</strong> نحلّل شخصية طفلك وميوله وأنماط تعلّمه باستخدام
              <strong> الذكاءات المتعددة</strong>، <strong>أنماط التعلم</strong>، وملامح
              <strong> السمات الخمسة الكبرى للشخصية</strong>، مع قراءة للبيئة الأسرية،
              ثم نولّد <strong>توصيات عملية</strong> وأنشطة منزلية سهلة التطبيق.
            </p>

            {/* CTA الرئيسي فقط هنا */}
            <div className="mt-6 flex items-stretch gap-3">
              <Link
                href="/register"
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] px-6 py-3 text-center text-white font-semibold shadow-md transition hover:scale-[1.02] hover:shadow-lg"
              >
                ابدأ الآن 
              </Link>
              <a
                href="/tests"
                className="flex-1 rounded-2xl border border-[#dedaf5] bg-white px-6 py-3 text-center font-semibold text-[#3c2e7e] hover:bg-[#faf9ff] transition"
              >
                 تعرف على اختبارات أرومة 
              </a>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              يستغرق 10–15 دقيقة • 48 سؤالًا خفيفًا • البيانات سرّية
            </p>
          </div>

          {/* بطاقة لافتة سريعة */}
          <div className="rounded-[2rem] border border-[#efeafd] bg-white/70 p-6 shadow-[0_10px_40px_rgba(125,115,185,0.12)]">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#f1eefc] bg-[#faf9ff] p-4 text-center">
                <div className="text-2xl">⚡️</div>
                <p className="mt-2 font-semibold">سريع وخفيف</p>
                <p className="text-xs text-gray-500">8 أقسام قصيرة</p>
              </div>
              <div className="rounded-2xl border border-[#e9fbf4] bg-[#f3fffb] p-4 text-center">
                <div className="text-2xl">🧪</div>
                <p className="mt-2 font-semibold">منهجيّ وعلمي</p>
                <p className="text-xs text-gray-500">MI • VAK • Big Five</p>
              </div>
              <div className="rounded-2xl border border-[#eaf5ff] bg-[#f7fbff] p-4 text-center">
                <div className="text-2xl">🎯</div>
                <p className="mt-2 font-semibold">خطة مصممة لطفلك</p>
                <p className="text-xs text-gray-500">توصيات عملية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* لماذا أرومة؟ */}
      <section id="why" className="mx-auto mt-20 w-full max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3c2e7e]">لماذا تختار أرومة؟</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            {
              t: "لغة بسيطة ونتيجة واضحة",
              d: "نترجم التحليل إلى ملخص سهل بعيد عن المصطلحات المعقّدة مع خطوات صغيرة قابلة للتنفيذ.",
            },
            {
              t: "يركّز على نقاط قوّة طفلك",
              d: "نُبرز ما يُتقنه طفلك ونبني عليه بدل التركيز على جوانب الضعف فقط.",
            },
            {
              t: "متوافق مع الروتين اليومي",
              d: "أنشطة قصيرة وآمنة للتطبيق داخل البيت والمدرسة بدون تجهيزات مرهقة.",
            },
            {
              t: "قابل للتطوير لاحقًا",
              d: "نُهيئ بياناتك لتقارير أعمق ولوحات مرئية عندما ترغب بالترقية.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border border-[#eee9ff] bg-white p-5 shadow-[0_6px_24px_rgba(130,120,160,0.08)]"
            >
              <p className="font-semibold text-[#3c2e7e]">{c.t}</p>
              <p className="mt-2 text-sm leading-7 text-[#5b5672]">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* كيف يعمل؟ */}
      <section id="how" className="mx-auto mt-20 w-full max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3c2e7e]">كيف يعمل أرومة؟</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            { n: "1", t: "مجالات الاختبار", d: "أسئلة قصيرة تُغطي السمات الكبرى الخمس للشخصية، نظرية الذكاءات المتعددة، أنماط التعلم، والبيئة الأسرية." },
            { n: "2", t: "تحليل فوري", d: "نحسب المؤشرات داخليًا ونولّد توصيات تربوية شخصية." },
            { n: "3", t: "طبّق بخطوات سهلة", d: "خطوات منزلية بسيطة تدعم نمو طفلك بثقة وطمأنينة." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-[#e8f1ff] bg-white p-6">
              <span className="absolute -top-3 -right-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7b5fe8] to-[#49d5a3] text-white font-bold shadow-md">
                {s.n}
              </span>
              <p className="mt-3 font-semibold text-[#2f2759]">{s.t}</p>
              <p className="mt-2 text-sm text-[#5b5672] leading-7">{s.d}</p>
            </div>
          ))}
        </div>
{/* ✅ قسم الأسئلة السريعة */}
      <section id="faq" className="mx-auto my-20 w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-[#efeafd] bg-white p-6 md:p-8 shadow-[0_10px_40px_rgba(125,115,185,0.08)]">
          <h3 className="text-xl font-extrabold text-[#3c2e7e] text-center md:text-right">
            الأسئلة السريعة
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-semibold text-[#31255f]">هل البيانات سرّية؟</p>
              <p className="text-sm text-[#5b5672] mt-1">
                نعم، تُستخدم فقط لأغراض التقييم والتوصيات، وتُحفظ محليًا بشكل آمن.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#31255f]">هل يصلح لكل الأعمار؟</p>
              <p className="text-sm text-[#5b5672] mt-1">
                مخصص للأطفال حتى سن 13 سنة، مع تطوير نسخة للمراهقين قريبًا.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#31255f]">هل يمكن مشاركة النتيجة؟</p>
              <p className="text-sm text-[#5b5672] mt-1">
                يمكنك حفظ أو طباعة التقرير ومشاركته مع المختصين أو المعلمين.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#31255f]">هل الاختبار مجاني؟</p>
              <p className="text-sm text-[#5b5672] mt-1">
                نعم حاليًا مجاني تمامًا خلال المرحلة التجريبية.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* CTA الختامي فقط هنا */}
        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-block rounded-2xl bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] px-10 py-3 text-white font-semibold shadow-md transition hover:scale-[1.02] hover:shadow-lg"
          >
            ابدأ الآن
          </Link>

          
          <p className="mt-4 text-xs text-gray-500">
            بالضغط على البدء، توافق على سياسة الخصوصية واستخدام البيانات لأغراض التقييم.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#efeafd] bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-[#9a93b6] md:flex-row">
          <p>© 2025 منصة أرومة – جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-[#3c2e7e]" href="#">سياسة الخصوصية</a>
            <a className="hover:text-[#3c2e7e]" href="#">الشروط والأحكام</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
