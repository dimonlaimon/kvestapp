function switchTab(tabName) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("screen-" + tabName).classList.add("active");
  document.getElementById("tab-" + tabName).classList.add("active");
  if (tabName === "map" && myMap) myMap.container.fitToViewport();
}

// ВАЖНО: скрипты подключены в <head>, поэтому вешаем события после загрузки DOM.
// Без этого getElementById вернул бы null — и приложение снова умерло бы.
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("password").addEventListener("keydown", e => {
    if (e.key === "Enter") tryLogin();
  });
  document.getElementById("reg-password2").addEventListener("keydown", e => {
    if (e.key === "Enter") tryLogin();
  });
  document.getElementById("q-input").addEventListener("keydown", e => {
    if (e.key === "Enter") checkAnswer();
  });
});
