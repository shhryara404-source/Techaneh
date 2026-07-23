# راهنمای کوتاه Worker دستیار تکانه

فایل پیشنهادی برای نصب از داشبورد Cloudflare:
`worker/dashboard-worker.js`

## Secretهای لازم

- `DEEPSEEK_ASSISTANT_API_KEY` ضروری
- `TAVILY_API_KEY` پیشنهادی
- `GNEWS_API_KEY` پیشنهادی
- `TURNSTILE_SECRET_KEY` اختیاری

## Variableهای اصلی

- `ALLOWED_ORIGINS=https://techaneh.ir,https://www.techaneh.ir,https://shhryara404-source.github.io`
- `CONTENT_BASE_URL=https://techaneh.ir`
- `TEXT_AI_PROVIDERS=deepseek`
- `DEEPSEEK_MODEL=deepseek-v4-flash`
- `SEARCH_PROVIDERS=gnews,tavily,tavily_keyless,hacker_news`
- `RATE_LIMIT_PER_MINUTE=15`

## صدای ابری اختیاری

در بخش Bindings یک Workers AI binding با نام دقیق `AI` اضافه کنید. مدل پیش‌فرض انگلیسی `@cf/deepgram/aura-2-en` است. برای فارسی، سایت از موتور صدای داخلی مرورگر یا گوشی استفاده می‌کند.

## دامنه

در Worker به مسیر Settings > Domains & Routes بروید و Custom Domain زیر را اضافه کنید:
`api.techaneh.ir`
