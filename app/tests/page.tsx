import Image from "next/image";
import Link from "next/link";

export default function TestsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#f7f6ff] via-white to-[#f4fff9] text-gray-800"
    >
      {/* الهيدر المصغّر */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="شعار أرومة"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-[#3c2e7e]"></span>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#3c2e7e]">الرئيسية</Link>
          <Link href="/#why" className="hover:text-[#3c2e7e]">لماذا أرومة؟</Link>
          <Link href="/#how" className="hover:text-[#3c2e7e]">كيف يعمل؟</Link>
        </nav>
        <Link
          href="/register"
          className="rounded-xl bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] px-4 py-2 text-white shadow-md transition hover:opacity-95"
        >
          إنشاء حساب
        </Link>
      </header>

      {/* العنوان */}
      <section className="relative mx-auto mt-8 w-full max-w-6xl px-6">
        <div className="rounded-[2rem] border border-[#efeafd] bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(125,115,185,0.10)]">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center">
              اختبارات <span className="bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] bg-clip-text text-transparent">أرومة</span> —  ماذا نقيس؟ ولماذا؟
            </h1>
          </div>
          <p className="mt-4 text-center text-[#5b5672] max-w-3xl mx-auto leading-8">
            نستخدم في أرومة مجموعة من الأدوات التربوية والنفسية المبسّطة لفهم شخصية الطفل وميوله وطريقة تعلّمه وملاءمة البيئة من حوله. هذه الأدوات معتمدة في الأدبيات العالمية، ونقدّم نتائجها بلغة سهلة وخطوات عملية تناسب الروتين اليومي.
          </p>
        </div>
      </section>

      {/* شبكة الاختبارات الأساسية */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3c2e7e]">الاختبارات/الأدوات الأساسية</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Big Five */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-xl font-bold text-[#3c2e7e]">
              السمات الخمس الكبرى للشخصية (Big Five)
            </h3>
            <p className="mt-3 text-[#4b4763] leading-7">
              يصف الشخصية عبر خمس أبعاد: <strong>الانفتاح للتجربة</strong>، <strong>الاجتهاد/الانضباط</strong>،
              <strong> الانبساط/الاجتماعية</strong>، <strong>التوافق/التعاطف</strong>، و<strong>الحساسية الانفعالية</strong>.
              يساعدنا ذلك على مواءمة أساليب التواصل والدافعية وتنظيم المهام مع طبيعة طفلك.
            </p>
            <div className="mt-4 rounded-xl bg-[#faf9ff] border border-[#efeafd] p-4 text-sm">
              <b>الفائدة:</b> اختيار أساليب تعليم وتواصل تناسب سِمات طفلك (مثل تقسيم المهام، التهيئة الهادئة، العمل الجماعي/الفردي).
            </div>
          </article>

          {/* Multiple Intelligences */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-xl font-bold text-[#3c2e7e]">الذكاءات المتعددة (Multiple Intelligences)</h3>
            <p className="mt-3 text-[#4b4763] leading-7">
              إطار <strong>هوارد غاردنر</strong> الذي ينظر للقدرات على أنها متعددة: لغوي، منطقي/رياضي، بصري/فراغي، موسيقي، حركي/جسدي،
              اجتماعي/تفاعلي، ذاتي/تأمّلي، وطبيعي/بيئي. نحدّد ترتيب القوة النسبي لكل نوع لدى طفلك.
            </p>
            <div className="mt-4 rounded-xl bg-[#f7fbff] border border-[#eaf5ff] p-4 text-sm">
              <b>الفائدة:</b> تصميم أنشطة جذّابة تبني على نقاط القوة (قصة وكتابة، ألغاز ومنطق، رسم وبناء، موسيقى وإيقاع، حركة وتجريب… إلخ).
            </div>
          </article>

          {/* VAK */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-xl font-bold text-[#3c2e7e]">أنماط التعلّم (VAK)</h3>
            <p className="mt-3 text-[#4b4763] leading-7">
              يوضّح النمط الغالب في التعلّم: <strong>بصري</strong> (صور وألوان ومخططات)، <strong>سمعي</strong> (شرح وقصص وتكرار لفظي)،
              أو <strong>حركي</strong> (تجريب ولمس وأنشطة عملية). نستخدم النمط لتقديم تعزيزات تجعل التعلّم أسهل وأكثر متعة.
            </p>
            <div className="mt-4 rounded-xl bg-[#f3fffb] border border-[#e9fbf4] p-4 text-sm">
              <b>الفائدة:</b> تحويل أي نشاط إلى تجربة تناسب نمط طفلك (ملصقات وألوان/تلخيص صوتي/تجارب ولمسيات).
            </div>
          </article>

          {/* Ecological / Environment Index */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-xl font-bold text-[#3c2e7e]">
              مؤشر البيئة والدعم الأسري (Bronfenbrenner)
            </h3>
            <p className="mt-3 text-[#4b4763] leading-7">
              يستند إلى الفكرة البيئية التي ترى تعلّم الطفل ضمن أنظمة متداخلة (الأسرة/المدرسة/الأقران…). نقيس مدى تهيئة البيئة المنزلية
              للدعم (روتين، تهيئة، أدوات، تواصل) ونصنّفه إلى مستويات (منخفض/متوسط/عالي) مع إرشادات رفع المؤشر.
            </p>
            <div className="mt-4 rounded-xl bg-[#fffaf5] border border-[#ffe9d6] p-4 text-sm">
              <b>الفائدة:</b> خطوات صغيرة لبيئة أكثر هدوءًا وثباتًا (توقيت ثابت، مؤقت بصري، صندوق أدوات، نهاية مشجّعة للجلسة).
            </div>
          </article>
        </div>
      </section>

      {/* عناصر التقرير المكملة (ليست اختبارات، لكنها تُحوّل النتائج إلى أفعال) */}
      <section className="mx-auto mt-12 w-full max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3c2e7e]">عناصر التقرير المُكمّلة</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Parental Goals */}
          <article className="rounded-2xl border border-[#eee9ff] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-lg font-bold text-[#3c2e7e]">الأهداف التربوية المدخلة</h3>
            <p className="mt-2 text-[#4b4763] leading-7">
              مدخلات بسيطة من ولي الأمر عن أولويات المرحلة (مثل الانضباط اللطيف، القراءة اليومية، تحسين التركيز).
              تُستخدم لتوجيه التوصيات والخطة الأسبوعية بحيث تخدم هدف الأسرة الحالي.
            </p>
            <div className="mt-3 rounded-xl bg-[#faf9ff] border border-[#efeafd] p-3 text-sm">
              <b>الدور:</b> تخصيص أدقّ للتوصيات ووزن الأنشطة بما يخدم أهدافك.
            </div>
          </article>

          {/* Narrative */}
          <article className="rounded-2xl border border-[#eee9ff] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-lg font-bold text-[#3c2e7e]">السرد التفسيري</h3>
            <p className="mt-2 text-[#4b4763] leading-7">
              ملخص لغوي مبسّط يربط أعلى الذكاءات وأنماط التعلّم والسمات البارزة مع البيئة الأسرية،
              ويترجمها إلى “ماذا يعني ذلك عمليًا؟” بلغة واضحة لولي الأمر.
            </p>
            <div className="mt-3 rounded-xl bg-[#f7fbff] border border-[#eaf5ff] p-3 text-sm">
              <b>الدور:</b> جسْر بين النتائج العلمية والسلوك اليومي داخل البيت.
            </div>
          </article>

          {/* Quick Recs */}
          <article className="rounded-2xl border border-[#eee9ff] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-lg font-bold text-[#3c2e7e]">التوصيات السريعة</h3>
            <p className="mt-2 text-[#4b4763] leading-7">
              قائمة قصيرة “جاهزة للتطبيق الآن” تُولّد تلقائيًا من نتائج طفلك وأهدافك، تتضمن أفكارًا عملية
              (٣–٨ عناصر عادةً) مثل تذكير لطيف، تقسيم مهمة، دعم بصري/سمعي/حركي، وتوثيق إنجاز اليوم.
            </p>
            <div className="mt-3 rounded-xl bg-[#f3fffb] border border-[#e9fbf4] p-3 text-sm">
              <b>الدور:</b> تحريك السلوك فورًا بخطوات صغيرة وثابتة.
            </div>
          </article>

          {/* Weekly Plan */}
          <article className="rounded-2xl border border-[#eee9ff] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-lg font-bold text-[#3c2e7e]">الخطة الأسبوعية (10–15 دقيقة يوميًا)</h3>
            <p className="mt-2 text-[#4b4763] leading-7">
              سبع بطاقات نشاط قصيرة مبنية على أعلى ذكاءين لدى طفلك، مُعززة بنمط التعلّم الغالب (VAK)،
              مع “بهارات” خفيفة من السمات الخمس عند الحاجة (تهيئة هادئة، تقسيم، عنصر اجتماعي…).
            </p>
            <div className="mt-3 rounded-xl bg-[#fffaf5] border border-[#ffe9d6] p-3 text-sm">
              <b>الدور:</b> تحويل التوصيات إلى روتين عملي ثابت وممتع.
            </div>
          </article>

          {/* Parent Guidance */}
          <article className="rounded-2xl border border-[#eee9ff] bg-white p-6 md:col-span-2 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h3 className="text-lg font-bold text-[#3c2e7e]">إرشادات موجّهة للوالدين</h3>
            <p className="mt-2 text-[#4b4763] leading-7">
              فقرة محددة للأم والأب حول مهارات دعم ينبغي تطويرها وفق شخصية الطفل ومستوى الدعم الأسري الحالي
              (مثل: تهيئة الانتقالات بهدوء، تعزيز لفظي محدد، اتفاق على بداية/نهاية، تنظيم الأدوات، ضبط الشاشات).
            </p>
            <div className="mt-3 rounded-xl bg-[#faf9ff] border border-[#efeafd] p-3 text-sm">
              <b>الدور:</b> مواءمة أسلوب الوالدين نفسيًا وتربويًا مع احتياجات الطفل لرفع أثر كل نشاط.
            </div>
          </article>
        </div>
      </section>

      {/* كيف نستخدم النتائج */}
      <section className="mx-auto mt-12 w-full max-w-6xl px-6">
        <div className="rounded-2xl border border-[#eee9ff] bg-white p-6 md:p-8 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
          <h3 className="text-lg md:text-xl font-bold text-[#3c2e7e]">
            كيف نحول نتائج الاختبارات إلى خطة تساعدك فعليًا؟
          </h3>
          <ol className="mt-4 list-decimal pr-6 text-sm leading-7 text-[#5b5672] space-y-2">
            <li>نجمع مخرجات Big Five وMI وVAK مع مؤشر البيئة الأسرية لصورة شاملة.</li>
            <li>نربطها بأهدافك الحالية لتحديد الأولويات قصيرة المدى.</li>
            <li>نولّد توصيات سريعة وخطة أسبوعية بجرعات صغيرة قابلة للثبات.</li>
            <li>نضيف إرشادات موجّهة للوالدين لرفع جودة التطبيق داخل البيت.</li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6 text-center">
        <p className="text-xs text-gray-500">
          جميع المعلومات تُستخدم لأغراض التقييم فقط وتُحفظ بسرية تامة.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-2xl bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] px-8 py-3 text-white font-semibold shadow-md transition hover:opacity-95"
          >
            ابدأ الآن
          </Link>
          <Link
            href="/assessment"
            className="rounded-2xl border border-[#dedaf5] bg-white px-8 py-3 font-semibold text-[#3c2e7e] hover:bg-[#faf9ff] transition"
          >
            اذهب إلى الاختبار
          </Link>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#3c2e7e]">
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="mt-16 border-t border-[#efeafd] bg-white/60">
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
