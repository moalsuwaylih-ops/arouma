// lib/scoring.ts

// ============ الأنواع ============
export type MiKey =
  | "linguistic"
  | "logical"
  | "spatial"
  | "musical"
  | "bodily"
  | "interpersonal"
  | "intrapersonal"
  | "naturalist";

export type VakKey = "visual" | "auditory" | "kinesthetic";

export type Big5Key = "E" | "O" | "A" | "C" | "N";

export interface AroumaProfile {
  // الذكاءات المتعددة
  miPercents: Partial<Record<MiKey, number>>;
  miRanking: MiKey[];

  // أنماط التعلم
  vak: {
    percent: Record<VakKey, number>;
    absolute: Record<VakKey, number>;
    top: VakKey;
  };

  // الخمسة الكبار
  big5: Record<Big5Key, number>; // 0..100

  // البيئة الأسرية
  environment: {
    supportPercent: number; // 0..100
    supportScore?: number;
    level: "منخفض" | "متوسط" | "عال";
  };

  // التوصيات المختصرة (سلاسل نصية)
  recs: string[];

  // ميتا اختيارية (قد لا تتوفر)
  meta?: {
    submittedAt?: string;
    locale?: string;
  };
}

// ============ عناوين العرض ============
export const MI_LABELS: Record<MiKey, string> = {
  linguistic: "لغوي",
  logical: "منطقي",
  spatial: "بصري",
  musical: "موسيقي",
  bodily: "حركي",
  interpersonal: "اجتماعي",
  intrapersonal: "تأمّلي",
  naturalist: "طبيعي",
};

export const VAK_LABELS: Record<VakKey, string> = {
  visual: "بصري (يتعلم بالصور والألوان)",
  auditory: "سمعي (يتعلم بالاستماع)",
  kinesthetic: "حركي (يتعلم بالتجربة والحركة)",
};

export const BIG5_LABELS: Record<Big5Key, string> = {
  E: "الانبساط (ميل للتفاعل والانفتاح الاجتماعي)",
  O: "الانفتاح (حب التجارب والأفكار الجديدة)",
  A: "التوافقية (التعاون واللطف مع الآخرين)",
  C: "الاجتهاد والانضباط (التركيز والمسؤولية)",
  N: "الاستقرار الانفعالي (الهدوء والتحكم بالعواطف)",
};

// ============ دوال مساعدة عامة ============
export function band(p: number): "منخفض" | "متوسط" | "عال" {
  if (p >= 67) return "عال";
  if (p <= 33) return "منخفض";
  return "متوسط";
}

function safeParse<T = unknown>(text: string | null): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

// ============ قراءة التخزين المحلي وتحويله ============
/**
 * تقرأ القيمة المخزنة في localStorage باسم "arouma_last_results"
 * وتحوّلها إلى AroumaProfile جاهز للعرض.
 *
 * ملاحظة: هذه الدالة مخصّصة للتشغيل على المتصفح فقط.
 */
export function readStoredProfile(): AroumaProfile | null {
  if (typeof window === "undefined") return null;

  type Raw = {
    mi?: {
      result?: Record<
        MiKey,
        { sum: number; max: number; percent: number }
      >;
      ranking?: MiKey[];
    };
    vak?: {
      percent?: Record<VakKey, number>;
      absolute?: Record<VakKey, number>;
      ranking?: VakKey[];
    };
    big5?: {
      raw?: any;
      percent?: Record<Big5Key, number>;
      counts?: any;
    };
    environment?: {
      supportScore?: number;
      supportPercent?: number;
      level?: "منخفض" | "متوسط" | "عال";
    };
    recs?: string[];
  };

  const raw = safeParse<Raw>(localStorage.getItem("arouma_last_results"));
  if (!raw) return null;

  // MI
  const miPercents: Partial<Record<MiKey, number>> = {};
  if (raw.mi?.result) {
    (Object.keys(raw.mi.result) as MiKey[]).forEach((k) => {
      miPercents[k] = clamp0_100(raw.mi!.result![k].percent);
    });
  }
  const miRanking: MiKey[] = (raw.mi?.ranking ?? []) as MiKey[];

  // VAK
  const vakPercent = {
    visual: clamp0_100(raw.vak?.percent?.visual ?? 0),
    auditory: clamp0_100(raw.vak?.percent?.auditory ?? 0),
    kinesthetic: clamp0_100(raw.vak?.percent?.kinesthetic ?? 0),
  } as Record<VakKey, number>;

  const vakAbsolute = {
    visual: clamp0_100(raw.vak?.absolute?.visual ?? 0),
    auditory: clamp0_100(raw.vak?.absolute?.auditory ?? 0),
    kinesthetic: clamp0_100(raw.vak?.absolute?.kinesthetic ?? 0),
  } as Record<VakKey, number>;

  const vakTop: VakKey =
    (raw.vak?.ranking?.[0] as VakKey) ??
    (Object.entries(vakPercent).sort((a, b) => b[1] - a[1])[0]?.[0] as VakKey) ??
    "visual";

  // Big Five
  const big5: Record<Big5Key, number> = {
    E: clamp0_100(raw.big5?.percent?.E ?? 50),
    O: clamp0_100(raw.big5?.percent?.O ?? 50),
    A: clamp0_100(raw.big5?.percent?.A ?? 50),
    C: clamp0_100(raw.big5?.percent?.C ?? 50),
    N: clamp0_100(raw.big5?.percent?.N ?? 50),
  };

  // Environment
  const env = {
    supportPercent: clamp0_100(raw.environment?.supportPercent ?? 50),
    supportScore: raw.environment?.supportScore,
    level:
      raw.environment?.level ??
      band(clamp0_100(raw.environment?.supportPercent ?? 50)),
  } as AroumaProfile["environment"];

  // Recs
  const recs: string[] = Array.isArray(raw.recs) ? raw.recs.filter(Boolean) : [];

  const profile: AroumaProfile = {
    miPercents,
    miRanking,
    vak: { percent: vakPercent, absolute: vakAbsolute, top: vakTop },
    big5,
    environment: env,
    recs,
  };

  return profile;
}

// ============ أدوات تنسيق ============
export function pct(n: number | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `${Math.round(n)}%`;
}

export function clamp0_100(x: number): number {
  if (Number.isNaN(x) || !Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}
