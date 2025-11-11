"use client";

import ResultsPage from "../results/page";

/**
 * هذا المكوّن يتيح إعادة استخدام صفحة النتائج في أي مسار آخر،
 * مثل /assessment/results أو /thank-you أو /parent-dashboard
 */
export default function ResultsView() {
  return <ResultsPage />;
}
