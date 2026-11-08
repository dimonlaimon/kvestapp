/* Замок на весь сайт. В репозитории — только SHA-256 хэш, сам пароль сюда не пишем. */
(function () {
  const SITE_PASSWORD_HASH = "f8feac9516a732b828c448b22b70702c3fc2c3261b2989997e80035bf51b393d";
  const UNLOCK_KEY = "site_unlocked";

  function sha256(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
      .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join(""));
  }

  // Уже разблокировано на этом устройстве — больше не спрашиваем
  if (localStorage.getItem(UNLOCK_KEY) === "1") return;

  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.id = "lock-screen";
    overlay.innerHTML =
      '<div class="lock-box">' +
        '<div class="lock-icon">🔒</div>' +
        '<div class="lock-title">Закрытая зона</div>' +
        '<div class="lock-sub">Введите пароль доступа</div>' +
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
          localStorage.setItem(UNLOCK_KEY, "1");
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
