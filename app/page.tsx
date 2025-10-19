import Image from "next/image";
// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="max-w-xl text-center space-y-6 p-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          أروّمة — تقييم شخصية وذكاءات الطفل
        </h1>
        <p className="opacity-80">
          جاوب على أسئلة بسيطة، وخلال ثوانٍ نحلّل النتائج محليًا ونقترح مسارات تعلم وأنشطة مناسبة لعمر الطفل.
        </p>
        <a
          href="/assessment"
          className="inline-block rounded-2xl px-6 py-3 bg-white text-black font-semibold hover:opacity-90"
        >
          ابدأ الاختبار
        </a>
      </div>
    </main>
  );
}
