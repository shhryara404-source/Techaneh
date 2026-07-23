(() => {
  "use strict";
  const memory = Number(navigator.deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  const narrow = matchMedia("(max-width:480px)").matches;
  const saveData = Boolean(navigator.connection?.saveData);
  const lowPower = saveData || (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4) || (narrow && /Android/i.test(navigator.userAgent));
  document.documentElement.classList.toggle("low-power", lowPower);
})();
