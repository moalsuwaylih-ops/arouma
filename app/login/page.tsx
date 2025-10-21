"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const search = useSearchParams();
  const authErr = search.get("error") === "CredentialsSignin";
  const justRegistered = search.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
      });
      if (res?.error) {
        setErr("هذا البريد غير مسجّل. رجاءً أنشئ حسابًا أولًا من صفحة التسجيل.");
      } else {
        window.location.href = "/assessment";
      }
    } catch {
      setErr("حدث خطأ غير متوقع. حاول لاحقًا.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F7F4FF] to-white text-gray-800 p-6 md:p-12 flex items-center justify-center"
    >
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)]
                  px-8 pt-16 pb-12 md:px-10 md:pt-16 md:pb-14 border border-[#f0ecfa] relative overflow-visible">

        {/* الشعار */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="شعار أرومة"
            width={150}
            height={150}
            className="object-contain drop-shadow-md"
            priority
          />
        </div>

        {justRegistered && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
            تم إنشاء الحساب بنجاح. سجّل الدخول الآن بنفس البريد.
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-center leading-[1.7] mt-6 mb-2" />

        <p className="mt-2 text-center text-gray-600">أدخل بريدك الإلكتروني للمتابعة</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          {(err || authErr) && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {err || "هذا البريد غير مسجّل. رجاءً أنشئ حسابًا أولًا من صفحة التسجيل."}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-white shadow-md transition
                       bg-gradient-to-r from-[#10B981] to-[#6D28D9] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "جاري التحقق..." : "تسجيل دخول"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/" className="no-underline hover:text-purple-700">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          <span className="text-gray-500">مستخدم جديد؟ </span>
          <Link href="/register" className="text-purple-700 hover:text-purple-800">
            إنشاء حساب
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-center text-gray-400">
          الدخول بالبريد فقط مبدئيًا خلال المرحلة التجريبية.
        </p>
      </div>
    </main>
  );
}
