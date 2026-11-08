function renderShopList() {
  // Плашка с балансом — теперь баллы видны прямо в магазине
  document.getElementById("shop-score-val").innerText = currentUser.score;

  const container = document.getElementById("shop-list");
  container.innerHTML = "";
  prizeList.forEach(prize => {
    const div = document.createElement("div");
    div.className = "list-item";

    const title = document.createElement("div");
    title.className = "list-title";
    title.innerText = prize.title;

    const desc = document.createElement("div");
    desc.className = "list-desc";
    desc.innerText = prize.desc;

    const price = document.createElement("span");
    price.className = "shop-price";
    price.innerText = "Цена: " + prize.cost + " баллов";

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.innerText = "Обменять баллы";
    btn.onclick = () => buyItem(prize);

    div.appendChild(title);
    div.appendChild(desc);
    div.appendChild(price);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function buyItem(prize) {
  if (currentUser.score < prize.cost) {
    showToast("Недостаточно баллов! Нужно ещё " + (prize.cost - currentUser.score) + ".");
    return;
  }
  currentUser.score -= prize.cost;
  saveProgress();
  document.getElementById("score-val").innerText = currentUser.score;
  document.getElementById("shop-score-val").innerText = currentUser.score;
  showToast("Обмен выполнен! Подробности купона у организаторов.", "success");
}
