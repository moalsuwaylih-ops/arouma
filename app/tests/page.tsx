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
          <span className="text-lg font-extrabold tracking-tight text-[#3c2e7e]">
        
          </span>
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
            نستخدم في أرومة مجموعة من الاختبارات التربوية والنفسية المبسطة، تساعدنا على فهم شخصية الطفل وطريقة تفكيره وتعلّمه. هذه الأدوات علمية ومستخدمة حول العالم، لكننا نقدّمها بلغة سهلة ونتائج عملية تفيدك في حياتك اليومية.
          </p>
        </div>
      </section>

      {/* شبكة الاختبارات */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Big Five */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h2 className="text-xl font-bold text-[#3c2e7e]">
              السمات الخمس الكبرى للشخصية (Big Five)
            </h2>
            <p className="mt-3 text-[#4b4763] leading-7">
              هذا النموذج يصف شخصية الإنسان من خلال خمس صفات رئيسية:
              <strong> الانفتاح</strong> (حب التعلم والتجربة)،
              <strong> التنظيم</strong> (الانضباط والمسؤولية)،
              <strong> الانبساط</strong> (الاجتماعية والطاقة)،
              <strong> التوافق</strong> (الطيبة والتعاون)، و<strong> الحساسية الانفعالية</strong> (مدى القلق أو الهدوء).
            </p>
            <p className="mt-2 text-[#4b4763]">
              من خلال هذا الاختبار، نفهم طبيعة شخصية طفلك: هل يفضّل العمل الفردي أم الجماعي؟ هل يحتاج إلى استقرار وهدوء أم بيئة مرنة ومتجددة؟
            </p>
            <div className="mt-4 rounded-xl bg-[#faf9ff] border border-[#efeafd] p-4 text-sm">
              <b>الفائدة:</b> يساعد على اختيار أسلوب التعليم والتعامل الأنسب لشخصية طفلك.
            </div>
          </article>

          {/* Multiple Intelligences */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h2 className="text-xl font-bold text-[#3c2e7e]">الذكاءات المتعددة (Multiple Intelligences)</h2>
            <p className="mt-3 text-[#4b4763] leading-7">
              وضعها العالم <strong>هوارد غاردنر</strong> وتقول إن الذكاء ليس واحدًا فقط، بل هناك عدة أنواع:
              مثل الذكاء اللغوي، المنطقي، الحركي، الاجتماعي، الموسيقي، الذاتي، والطبيعي.
            </p>
            <p className="mt-2 text-[#4b4763]">
              هذا الاختبار يبيّن المجالات التي يتميّز فيها طفلك، لنساعدك على تطويرها من خلال أنشطة ممتعة وبسيطة.
            </p>
            <div className="mt-4 rounded-xl bg-[#f7fbff] border border-[#eaf5ff] p-4 text-sm">
              <b>الفائدة:</b> يساعدك على اكتشاف مجالات تميّز طفلك ودعمه من خلالها.
            </div>
          </article>

          {/* VAK */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h2 className="text-xl font-bold text-[#3c2e7e]">أنماط التعلّم (VAK)</h2>
            <p className="mt-3 text-[#4b4763] leading-7">
              يوضّح هذا الاختبار الطريقة التي يتعلّم بها الطفل بشكل أفضل:
              <strong> بصريًا</strong> (يحب الصور والألوان)،
              <strong> سمعيًا</strong> (يفهم من الشرح والكلام)، أو
              <strong> حركيًا</strong> (يتعلم بالتجربة والحركة).
            </p>
            <p className="mt-2 text-[#4b4763]">
              بمعرفة نمط التعلّم، يمكننا اقتراح أنشطة تناسبه وتجعل الدراسة أكثر متعة وسهولة.
            </p>
            <div className="mt-4 rounded-xl bg-[#f3fffb] border border-[#e9fbf4] p-4 text-sm">
              <b>الفائدة:</b> يجعل التعليم ممتعًا ومناسبًا لطبيعة طفلك.
            </div>
          </article>

          {/* Ecological Systems */}
          <article className="rounded-2xl border border-[#efeafd] bg-white p-6 shadow-[0_6px_24px_rgba(130,120,160,0.08)]">
            <h2 className="text-xl font-bold text-[#3c2e7e]">
              النظرية البيئية (Bronfenbrenner)
            </h2>
            <p className="mt-3 text-[#4b4763] leading-7">
              ترى هذه النظرية أن سلوك الطفل لا يتكوّن فقط من شخصيته، بل أيضًا من البيئة حوله: الأسرة، المدرسة، الأصدقاء، والمجتمع.
            </p>
            <p className="mt-2 text-[#4b4763]">
              لذلك نقيس مدى انسجام هذه البيئة مع احتياجات طفلك، ونقدّم لك خطوات عملية لتحسينها إن لزم الأمر.
            </p>
            <div className="mt-4 rounded-xl bg-[#fffaf5] border border-[#ffe9d6] p-4 text-sm">
              <b>الفائدة:</b> يساعدك على خلق بيئة داعمة وصحية لطفلك داخل المنزل والمدرسة.
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
            <li>نجمع نتائج الاختبارات الأربعة معًا لنكوّن صورة شاملة عن طفلك.</li>
            <li>نحدّد نقاط القوة والاحتياجات في الجوانب الشخصية والتعليمية.</li>
            <li>ننشئ خطة تحتوي على أنشطة منزلية وأفكار تربوية سهلة التطبيق.</li>
            <li>نقترح طرق متابعة بسيطة لتلاحظي تطور طفلك مع الوقت.</li>
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
          >
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
