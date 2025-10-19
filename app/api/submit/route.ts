export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body.answers || {};

    const sheetUrl = process.env.NEXT_PUBLIC_SHEET_URL;
    if (!sheetUrl) {
      return new Response(JSON.stringify({ ok: false, error: "Missing sheet URL" }), { status: 500 });
    }

    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, result: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
