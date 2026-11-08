let authMode = "login";

function showAuthMode(mode) {
  authMode = mode;
  document.getElementById("lt-login").classList.toggle("active", mode === "login");
  document.getElementById("lt-reg").classList.toggle("active", mode === "reg");
  document.querySelectorAll(".reg-field").forEach(el => el.classList.toggle("hidden", mode === "login"));
  document.getElementById("auth-btn").innerText = mode === "login" ? "Войти" : "Создать аккаунт";
}

function tryLogin() {
  const u = document.getElementById("username").value.trim().toLowerCase();
  const p = document.getElementById("password").value.trim();

  if (authMode === "reg") {
    registerAccount(u, p);
    return;
  }

  const users = getAllUsers();
  if (users[u] && users[u].password === p) {
    enterApp(u, users[u]);
  } else {
    showToast("Неверный логин или пароль!");
  }
}

function registerAccount(u, p) {
  const name = document.getElementById("reg-name").value.trim();
  const p2 = document.getElementById("reg-password2").value.trim();

  if (u.length < 3)  { showToast("Логин должен быть не короче 3 символов"); return; }
  if (p.length < 4)  { showToast("Пароль должен быть не короче 4 символов"); return; }
  if (p !== p2)      { showToast("Пароли не совпадают!"); return; }

  const users = getAllUsers();
  if (users[u]) { showToast("Такой логин уже занят"); return; }

  // Сохраняем только нового пользователя (встроенные тестовые не трогаем)
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_USERS)) || {}; } catch (e) {}
  saved[u] = { password: p, name: name || u, score: 0, completedByRoute: {}, currentRoute: null };
  localStorage.setItem(STORE_USERS, JSON.stringify(saved));

  enterApp(u, saved[u]);
  showToast("Аккаунт создан! Добро пожаловать 🌳", "success");
}

function enterApp(login, user) {
  currentUser = user;
  currentLogin = login;
  loadProgress(login);

  document.getElementById("user-name-val").innerText = currentUser.name;

  if (currentUser.currentRoute) {
    startRoute(currentUser.currentRoute);
  } else {
    showRouteSelect();
  }
}

function logout() {
  currentUser = null;
  currentLogin = null;
  document.getElementById("main-container").style.display = "none";
  document.getElementById("route-select").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
