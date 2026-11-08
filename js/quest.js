function renderRouteList() {
  const container = document.getElementById("route-list");
  container.innerHTML = "";

  const route = routesData.find(r => r.id === currentUser.currentRoute);
  const done = getRouteProgress(route.id);
  const active = getActivePoint();

  route.points.forEach(point => {
    const div = document.createElement("div");
    div.className = "list-item";

    let statusText = "🔒 Заблокировано", badgeBg = "#9e9e9e";
    if (done.includes(point.id)) {
      statusText = "✅ Пройдено"; badgeBg = "#4caf50";
    } else if (active && point.id === active.id) {
      statusText = "Активно"; badgeBg = "#2196f3";
    } else {
      div.classList.add("step-locked");
    }

    const badge = document.createElement("span");
    badge.className = "step-badge";
    badge.style.background = badgeBg;
    badge.innerText = statusText;
    div.appendChild(badge);

    const title = document.createElement("div");
    title.className = "list-title";
    title.innerText = point.title;
    div.appendChild(title);

    const desc = document.createElement("div");
    desc.className = "list-desc";
    desc.innerText = done.includes(point.id) ? point.fact : "Найдите табличку и отсканируйте QR";
    div.appendChild(desc);

    if (active && point.id === active.id) {
      const scanBtn = document.createElement("button");
      scanBtn.className = "btn";
      scanBtn.innerText = "📷 Симулировать сканирование";
      scanBtn.onclick = () => handleQRScanned(point.qrCode);
      div.appendChild(scanBtn);
    }
    container.appendChild(div);
  });
}

function handleQRScanned(code) {
  const active = getActivePoint();
  if (!active || active.qrCode !== code) {
    showToast("Этот QR-код заблокирован линейным маршрутом или неверен!");
    return;
  }
  switchTab("map");
  currentPoint = active;
  document.getElementById("q-title").innerText = active.title;
  document.getElementById("q-fact").innerText = active.fact;
  document.getElementById("q-task").innerText = active.task;
  document.getElementById("q-input").value = "";
  document.getElementById("q-submit-btn").disabled = false;
  document.getElementById("quest-card").style.display = "block";
  if (myMap) myMap.setCenter(active.coords, 17, { transitionDuration: 500 });
}

function normalizeAnswer(s) {
  return s.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

function checkAnswer() {
  if (!currentPoint) return;
  const userAns = normalizeAnswer(document.getElementById("q-input").value);
  const correct = correctAnswers[currentPoint.id] || [];
  if (correct.map(normalizeAnswer).includes(userAns)) {
    const done = currentUser.completedByRoute[currentUser.currentRoute];
    if (!done.includes(currentPoint.id)) done.push(currentPoint.id);
    currentUser.score += 100;
    saveProgress();
    document.getElementById("score-val").innerText = currentUser.score;
    document.getElementById("quest-card").style.display = "none";
    showToast("🎉 Правильно! +100 баллов. Локация зафиксирована.", "success");
    updateMapMarkers();
    renderRouteList();
  } else {
    showToast("Неверно! Попробуйте ещё раз.");
  }
}
