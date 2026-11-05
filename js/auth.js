function tryLogin() {
  const u = document.getElementById('username').value.trim().toLowerCase();
  const p = document.getElementById('password').value.trim();
  if (testUsers[u] && testUsers[u].password === p) {
    currentUser = testUsers[u];
    currentLogin = u;
    loadProgress(u);
    document.getElementById('main-container').style.display = 'block';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('user-name-val').innerText = currentUser.name;
    document.getElementById('score-val').innerText = currentUser.score;
    renderRouteList();
    renderShopList();
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(initMap);
    } else {
      showToast("Карты не загрузились — проверьте интернет и обновите страницу");
    }
  } else {
    showToast("Неверный логин или пароль!");
  }
}
