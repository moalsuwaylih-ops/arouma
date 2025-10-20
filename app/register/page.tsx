"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء التسجيل");
      setMessage("✅ تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول");
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white text-gray-800 p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-purple-100">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
          إنشاء حساب جديد
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">الاسم </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">كلمة المرور</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "جارٍ التسجيل..." : "تسجيل"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-700">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          لديك حساب؟{" "}
          <a href="/login" className="text-purple-600 font-medium underline">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </main>
  );
}
