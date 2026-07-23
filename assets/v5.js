(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const lang = () => (document.documentElement.lang === "en" ? "en" : "fa");
  const localText = (fa, en) => (lang() === "fa" ? fa : en);

  function catalog() {
    try {
      return typeof productsList !== "undefined" && Array.isArray(productsList) ? productsList : [];
    } catch {
      return [];
    }
  }

  function initComparisonSearch() {
    const input = $("#compareProductSearch");
    const results = $("#compareSearchResults");
    const category = $("#compareCategory");
    const first = $("#productOne");
    const second = $("#productTwo");
    if (!input || !results || !category || !first || !second) return;

    const selectProduct = (product) => {
      category.value = product.category || "all";
      category.dispatchEvent(new Event("change", { bubbles: true }));
      requestAnimationFrame(() => {
        const options = [...first.options];
        const option = options.find((item) => item.textContent.trim() === product.name);
        if (!option) return;
        const target = !first.value ? first : second;
        target.value = option.value;
        target.dispatchEvent(new Event("change", { bubbles: true }));
        input.value = "";
        results.hidden = true;
      });
    };

    const render = () => {
      const query = input.value.trim().toLocaleLowerCase(document.documentElement.lang || "fa");
      if (!query) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      const items = catalog()
        .filter((item) => `${item.name} ${item.category}`.toLocaleLowerCase().includes(query))
        .slice(0, 12);
      results.innerHTML = items.length
        ? items
            .map(
              (item, index) =>
                `<button type="button" data-product-result="${index}"><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.category || "")}</small></button>`,
            )
            .join("")
        : `<p class="muted" style="padding:.8rem;margin:0">${localText("محصولی پیدا نشد.", "No product found.")}</p>`;
      results.hidden = false;
      $$('[data-product-result]', results).forEach((button) => {
        button.addEventListener("click", () => selectProduct(items[Number(button.dataset.productResult)]));
      });
    };

    input.addEventListener("input", render);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") results.hidden = true;
      if (event.key === "Enter") {
        event.preventDefault();
        $("[data-product-result]", results)?.click();
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".compare-discovery")) results.hidden = true;
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[char]);
  }

  function setVoiceVisual(active, text) {
    const visual = $("#voiceVisual");
    const state = $("#voiceState");
    visual?.classList.toggle("active", active);
    visual?.setAttribute("aria-hidden", String(!active));
    if (state && text) state.textContent = text;
  }

  function initVoiceAssistant() {
    const mic = $("#aiMic");
    const speak = $("#aiSpeakLast");
    const input = $("#aiInput");
    const form = $("#aiForm");
    if (!mic || !speak || !input || !form) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let listening = false;

    const stopListening = () => {
      listening = false;
      mic.classList.remove("listening");
      mic.setAttribute("aria-pressed", "false");
      setVoiceVisual(false);
    };

    if (Recognition) {
      recognition = new Recognition();
      recognition.lang = lang() === "fa" ? "fa-IR" : "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.addEventListener("start", () => {
        listening = true;
        mic.classList.add("listening");
        mic.setAttribute("aria-pressed", "true");
        setVoiceVisual(true, localText("در حال شنیدن…", "Listening…"));
      });
      recognition.addEventListener("result", (event) => {
        const transcript = [...event.results].map((result) => result[0]?.transcript || "").join(" ").trim();
        if (transcript) {
          input.value = transcript;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        const finalResult = [...event.results].some((result) => result.isFinal);
        if (finalResult && transcript) {
          setVoiceVisual(true, localText("در حال ارسال…", "Sending…"));
          setTimeout(() => form.requestSubmit(), 250);
        }
      });
      recognition.addEventListener("end", stopListening);
      recognition.addEventListener("error", (event) => {
        stopListening();
        const message = event.error === "not-allowed"
          ? localText("اجازه میکروفون در مرورگر فعال نیست.", "Microphone permission is not enabled.")
          : localText("ورودی صوتی در این مرورگر در دسترس نیست.", "Voice input is unavailable in this browser.");
        input.placeholder = message;
      });
    } else {
      mic.title = localText("ورودی صوتی در این مرورگر پشتیبانی نمی‌شود", "Voice input is not supported in this browser");
    }

    mic.addEventListener("click", () => {
      if (!recognition) {
        input.focus();
        input.placeholder = localText("مرورگر شما ورودی صوتی را پشتیبانی نمی‌کند.", "Your browser does not support voice input.");
        return;
      }
      recognition.lang = lang() === "fa" ? "fa-IR" : "en-US";
      if (listening) recognition.stop();
      else {
        try { recognition.start(); } catch { recognition.stop(); }
      }
    });

    speak.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setVoiceVisual(false);
        speak.classList.remove("listening");
        return;
      }
      const messages = $$("#aiMessages .message.bot").filter((item) => item.id !== "typingMessage");
      const text = messages.at(-1)?.textContent?.trim();
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang() === "fa" ? "fa-IR" : "en-US";
      utterance.rate = 0.96;
      utterance.onstart = () => {
        speak.classList.add("listening");
        setVoiceVisual(true, localText("در حال خواندن پاسخ…", "Reading the answer…"));
      };
      utterance.onend = utterance.onerror = () => {
        speak.classList.remove("listening");
        setVoiceVisual(false);
      };
      speechSynthesis.speak(utterance);
    });
  }

  function initGalaxyDrag() {
    const stage = $("#galaxyStage");
    const canvas = $("#heroGalaxy");
    if (!stage || !canvas) return;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dy = 0;

    const apply = () => {
      canvas.style.transform = `translate3d(${dx * 0.045}px,${dy * 0.035}px,0) rotateX(${-dy * 0.018}deg) rotateY(${dx * 0.022}deg) scale(1.018)`;
    };
    const release = () => {
      pointerId = null;
      stage.classList.remove("is-dragging");
      canvas.style.transition = "transform .75s cubic-bezier(.2,.9,.2,1)";
      canvas.style.transform = "none";
      setTimeout(() => { canvas.style.transition = ""; }, 760);
    };

    stage.addEventListener("pointerdown", (event) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dx = 0;
      dy = 0;
      stage.classList.add("is-dragging");
      stage.setPointerCapture?.(event.pointerId);
      canvas.style.transition = "none";
    });
    stage.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      dx = Math.max(-160, Math.min(160, event.clientX - startX));
      dy = Math.max(-110, Math.min(110, event.clientY - startY));
      apply();
    });
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
  }

  function initAssistantSwipeClose() {
    const panel = $("#aiPanel");
    const close = $("#aiClose");
    if (!panel || !close) return;
    let start = null;
    panel.addEventListener("touchstart", (event) => {
      if (!matchMedia("(max-width:720px)").matches || event.touches.length !== 1) return;
      start = event.touches[0].clientY;
    }, { passive: true });
    panel.addEventListener("touchend", (event) => {
      if (start === null || !event.changedTouches.length) return;
      const delta = event.changedTouches[0].clientY - start;
      start = null;
      if (delta > 100) close.click();
    }, { passive: true });
  }

  function improveCatalogMessage() {
    const note = $("#productDataStatus");
    if (!note || note.hidden) return;
    note.textContent = localText(
      "فهرست اولیه شامل محصولات منتخب بازار است. مشخصات فقط پس از بررسی دو منبع مستقل توسط عامل محصول نمایش داده می‌شود؛ بنابراین فهرست ادعای پوشش کامل همه محصولات جهان را ندارد.",
      "The initial catalog is a curated market seed. Specifications appear only after two-source agent verification, so it does not claim to cover every product worldwide.",
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    initComparisonSearch();
    initVoiceAssistant();
    initGalaxyDrag();
    initAssistantSwipeClose();
    improveCatalogMessage();
  });
})();
