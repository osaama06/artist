# دليل النشر — ليالي الدرعية

المشروع جاهز للنشر: git repo مُنشأ ونظيف، البناء (`npm run build`) يشتغل بدون أخطاء. الخطوات التالية لازم تصير من طرفك — ما أقدر أسجّل دخول أو أنشئ حسابات بالنيابة عنك (قاعدة أمان ثابتة).

## 1) رفع الكود على GitHub

```bash
cd "/home/osama-alrumoosh/Desktop/claude study"
gh auth login
```

اتبعي التعليمات (تسجيل دخول بالمتصفح). بعدها:

```bash
gh repo create diriyah-nights-site --private --source=. --remote=origin --push
```

هذا ينشئ مستودع **خاص** (private) على حسابك ويرفع الكود المحفوظ فعليًا (commit واحد جاهز).

## 2) ربط المشروع بـ Vercel

الأسهل: من [vercel.com/new](https://vercel.com/new) → Import Project → اختاري المستودع اللي أنشأتيه.

**مهم جدًا:** بإعدادات الاستيراد، غيّري **Root Directory** إلى `site` — المشروع الفعلي جوّا هذا المجلد الفرعي، مو بجذر المستودع.

أو عبر الطرفية:

```bash
cd "/home/osama-alrumoosh/Desktop/claude study"
vercel login
cd site
vercel --prod
```

## 3) متغيرات البيئة (Environment Variables)

بإعدادات المشروع على Vercel (Settings → Environment Variables)، ضيفي كل هذي (القيم موجودة بملف `site/.env.local` عندك محليًا — انسخيها من هناك، لا تشاركيها مع أي حد):

| المتغير | ملاحظة |
|---|---|
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | من `.env.local` |
| `IMAGEKIT_PUBLIC_KEY` | من `.env.local` |
| `IMAGEKIT_PRIVATE_KEY` | 🔒 سري — سيرفر فقط |
| `NEXT_PUBLIC_SUPABASE_URL` | من `.env.local` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | من `.env.local` |
| `NEXT_PUBLIC_SITE_URL` | **الرابط النهائي بعد النشر** (مثال: `https://diriyah-nights.vercel.app` أو دومين خاص لاحقًا) — يُستخدم بخريطة الموقع وروابط المشاركة |
| `CRON_SECRET` | من `.env.local` — يحمي مهمة الـ keep-alive أدناه |

بعد إضافتها، اعملي Redeploy مرة وحدة عشان تنطبق.

## 4) تأكيد مهمة الـ Keep-Alive (تمنع توقف سوبابيز المجاني)

المشروع فيه `vercel.json` يعرّف مهمة (Cron Job) تضرب `/api/cron/keep-alive` **يوميًا** — هذا يمنع سوبابيز من إيقاف مشروعك المجاني تلقائيًا بعد أسبوع خمول. مجاني بالكامل على خطة Vercel Hobby (يدعم حتى مهمتين يوميًا).

بعد أول نشر، تأكدي إنها فعليًا مسجّلة: Vercel Dashboard → مشروعك → تبويب **Cron Jobs** — لازم تشوفين `/api/cron/keep-alive` مجدولة. ما تحتاجين تسوين شي إضافي غير التأكد إن `CRON_SECRET` مضاف بالخطوة اللي فوق.

## 5) حساب دخول الفنانة (لو ما سويتيه بعد)

من [لوحة Supabase](https://supabase.com/dashboard/project/gyieuvrnixlolsfpefcg/auth/users) → Add User → بريد + كلمة مرور. هذا منفصل تمامًا عن النشر، وتقدرين تسوّينه أي وقت.

## 6) قبل ما ترسلين الرابط لأي حد — نظّفي المحتوى التجريبي

فيه محتوى اختباري لسا موجود بالموقع من مرحلة البناء (راجعي الرسالة اللي قبل هذا الدليل فيها التفاصيل الكاملة) — أهمها معرضين وهميين يظهرون تحت "معارض قادمة" بصفحة المدونة. احذفيهم أو عدّليهم من `/admin/exhibitions` و`/admin/artworks` قبل ما يشوفهم أي زائر حقيقي.

## بعد النشر

- الموقع العام: `https://<الدومين>`
- لوحة التحكم: `https://<الدومين>/admin/login`
- لو حبيتي دومين خاص (مثل `artist-name.com`) بدل رابط vercel.app الافتراضي، تقدرين تضيفينه من Vercel → Settings → Domains، وحدّثي `NEXT_PUBLIC_SITE_URL` بعدها.
