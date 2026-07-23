  (() => {
    "use strict";

    const SITE = {
      name: "Techaneh | تکانه",
      baseUrl: "https://techaneh.ir/",
      defaultImage: "https://techaneh.ir/assets/og-cover.png",
      perPage: 9,
      security: { turnstileSiteKey: "" },
      agent: {
        baseUrl: "",
        endpoint: "",
        compareEndpoint: "",
        ttsEndpoint: "",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        timeout: 45000
      }
    };

    const publicConfig = window.TECHANEH_CONFIG || {};
    const baseAgentUrl = String(publicConfig.agentBaseUrl || "").replace(/\/$/, "");
    SITE.security.turnstileSiteKey = String(publicConfig.turnstileSiteKey || "").trim();
    Object.assign(SITE.agent, {
      baseUrl: baseAgentUrl,
      endpoint: publicConfig.agentEndpoint || (baseAgentUrl ? `${baseAgentUrl}/v1/agent` : ""),
      compareEndpoint: publicConfig.compareEndpoint || (baseAgentUrl ? `${baseAgentUrl}/v1/compare` : ""),
      ttsEndpoint: publicConfig.ttsEndpoint || (baseAgentUrl ? `${baseAgentUrl}/v1/tts` : "")
    }, window.TECHANEH_AGENT_CONFIG || {});

    const fallbackArticles = [
      {
        id: 1, category: "AI", date: "2026-07-10", author: "Techaneh Editorial", score: 95,
        title: { fa: "هوش مصنوعی عامل‌محور چیست و چرا مهم شده است؟", en: "What Is Agentic AI and Why Does It Matter?" },
        excerpt: { fa: "از چت‌باتی که پاسخ می‌دهد تا سیستمی که برنامه‌ریزی و اجرا می‌کند.", en: "From chatbots that answer to systems that plan and act." },
        body: { fa: `<p>عامل‌های هوشمند فقط پاسخ تولید نمی‌کنند؛ آن‌ها می‌توانند هدف را به چند مرحله تبدیل کنند، ابزار مناسب را انتخاب کنند و نتیجه را ارزیابی کنند.</p><h2>تفاوت با چت‌بات معمولی</h2><p>چت‌بات معمولاً در مرز یک مکالمه باقی می‌ماند، اما ایجنت می‌تواند حافظه، ابزار، برنامه‌ریزی و حلقه بازخورد داشته باشد.</p><blockquote>ارزش واقعی ایجنت در «خودکاربودن» نیست؛ در ترکیب استقلال با کنترل‌پذیری است.</blockquote><h2>معماری ساده</h2><h3>۱. درک هدف</h3><p>سیستم باید درخواست را به هدفی روشن و قابل سنجش تبدیل کند.</p><h3>۲. انتخاب ابزار</h3><p>جستجو، پایگاه داده، تقویم، کد یا هر ابزار دیگر بر اساس وظیفه انتخاب می‌شود.</p><h3>۳. ارزیابی نتیجه</h3><p>عامل باید بداند چه زمانی پاسخ کافی است و چه زمانی باید مسیر را اصلاح کند.</p>`, en: `<p>Intelligent agents do more than generate answers. They can decompose goals, choose tools, execute steps, and evaluate results.</p><h2>Beyond a chatbot</h2><p>A chatbot often stays within a conversation. An agent can combine memory, tools, planning, and feedback loops.</p><blockquote>The real value of an agent is not automation alone, but autonomy with controllability.</blockquote><h2>A simple architecture</h2><h3>1. Understand the goal</h3><p>The request must become a clear, measurable objective.</p><h3>2. Choose tools</h3><p>Search, databases, calendars, code, or other tools are selected based on the task.</p><h3>3. Evaluate</h3><p>The agent needs to know when the result is sufficient and when to revise its approach.</p>` }
      },
      {
        id: 2, category: "Programming", date: "2026-07-08", author: "Techaneh Editorial", score: 89,
        title: { fa: "چگونه یک وب‌سایت سریع‌تر و سبک‌تر بسازیم؟", en: "How to Build a Faster, Lighter Website" },
        excerpt: { fa: "راهنمای عملی برای کاهش زمان بارگذاری و بهبود تجربه کاربر.", en: "A practical guide to faster loading and better user experience." },
        body: { fa: `<p>سرعت سایت حاصل یک ترفند جادویی نیست؛ نتیجه ده‌ها تصمیم کوچک در تصاویر، فونت‌ها، JavaScript و نحوه رندر است.</p><h2>از بزرگ‌ترین عنصر شروع کنید</h2><p>عنصر اصلی بالای صفحه را سبک نگه دارید و منابع ضروری آن را زودتر بارگذاری کنید.</p><h2>JavaScript کمتر، تعامل بهتر</h2><p>کد غیرضروری را حذف کنید، رویدادها را واگذار کنید و کارهای سنگین را از مسیر اصلی تعامل بیرون ببرید.</p><h2>پایداری بصری</h2><p>برای تصاویر و اجزای پویا ابعاد مشخص کنید تا صفحه هنگام بارگذاری نپرد.</p>`, en: `<p>Site speed is not one magic trick. It is the result of many small decisions around images, fonts, JavaScript, and rendering.</p><h2>Start with the largest element</h2><p>Keep the main above-the-fold element lightweight and prioritize its critical resources.</p><h2>Less JavaScript, better interaction</h2><p>Remove unused code, delegate events, and keep heavy work away from the interaction path.</p><h2>Visual stability</h2><p>Reserve dimensions for images and dynamic elements to prevent layout shifts.</p>` }
      },
      {
        id: 3, category: "Phone", date: "2026-07-05", author: "Techaneh Editorial", score: 87,
        title: { fa: "پنج معیار مهم‌تر از عدد مگاپیکسل", en: "Five Camera Factors More Important Than Megapixels" },
        excerpt: { fa: "چرا کیفیت دوربین موبایل را نمی‌توان با یک عدد خلاصه کرد؟", en: "Why phone camera quality cannot be reduced to one number." },
        body: { fa: `<p>مگاپیکسل تنها اندازه تصویر را توصیف می‌کند، نه کیفیت نهایی آن را.</p><h2>اندازه حسگر</h2><p>حسگر بزرگ‌تر معمولاً نور بیشتری جمع می‌کند و در شب نتیجه بهتری می‌دهد.</p><h2>پردازش تصویر</h2><p>ترکیب چند فریم، HDR و الگوریتم رنگ می‌تواند نتیجه دو سخت‌افزار مشابه را کاملاً متفاوت کند.</p><h2>لرزش‌گیر و اپتیک</h2><p>پایداری و کیفیت لنز در عکس و ویدئو نقش تعیین‌کننده دارند.</p>`, en: `<p>Megapixels describe image dimensions, not final image quality.</p><h2>Sensor size</h2><p>A larger sensor usually gathers more light and performs better at night.</p><h2>Image processing</h2><p>Multi-frame fusion, HDR, and color algorithms can make similar hardware look very different.</p><h2>Stabilization and optics</h2><p>Stability and lens quality strongly shape both photos and video.</p>` }
      },
      {
        id: 4, category: "Laptop", date: "2026-07-01", author: "Techaneh Editorial", score: 86,
        title: { fa: "لپ‌تاپ مناسب برنامه‌نویسی واقعاً چه مشخصاتی می‌خواهد؟", en: "What Specs Does a Programming Laptop Really Need?" },
        excerpt: { fa: "انتخاب منطقی پردازنده، رم، نمایشگر و باتری بدون هزینه اضافی.", en: "A sensible CPU, RAM, display, and battery choice without overspending." },
        body: { fa: `<p>بهترین لپ‌تاپ برنامه‌نویسی لزوماً گران‌ترین مدل بازار نیست.</p><h2>رم و نوع پروژه</h2><p>برای توسعه وب سبک، ۱۶ گیگابایت معمولاً مناسب است؛ ماشین مجازی و پروژه‌های داده‌محور حافظه بیشتری می‌خواهند.</p><h2>پردازنده و پایداری</h2><p>عملکرد پایدار زیر بار طولانی مهم‌تر از جهش کوتاه بنچمارک است.</p><h2>نمایشگر و صفحه‌کلید</h2><p>این دو بخش ساعت‌ها مستقیماً با بدن و تمرکز شما درگیرند.</p>`, en: `<p>The best programming laptop is not necessarily the most expensive model.</p><h2>RAM and project type</h2><p>For light web development, 16 GB is often enough. Virtual machines and data-heavy projects need more.</p><h2>CPU and sustained performance</h2><p>Stable performance under long workloads matters more than short benchmark bursts.</p><h2>Display and keyboard</h2><p>These are the parts your body and attention interact with for hours.</p>` }
      },
      {
        id: 5, category: "BuyingGuide", date: "2026-06-28", author: "Techaneh Editorial", score: 84,
        title: { fa: "راهنمای خرید هدفون برای کار، سفر و ورزش", en: "Headphone Buying Guide for Work, Travel, and Exercise" },
        excerpt: { fa: "یک هدفون برای همه مناسب نیست؛ کاربرد واقعی باید نقطه شروع باشد.", en: "One headphone does not fit every use case. Start with real needs." },
        body: { fa: `<p>قبل از مقایسه کدک‌ها و درایورها، باید بدانید هدفون را کجا و چند ساعت استفاده می‌کنید.</p><h2>کار و تمرکز</h2><p>راحتی، میکروفون و حذف نویز پایدار اهمیت بیشتری دارند.</p><h2>سفر</h2><p>عمر باتری، جمع‌شدن و حذف صدای فرکانس پایین مهم‌اند.</p><h2>ورزش</h2><p>ثبات در گوش و مقاومت در برابر عرق بر کیفیت صدای آزمایشگاهی اولویت دارند.</p>`, en: `<p>Before comparing codecs and drivers, decide where and how long you will use the headphones.</p><h2>Work and focus</h2><p>Comfort, microphone quality, and consistent noise cancellation matter more.</p><h2>Travel</h2><p>Battery life, portability, and low-frequency noise cancellation are key.</p><h2>Exercise</h2><p>Secure fit and sweat resistance matter more than laboratory-perfect sound.</p>` }
      },
      {
        id: 6, category: "AI", date: "2026-06-22", author: "Techaneh Editorial", score: 82,
        title: { fa: "مدل زبانی چگونه پاسخ می‌سازد؟", en: "How Does a Language Model Build an Answer?" },
        excerpt: { fa: "نگاهی ساده اما دقیق به توکن، زمینه و احتمال.", en: "A simple but accurate look at tokens, context, and probability." },
        body: { fa: `<p>مدل زبانی متن را واژه‌به‌واژه به معنای انسانی نمی‌خواند؛ آن را به واحدهایی به نام توکن تبدیل می‌کند.</p><h2>توکن و زمینه</h2><p>هر پاسخ بر اساس الگوهای آموخته‌شده و متن موجود در پنجره زمینه ساخته می‌شود.</p><h2>پیش‌بینی، نه بازیابی صرف</h2><p>مدل معمولاً پاسخ را از یک مخزن آماده بیرون نمی‌کشد؛ توکن بعدی را مرحله‌به‌مرحله پیش‌بینی می‌کند.</p>`, en: `<p>A language model does not read text word-for-word in a human sense. It transforms text into units called tokens.</p><h2>Tokens and context</h2><p>Each answer is shaped by learned patterns and the text available in the context window.</p><h2>Prediction, not simple retrieval</h2><p>The model usually does not pull a finished answer from a database. It predicts the next token step by step.</p>` }
      }
    ];

    const fallbackProducts = [
      { name: "Demo · Phone A", category: "Phone", display: "6.7-inch OLED 120Hz", cpu: "X1 Pro", ram: "12 GB", battery: "5000 mAh", camera: "50 MP main", weight: "198 g", price: "$899", score: 91 },
      { name: "Demo · Laptop A", category: "Laptop", display: "15.3-inch 2.8K", cpu: "Core Ultra 7", ram: "16 GB", battery: "75 Wh", camera: "1080p", weight: "1.55 kg", price: "$1299", score: 88 },
      { name: "Demo · Phone B", category: "Phone", display: "6.4-inch OLED 120Hz", cpu: "Tensor Z", ram: "8 GB", battery: "4600 mAh", camera: "50 MP main", weight: "183 g", price: "$699", score: 87 },
      { name: "Demo · Laptop B", category: "Laptop", display: "14-inch 2.5K", cpu: "Ryzen 7", ram: "32 GB", battery: "68 Wh", camera: "1080p", weight: "1.28 kg", price: "$1199", score: 92 }
    ];

    const t = {
      fa: {
        skip:"پرش به محتوای اصلی",home:"خانه",articles:"مقالات",compare:"مقایسه",about:"درباره",search:"جستجو",settings:"تنظیمات",
        heroKicker:"رسانه زنده فناوری با نیروی هوش مصنوعی",heroLine1:"هر تکانه،",heroLine2:"یک کشف.",heroDesc:"تحلیل‌های روشن، آموزش‌های کاربردی و مقایسه‌های هوشمند برای دنیایی که هر روز سریع‌تر می‌تپد.",exploreArticles:"کشف مقالات",askAI:"از دستیار تکانه بپرس",
        metricArticles:"مقاله و تحلیل",metricCategories:"حوزه فناوری",metricBilingual:"تجربه دوزبانه",chipAI:"ذهن دیجیتال",chipCode:"معماری کد",chipGuide:"انتخاب هوشمند",
        feature1Title:"خلاصه هوشمند",feature1Text:"رسیدن سریع به لب مطلب",feature2Title:"مطالعه متمرکز",feature2Text:"فهرست، تنظیم متن و شنیدن مقاله",feature3Title:"مقایسه تحلیلی",feature3Text:"فراتر از یک جدول مشخصات",feature4Title:"ذخیره محلی",feature4Text:"مقالات محبوب همیشه در دسترس",intelNewsTitle:"رادار خبر",intelNewsText:"پایش منابع معتبر و ساخت پیش‌نویس‌های دوزبانه با کنترل کیفیت.",intelSeriesTitle:"مسیرهای یادگیری",intelSeriesText:"سلسله‌مقاله‌های هفتگی برای یادگیری مرحله‌به‌مرحله موضوعات تخصصی.",intelGuideTitle:"راهنمای خرید",intelGuideText:"راهنماهای ماهانه بر پایه نیاز واقعی، مشخصات قابل‌تأیید و ارزش خرید.",intelImageTitle:"استودیوی تصویر",intelImageText:"کاورهای اختصاصی هماهنگ با هویت بصری و موضوع هر مقاله.",
        freshPulse:"تازه‌ترین تکانه‌ها",latestTitle:"چیزهایی که اکنون ارزش دانستن دارند",latestDesc:"منتخب تازه‌ترین تحلیل‌ها، راهنماها و آموزش‌ها",viewAll:"مشاهده همه",
        libraryEyebrow:"کتابخانه تکانه",articlesTitle:"مقالات، تحلیل‌ها و راهنماها",searchPlaceholder:"جستجو میان مقاله‌ها...",saved:"ذخیره‌شده‌ها",clearFilters:"پاک‌کردن فیلترها",all:"همه",noResults:"مقاله‌ای با این مشخصات پیدا نشد.",results:n=>`${n.toLocaleString("fa-IR")} نتیجه`,readTime:n=>`${n.toLocaleString("fa-IR")} دقیقه مطالعه`,read:"مطالعه مقاله",
        back:"بازگشت",save:"ذخیره",savedDone:"ذخیره شد",share:"اشتراک",listen:"شنیدن",stop:"توقف",print:"چاپ",toc:"در این مقاله",articleImageMode:"تصویر مقالات",defaultArtwork:"گرافیک پیش‌فرض",aiArtwork:"تصویر هوش مصنوعی",readingSettings:"تنظیمات مطالعه",capReadTitle:"مطالعه‌ای که با شما سازگار می‌شود",capReadText:"تنظیم اندازه متن، عرض سطر، ذخیره، چاپ، اشتراک و شنیدن مقاله در یک تجربه یکپارچه.",capCompareTitle:"مقایسه، نه انباشت مشخصات",capCompareText:"تفاوت‌های مهم را کنار هم می‌گذاریم تا انتخاب محصول از یک جدول خشک فراتر برود.",capAgentTitle:"ایجنت‌هایی با ترمز و فرمان",capAgentText:"خودکارسازی خبر، آموزش، تصویر و راهنمای خرید همراه با منبع، کنترل کیفیت و امکان بازبینی.",capBilingualTitle:"یک رسانه، دو زبان",capBilingualText:"هر مقاله به فارسی و انگلیسی منتشر می‌شود تا تجربه سایت با زبان انتخابی شما هماهنگ بماند.",copyrightText:year=>`© ${year} تکانه. تمامی حقوق متعلق به شهریار وزیری نسب است.`,fontSize:"اندازه متن",lineWidth:"عرض سطر",articleProgress:"پیشرفت مطالعه",
        compareEyebrow:"تصمیم بهتر، نویز کمتر",compareTitle:"مقایسه هوشمند محصولات",compareDesc:"دو محصول را انتخاب کنید تا مشخصات و جمع‌بندی هوشمند تکانه را کنار هم ببینید.",category:"دسته‌بندی",firstProduct:"محصول اول",secondProduct:"محصول دوم",selectProduct:"انتخاب محصول",specs:"مشخصات",verdictTitle:"جمع‌بندی هوشمند تکانه",verdictText:name=>`بر اساس امتیاز کلی داده‌های موجود، ${name} انتخاب قوی‌تری است؛ با این حال بهترین گزینه به اولویت واقعی شما بستگی دارد.`,selectBoth:"برای مشاهده مقایسه، دو محصول را انتخاب کنید.",sameProduct:"لطفاً دو محصول متفاوت انتخاب کنید.",demoProducts:"فعلاً داده‌های نمونه نمایش داده می‌شوند. برای مشخصات واقعی، Product Agent را اجرا و Pull Request آن را پس از بررسی تأیید کنید.",
        aboutEyebrow:"درباره تکانه",aboutHeading1:"فناوری، بدون",aboutHeading2:"مه اطلاعاتی.",aboutText1:"تکانه جایی است برای آدم‌هایی که می‌خواهند فناوری را بفهمند، نه فقط تیترهایش را دنبال کنند. از هوش مصنوعی و برنامه‌نویسی تا موبایل، لپ‌تاپ و ابزارهای روزمره، تلاش می‌کنیم هر موضوع را روشن، کاربردی و بدون شلوغی اضافه روایت کنیم.",aboutText2:"این پروژه توسط شهریار وزیری نسب طراحی و توسعه یافته است. ایجنت‌ها در جمع‌آوری، سازمان‌دهی و غنی‌سازی محتوا کمک می‌کنند، اما منبع، دقت، شفافیت و امکان بازبینی همچنان فرمان اصلی این سفینه‌اند.",startReading:"شروع مطالعه",contactTitle:"ارتباط با ما",value1:"شفافیت پیش از هیجان",value2:"کاربرد پیش از انباشت اطلاعات",value3:"کنجکاوی بدون پایان",value4:"هوش مصنوعی در خدمت فهم بهتر",rights:"تمامی حقوق محفوظ است.",
        language:"زبان",theme:"پوسته",light:"روشن",dark:"تاریک",system:"سیستم",motion:"حرکت و افکت",fullMotion:"کامل",reducedMotion:"کاهش‌یافته",quickSearch:"جستجوی سریع",readingSettingsHint:"برای همه مقاله‌ها ذخیره می‌شود",speechProvider:"روش خواندن صوتی",speechAuto:"خودکار",speechDevice:"صدای دستگاه",speechCloud:"صدای ابری ایجنت",speechVoice:"صدای دستگاه",speechRate:"سرعت خواندن",agentConnection:"اتصال ایجنت",agentChecking:"در حال بررسی اتصال...",agentOnline:"ایجنت آنلاین است",agentOffline:"ایجنت هنوز تنظیم نشده یا در دسترس نیست",voiceUnavailable:"صدای فارسی مناسبی روی این دستگاه پیدا نشد. حالت ابری را از تنظیمات انتخاب کنید.",ttsUnavailable:"سرویس خواندن ابری هنوز متصل نشده است.",
        aiName:"دستیار تکانه",agentReady:"آماده اتصال به ایجنت",agentConnected:"ایجنت متصل است",aiPlaceholder:"درباره فناوری یا این مقاله بپرسید...",aiNote:"پاسخ‌ها ممکن است خطا داشته باشند؛ اطلاعات مهم را بررسی کنید.",aiWelcome:"سلام! من دستیار تکانه‌ام. می‌توانم درباره مقاله‌ها، مقایسه محصولات و مفاهیم فناوری کمک کنم.",aiFallback:"رابط دستیار آماده است، اما هنوز آدرس Worker در config.js تنظیم نشده است. پس از افزودن آن، پیام‌ها مستقیماً به ایجنت ارسال می‌شوند.",securityCheck:"لطفاً بررسی امنیتی دستیار را کامل کنید.",suggestions:["این مقاله را خلاصه کن","برای خرید راهنمایی‌ام کن","جدیدترین مقاله‌ها چیست؟"],
        copied:"پیوند کپی شد",shareUnavailable:"پیوند مقاله کپی شد",error:"مشکلی پیش آمد. دوباره تلاش کنید.",emptySaved:"هنوز مقاله‌ای ذخیره نکرده‌اید.",menu:"منو"
      },
      en: {
        skip:"Skip to main content",home:"Home",articles:"Articles",compare:"Compare",about:"About",search:"Search",settings:"Settings",
        heroKicker:"Live technology media powered by AI",heroLine1:"Every pulse,",heroLine2:"a discovery.",heroDesc:"Clear analysis, practical guides, and intelligent comparisons for a world moving faster every day.",exploreArticles:"Explore articles",askAI:"Ask Techaneh AI",
        metricArticles:"articles & analyses",metricCategories:"technology fields",metricBilingual:"bilingual experience",chipAI:"Digital mind",chipCode:"Code architecture",chipGuide:"Smart choices",
        feature1Title:"Smart summaries",feature1Text:"Reach the signal faster",feature2Title:"Focused reading",feature2Text:"TOC, typography, and text-to-speech",feature3Title:"Analytical comparison",feature3Text:"Beyond a specification table",feature4Title:"Local bookmarks",feature4Text:"Keep favorites within reach",intelNewsTitle:"News radar",intelNewsText:"Monitor trusted sources and prepare bilingual drafts with quality gates.",intelSeriesTitle:"Learning paths",intelSeriesText:"Weekly series that turn specialist topics into step-by-step journeys.",intelGuideTitle:"Buying guides",intelGuideText:"Monthly guides grounded in real needs, verifiable specs, and value.",intelImageTitle:"Visual studio",intelImageText:"Original covers aligned with each article and the Techaneh visual system.",
        freshPulse:"Latest pulses",latestTitle:"What is worth knowing right now",latestDesc:"Fresh analysis, guides, and tutorials",viewAll:"View all",
        libraryEyebrow:"Techaneh library",articlesTitle:"Articles, analysis, and guides",searchPlaceholder:"Search articles...",saved:"Saved",clearFilters:"Clear filters",all:"All",noResults:"No articles matched your filters.",results:n=>`${n.toLocaleString("en-US")} results`,readTime:n=>`${n.toLocaleString("en-US")} min read`,read:"Read article",
        back:"Back",save:"Save",savedDone:"Saved",share:"Share",listen:"Listen",stop:"Stop",print:"Print",toc:"In this article",articleImageMode:"Article imagery",defaultArtwork:"Default artwork",aiArtwork:"AI-generated image",readingSettings:"Reading settings",capReadTitle:"Reading that adapts to you",capReadText:"Text size, line width, saving, printing, sharing, and listening in one coherent reader.",capCompareTitle:"Comparison, not spec overload",capCompareText:"Meaningful differences are surfaced so choosing goes beyond a dry table.",capAgentTitle:"Agents with brakes and steering",capAgentText:"Automated news, learning, visuals, and buying guides with sources, quality gates, and review.",capBilingualTitle:"One publication, two languages",capBilingualText:"Every article ships in Persian and English, matching the language you choose.",copyrightText:year=>`© ${year} Techaneh. All rights reserved by Shahryar Vaziri Nasab.`,fontSize:"Font size",lineWidth:"Line width",articleProgress:"Reading progress",
        compareEyebrow:"Better decisions, less noise",compareTitle:"Intelligent product comparison",compareDesc:"Choose two products to compare their specifications and Techaneh's summary.",category:"Category",firstProduct:"First product",secondProduct:"Second product",selectProduct:"Select a product",specs:"Specifications",verdictTitle:"Techaneh intelligent verdict",verdictText:name=>`Based on the available overall score, ${name} is the stronger choice. The best product still depends on your real priorities.`,selectBoth:"Select two products to start comparing.",sameProduct:"Please choose two different products.",demoProducts:"Demo data is currently shown. Run the Product Agent and review its pull request to publish verified product specifications.",
        aboutEyebrow:"About Techaneh",aboutHeading1:"Technology, without",aboutHeading2:"the information fog.",aboutText1:"Techaneh is for people who want to understand technology, not merely chase its headlines. From AI and programming to phones, laptops, and everyday tools, each topic is shaped into a clear, useful story without the fog.",aboutText2:"Designed and developed by Shahryar Vaziri Nasab, Techaneh uses agents to gather, organize, and enrich content, while sources, accuracy, transparency, and human review remain firmly at the controls.",startReading:"Start reading",contactTitle:"Contact us",value1:"Clarity before hype",value2:"Utility before information overload",value3:"Curiosity without an endpoint",value4:"AI in service of understanding",rights:"All rights reserved.",
        language:"Language",theme:"Theme",light:"Light",dark:"Dark",system:"System",motion:"Motion & effects",fullMotion:"Full",reducedMotion:"Reduced",quickSearch:"Quick search",readingSettingsHint:"Saved for every article",speechProvider:"Speech method",speechAuto:"Automatic",speechDevice:"Device voice",speechCloud:"Cloud agent voice",speechVoice:"Device voice",speechRate:"Speech rate",agentConnection:"Agent connection",agentChecking:"Checking connection...",agentOnline:"Agent is online",agentOffline:"Agent is not configured or unavailable",voiceUnavailable:"No suitable voice was found on this device. Choose cloud speech in settings.",ttsUnavailable:"Cloud speech is not connected yet.",
        aiName:"Techaneh Assistant",agentReady:"Ready to connect to your agent",agentConnected:"Agent connected",aiPlaceholder:"Ask about technology or this article...",aiNote:"AI can make mistakes. Verify important information.",aiWelcome:"Hi! I am the Techaneh assistant. I can help with articles, product comparisons, and technology concepts.",aiFallback:"The assistant UI is ready, but no agent endpoint is configured yet. Add the Worker URL to config.js and messages will be sent to your agent.",securityCheck:"Please complete the assistant security check.",suggestions:["Summarize this article","Help me choose a product","What are the latest articles?"],
        copied:"Link copied",shareUnavailable:"Article link copied",error:"Something went wrong. Please try again.",emptySaved:"You have not saved any articles yet.",menu:"Menu"
      }
    };

    const safeJSON = (key, fallback) => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    };
    const storedLang = localStorage.getItem("techaneh:lang");
    const storedTheme = localStorage.getItem("techaneh:theme");
    const storedMotion = localStorage.getItem("techaneh:motion");
    const storedImageMode = localStorage.getItem("techaneh:imageMode") || "ai";
    const storedReader = safeJSON("techaneh:reader", {});
    const restoredHistory = safeJSON("techaneh:aiHistory", []);

    const state = {
      lang: ["fa","en"].includes(storedLang) ? storedLang : "fa",
      theme: ["light","dark","system"].includes(storedTheme) ? storedTheme : "system",
      motion: ["full","reduced"].includes(storedMotion) ? storedMotion : "full",
      imageMode: ["default","ai"].includes(storedImageMode) ? storedImageMode : "ai",
      category: "all",
      query: "",
      page: 1,
      savedOnly: false,
      currentArticle: null,
      speaking: false,
      audio: null,
      speechRun: 0,
      turnstileToken: "",
      turnstileWidget: null,
      reader: {
        fontSize: Math.min(25,Math.max(16,Number(storedReader.fontSize)||18)),
        width: Math.min(960,Math.max(620,Number(storedReader.width)||780)),
        speechProvider: ["auto","device","cloud"].includes(storedReader.speechProvider) ? storedReader.speechProvider : "auto",
        speechVoice: String(storedReader.speechVoice||""),
        speechRate: Math.min(1.3,Math.max(.7,Number(storedReader.speechRate)||.95))
      },
      aiHistory: Array.isArray(restoredHistory) ? restoredHistory : []
    };

    const qs = (s,root=document) => root.querySelector(s);
    const qsa = (s,root=document) => [...root.querySelectorAll(s)];
    const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
    const locale = () => state.lang === "fa" ? "fa-IR" : "en-US";
    const tr = key => t[state.lang][key];
    const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
    const getLocalized = (value,fallback="") => typeof value === "object" && value !== null ? (value[state.lang] ?? value.fa ?? value.en ?? fallback) : (value ?? fallback);
    const stripHTML = value => { const node=document.createElement("div"); node.innerHTML=String(value??""); return node.textContent.replace(/\s+/g," ").trim(); };
    const externalArticles = () => {
      const source = typeof allArticles !== "undefined" && Array.isArray(allArticles)
        ? allArticles
        : (Array.isArray(window.allArticles) ? window.allArticles : []);
      return source.length ? source : fallbackArticles;
    };
    const externalProducts = () => {
      const source = typeof productsList !== "undefined" && Array.isArray(productsList)
        ? productsList
        : (Array.isArray(window.productsList) ? window.productsList : []);
      return source.length ? source : fallbackProducts;
    };
    const articles = () => externalArticles().filter(Boolean);
    const products = () => externalProducts().filter(Boolean);
    const savedIds = () => {
      const value = safeJSON("techaneh:saved", []);
      return new Set((Array.isArray(value) ? value : []).map(String));
    };
    const categoryLabel = cat => ({
      fa:{AI:"ذهن دیجیتال",Programming:"معماری کد",Phone:"گوشی",Laptop:"لپ‌تاپ",Tablet:"تبلت",GPU:"کارت گرافیک",Console:"کنسول",Audio:"صوتی",Wearable:"پوشیدنی",Monitor:"نمایشگر",BuyingGuide:"نقشه راه"},
      en:{AI:"Digital Mind",Programming:"Code Architecture",Phone:"Phone",Laptop:"Laptop",Tablet:"Tablet",GPU:"GPU",Console:"Console",Audio:"Audio",Wearable:"Wearable",Monitor:"Monitor",BuyingGuide:"Roadmap"}
    })[state.lang][cat] || cat || tr("all");
    const categoryIcon = cat => ({AI:"cpu",Programming:"code",Phone:"phone",Laptop:"laptop",Tablet:"book",GPU:"cpu",Console:"spark",Audio:"volume",Wearable:"clock",Monitor:"image",BuyingGuide:"cart"}[cat] || "spark");
    const categoryColors = cat => ({AI:["#715aff","#20c7ff"],Programming:["#4e61ff","#9b52ff"],Phone:["#ff4f9a","#ff8a5c"],Laptop:["#14b8a6","#4f75ff"],Tablet:["#20c7ff","#705cff"],GPU:["#4ce2b4","#705cff"],Console:["#ff9d3d","#ff4f88"],Audio:["#22c5ff","#14b8a6"],Wearable:["#ff4fa3","#9b7bff"],Monitor:["#705cff","#4ce2b4"],BuyingGuide:["#ff9d3d","#ff4f88"]}[cat] || ["#705cff","#22c5ff"]);

    function sanitizeHTML(html) {
      const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`,"text/html");
      doc.querySelectorAll("script,iframe,object,embed,form,link,meta").forEach(el => el.remove());
      doc.querySelectorAll("*").forEach(el => {
        [...el.attributes].forEach(attr => {
          const n = attr.name.toLowerCase(),v = attr.value.trim().toLowerCase();
          if (n.startsWith("on") || (n === "href" && v.startsWith("javascript:")) || (n === "src" && v.startsWith("javascript:"))) el.removeAttribute(attr.name);
        });
        if (el.tagName === "A") { el.setAttribute("rel","noopener noreferrer"); }
        if (el.tagName === "IMG") { el.setAttribute("loading","lazy"); el.setAttribute("decoding","async"); }
      });
      return doc.body.firstElementChild?.innerHTML || "";
    }

    function readingMinutes(article) {
      const html = getLocalized(article.body,"");
      const text = new DOMParser().parseFromString(html,"text/html").body.textContent || "";
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return Math.max(1,Math.ceil(words/(state.lang === "fa" ? 180 : 220)));
    }

    function formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return Number.isNaN(d.getTime()) ? escapeHTML(date) : new Intl.DateTimeFormat(locale(),{year:"numeric",month:"short",day:"numeric"}).format(d);
    }

    function applyLanguage() {
      document.documentElement.lang = state.lang;
      document.documentElement.dir = state.lang === "fa" ? "rtl" : "ltr";
      qsa("[data-i18n]").forEach(el => { const value = tr(el.dataset.i18n); if (typeof value === "string") el.textContent = value; });
      qsa("[data-i18n-placeholder]").forEach(el => { const value = tr(el.dataset.i18nPlaceholder); if (typeof value === "string") el.placeholder = value; });
      qs("#brandPrimary").textContent = state.lang === "fa" ? "تکانه" : "Techaneh";
      qs("#brandSecondary").textContent = state.lang === "fa" ? "TECHANEH" : "تکانه";
      qsa("[data-lang]").forEach(btn => btn.classList.toggle("active",btn.dataset.lang === state.lang));
      const year = new Date().getFullYear().toLocaleString(locale(),{useGrouping:false});
      if(qs("#copyrightText")) qs("#copyrightText").textContent = tr("copyrightText")(year);
      renderAll();
    }

    function applyTheme() {
      document.documentElement.dataset.theme = state.theme;
      qsa("[data-theme-value]").forEach(btn => btn.classList.toggle("active",btn.dataset.themeValue === state.theme));
      const dark = state.theme === "dark" || (state.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
      qs('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]')?.setAttribute("content",dark ? "#070a13" : "#f5f7ff");
      qs("#quickTheme")?.classList.toggle("is-dark",dark);
    }

    function applyMotion() {
      document.documentElement.style.setProperty("--motion-enabled",state.motion === "reduced" ? "0" : "1");
      document.documentElement.classList.toggle("reduce-motion",state.motion === "reduced");
      qsa("[data-motion]").forEach(btn => btn.classList.toggle("active",btn.dataset.motion === state.motion));
    }

    function applyImageMode() {
      qsa("[data-image-mode]").forEach(btn=>btn.classList.toggle("active",btn.dataset.imageMode===state.imageMode));
      document.documentElement.dataset.articleImages=state.imageMode;
      renderLatest(); renderArticles();
      if(state.currentArticle) renderArticle(state.currentArticle.id,false);
    }

    function saveReaderSettings() {
      localStorage.setItem("techaneh:reader",JSON.stringify(state.reader));
    }

    function applyReaderSettings() {
      document.documentElement.style.setProperty("--reader-size",`${state.reader.fontSize}px`);
      document.documentElement.style.setProperty("--reader-width",`${state.reader.width}px`);
      const font=qs("#fontSizeRange"),width=qs("#widthRange"),provider=qs("#speechProvider"),rate=qs("#speechRate");
      if(font)font.value=state.reader.fontSize;
      if(width)width.value=state.reader.width;
      if(provider)provider.value=state.reader.speechProvider;
      if(rate)rate.value=state.reader.speechRate;
      if(qs("#fontSizeValue"))qs("#fontSizeValue").textContent=`${state.reader.fontSize}px`;
      if(qs("#widthValue"))qs("#widthValue").textContent=`${state.reader.width}px`;
      if(qs("#speechRateValue"))qs("#speechRateValue").textContent=`${state.reader.speechRate.toFixed(2)}×`;
    }

    function availableVoices() { return "speechSynthesis" in window ? speechSynthesis.getVoices() : []; }
    function populateVoices() {
      const select=qs("#speechVoice"); if(!select)return;
      const voices=availableVoices();
      const preferred=voices.filter(v=>v.lang?.toLowerCase().startsWith(state.lang==="fa"?"fa":"en"));
      const list=preferred.length?preferred:voices;
      select.innerHTML=`<option value="">${state.lang==="fa"?"انتخاب خودکار":"Automatic"}</option>`+list.map(v=>`<option value="${escapeHTML(v.voiceURI)}">${escapeHTML(v.name)} · ${escapeHTML(v.lang)}</option>`).join("");
      select.value=list.some(v=>v.voiceURI===state.reader.speechVoice)?state.reader.speechVoice:"";
    }

    async function checkAgentHealth() {
      const el=qs("#agentHealth"); if(!el)return;
      if(!SITE.agent.baseUrl){el.dataset.status="offline";el.querySelector("span:last-child").textContent=tr("agentOffline");return;}
      try{
        const response=await fetch(`${SITE.agent.baseUrl}/health`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout?.(6000)});
        if(!response.ok)throw new Error("offline");
        el.dataset.status="online";el.querySelector("span:last-child").textContent=tr("agentOnline");
        qs("#agentStatus").textContent=tr("agentConnected");
      }catch{el.dataset.status="offline";el.querySelector("span:last-child").textContent=tr("agentOffline");}
    }

    function renderAll() {
      qs("#metricArticles").textContent = articles().length.toLocaleString(locale());
      qs("#metricCategories").textContent = new Set(articles().map(a=>a.category).filter(Boolean)).size.toLocaleString(locale());
      renderLatest();
      renderCategoryPills();
      renderArticles();
      initCompare();
      renderAISuggestions();
      if (state.currentArticle) renderArticle(state.currentArticle.id,false);
      updateStaticMetadata();
      applyReaderSettings();
      populateVoices();
    }

    function cardHTML(article,index=0) {
      const [a,b] = categoryColors(article.category);
      const isSaved = savedIds().has(String(article.id));
      const title = escapeHTML(getLocalized(article.title,"Untitled"));
      const excerpt = escapeHTML(getLocalized(article.excerpt,""));
      return `<article class="article-card glass reveal" style="--card-a:${a};--card-b:${b};--reveal-delay:${Math.min(index,8)*70}ms">
        <button class="bookmark-btn ${isSaved?"saved":""}" type="button" data-save-id="${escapeHTML(article.id)}" aria-label="${escapeHTML(tr("save"))}">${icon("bookmark")}</button>
        <a class="card-link" href="#article/${encodeURIComponent(article.id)}">
          <div class="card-visual">${state.imageMode==="ai"&&article.image ? `<img class="card-image" src="${escapeHTML(article.image)}" alt="${title}" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : ""}<div class="card-glyph">${icon(categoryIcon(article.category))}</div></div>
          <div class="card-body">
            <div class="card-meta"><span class="category-badge">${escapeHTML(categoryLabel(article.category))}</span><time datetime="${escapeHTML(article.date||"")}">${formatDate(article.date)}</time></div>
            <h3>${title}</h3><p>${excerpt}</p>
            <div class="card-footer"><span>${icon("clock")} ${escapeHTML(tr("readTime")(readingMinutes(article)))}</span><span>${escapeHTML(tr("read"))} ${icon("chevron")}</span></div>
          </div>
        </a></article>`;
    }

    function renderLatest() {
      const sorted = [...articles()].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).slice(0,6);
      qs("#latestGrid").innerHTML = sorted.map((article,index)=>cardHTML(article,index)).join("");
      activateReveals();
    }

    function categories() { return [...new Set(articles().map(a=>a.category).filter(Boolean))]; }
    function renderCategoryPills() {
      const list = ["all",...categories()];
      qs("#categoryPills").innerHTML = list.map(cat=>`<button class="category-pill ${state.category===cat?"active":""}" type="button" data-category="${escapeHTML(cat)}">${escapeHTML(cat==="all"?tr("all"):categoryLabel(cat))}</button>`).join("");
    }

    function filteredArticles() {
      const q = state.query.trim().toLocaleLowerCase(locale());
      const saved = savedIds();
      return articles().filter(article => {
        const haystack = [getLocalized(article.title),getLocalized(article.excerpt),getLocalized(article.body),categoryLabel(article.category)].join(" ").replace(/<[^>]+>/g," ").toLocaleLowerCase(locale());
        return (!q || haystack.includes(q)) && (state.category === "all" || article.category === state.category) && (!state.savedOnly || saved.has(String(article.id)));
      }).sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    }

    function renderArticles() {
      const items = filteredArticles();
      const pages = Math.max(1,Math.ceil(items.length/SITE.perPage));
      state.page = Math.min(state.page,pages);
      const slice = items.slice((state.page-1)*SITE.perPage,state.page*SITE.perPage);
      qs("#resultsCount").textContent = tr("results")(items.length);
      qs("#savedFilter").classList.toggle("active",state.savedOnly);
      qs("#articlesGrid").innerHTML = slice.length ? slice.map((article,index)=>cardHTML(article,index)).join("") : `<div class="empty-state glass">${icon("search")}<h3>${escapeHTML(state.savedOnly?tr("emptySaved"):tr("noResults"))}</h3></div>`;
      qs("#pagination").innerHTML = pages > 1 ? Array.from({length:pages},(_,i)=>`<button class="page-btn ${state.page===i+1?"active":""}" type="button" data-page-number="${i+1}" aria-label="${i+1}">${(i+1).toLocaleString(locale())}</button>`).join("") : "";
      activateReveals();
    }

    function toggleSaved(id) {
      const set = savedIds(),key=String(id);
      set.has(key)?set.delete(key):set.add(key);
      localStorage.setItem("techaneh:saved",JSON.stringify([...set]));
      renderArticles(); renderLatest();
      if (state.currentArticle && String(state.currentArticle.id)===key) updateReaderSave();
      toast(set.has(key)?tr("savedDone"):tr("save"));
    }

    function prepareArticleBody(html) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = sanitizeHTML(html);
      const headings = [...wrapper.querySelectorAll("h2,h3")];
      headings.forEach((h,i)=>{ h.id = `section-${i+1}`; });
      return { html:wrapper.innerHTML, headings:headings.map(h=>({id:h.id,text:h.textContent,level:h.tagName})) };
    }

    function renderArticle(articleId,pushMeta=true) {
      const article = articles().find(a=>String(a.id)===String(articleId));
      if (!article) { location.hash="#articles"; return; }
      state.currentArticle = article;
      const title = getLocalized(article.title,"Untitled"),excerpt=getLocalized(article.excerpt,""),body=prepareArticleBody(getLocalized(article.body,""));
      const [a,b]=categoryColors(article.category);
      qs("#readerCover").style.setProperty("--cover-a",a); qs("#readerCover").style.setProperty("--cover-b",b);
      const useCover=state.imageMode==="ai"&&article.image; qs("#readerCover").classList.toggle("has-image",Boolean(useCover)); qs("#readerCover").style.setProperty("--cover-image",useCover?`url("${encodeURI(String(article.image)).replace(/"/g,"%22")}")`:"none");
      qs("#readerCover").innerHTML = `<span class="category-badge" style="background:rgba(255,255,255,.18);color:white;width:max-content">${escapeHTML(categoryLabel(article.category))}</span><h1>${escapeHTML(title)}</h1><p style="max-width:65ch;margin:.2rem 0 1rem;opacity:.88">${escapeHTML(excerpt)}</p><div class="article-meta-line"><span>${escapeHTML(article.author||"Techaneh")}</span><time datetime="${escapeHTML(article.date||"")}">${formatDate(article.date)}</time><span>${escapeHTML(tr("readTime")(readingMinutes(article)))}</span></div>`;
      qs("#readerContent").innerHTML = body.html;
      qs("#articleToc").innerHTML = body.headings.length ? body.headings.map(h=>`<a href="#${h.id}" style="padding-inline-start:${h.level==="H3"?"1.1rem":".55rem"}">${escapeHTML(h.text)}</a>`).join("") : `<span class="muted">—</span>`;
      updateReaderSave();
      if (pushMeta) updateArticleMetadata(article,title,excerpt);
      requestAnimationFrame(()=>{ window.scrollTo({top:0,behavior:"auto"}); observeToc(); updateReadingProgress(); });
    }

    function updateReaderSave() {
      if (!state.currentArticle) return;
      const isSaved=savedIds().has(String(state.currentArticle.id));
      qs("#readerSave").classList.toggle("active",isSaved);
      qs("#readerSave span").textContent=isSaved?tr("savedDone"):tr("save");
    }

    function updateStaticMetadata() {
      if (location.hash.startsWith("#article/")) return;
      document.title = state.lang === "fa" ? "تکانه | Techaneh — رسانه هوشمند فناوری" : "Techaneh — Intelligent Technology Media";
      setMeta("description",state.lang === "fa"?"تکانه، رسانه هوشمند فناوری برای تحلیل هوش مصنوعی، برنامه‌نویسی، موبایل، لپ‌تاپ و مقایسه محصولات.":"Techaneh is an intelligent technology publication for AI, programming, devices, guides, and product comparisons.");
      setProperty("og:title",document.title); setProperty("og:description",qs('meta[name="description"]').content); setProperty("og:type","website"); setProperty("og:url",SITE.baseUrl);
      qs("link[rel=canonical]").href=SITE.baseUrl;
      qs("#articleSchema")?.remove();
    }

    function slugifyArticle(article) {
      const source = typeof article?.title === "object"
        ? (article.title.en || article.title.fa || "article")
        : (article?.title || "article");
      return String(source)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 72) || "article";
    }

    function articleCanonicalUrl(article) {
      const lang = state.lang === "en" ? "en" : "fa";
      return new URL(`${lang}/articles/${encodeURIComponent(article.id)}-${slugifyArticle(article)}/`, SITE.baseUrl).href;
    }

    function updateArticleMetadata(article,title,excerpt) {
      const url = articleCanonicalUrl(article);
      document.title=`${title} | ${state.lang==="fa"?"تکانه":"Techaneh"}`;
      const imageUrl=article.image?new URL(article.image,SITE.baseUrl).href:SITE.defaultImage;
      setMeta("description",excerpt.slice(0,200)); setProperty("og:title",document.title); setProperty("og:description",excerpt); setProperty("og:type","article"); setProperty("og:url",url);setProperty("og:image",imageUrl);setMeta("twitter:image",imageUrl);
      qs("link[rel=canonical]").href=url;
      qs("#articleSchema")?.remove();
      const schema=document.createElement("script"); schema.type="application/ld+json"; schema.id="articleSchema";
      const words=stripHTML(getLocalized(article.body,"")).split(/\s+/).filter(Boolean).length;
      schema.textContent=JSON.stringify({"@context":"https://schema.org","@type":"TechArticle",headline:title,description:excerpt,datePublished:article.date||undefined,dateModified:article.modified||article.date||undefined,author:{"@type":"Organization",name:article.author||"Techaneh Editorial",url:SITE.baseUrl},publisher:{"@type":"Organization",name:"Techaneh | تکانه",url:SITE.baseUrl,logo:{"@type":"ImageObject",url:`${SITE.baseUrl}assets/techaneh-mark.svg`}},mainEntityOfPage:{"@type":"WebPage","@id":url},image:imageUrl,inLanguage:state.lang==="fa"?"fa-IR":"en-US",articleSection:article.category||"Technology",wordCount:words,timeRequired:`PT${readingMinutes(article)}M`,isAccessibleForFree:true,keywords:Array.isArray(article?.keywords?.[state.lang])?article.keywords[state.lang].join(", "):undefined,citation:Array.isArray(article.sources)?article.sources:[]});
      document.head.append(schema);
    }
    function setMeta(name,value){ let el=qs(`meta[name="${name}"]`); if(!el){el=document.createElement("meta");el.name=name;document.head.append(el);} el.content=value; }
    function setProperty(property,value){ let el=qs(`meta[property="${property}"]`); if(!el){el=document.createElement("meta");el.setAttribute("property",property);document.head.append(el);} el.content=value; }

    function initCompare() {
      const hasVerifiedCatalog = typeof productsList !== "undefined" && Array.isArray(productsList) && productsList.some(item => Array.isArray(item?.sources) && item.sources.length >= 2);
      const dataStatus = qs("#productDataStatus");
      if (dataStatus) {
        dataStatus.hidden = hasVerifiedCatalog;
        dataStatus.textContent = hasVerifiedCatalog ? "" : tr("demoProducts");
      }
      const cats=["all",...new Set(products().map(p=>p.category).filter(Boolean))];
      const categorySelect=qs("#compareCategory"),current=categorySelect.value||"all";
      categorySelect.innerHTML=cats.map(cat=>`<option value="${escapeHTML(cat)}">${escapeHTML(cat==="all"?tr("all"):categoryLabel(cat))}</option>`).join("");
      categorySelect.value=cats.includes(current)?current:"all";
      populateProductSelects(false);
    }

    function populateProductSelects(reset=true) {
      const cat=qs("#compareCategory").value||"all";
      const list=products().filter(p=>cat==="all"||p.category===cat);
      const p1=qs("#productOne"),p2=qs("#productTwo"),v1=reset?"":p1.value,v2=reset?"":p2.value;
      const options=`<option value="">${escapeHTML(tr("selectProduct"))}</option>`+list.map((p,i)=>`<option value="${i}">${escapeHTML(p.name)}</option>`).join("");
      p1.innerHTML=options;p2.innerHTML=options;
      if(v1 && p1.querySelector(`option[value="${CSS.escape(v1)}"]`))p1.value=v1;
      if(v2 && p2.querySelector(`option[value="${CSS.escape(v2)}"]`))p2.value=v2;
      renderComparison();
    }

    function selectedProducts() {
      const cat = qs("#compareCategory").value || "all";
      const list = products().filter(p => cat === "all" || p.category === cat);
      const firstValue = qs("#productOne").value;
      const secondValue = qs("#productTwo").value;
      return [
        firstValue === "" ? null : list[Number(firstValue)],
        secondValue === "" ? null : list[Number(secondValue)]
      ];
    }

    function productPanel(product) {
      const labels={display:state.lang==="fa"?"نمایشگر":"Display",cpu:state.lang==="fa"?"پردازنده":"Processor",gpu:state.lang==="fa"?"گرافیک":"Graphics",ram:"RAM",storage:state.lang==="fa"?"حافظه":"Storage",battery:state.lang==="fa"?"باتری":"Battery",camera:state.lang==="fa"?"دوربین":"Camera",connectivity:state.lang==="fa"?"اتصالات":"Connectivity",weight:state.lang==="fa"?"وزن":"Weight",price:state.lang==="fa"?"قیمت":"Price"};
      const verified=Array.isArray(product.sources)&&product.sources.length>=2;
      const status=verified?(state.lang==="fa"?"تأییدشده با منبع":"Source verified"):(state.lang==="fa"?"در صف بررسی عامل":"Queued for agent verification");
      const updated=product.lastUpdated?`<small>${state.lang==="fa"?"آخرین بررسی":"Last checked"}: ${escapeHTML(product.lastUpdated)}</small>`:"";
      return `<section class="product-panel ${verified?"verified":"seed"}"><div class="product-panel-head"><span class="product-status">${escapeHTML(status)}</span><h3>${escapeHTML(product.name)}</h3>${updated}</div>${Object.entries(labels).map(([k,l])=>`<div class="spec-row"><span>${escapeHTML(l)}</span><span>${escapeHTML(product[k]||"—")}</span></div>`).join("")}</section>`;
    }

    async function renderComparison() {
      const [one,two]=selectedProducts();
      if(!one||!two){qs("#comparisonGrid").innerHTML="";qs("#comparisonVerdict").innerHTML=`<div class="verdict muted">${escapeHTML(tr("selectBoth"))}</div>`;return;}
      if(one===two){qs("#comparisonGrid").innerHTML="";qs("#comparisonVerdict").innerHTML=`<div class="verdict">${escapeHTML(tr("sameProduct"))}</div>`;return;}
      qs("#comparisonGrid").innerHTML=productPanel(one)+productPanel(two);
      const winner=(Number(one.score)||0)>=(Number(two.score)||0)?one:two;
      const fallback=tr("verdictText")(winner.name);
      qs("#comparisonVerdict").innerHTML=`<div class="verdict"><span class="eyebrow">AI</span><h3>${escapeHTML(tr("verdictTitle"))}</h3><p>${escapeHTML(fallback)}</p></div>`;
      if(!SITE.agent.compareEndpoint)return;
      try{
        qs("#comparisonVerdict p").textContent=state.lang==="fa"?"در حال تحلیل اولویت‌ها و تفاوت‌های واقعی...":"Analyzing meaningful differences and priorities...";
        const response=await fetch(SITE.agent.compareEndpoint,{method:"POST",headers:SITE.agent.headers,body:JSON.stringify({language:state.lang,products:[one,two]}),signal:AbortSignal.timeout?.(SITE.agent.timeout)});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const data=await response.json();
        qs("#comparisonVerdict p").textContent=data.reply||data.output||fallback;
      }catch(err){console.warn("Comparison agent unavailable",err);qs("#comparisonVerdict p").textContent=fallback;}
    }

    function route() {
      const raw=location.hash.replace(/^#/,"")||"home";
      const [page,param]=raw.split("/");
      const target=page==="article"?"articleDetail":["home","articles","compare","about"].includes(page)?page:"home";
      qsa(".page").forEach(el=>el.classList.toggle("active",el.dataset.page===target));
      qsa("[data-route]").forEach(el=>el.classList.toggle("active",el.dataset.route===page));
      closeDrawer();
      if(page==="article"&&param)renderArticle(decodeURIComponent(param)); else {state.currentArticle=null; qs("#readerProgressOrb")?.classList.remove("show"); stopSpeaking(); updateStaticMetadata(); window.scrollTo({top:0,behavior:"auto"});}
      if(page==="articles")setTimeout(()=>qs("#articleSearch")?.focus({preventScroll:true}),0);
      activateReveals();
    }

    function openDrawer(){const d=qs("#mobileDrawer");d.classList.add("open");d.setAttribute("aria-hidden","false");qs("#menuOpen").setAttribute("aria-expanded","true");document.body.style.overflow="hidden";}
    function closeDrawer(){const d=qs("#mobileDrawer");d.classList.remove("open");d.setAttribute("aria-hidden","true");qs("#menuOpen").setAttribute("aria-expanded","false");document.body.style.overflow="";}
    function openDialog(dialog){if(!dialog.open)dialog.showModal();}
    function closeDialogs(){qsa("dialog[open]").forEach(d=>d.close());}

    function openAI(){qs("#aiPanel").classList.add("open");qs("#aiPanel").setAttribute("aria-hidden","false");qs(".ai-launcher").setAttribute("aria-expanded","true");initTurnstile();setTimeout(()=>qs("#aiInput").focus(),250);}
    function closeAI(){qs("#aiPanel").classList.remove("open");qs("#aiPanel").setAttribute("aria-hidden","true");qs(".ai-launcher").setAttribute("aria-expanded","false");}
    function renderAISuggestions(){qs("#aiSuggestions").innerHTML=tr("suggestions").map(s=>`<button type="button" data-ai-suggestion="${escapeHTML(s)}">${escapeHTML(s)}</button>`).join("");}
    function renderAIHistory(){
      if(!state.aiHistory.length)state.aiHistory=[{role:"assistant",content:tr("aiWelcome")}];
      qs("#aiMessages").innerHTML=state.aiHistory.map(m=>{
        const sources=Array.isArray(m.sources)&&m.sources.length?`<div class="message-sources"><strong>${state.lang==="fa"?"منابع":"Sources"}</strong>${m.sources.slice(0,5).map(source=>`<a href="${escapeHTML(source.url||"#")}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(source.provider||"Source")}</span>${escapeHTML(source.title||source.url||"")}</a>`).join("")}</div>`:"";
        return `<div class="message ${m.role==="user"?"user":"bot"}"><div>${escapeHTML(m.content)}</div>${sources}</div>`;
      }).join("");
      qs("#aiMessages").scrollTop=qs("#aiMessages").scrollHeight;
      qs("#agentStatus").textContent=SITE.agent.endpoint?tr("agentConnected"):tr("agentReady");
    }
    function saveAIHistory(){state.aiHistory=state.aiHistory.slice(-30);localStorage.setItem("techaneh:aiHistory",JSON.stringify(state.aiHistory));}
    function setTyping(show){qs("#typingMessage")?.remove();if(show){const el=document.createElement("div");el.id="typingMessage";el.className="message bot typing";el.innerHTML="<i></i><i></i><i></i>";qs("#aiMessages").append(el);qs("#aiMessages").scrollTop=qs("#aiMessages").scrollHeight;}}

    function loadTurnstileScript(){
      if(!SITE.security.turnstileSiteKey)return Promise.resolve(false);
      if(window.turnstile)return Promise.resolve(true);
      if(window.__techanehTurnstilePromise)return window.__techanehTurnstilePromise;
      window.__techanehTurnstilePromise=new Promise((resolve,reject)=>{
        const script=document.createElement("script");
        script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async=true;script.defer=true;
        script.onload=()=>resolve(true);script.onerror=()=>reject(new Error("turnstile_load_failed"));
        document.head.append(script);
      });
      return window.__techanehTurnstilePromise;
    }

    async function initTurnstile(){
      const box=qs("#turnstileContainer");
      if(!SITE.security.turnstileSiteKey){box.hidden=true;return;}
      box.hidden=false;
      try{
        await loadTurnstileScript();
        if(state.turnstileWidget===null&&window.turnstile){
          state.turnstileWidget=window.turnstile.render(box,{
            sitekey:SITE.security.turnstileSiteKey,
            theme:"auto",
            callback:token=>{state.turnstileToken=token;},
            "expired-callback":()=>{state.turnstileToken="";},
            "error-callback":()=>{state.turnstileToken="";}
          });
        }
      }catch(err){console.warn("Turnstile unavailable",err);}
    }

    function resetTurnstile(){
      state.turnstileToken="";
      if(window.turnstile&&state.turnstileWidget!==null){try{window.turnstile.reset(state.turnstileWidget);}catch{}}
    }

    async function askAgent(message){
      if(!SITE.agent.endpoint)return {reply:tr("aiFallback"),sources:[]};
      if(SITE.security.turnstileSiteKey&&!state.turnstileToken)throw new Error("turnstile_required");
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),SITE.agent.timeout);
      const payload={message,language:state.lang,turnstileToken:state.turnstileToken,history:state.aiHistory.slice(-12),context:{page:location.hash||"#home",article:state.currentArticle?{id:state.currentArticle.id,title:getLocalized(state.currentArticle.title),excerpt:getLocalized(state.currentArticle.excerpt),bodyText:stripHTML(getLocalized(state.currentArticle.body,"" )).slice(0,12000)}:null}};
      try{
        const response=await fetch(SITE.agent.endpoint,{method:SITE.agent.method,headers:SITE.agent.headers,body:JSON.stringify(payload),signal:controller.signal});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const type=response.headers.get("content-type")||"";
        if(type.includes("application/json")){const data=await response.json();return {reply:data.reply||data.message||data.output||JSON.stringify(data),sources:Array.isArray(data.sources)?data.sources:[],provider:data.provider||""};}
        return {reply:await response.text(),sources:[]};
      }finally{clearTimeout(timer);if(SITE.security.turnstileSiteKey)resetTurnstile();}
    }

    async function submitAI(message){
      const clean=message.trim();if(!clean)return;
      state.aiHistory.push({role:"user",content:clean});renderAIHistory();setTyping(true);
      try{const result=await askAgent(clean);setTyping(false);state.aiHistory.push({role:"assistant",content:result.reply,sources:result.sources||[],provider:result.provider||""});saveAIHistory();renderAIHistory();}
      catch(err){console.error(err);setTyping(false);state.aiHistory.push({role:"assistant",content:String(err.message).includes("turnstile")?tr("securityCheck"):tr("error")});renderAIHistory();}
    }

    function updateReadingProgress(){
      const max=document.documentElement.scrollHeight-innerHeight;
      const global=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;
      qs("#readingProgress").style.width=`${global}%`;
      qs("#siteHeader").classList.toggle("scrolled",scrollY>20);
      if(state.currentArticle){
        const content=qs("#readerContent");if(!content)return;
        const start=content.getBoundingClientRect().top+scrollY-innerHeight*.25,end=start+content.offsetHeight-innerHeight*.55;
        const p=Math.min(100,Math.max(0,(scrollY-start)/(end-start)*100));
        qs("#articleProgressText").textContent=`${Math.round(p).toLocaleString(locale())}%`;
        const circle=qs("#articleProgressCircle"),orb=qs("#readerProgressOrb"); if(circle){const circumference=263.89;circle.style.strokeDashoffset=String(circumference*(1-p/100));} if(orb){orb.classList.add("show");orb.setAttribute("aria-label",`${tr("articleProgress")} ${Math.round(p)}%`);} 
      }
    }

    function observeToc(){
      const links=qsa("#articleToc a"),map=new Map(links.map(a=>[a.getAttribute("href").slice(1),a]));
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.remove("active"));map.get(entry.target.id)?.classList.add("active");}}),{rootMargin:"-25% 0px -65% 0px"});
      qsa("#readerContent h2,#readerContent h3").forEach(h=>observer.observe(h));
    }

    let revealObserver;
    function activateReveals(){
      revealObserver ||= new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObserver.unobserve(e.target);}}),{threshold:.08});
      qsa(".reveal:not(.visible)").forEach(el=>revealObserver.observe(el));
    }

    function stopSpeaking(){
      state.speechRun += 1;
      window.speechSynthesis?.cancel();
      if(state.audio){
        state.audio.pause();
        if(state.audio.src?.startsWith("blob:")) URL.revokeObjectURL(state.audio.src);
        state.audio=null;
      }
      state.speaking=false;
      const span=qs("#readerSpeak span");if(span)span.textContent=tr("listen");
    }

    function chooseDeviceVoice(){
      const voices=availableVoices();
      if(state.reader.speechVoice)return voices.find(v=>v.voiceURI===state.reader.speechVoice)||null;
      const prefix=state.lang==="fa"?"fa":"en";
      return voices.find(v=>v.lang?.toLowerCase().startsWith(prefix))||null;
    }

    async function playDeviceChunk(text,voice,runId){
      await new Promise((resolve,reject)=>{
        if(!state.speaking||runId!==state.speechRun){resolve();return;}
        const utterance=new SpeechSynthesisUtterance(text);
        utterance.lang=state.lang==="fa"?"fa-IR":"en-US";
        utterance.rate=state.reader.speechRate;
        utterance.pitch=1;
        if(voice)utterance.voice=voice;
        utterance.onend=resolve;
        utterance.onerror=event=>event.error==="canceled"?resolve():reject(new Error("speech-playback"));
        speechSynthesis.speak(utterance);
      });
    }

    async function speakWithDevice(text,runId){
      if(!("speechSynthesis" in window))throw new Error("speech-unavailable");
      const voice=chooseDeviceVoice();
      if(state.lang==="fa"&&!voice)throw new Error("voice-unavailable");
      const chunks=splitSpeechText(text,700);
      for(const chunk of chunks){
        if(!state.speaking||runId!==state.speechRun)return;
        await playDeviceChunk(chunk,voice,runId);
      }
      if(state.speaking&&runId===state.speechRun)stopSpeaking();
    }

    function splitSpeechText(text,maxLength=3600){
      const paragraphs=String(text||"").split(/\n{2,}/).map(part=>part.trim()).filter(Boolean);
      const chunks=[];
      for(const paragraph of paragraphs){
        if(paragraph.length<=maxLength){
          const last=chunks.at(-1);
          if(last && last.length+paragraph.length+2<=maxLength)chunks[chunks.length-1]=`${last}\n\n${paragraph}`;
          else chunks.push(paragraph);
          continue;
        }
        const sentences=paragraph.split(/(?<=[.!?؟。])\s+/);
        let current="";
        for(const sentence of sentences){
          if(sentence.length>maxLength){
            if(current){chunks.push(current);current="";}
            for(let i=0;i<sentence.length;i+=maxLength)chunks.push(sentence.slice(i,i+maxLength));
          }else if(!current)current=sentence;
          else if(current.length+sentence.length+1<=maxLength)current+=` ${sentence}`;
          else{chunks.push(current);current=sentence;}
        }
        if(current)chunks.push(current);
      }
      return chunks.length?chunks:[String(text||"").slice(0,maxLength)];
    }

    async function playCloudChunk(text,runId){
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),SITE.agent.timeout);
      let response;
      try{
        response=await fetch(SITE.agent.ttsEndpoint,{method:"POST",headers:SITE.agent.headers,body:JSON.stringify({text,language:state.lang,rate:state.reader.speechRate}),signal:controller.signal});
      }finally{clearTimeout(timeout);}
      if(!response.ok)throw new Error(`tts-${response.status}`);
      const blob=await response.blob(),url=URL.createObjectURL(blob);
      if(!state.speaking||runId!==state.speechRun){URL.revokeObjectURL(url);return;}
      await new Promise((resolve,reject)=>{
        const audio=new Audio(url);state.audio=audio;
        audio.onended=()=>{URL.revokeObjectURL(url);if(state.audio===audio)state.audio=null;resolve();};
        audio.onerror=()=>{URL.revokeObjectURL(url);if(state.audio===audio)state.audio=null;reject(new Error("tts-playback"));};
        audio.play().catch(reject);
      });
    }

    async function speakWithCloud(text,runId){
      if(!SITE.agent.ttsEndpoint)throw new Error("tts-unavailable");
      const chunks=splitSpeechText(text);
      for(const chunk of chunks){
        if(!state.speaking||runId!==state.speechRun)return;
        await playCloudChunk(chunk,runId);
      }
      if(state.speaking&&runId===state.speechRun)stopSpeaking();
    }

    async function toggleSpeak(){
      if(state.speaking){stopSpeaking();return;}
      const text=qs("#readerContent")?.innerText?.trim();if(!text)return;
      state.speaking=true;const runId=++state.speechRun;qs("#readerSpeak span").textContent=tr("stop");
      const provider=state.reader.speechProvider;
      try{
        if(provider==="cloud")await speakWithCloud(text,runId);
        else if(provider==="device")await speakWithDevice(text,runId);
        else {
          const deviceVoice=chooseDeviceVoice();
          if((state.lang!=="fa"||deviceVoice)&&"speechSynthesis" in window)await speakWithDevice(text,runId);else await speakWithCloud(text,runId);
        }
      }catch(err){
        console.warn(err);stopSpeaking();
        toast(String(err.message).includes("voice")?tr("voiceUnavailable"):String(err.message).includes("tts")?tr("ttsUnavailable"):tr("error"));
      }
    }

    async function shareArticle(){
      if(!state.currentArticle)return;
      const canonicalUrl = articleCanonicalUrl(state.currentArticle);
      const data={title:getLocalized(state.currentArticle.title),text:getLocalized(state.currentArticle.excerpt),url:canonicalUrl};
      try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(canonicalUrl);toast(tr("shareUnavailable"));}}catch(err){if(err.name!=="AbortError")toast(tr("error"));}
    }

    function toast(message){const el=document.createElement("div");el.className="toast";el.textContent=message;qs("#toastStack").append(el);setTimeout(()=>el.remove(),3100);}

    function globalSearch(query){
      const q=query.trim().toLocaleLowerCase(locale());
      const list=!q?articles().slice(0,5):articles().filter(a=>[getLocalized(a.title),getLocalized(a.excerpt)].join(" ").toLocaleLowerCase(locale()).includes(q)).slice(0,8);
      qs("#globalSearchResults").innerHTML=list.map(a=>`<a href="#article/${encodeURIComponent(a.id)}" style="display:block;padding:.75rem;border:1px solid var(--line);border-radius:14px;text-decoration:none"><strong>${escapeHTML(getLocalized(a.title))}</strong><small class="muted" style="display:block">${escapeHTML(categoryLabel(a.category))}</small></a>`).join("")||`<p class="muted">${escapeHTML(tr("noResults"))}</p>`;
    }

    function initParticles(){
      const canvas=qs("#particleField"),ctx=canvas?.getContext("2d");if(!ctx)return;
      const lowPower=document.documentElement.classList.contains("low-power");
      let particles=[],comets=[],raf=0,w=0,h=0,dpr=1,last=0,lastFrame=0,pointer={x:-9999,y:-9999,active:false};
      const palette=[255,194,326,160];
      const spawnComet=()=>{comets.push({x:-80,y:Math.random()*h*.65,vx:2.2+Math.random()*1.8,vy:.25+Math.random()*.55,life:1,hue:palette[Math.floor(Math.random()*palette.length)]});if(comets.length>3)comets.shift()};
      const resize=()=>{dpr=Math.min(devicePixelRatio||1,lowPower?1.05:1.65);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);const count=lowPower?Math.min(42,Math.max(22,Math.round(w*h/32000))):Math.min(105,Math.max(34,Math.round(w*h/17000)));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,z:.25+Math.random()*.9,r:.45+Math.random()*1.65,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.13,a:.12+Math.random()*.5,hue:palette[Math.floor(Math.random()*palette.length)],tw:Math.random()*Math.PI*2}))};
      const draw=(now=0)=>{if(lowPower&&now-lastFrame<33){raf=requestAnimationFrame(draw);return}lastFrame=now;ctx.clearRect(0,0,w,h);if(state.motion==="reduced"||document.hidden){raf=requestAnimationFrame(draw);return}const dt=Math.min(2,(now-last)/16.67||1);last=now;if(Math.random()<.0018)spawnComet();
        for(let i=0;i<particles.length;i++){const p=particles[i],dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(pointer.active&&dist<170&&dist>1){const force=(1-dist/170)*.012;p.vx+=dx/dist*force;p.vy+=dy/dist*force}p.vx*=.995;p.vy*=.995;p.x+=p.vx*p.z*dt;p.y+=p.vy*p.z*dt;p.tw+=.018*p.z*dt;if(p.x<-15)p.x=w+15;if(p.x>w+15)p.x=-15;if(p.y<-15)p.y=h+15;if(p.y>h+15)p.y=-15;
          for(let j=i+1;j<particles.length;j++){const q=particles[j],ddx=p.x-q.x,ddy=p.y-q.y,d=Math.hypot(ddx,ddy);if(d<88){ctx.beginPath();ctx.strokeStyle=`rgba(120,140,255,${(1-d/88)*.055*Math.min(p.z,q.z)})`;ctx.lineWidth=.6;ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}
          const alpha=p.a*(.66+.34*Math.sin(p.tw));ctx.beginPath();ctx.fillStyle=`hsla(${p.hue},96%,72%,${alpha})`;ctx.shadowBlur=10*p.z;ctx.shadowColor=`hsla(${p.hue},96%,68%,.32)`;ctx.arc(p.x,p.y,p.r*p.z,0,Math.PI*2);ctx.fill()}
        for(const c of comets){c.x+=c.vx*dt;c.y+=c.vy*dt;c.life-=.004*dt;const grad=ctx.createLinearGradient(c.x-90,c.y-20,c.x,c.y);grad.addColorStop(0,"transparent");grad.addColorStop(1,`hsla(${c.hue},95%,72%,${Math.max(0,c.life)})`);ctx.strokeStyle=grad;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(c.x-95,c.y-25);ctx.lineTo(c.x,c.y);ctx.stroke();ctx.fillStyle=`hsla(${c.hue},98%,82%,${Math.max(0,c.life)})`;ctx.beginPath();ctx.arc(c.x,c.y,2.2,0,Math.PI*2);ctx.fill()}comets=comets.filter(c=>c.life>0&&c.x<w+120);ctx.shadowBlur=0;raf=requestAnimationFrame(draw)};
      addEventListener("resize",resize,{passive:true});addEventListener("pointermove",e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true},{passive:true});addEventListener("pointerleave",()=>{pointer.active=false},{passive:true});resize();cancelAnimationFrame(raf);draw();
    }

    function initHeroGalaxy(){
      const canvas=qs("#heroGalaxy"),stage=qs("#galaxyStage"),ctx=canvas?.getContext("2d");if(!canvas||!stage||!ctx)return;
      const lowPower=document.documentElement.classList.contains("low-power");
      let w=0,h=0,dpr=1,raf=0,time=0,lastFrame=0,tiltX=-.18,tiltY=.15,targetX=tiltX,targetY=tiltY,boost=1;
      const stars=Array.from({length:lowPower?68:150},()=>({x:(Math.random()-.5)*700,y:(Math.random()-.5)*520,z:(Math.random()-.5)*620,a:.15+Math.random()*.72,r:.4+Math.random()*1.4,h:[194,255,326][Math.floor(Math.random()*3)]}));
      const planets=[
        {r:74,s:.62,size:5,c:"#9b7bff",tilt:.18,phase:.2},{r:118,s:-.38,size:8,c:"#22c5ff",tilt:-.42,phase:2.1},{r:166,s:.24,size:11,c:"#ff4fa3",tilt:.58,phase:4.1},{r:214,s:-.15,size:6,c:"#4ce2b4",tilt:-.25,phase:1.4}
      ];
      const resize=()=>{const r=stage.getBoundingClientRect();w=Math.max(320,r.width);h=Math.max(320,r.height);dpr=Math.min(devicePixelRatio||1,lowPower?1.1:1.7);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0)};
      const rotate=(x,y,z)=>{let cy=Math.cos(tiltY),sy=Math.sin(tiltY),cx=Math.cos(tiltX),sx=Math.sin(tiltX);let x1=x*cy-z*sy,z1=x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;return[x1,y1,z2]};
      const project=(x,y,z)=>{const [rx,ry,rz]=rotate(x,y,z),f=520/(520+rz);return{x:w/2+rx*f,y:h/2+ry*f,z:rz,scale:f}};
      const drawOrbit=(radius,planetTilt)=>{ctx.save();ctx.beginPath();for(let i=0;i<=96;i++){const a=i/96*Math.PI*2,x=Math.cos(a)*radius,y=Math.sin(a)*radius*Math.sin(planetTilt),z=Math.sin(a)*radius*Math.cos(planetTilt);const p=project(x,y,z);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}ctx.strokeStyle="rgba(151,160,255,.16)";ctx.lineWidth=1;ctx.setLineDash([3,6]);ctx.stroke();ctx.restore()};
      const frame=(now=0)=>{if(lowPower&&now-lastFrame<33){raf=requestAnimationFrame(frame);return}lastFrame=now;ctx.clearRect(0,0,w,h);if(state.motion==="reduced"||document.hidden){raf=requestAnimationFrame(frame);return}tiltX+=(targetX-tiltX)*.045;tiltY+=(targetY-tiltY)*.045;time+=.008*boost;boost+=(1-boost)*.025;
        const sortedStars=stars.map(st=>({...st,p:project(st.x,st.y,st.z)})).sort((a,b)=>a.p.z-b.p.z);for(const st of sortedStars){const p=st.p;if(p.x<-20||p.x>w+20||p.y<-20||p.y>h+20)continue;ctx.beginPath();ctx.fillStyle=`hsla(${st.h},95%,72%,${st.a*Math.max(.3,p.scale)})`;ctx.shadowBlur=8;ctx.shadowColor=`hsla(${st.h},95%,70%,.35)`;ctx.arc(p.x,p.y,st.r*p.scale,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;
        planets.forEach(o=>drawOrbit(o.r,o.tilt));
        const bodies=planets.map(o=>{const a=time*o.s+o.phase,x=Math.cos(a)*o.r,y=Math.sin(a)*o.r*Math.sin(o.tilt),z=Math.sin(a)*o.r*Math.cos(o.tilt);return{...o,p:project(x,y,z)}}).sort((a,b)=>a.p.z-b.p.z);
        for(const b of bodies){const p=b.p,g=ctx.createRadialGradient(p.x-b.size*.35,p.y-b.size*.4,1,p.x,p.y,b.size*p.scale*2.6);g.addColorStop(0,"#fff");g.addColorStop(.18,b.c);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,b.size*p.scale*2.6,0,Math.PI*2);ctx.fill();ctx.fillStyle=b.c;ctx.shadowBlur=22;ctx.shadowColor=b.c;ctx.beginPath();ctx.arc(p.x,p.y,b.size*p.scale,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
        const center=project(0,0,0),pulse=1+Math.sin(time*3)*.035,rg=ctx.createRadialGradient(center.x-18,center.y-20,4,center.x,center.y,72*pulse);rg.addColorStop(0,"rgba(255,255,255,1)");rg.addColorStop(.16,"rgba(142,229,255,.96)");rg.addColorStop(.42,"rgba(112,92,255,.88)");rg.addColorStop(.72,"rgba(255,79,163,.28)");rg.addColorStop(1,"transparent");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(center.x,center.y,76*pulse,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.86)";ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowBlur=22;ctx.shadowColor="#22c5ff";ctx.beginPath();ctx.moveTo(center.x-44,center.y);ctx.lineTo(center.x-24,center.y);ctx.lineTo(center.x-14,center.y-25);ctx.lineTo(center.x+2,center.y+26);ctx.lineTo(center.x+16,center.y-17);ctx.lineTo(center.x+27,center.y);ctx.lineTo(center.x+46,center.y);ctx.stroke();ctx.shadowBlur=0;raf=requestAnimationFrame(frame)};
      stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.62;targetX=-.18+((e.clientY-r.top)/r.height-.5)*.34},{passive:true});stage.addEventListener("pointerleave",()=>{targetX=-.18;targetY=.15});stage.addEventListener("pointerdown",()=>{boost=3.2});addEventListener("resize",resize,{passive:true});resize();cancelAnimationFrame(raf);frame();
    }

    function initFancySelects(){
      const closeAll=except=>qsa(".fancy-select.open").forEach(box=>{if(box!==except){box.classList.remove("open");box.querySelector(".fancy-trigger")?.setAttribute("aria-expanded","false");}});
      qsa("select").forEach(select=>{
        if(select.dataset.fancyReady)return;
        select.dataset.fancyReady="true";
        const wrapper=document.createElement("div");wrapper.className="fancy-select";
        select.parentNode.insertBefore(wrapper,select);wrapper.append(select);select.classList.add("native-select-accessible");
        const trigger=document.createElement("button");trigger.type="button";trigger.className="fancy-trigger";trigger.setAttribute("aria-haspopup","listbox");trigger.setAttribute("aria-expanded","false");
        trigger.innerHTML=`<span class="fancy-label"></span><span class="fancy-arrow">${icon("chevron")}</span>`;
        const menu=document.createElement("div");menu.className="fancy-menu";menu.setAttribute("role","listbox");wrapper.append(trigger,menu);
        const sync=()=>{
          const option=select.options[select.selectedIndex];
          trigger.querySelector(".fancy-label").textContent=option?.textContent||"—";
          trigger.disabled=select.disabled;
          qsa(".fancy-option",menu).forEach((button,index)=>{button.classList.toggle("selected",index===select.selectedIndex);button.setAttribute("aria-selected",String(index===select.selectedIndex));});
        };
        const render=()=>{
          menu.innerHTML=[...select.options].map((option,index)=>`<button class="fancy-option ${index===select.selectedIndex?"selected":""}" type="button" role="option" aria-selected="${index===select.selectedIndex}" data-option-index="${index}" ${option.disabled?"disabled":""}>${escapeHTML(option.textContent||option.value||"—")}</button>`).join("");
          sync();
        };
        trigger.addEventListener("click",event=>{event.stopPropagation();const opening=!wrapper.classList.contains("open");closeAll(wrapper);wrapper.classList.toggle("open",opening);trigger.setAttribute("aria-expanded",String(opening));if(opening)menu.querySelector(".selected")?.scrollIntoView({block:"nearest"});});
        menu.addEventListener("click",event=>{const option=event.target.closest("[data-option-index]");if(!option||option.disabled)return;select.selectedIndex=Number(option.dataset.optionIndex);select.dispatchEvent(new Event("input",{bubbles:true}));select.dispatchEvent(new Event("change",{bubbles:true}));wrapper.classList.remove("open");trigger.setAttribute("aria-expanded","false");sync();});
        select.addEventListener("change",sync);
        new MutationObserver(render).observe(select,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","selected","label"]});
        render();
      });
      if(!document.documentElement.dataset.fancyGlobalBound){
        document.documentElement.dataset.fancyGlobalBound="true";
        document.addEventListener("click",event=>{if(!event.target.closest(".fancy-select"))closeAll();});
        document.addEventListener("keydown",event=>{if(event.key==="Escape")closeAll();});
      }
    }

    function initCardSpotlights(){
      document.addEventListener("pointermove",event=>{
        const card=event.target.closest(".article-card");if(!card)return;
        const rect=card.getBoundingClientRect();
        card.style.setProperty("--card-x",`${event.clientX-rect.left}px`);
        card.style.setProperty("--card-y",`${event.clientY-rect.top}px`);
      },{passive:true});
      document.addEventListener("pointerout",event=>{const card=event.target.closest(".article-card");if(card&&!card.contains(event.relatedTarget)){card.style.removeProperty("--card-x");card.style.removeProperty("--card-y");}},{passive:true});
    }

    function bindEvents(){
      addEventListener("hashchange",route);
      addEventListener("scroll",updateReadingProgress,{passive:true});
      addEventListener("pointermove",e=>{if(state.motion==="full"){document.documentElement.style.setProperty("--pointer-x",`${e.clientX}px`);document.documentElement.style.setProperty("--pointer-y",`${e.clientY}px`);}},{passive:true});
      matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",()=>{if(state.theme==="system")applyTheme();});

      document.addEventListener("error",e=>{if(e.target?.classList?.contains("card-image"))e.target.remove();},true);

      document.addEventListener("click",e=>{
        const save=e.target.closest("[data-save-id]");if(save){e.preventDefault();e.stopPropagation();toggleSaved(save.dataset.saveId);return;}
        const cat=e.target.closest("[data-category]");if(cat){state.category=cat.dataset.category;state.page=1;renderCategoryPills();renderArticles();return;}
        const page=e.target.closest("[data-page-number]");if(page){state.page=Number(page.dataset.pageNumber);renderArticles();scrollTo({top:qs("#articlesGrid").offsetTop-120,behavior:"smooth"});return;}
        if(e.target.closest("[data-open-settings]")){closeDrawer();openDialog(qs("#settingsDialog"));return;}
        if(e.target.closest("[data-open-search]")){closeDrawer();openDialog(qs("#searchDialog"));globalSearch(qs("#globalSearch").value);setTimeout(()=>qs("#globalSearch").focus(),100);return;}
        if(e.target.closest("[data-close-dialog]")){e.target.closest("dialog").close();return;}
        if(e.target.closest("[data-open-ai]")){openAI();return;}
        if(e.target.closest("[data-close-drawer]")){closeDrawer();return;}
        const sug=e.target.closest("[data-ai-suggestion]");if(sug){openAI();qs("#aiInput").value=sug.dataset.aiSuggestion;submitAI(sug.dataset.aiSuggestion);qs("#aiInput").value="";return;}
      });

      qs("#menuOpen").addEventListener("click",openDrawer);
      qs("#quickTheme").addEventListener("click",()=>{state.theme=(state.theme==="dark"?"light":"dark");localStorage.setItem("techaneh:theme",state.theme);applyTheme();});
      qsa("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>{state.lang=btn.dataset.lang;localStorage.setItem("techaneh:lang",state.lang);applyLanguage();}));
      qsa("[data-theme-value]").forEach(btn=>btn.addEventListener("click",()=>{state.theme=btn.dataset.themeValue;localStorage.setItem("techaneh:theme",state.theme);applyTheme();}));
      qsa("[data-motion]").forEach(btn=>btn.addEventListener("click",()=>{state.motion=btn.dataset.motion;localStorage.setItem("techaneh:motion",state.motion);applyMotion();}));
      qsa("[data-image-mode]").forEach(btn=>btn.addEventListener("click",()=>{state.imageMode=btn.dataset.imageMode;localStorage.setItem("techaneh:imageMode",state.imageMode);applyImageMode();}));

      qs("#articleSearch").addEventListener("input",e=>{state.query=e.target.value;state.page=1;renderArticles();});
      qs("#savedFilter").addEventListener("click",()=>{state.savedOnly=!state.savedOnly;state.page=1;renderArticles();});
      qs("#clearFilters").addEventListener("click",()=>{state.query="";state.category="all";state.savedOnly=false;state.page=1;qs("#articleSearch").value="";renderCategoryPills();renderArticles();});
      qs("#readerSave").addEventListener("click",()=>state.currentArticle&&toggleSaved(state.currentArticle.id));
      qs("#readerShare").addEventListener("click",shareArticle);
      qs("#readerSpeak").addEventListener("click",toggleSpeak);
      qs("#readerPrint").addEventListener("click",()=>print());
      qs("#readerProgressOrb")?.addEventListener("click",()=>qs("#readerContent")?.scrollIntoView({behavior:"smooth",block:"start"}));
      qs("#fontSizeRange").addEventListener("input",e=>{state.reader.fontSize=Number(e.target.value);saveReaderSettings();applyReaderSettings();});
      qs("#widthRange").addEventListener("input",e=>{state.reader.width=Number(e.target.value);saveReaderSettings();applyReaderSettings();});
      qs("#speechProvider").addEventListener("change",e=>{state.reader.speechProvider=e.target.value;saveReaderSettings();stopSpeaking();});
      qs("#speechVoice").addEventListener("change",e=>{state.reader.speechVoice=e.target.value;saveReaderSettings();stopSpeaking();});
      qs("#speechRate").addEventListener("input",e=>{state.reader.speechRate=Number(e.target.value);saveReaderSettings();applyReaderSettings();stopSpeaking();});
      qs("#compareCategory").addEventListener("change",()=>populateProductSelects(true));
      qs("#productOne").addEventListener("change",renderComparison);qs("#productTwo").addEventListener("change",renderComparison);

      qs("#aiClose").addEventListener("click",closeAI);
      qs("#aiForm").addEventListener("submit",e=>{e.preventDefault();const input=qs("#aiInput"),msg=input.value;input.value="";input.style.height="";submitAI(msg);});
      qs("#aiInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=`${Math.min(e.target.scrollHeight,130)}px`;});
      qs("#aiInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();qs("#aiForm").requestSubmit();}});
      qs("#globalSearch").addEventListener("input",e=>globalSearch(e.target.value));
      qs("#globalSearchResults").addEventListener("click",()=>qs("#searchDialog").close());

      qsa("dialog").forEach(dialog=>dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();}));
      addEventListener("keydown",e=>{
        if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openDialog(qs("#searchDialog"));globalSearch("");setTimeout(()=>qs("#globalSearch").focus(),100);}
        if(e.key==="Escape"){closeDrawer();closeAI();closeDialogs();}
      });
    }

    function handleQueryParam(){
      const params = new URLSearchParams(location.search);
      const articleId = params.get("article");
      if(articleId){
        location.hash = `#article/${encodeURIComponent(articleId)}`;
        return;
      }
      const q = params.get("q");
      if(q){state.query=q;qs("#articleSearch").value=q;location.hash="#articles";}
    }

    function init(){
      applyTheme();applyMotion();applyLanguage();applyImageMode();bindEvents();initParticles();initHeroGalaxy();initFancySelects();initCardSpotlights();
      speechSynthesis?.addEventListener?.("voiceschanged",populateVoices);
      applyReaderSettings();populateVoices();checkAgentHealth();
      renderAIHistory();handleQueryParam();route();updateReadingProgress();
      if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
    }

    init();
  })();
