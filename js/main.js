function switchTab(tabName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + tabName).classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
  if (tabName === 'map' && myMap) myMap.container.fitToViewport();
}

/* Вход и ответ срабатывают по Enter */
document.getElementById('password').addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});
document.getElementById('q-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkAnswer();
});
