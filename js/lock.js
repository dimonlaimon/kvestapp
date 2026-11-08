/* Замок на весь сайт. Пароль запрашивается при каждом открытии. */
(function () {
  const SITE_PASSWORD_HASH = "ВАШ_ХЭШ_ОТ_ПАРОЛЯ_САЙТА";

  function sha256(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
      .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join(""));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.id = "lock-screen";
    overlay.innerHTML =
      '<div class="lock-box">' +
        '<div class="lock-icon">🔒</div>' +
        '<input type="password" id="lock-input" class="input-field" placeholder="Пароль">' +
        '<button class="btn" id="lock-btn">Открыть</button>' +
        '<div class="lock-error" id="lock-error"></div>' +
      '</div>';
    document.body.prepend(overlay);

    const input = document.getElementById("lock-input");
    const err = document.getElementById("lock-error");

    function tryUnlock() {
      const val = input.value;
      if (!val) return;
      sha256(val).then(h => {
        if (h === SITE_PASSWORD_HASH) {
          overlay.remove();
        } else {
          err.innerText = "Неверный пароль";
          input.value = "";
          input.focus();
        }
      });
    }

    document.getElementById("lock-btn").onclick = tryUnlock;
    input.addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });
    input.focus();
  });
})();
