let currentUser = null, currentLogin = null;
let currentPoint = null, myMap = null, geoObjects = [];

const STORE_USERS = "ecosled_accounts";
const STORE_PROGRESS = login => "ecosled_progress_" + login;

function getAllUsers() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_USERS)) || {}; } catch (e) {}
  return Object.assign({}, testUsers, saved);
}

function showToast(msg, type) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.className = type === "success" ? "show success" : "show";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = "", 3000);
}

function saveProgress() {
  if (!currentLogin) return;
  localStorage.setItem(STORE_PROGRESS(currentLogin), JSON.stringify({
    score: currentUser.score,
    completedByRoute: currentUser.completedByRoute,
    currentRoute: currentUser.currentRoute
  }));
}

function loadProgress(login) {
  try {
    const raw = localStorage.getItem(STORE_PROGRESS(login));
    if (raw) {
      const d = JSON.parse(raw);
      currentUser.score = d.score || 0;
      currentUser.completedByRoute = d.completedByRoute || {};
      currentUser.currentRoute = d.currentRoute || null;
    }
  } catch (e) { /* прогресса нет — начинаем с нуля */ }
}

function getRouteProgress(routeId) {
  return currentUser.completedByRoute[routeId] || [];
}

// Первая непройденная точка активного маршрута
function getActivePoint() {
  const route = routesData.find(r => r.id === currentUser.currentRoute);
  if (!route) return null;
  const done = getRouteProgress(route.id);
  for (const p of route.points) {
    if (!done.includes(p.id)) return p;
  }
  return null;
}
