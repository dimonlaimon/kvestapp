let currentUser = null, currentLogin = null;
let currentPoint = null, myMap = null, geoObjects = [];

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.className = type === 'success' ? 'show success' : 'show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', 3000);
}

function saveProgress() {
  if (currentLogin) {
    localStorage.setItem('ecosled_' + currentLogin,
      JSON.stringify({ score: currentUser.score, completed: currentUser.completed }));
  }
}

function loadProgress(login) {
  try {
    const raw = localStorage.getItem('ecosled_' + login);
    if (raw) {
      const data = JSON.parse(raw);
      currentUser.score = data.score;
      currentUser.completed = data.completed || [];
    }
  } catch (e) { /* прогресс не найден — играем с нуля */ }
}
