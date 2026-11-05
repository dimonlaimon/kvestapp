function renderRouteList() {
  const container = document.getElementById('route-list');
  container.innerHTML = '';
  const currentActiveId = getNextActiveQuestId();

  questPoints.forEach(point => {
    const div = document.createElement('div');
    div.className = 'list-item';
    let statusText = "🔒 Заблокировано", badgeBg = "#9e9e9e";
    if (currentUser.completed.includes(point.id)) {
      statusText = "✅ Пройдено"; badgeBg = "#4caf50";
    } else if (point.id === currentActiveId) {
      statusText = "Активно"; badgeBg = "#2196f3";
    } else {
      div.classList.add('step-locked');
    }

    const badge = document.createElement('span');
    badge.className = 'step-badge';
    badge.style.background = badgeBg;
    badge.innerText = statusText;
    div.appendChild(badge);

    const title = document.createElement('div');
    title.className = 'list-title';
    title.innerText = point.title;
    div.appendChild(title);

    const desc = document.createElement('div');
    desc.className = 'list-desc';
    desc.innerHTML = 'Сканируйте метку: <code>' + point.qrCode + '</code>';
    div.appendChild(desc);

    if (point.id === currentActiveId) {
      const scanBtn = document.createElement('button');
      scanBtn.className = 'btn';
      scanBtn.innerText = '📷 Симулировать сканирование';
      scanBtn.onclick = () => handleQRScanned(point.qrCode);
      div.appendChild(scanBtn);
    }
    container.appendChild(div);
  });
}

function handleQRScanned(code) {
  const currentActiveId = getNextActiveQuestId();
  const point = questPoints.find(p => p.qrCode === code);
  if (!point || point.id !== currentActiveId) {
    showToast("Этот QR-код заблокирован линейным маршрутом или неверен!");
    return;
  }
  switchTab('map');
  currentPoint = point;
  document.getElementById('q-title').innerText = point.title;
  document.getElementById('q-fact').innerText = point.fact;
  document.getElementById('q-task').innerText = point.task;
  document.getElementById('q-input').value = '';
  document.getElementById('q-submit-btn').disabled = false;
  document.getElementById('quest-card').style.display = 'block';
  if (myMap) myMap.setCenter(point.coords, 17, { transitionDuration: 500 });
}

function normalizeAnswer(s) {
  return s.trim().toLowerCase().replace(/ё/g, 'е');
}

function checkAnswer() {
  const userAns = normalizeAnswer(document.getElementById('q-input').value);
  if (!currentPoint) return;
  if (userAns === normalizeAnswer(correctAnswers[currentPoint.id])) {
    currentUser.completed.push(currentPoint.id);
    currentUser.score += 100;
    saveProgress();
    document.getElementById('score-val').innerText = currentUser.score;
    document.getElementById('quest-card').style.display = 'none';
    showToast("🎉 Правильно! +100 баллов. Локация зафиксирована.", 'success');
    updateMapMarkers();
    renderRouteList();
  } else {
    showToast("Неверно! Попробуйте ещё раз.");
  }
}
