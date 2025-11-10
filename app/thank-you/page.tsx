// app/thank-you/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [hasResults, setHasResults] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("arouma_last_results") : null;
      setHasResults(!!saved);
    } catch {
      setHasResults(false);
    }
  }, []);

  const goResults = () => {
    if (hasResults) window.location.href = "/assessment/results"; // <-- هنا التعديل
  };

  return (
    <main dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f7fd] via-[#fdfcff] to-white text-gray-800 p-6">
      <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)] p-10 w-full max-w-md text-center border border-[#f0ecfa]">
        <h1 className="text-3xl font-bold text-[#3c2e7e] mb-3">شكرًا لإكمال الاستبانة 💜</h1>
        <p className="text-[#5b5672] mb-7 leading-relaxed text-[1.05rem]">
          وجودك هنا يعني الكثير، ومشاركتك تفتح طريقًا لطفلك لِيُفهَم أكثر، ويُنمى بحب ووعي. 🌱
        </p>

        <button
          onClick={goResults}
          disabled={hasResults === false}
          className={`w-full px-10 py-3 rounded-full text-white font-medium shadow-md transition-all duration-300
            ${hasResults === false ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-[#7b5fe8] to-[#49d5a3] hover:scale-105 hover:shadow-lg"}`}
        >
          {hasResults === false ? "لا توجد نتيجة محفوظة" : "اعرض نتيجة التحليل"}
        </button>

        <a
          href="/"
          className="inline-block w-full mt-3 px-10 py-3 rounded-full border border-[#d9d3f2] text-[#3c2e7e] bg-white hover:bg-[#faf9ff] transition"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </div>

      <footer className="mt-10 text-sm text-[#9a93b6]">
        <span>© 2025 منصة أرومة – جميع الحقوق محفوظة</span>
      </footer>
    </main>
  );
}
