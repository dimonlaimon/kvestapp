function initMap(route) {
  // Если карта уже была (смена маршрута) — сносим и создаём заново
  if (myMap) {
    try { myMap.destroy(); } catch (e) {}
    myMap = null;
  }

  myMap = new ymaps.Map("map", {
    center: route.center,
    zoom: route.zoom,
    controls: ["zoomControl"]
  }, {
    // Запираем карту в пределах мира (широта +85…-85 — границы самой проекции).
    // Дальше этой рамки пользователь не отдалится и не уедет —
    // серые зоны "нет данных" появиться не могут в принципе,
    // а по горизонтали мир повторяется бесшовно, как в приложении Яндекс Карт.
    restrictMapArea: [[-85.05, -180], [85.05, 180]]
  });

  updateMapMarkers();

  // Даём карте установить размер и подгоняем масштаб под все точки маршрута
  setTimeout(() => {
    if (!myMap) return;
    myMap.container.fitToViewport();
    if (geoObjects.length) {
      myMap.setBounds(myMap.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 30
      });
    }
  }, 300);
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
