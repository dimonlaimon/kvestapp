function renderShopList() {
  const container = document.getElementById('shop-list');
  container.innerHTML = '';
  prizeList.forEach(prize => {
    const div = document.createElement('div');
    div.className = 'list-item';

    const title = document.createElement('div');
    title.className = 'list-title';
    title.innerText = prize.title;
    div.appendChild(title);

    const desc = document.createElement('div');
    desc.className = 'list-desc';
    desc.innerText = prize.desc;
    div.appendChild(desc);

    const price = document.createElement('span');
    price.className = 'shop-price';
    price.innerText = 'Цена: ' + prize.cost + ' баллов';
    div.appendChild(price);

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.marginTop = '8px';
    btn.innerText = 'Обменять баллы';
    btn.onclick = () => buyItem(prize);
    div.appendChild(btn);

    container.appendChild(div);
  });
}

function buyItem(prize) {
  if (currentUser.score >= prize.cost) {
    currentUser.score -= prize.cost;
    saveProgress();
    document.getElementById('score-val').innerText = currentUser.score;
    const code = 'ECO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    showToast("Успешный обмен! Ваш промокод: " + code, 'success');
  } else {
    showToast("Недостаточно баллов! Нужно ещё " + (prize.cost - currentUser.score) + ".");
  }
}
