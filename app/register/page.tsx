// app/register/page.tsx
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

// ملاحظة: هذا "Server Component" (لا تضع "use client" هنا)
const prisma = new PrismaClient();

// ===== Server Action للتسجيل =====
async function register(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  // تحقق بسيط
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk) {
    // رجّع إلى نفس الصفحة مع بارامتر خطأ بسيط
    redirect("/register?error=invalid");
  }

  // احفظ/حدّث المستخدم (بدون كلمة مرور مبدئيًا)
  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email },
  });

  // بعد التسجيل نوّجه المستخدم لتسجيل الدخول
  redirect("/login?registered=1");
}

// ===== صفحة التسجيل (React Component) =====
export default function RegisterPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white text-gray-800 p-6"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8 border border-purple-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center">
          <span className="text-purple-700">أرومة</span> — تسجيل مستخدم جديد
        </h1>

        <p className="mt-3 text-center text-gray-600">
          أدخل اسمك وبريدك الإلكتروني لإنشاء حساب والبدء في الاختبار.
        </p>

        <form action={register} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              name="name"
              required
              placeholder="اكتب اسمك"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-green-400 to-purple-500 py-2 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            إنشاء الحساب
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/login" className="text-purple-600 underline">
            لدي حساب بالفعل — تسجيل الدخول
          </a>
        </div>
      </div>
    </main>
  );
}
