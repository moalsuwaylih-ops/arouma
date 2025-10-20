"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // نحتفظ به لنفس تجربة التسجيل (اختياري)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // NextAuth Credentials (بدون كلمة مرور – نموذج MVP)
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        name: name.trim(),
      });

      if (res?.error) {
        setErr("تعذّر تسجيل الدخول. تأكد من البريد الإلكتروني وحاول مرة أخرى.");
      } else {
        // بعد نجاح الدخول نذهب للاختبار
        window.location.href = "/assessment";
      }
    } catch (e) {
      setErr("حدث خطأ غير متوقع. حاول لاحقًا.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F7F4FF] to-white text-gray-800 p-6 md:p-12"
    >
      <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)] 
                  px-8 pt-16 pb-12 md:px-10 md:pt-20 md:pb-14 overflow-visible border border-[#f0ecfa]">
        {/* العنوان */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center leading-[1.7] pt-2 pb-2 mb-6">
          <span className="block bg-gradient-to-r from-[#6D28D9] to-[#10B981] bg-clip-text text-transparent 
                       bg-clip-text text-transparent px-[2px] pt-[4px]">
            أرومة
          </span>{" "}
       
        </h1>
        <p className="mt-3 text-center text-gray-600">
          قم بتسجيل الدخول للمتابعة
        </p>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              type="text"
              placeholder="اكتب اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-purple-300 px-4 py-2.5 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-purple-300 px-4 py-2.5 outline-none transition"
              required
            />
          </div>

          {err && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {err}
            </p>
          )}

          {/* زر الدخول – هوية موحّدة (تدرّج أخضر/بنفسجي) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-white shadow-md transition
                       bg-gradient-to-r from-[#6d28d9] to-[#34d399] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "تسجيل دخول"}
          </button>
        </form>

        {/* روابط بدون خط سفلي */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="no-underline decoration-transparent hover:text-purple-700">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          <span className="text-gray-500">مستخدم جديد؟ </span>
          <Link
            href="/register"
            className="no-underline decoration-transparent text-purple-700 hover:text-purple-800"
          >
            إنشاء حساب
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-center text-gray-400">
          بالضغط على الدخول، أنت توافق على سياسة الخصوصية واستخدام البيانات لأغراض التقييم فقط.
        </p>
      </div>
    </main>
  );
}
