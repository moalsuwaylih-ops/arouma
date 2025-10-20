// app/register/page.tsx
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

// ملاحظة: هذا "Server Component" (لا تضع "use client" هنا)
const prisma = new PrismaClient();

/* ========= Server Action للتسجيل ========= */
async function register(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  // تحقق بسيط للبريد
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk) {
    redirect("/register?error=invalid");
  }

  // احفظ/حدّث المستخدم (بدون كلمة مرور مبدئيًا)
  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email },
  });

  // بعد التسجيل نوجّه المستخدم لتسجيل الدخول
  redirect("/login?registered=1");
}

/* ========= صفحة التسجيل ========= */
export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams?.error === "invalid";

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#F7F4FF] to-white text-gray-800 p-6 md:p-12"
    >
      <div
        className="max-w-md mx-auto bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(130,120,160,0.08)] 
                  px-8 pt-16 pb-12 md:px-10 md:pt-20 md:pb-14 overflow-visible border border-[#f0ecfa]">
        "
      
        {/* العنوان — معالجة قص الحروف بإضافة padding داخلي و line-height مرتفع */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center leading-[1.7] pt-2 pb-2 mb-6">
          <span className="block bg-gradient-to-r from-[#6D28D9] to-[#10B981] bg-clip-text text-transparent 
                       bg-clip-text text-transparent px-[2px] pt-[4px]">
            أرومة
          </span>
          <span className="inline-block text-[#1f2937]"> تسجيل جديد</span>
        </h1>

        <p className="mt-2 text-center text-gray-600">
          أدخل اسمك وبريدك الإلكتروني لإنشاء حساب 
        </p>

        {hasError && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3">
            رجاءً تأكد من إدخال اسم صحيح وبريد إلكتروني صالح.
          </div>
        )}

        <form action={register} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              name="name"
              required
              placeholder="اكتب اسمك"
              className="
                w-full rounded-xl border border-gray-200 px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-[#6366F1]
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="
                w-full rounded-xl border border-gray-200 px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-[#6366F1]
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-semibold text-white shadow-md transition
              bg-gradient-to-r from-[#5B21B6] via-[#6366F1] to-[#10B981]
              hover:opacity-95
            "
          >
            إنشاء الحساب
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/login" className="text-gray-600 hover:text-gray-800 underline">
            لدي حساب بالفعل — تسجيل الدخول
          </a>
        </div>
      </div>
    </main>
  );
}
