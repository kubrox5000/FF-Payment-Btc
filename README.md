# vibe-web-template

A general-purpose Next.js web application template with database initialization and AI-friendly foundations.

## Features

- **Standardized Utilities**: Client-safe wrappers for `fetch` and a leveled `logger`.
- **Database Ready**: Drizzle ORM + PostgreSQL initialization pre-configured.
- **UI System**: Tailwind CSS 4, the full Radix UI primitive set (shadcn-style components under `components/ui/`), and `sonner` for notifications.
- **Offline-safe Builds**: The default system font stack does not fetch Google Fonts during builds.
- **Forms**: React Hook Form + Zod resolvers.
- **AI-Friendly**: Ships with `docs/AI_GUIDE.md` to keep AI-generated code consistent.

## Tech Stack

- Next.js 16 (App Router)
- React 19 / TypeScript 5
- Tailwind CSS 4
- Drizzle ORM + PostgreSQL (`postgres` driver)
- Zod + React Hook Form
- Zustand (state management)
- Vercel Analytics + optional Umami script injection

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment variables**:
   Copy `.env.example` to `.env` and configure at minimum `DATABASE_URL`. Umami analytics variables (`NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) are optional and only injected in production.

3. **Run development server** (port 13000):
   ```bash
   pnpm dev
   ```

4. **Verify changes**:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm build
   ```

5. **Database commands**:
   - `pnpm db:generate` — generate migrations
   - `pnpm db:migrate` — run migrations
   - `pnpm db:studio` — open Drizzle Studio

## تفعيل الدفع عبر Heleket

الربط موجود في الموقع: يُنشئ فاتورة لدى Heleket، ويعرض رابط الدفع للعميل، ويتحقق من إشعارات الدفع ويسترجع حالة الفاتورة من البوابة قبل تحديث الطلب.

1. من إعدادات المشروع في Netlify، افتح **Environment variables** وأضف `HELEKET_MERCHANT_ID` (معرّف التاجر) و`HELEKET_API_KEY` (مفتاح **Payment API** من حساب Heleket). أتح القيم لبيئة الإنتاج ووظائف الخادم، ولا تضف بادئة `NEXT_PUBLIC_` إلى أي منهما. لا تحفظ القيم في المستودع أو المحادثة.
2. أعد نشر الموقع بعد حفظ المتغيرات. يظهر خيار **Heleket** تلقائياً عند توفر المتغيرين، ما لم يكن هناك سجل مخصص له في لوحة وسائل الدفع؛ في هذه الحالة تأكد من تفعيله.
3. تأكد من عمل قاعدة بيانات الطلبات؛ يستخدم الإعداد الحالي `DATABASE_URL`. ظهور خيار الدفع وحده لا يثبت أن حفظ الطلبات يعمل.
4. أنشئ طلباً صغيراً، واختر Heleket وافتح صفحة الدفع. بعد إتمام الدفع، تحقق من تحول حالة الطلب إلى مدفوع في صفحة الطلب ولوحة الإدارة. لا تعني العودة إلى الموقع وحدها نجاح الدفع.

يرسل الموقع عنوان استقبال إشعارات الدفع تلقائياً مع كل فاتورة: `/api/heleket/webhook` على نطاق الموقع. عنوانه الحالي للإنتاج هو `https://silly-beignet-d243f7.netlify.app/api/heleket/webhook`. يجب أن يكون متاحاً للبوابة عبر HTTPS. عند استخدام نطاق مخصص، تأكد من أن عنوان الموقع المستخدم لإنشاء الفواتير يطابق نطاق الإنتاج.

إذا لم يظهر الخيار، راجع توفر المتغيرين في النشر الحالي وأعد النشر. إذا تعذر إنشاء الفاتورة، راجع تفعيل حساب التاجر وصلاحية مفتاح Payment API وسجلات الخادم. إذا تأخر تحديث الطلب، استخدم زر تحديث الحالة في صفحة الدفع؛ يستعلم الموقع عن الحالة مباشرة من Heleket أيضاً.

## Project Structure

- `app/` — Next.js App Router (`layout.tsx`, `page.tsx`, `api/`).
- `components/` — `AgentationGuard.tsx` plus shadcn-style primitives in `components/ui/`.
- `db/` — Drizzle client (`db/index.ts`).
- `lib/` — Core utilities: `api-response.ts`, `api-error-response.ts`, `request.ts`, `logger.ts`, `errors.ts`, `utils.ts`, `agentationFeedbackMode.ts`.
- `hooks/` — Shared hooks (`use-mobile.ts`, `use-toast.ts`).
- `utils/` — `cn.ts` (clsx + tailwind-merge).
- `docs/` — `AI_GUIDE.md` (AI/developer conventions).
- `Dockerfile` — Multi-stage node:22-slim build exposing port 13000.
