/**
 * Public browser configuration. Never put API keys, tokens, or passwords here.
 */
window.TECHANEH_CONFIG = Object.freeze({
  // Production Worker custom domain. Change only if your Worker uses another URL.
  agentBaseUrl: "https://api.techaneh.ir",

  // Optional public Cloudflare Turnstile Site Key. The secret stays in the Worker.
  turnstileSiteKey: "",
});
