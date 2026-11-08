function initMap(route) {
  myMap = new ymaps.Map("map", {
    center: route.center,
    zoom: route.zoom,
    controls: ["zoomControl"]
  });
  updateMapMarkers();
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
