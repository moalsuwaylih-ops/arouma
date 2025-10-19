export default function ThankYouPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center 
                 bg-gradient-to-b from-[#f8f7fd] via-[#fdfcff] to-white 
                 text-gray-800 p-6"
    >
      <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)] 
                      p-10 max-w-md text-center border border-[#f0ecfa]">
        <h1 className="text-3xl font-bold text-[#3c2e7e] mb-4">
           شكرًا لإكمال الاستبانة💜 
        </h1>
        <p className="text-[#5b5672] mb-8 leading-relaxed text-[1.05rem]">
          وجودك هنا يعني الكثير، ومشاركتك تفتح طريقًا لطفلك ليُفهم أكثر، ويُنمّى بحب ووعي. 🌱
        </p>

        <a
          href="/"
          className="inline-block px-10 py-3 rounded-full 
                     bg-gradient-to-r from-[#a68cf1] to-[#88e3c1] 
                     text-white font-medium shadow-md 
                     hover:scale-105 hover:shadow-lg transition-all duration-300"
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
