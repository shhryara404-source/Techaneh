(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);

  function buildGalaxyDepth() {
    const stage = $("#galaxyStage");
    if (!stage || stage.querySelector(".galaxy-depth")) return;
    const depth = document.createElement("div");
    depth.className = "galaxy-depth";
    depth.setAttribute("aria-hidden", "true");
    depth.innerHTML = '<span class="d1"></span><span class="d2"></span><span class="d3"></span>';
    stage.insertBefore(depth, stage.querySelector(".galaxy-hud"));

    if (document.documentElement.classList.contains("low-power")) return;
    const move = (event) => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      document.documentElement.style.setProperty("--v6-depth-x", `${x * 9}deg`);
      document.documentElement.style.setProperty("--v6-depth-y", `${y * -7}deg`);
    };
    const reset = () => {
      document.documentElement.style.setProperty("--v6-depth-x", "0deg");
      document.documentElement.style.setProperty("--v6-depth-y", "0deg");
    };
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
    stage.addEventListener("pointerup", () => {
      stage.animate([{ filter: "brightness(1.18) saturate(1.18)" }, { filter: "none" }], { duration: 520, easing: "ease-out" });
    });
  }

  function enhanceAssistant() {
    const panel = $("#aiPanel");
    const close = $("#aiClose");
    if (!panel || !close) return;
    let backdrop = $(".ai-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "ai-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      document.body.append(backdrop);
    }
    const sync = () => {
      const open = panel.classList.contains("open");
      document.body.classList.toggle("ai-open", open);
      backdrop.setAttribute("aria-hidden", String(!open));
      if (matchMedia("(max-width:720px)").matches) document.body.style.overflow = open ? "hidden" : "";
    };
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ["class"] });
    backdrop.addEventListener("click", () => close.click());
    sync();
  }

  function markVersion() {
    document.documentElement.dataset.techanehVersion = "6";
    const status = $("#productDataStatus");
    if (status && !status.dataset.v6Ready) {
      status.dataset.v6Ready = "true";
      status.title = document.documentElement.lang === "fa"
        ? "این فهرست برای پایش بازار گسترده است؛ عامل محصول مشخصات را فقط بعد از بررسی منابع نمایش می‌دهد."
        : "This is a broad monitoring catalog; the product agent displays specs only after source verification.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildGalaxyDepth();
    enhanceAssistant();
    markVersion();
  });
})();
