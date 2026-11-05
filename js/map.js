function initMap() {
  myMap = new ymaps.Map("map", {
    center: [60.0067, 30.3740],          // [широта, долгота] — не перепутано!
    zoom: 16,
    controls: ['zoomControl']
  });
  updateMapMarkers();
}

function updateMapMarkers() {
  if (!myMap) return;
  geoObjects.forEach(obj => myMap.geoObjects.remove(obj));
  geoObjects = [];
  const currentActiveId = getNextActiveQuestId();

  questPoints.forEach(point => {
    let color = '#cccccc';
    let hint = "Идите по цепочке маршрута";
    if (currentUser.completed.includes(point.id)) {
      color = '#00cc66'; hint = "Пройдено! ✅";
    } else if (point.id === currentActiveId) {
      color = '#0077ff'; hint = "Сканируйте QR на локации!";
    }
    const placemark = new ymaps.Placemark(point.coords, {
      hintContent: point.title,
      balloonContent: '<b>' + point.title + '</b><br>' + hint
    }, { preset: 'islands#circleDotIcon', iconColor: color });
    geoObjects.push(placemark);
    myMap.geoObjects.add(placemark);
  });
}

function getNextActiveQuestId() {
  for (let i = 0; i < questPoints.length; i++) {
    if (!currentUser.completed.includes(questPoints[i].id)) return questPoints[i].id;
  }
  return null;
}
