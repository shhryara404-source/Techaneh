# تکانه | Techaneh v6

نسخه بازطراحی‌شده رسانه فناوری تکانه برای دامنه اصلی `techaneh.ir` و API دستیار در `api.techaneh.ir`.

## قابلیت‌های اصلی

- رابط کاملاً واکنش‌گرا با Liquid Glass، افکت‌های سبک و حالت کم‌مصرف برای موبایل‌های ضعیف‌تر
- منظومه سه‌بعدی تعاملی با واکنش به ماوس و لمس، همراه با کاهش خودکار جزئیات در دستگاه‌های کم‌توان
- نشانگر دایره‌ای و متحرک پیشرفت مطالعه در محدوده دید خواننده
- صفحات مستقل فارسی و انگلیسی، جست‌وجوی مقاله، RSS، JSON Feed، sitemap، canonical و hreflang
- مقایسه محصول با جست‌وجو، فیلتر دسته‌بندی و ۱۵۸ محصول اولیه برای پایش بازار
- دستیار تخصصی فناوری با آگاهی از مقاله‌ها و داده محصولات تکانه، جست‌وجوی خبر روز و محدودسازی موضوعی
- گفت‌وگوی صوتی با تشخیص و پخش صدای دستگاه، به‌علاوه صدای ابری انگلیسی اختیاری با Cloudflare Workers AI
- عامل‌های مقاله، مجموعه آموزشی، راهنمای خرید و به‌روزرسانی محصولات
- Cloudflare Worker با CORS محدود، Rate Limit، Turnstile اختیاری، محدودیت اندازه ورودی و هدرهای امنیتی

## معماری API و پشتیبان‌ها

### تولید مقاله در GitHub Actions

1. DeepSeek با Secret به نام `DEEPSEEK_ARTICLES_API_KEY`
2. GitHub Models با `GITHUB_TOKEN` خودکار و مجوز `models: read`

### جست‌وجوی خبر و منبع

1. GNews با `GNEWS_API_KEY`
2. Tavily با `TAVILY_API_KEY`
3. Tavily Keyless رسمی و محدودشده
4. Hacker News عمومی برای خبرهای فناوری

### دستیار سایت در Cloudflare Worker

- مدل اصلی: DeepSeek با Secret به نام `DEEPSEEK_ASSISTANT_API_KEY`
- دانش داخلی: `data/knowledge.json` شامل مقاله‌ها و داده محصولات
- جست‌وجوی تازه: GNews، Tavily کلیددار، Tavily Keyless و Hacker News
- صدای فارسی: قابلیت داخلی مرورگر و دستگاه، بدون کلید
- صدای انگلیسی ابری: Cloudflare Workers AI، اختیاری

## Secretهای لازم

### GitHub Repository Secrets

- `DEEPSEEK_ARTICLES_API_KEY`
- `TAVILY_API_KEY`
- `GNEWS_API_KEY`

### Cloudflare Worker Secrets

- `DEEPSEEK_ASSISTANT_API_KEY`
- `TAVILY_API_KEY` اختیاری ولی پیشنهادی
- `GNEWS_API_KEY` اختیاری ولی پیشنهادی
- `TURNSTILE_SECRET_KEY` اختیاری برای زمان انتشار عمومی

کلیدها را هرگز داخل فایل عمومی، `config.js`، پیام‌رسان، Issue یا تصویر قرار ندهید.

## نصب از صفر

1. یک repository عمومی و خالی با نام `Techaneh` بسازید.
2. فایل `Techaneh-v6-site.zip` را در ریشه repository بارگذاری کنید.
3. فایل `install-techaneh-v6.yml` را در مسیر `.github/workflows/install-techaneh-v6.yml` بسازید.
4. از بخش Actions، گردش‌کار `Install Techaneh v6` را اجرا کنید.
5. Secretها و Variableهای توضیح‌داده‌شده در PDF را اضافه کنید.
6. GitHub Pages را با منبع `GitHub Actions` فعال کنید.
7. Worker را در Cloudflare بسازید و `api.techaneh.ir` را به آن متصل کنید.
8. در پایان دامنه `techaneh.ir` را به GitHub Pages وصل کنید.

## کاتالوگ محصولات

فهرست ۱۵۸ محصول، یک watchlist گسترده و قابل‌به‌روزرسانی است، نه ادعای پوشش تمام مدل‌های جهان. داده ساختگی، قیمت حدسی یا مشخصات تأییدنشده نمایش داده نمی‌شود. عامل محصول در هر اجرا بخشی از فهرست را بررسی می‌کند و فقط پس از تأیید حداقل دو منبع مستقل، داده را منتشر می‌کند.

## بررسی فنی محلی

```bash
node build-seo-pages.mjs
node scripts/validate_site.mjs
node --check assets/app.js
node --check assets/v5-preflight.js
node --check assets/v5.js
node --check assets/v6.js
node --check worker/src/index.js
node --check worker/dashboard-worker.js
python -m py_compile scripts/*.py
```

## نکته درباره Hugging Face

در نسخه v6 هیچ Hugging Face Token لازم نیست. ابتدا سایت را با کلیدهای موجود راه‌اندازی کنید. افزودن یک سرویس جدید پیش از مشاهده نیاز واقعی، هزینه نگهداری و احتمال خطا را بی‌دلیل بالا می‌برد.

## مالکیت و مسئولیت تحریریه

نام، هویت بصری و محتوای تکانه متعلق به مالک پروژه است. عامل‌ها فقط پیش‌نویس و داده منبع‌دار تولید می‌کنند. انتشار بدون بازبینی انسانی، مخصوصاً درباره قیمت، مشخصات محصول، امنیت و توصیه خرید، توصیه نمی‌شود.
