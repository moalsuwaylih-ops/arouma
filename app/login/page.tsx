"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!name.trim()) return setErr("الاسم مطلوب.");
    if (!isValidEmail(email)) return setErr("أدخل بريدًا صحيحًا.");

    setLoading(true);
    try {
      // مطابق لمزوّد Credentials في route.ts (اسم الحقول: email, name)
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        redirect: false,            // لا تعيد التوجيه تلقائيًا
        callbackUrl: "/assessment", // الوجهة بعد الدخول
      });

      if (res?.ok) {
        router.push(res.url || "/assessment");
      } else {
        setErr("تعذّر تسجيل الدخول. جرّب مرة أخرى.");
      }
    } catch {
      setErr("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6 text-gray-800"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center leading-relaxed">
          <span className="text-purple-700">أرومة</span> — ادخل للبدء
        </h1>
        <p className="text-center text-gray-600 mt-2">
          سجّل اسمك وبريدك الإلكتروني للبدء في الاستبانة.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-2 font-medium">الاسم</label>
            <input
              dir="auto"
              type="text"
              placeholder="اكتب اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">البريد الإلكتروني</label>
            <input
              dir="ltr"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {err && <p className="text-rose-600 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-md transition disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "ابدأ الاختبار"}
          </button>

          <a
            href="/"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
          >
            العودة إلى الصفحة الرئيسية
          </a>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-6">
          بتسجيل الدخول، أنت توافق على سياسة الخصوصية واستخدام البيانات لأغراض التقييم فقط.
        </p>
      </div>
    </main>
  );
}
