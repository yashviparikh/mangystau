export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return reply({ success: false }, 400); }
  if (d.botcheck) return reply({ success: true });          // bots: pretend it worked

  const clean = (v, n) => String(v || '').slice(0, n);
  const name = clean(d.name, 100), phone = clean(d.phone, 30);
  if (!name || !phone) return reply({ success: false }, 400);

  const r = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_KEY,
      subject: 'New Mangystau tour enquiry',
      from_name: 'Mangystau Tours Website',
      name, phone,
      email: clean(d.email, 120),
      dates: clean(d.dates, 60),
      message: clean(d.message, 1500)
    })
  });
  const out = await r.json().catch(() => ({ success: false }));
  return reply({ success: !!out.success }, out.success ? 200 : 502);
}

const reply = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });