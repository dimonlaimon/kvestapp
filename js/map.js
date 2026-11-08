function initMap(route) {
  // Если карта уже была (смена маршрута) — сносим и создаём заново,
  // иначе она остаётся привязана к старому центру и размеру
  if (myMap) {
    try { myMap.destroy(); } catch (e) {}
    myMap = null;
  }

  myMap = new ymaps.Map("map", {
    center: route.center,
    zoom: route.zoom,
    controls: ["zoomControl"]
  });

  // Не даём отдалиться дальше 12 — на мелких зумах у тайлов нет данных
  // и появляются серые области
  myMap.events.add("boundschange", () => {
    if (myMap.getZoom() < 12) myMap.setZoom(12, { duration: 200 });
  });

  updateMapMarkers();

  // Пересчёт размера после того, как контейнер точно получил высоту
  setTimeout(() => { if (myMap) myMap.container.fitToViewport(); }, 300);
}

function updateMapMarkers() {
  if (!myMap || !currentUser.currentRoute) return;
  geoObjects.forEach(obj => myMap.geoObjects.remove(obj));
  geoObjects = [];

  const route = routesData.find(r => r.id === currentUser.currentRoute);
  const done = getRouteProgress(route.id);
  const active = getActivePoint();

  route.points.forEach(point => {
    let color = "#cccccc";
    let hint = "Идите по цепочке маршрута";
    if (done.includes(point.id)) {
      color = "#00cc66"; hint = "Пройдено! ✅";
    } else if (active && point.id === active.id) {
      color = "#0077ff"; hint = "Сканируйте QR на локации!";
    }
    const placemark = new ymaps.Placemark(point.coords, {
      hintContent: point.title,
      balloonContent: "<b>" + point.title + "</b><br>" + hint
    }, { preset: "islands#circleDotIcon", iconColor: color });
    geoObjects.push(placemark);
    myMap.geoObjects.add(placemark);
  });
}
