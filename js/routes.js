function showRouteSelect() {
  renderRouteCards();
  document.getElementById("route-select").classList.remove("hidden");
}

function renderRouteCards() {
  const c = document.getElementById("route-cards");
  c.innerHTML = "";
  routesData.forEach(r => {
    const card = document.createElement("div");
    card.className = "route-card";
    card.onclick = () => chooseRoute(r.id);

    const icon = document.createElement("div");
    icon.className = "route-icon";
    icon.innerText = r.icon;

    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "route-name";
    name.innerText = r.title;
    const area = document.createElement("div");
    area.className = "route-area";
    area.innerText = r.area;
    const meta = document.createElement("div");
    meta.className = "route-meta";
    meta.innerText = `${r.points.length} точек · до ${r.points.length * 100} баллов`;
    info.appendChild(name);
    info.appendChild(area);
    info.appendChild(meta);

    card.appendChild(icon);
    card.appendChild(info);
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
