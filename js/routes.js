function showRouteSelect() {
  renderRouteCards();
  document.getElementById("route-select").classList.remove("hidden");
}

function renderRouteCards() {
  const c = document.getElementById("route-cards");
  c.innerHTML = "";
  routesData.forEach(r => {
    const done = getRouteProgress(r.id).length;
    const total = r.points.length;

    const card = document.createElement("div");
    card.className = "route-card";
    card.style.background = r.gradient;
    card.innerHTML =
      '<div class="route-progress">' + done + " / " + total + "</div>" +
      '<div class="route-icon">' + r.icon + "</div>" +
      '<div class="route-name">' + r.title + "</div>" +
      '<div class="route-area">' + r.desc + "</div>" +
      '<div class="route-chips">' +
        '<span class="chip">📍 ' + r.area + "</span>" +
        '<span class="chip">🚶 ' + r.distance + "</span>" +
        '<span class="chip">⭐ до ' + total * 100 + " баллов</span>" +
      "</div>";
    card.onclick = () => chooseRoute(r.id);
    c.appendChild(card);
  });
}

function chooseRoute(id) {
  currentUser.currentRoute = id;
  if (!currentUser.completedByRoute[id]) currentUser.completedByRoute[id] = [];
  saveProgress();
  document.getElementById("route-select").classList.add("hidden");
  startRoute(id);
}

function startRoute(id) {
  const route = routesData.find(r => r.id === id);
  document.getElementById("header-title").innerText = "🌳 ЭкоСлед · " + route.title;
  document.getElementById("main-container").style.display = "flex";
  document.getElementById("login-screen").classList.add("hidden");

  document.getElementById("score-val").innerText = currentUser.score;
  document.getElementById("rb-name").innerText = route.title;

  renderRouteList();
  renderShopList();

  if (typeof ymaps !== "undefined") {
    ymaps.ready(() => initMap(route));
  } else {
    showToast("Карты не загрузились — проверьте интернет и обновите страницу");
  }
}
