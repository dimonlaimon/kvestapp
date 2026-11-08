function calcMinZoom() {
  const el = document.getElementById("map");
  const h = el && el.clientHeight ? el.clientHeight : 800;
  // Высота мира в проекции Меркатора: 256 * 2^zoom пикселей.
  // Берём минимальный зум, при котором мир всегда закрывает экран по высоте.
  // По ширине мир зацикливается бесшовно, поэтому важна только высота.
  return Math.max(2, Math.ceil(Math.log2(h / 256)));
}

function initMap(route) {
  // Если карта уже была (смена маршрута) — сносим и создаём заново
  if (myMap) {
    try { myMap.destroy(); } catch (e) {}
    myMap = null;
  }

  const minZ = calcMinZoom();

  myMap = new ymaps.Map("map", {
    center: route.center,
    zoom: Math.max(route.zoom, minZ),
    controls: ["zoomControl"]
  }, {
    minZoom: minZ,
    maxZoom: 19
  });

  // При повороте телефона или изменении окна пересчитываем ограничение
  window.onresize = () => {
    if (!myMap) return;
    myMap.options.set("minZoom", calcMinZoom());
    myMap.container.fitToViewport();
  };

  updateMapMarkers();

  // Даём карте установить размер и подгоняем масштаб под все точки маршрута
  setTimeout(() => {
    if (!myMap) return;
    myMap.container.fitToViewport();
    myMap.options.set("minZoom", calcMinZoom());
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
