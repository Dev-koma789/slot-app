"use strict";
// 厳格モード：
// 変数の宣言漏れなどをエラーとして検出し、バグを防ぐ

// ===============================
// 使用する絵柄の定義
// ===============================
const symbols = ["🍎", "🍋", "🍒", "💎", "🔔", "7️⃣"];

// SPINボタン要素
const spinButton = document.getElementById("spin-button");

// メッセージ表示用要素
const message = document.getElementById("message");

// 各リール（枠）の要素を取得
const reelElements = document.querySelectorAll(".reel");

// 各リールの「中身（縦に並んだ帯）」を管理する配列
// index とリール番号が対応する
const containers = [];

/* ==================================================
   1. 初期化処理
   各リールの中に「絵柄を縦に並べた帯」を作る
   ================================================== */
reelElements.forEach((reel, i) => {
  // 絵柄を縦に並べるためのコンテナ（帯）
  const container = document.createElement("div");
  container.classList.add("reel-container");

  // 絵柄を長く並べるために、symbols を3回繰り返す
  // → 回転しても途中で切れないようにする
  const fullSymbols = [...symbols, ...symbols, ...symbols];

  fullSymbols.forEach((symbol) => {
    // 絵柄1つ分の要素を作成
    const symbolDiv = document.createElement("div");
    symbolDiv.classList.add("symbol");

    // 絵柄をテキストノードとして追加
    // innerHTML を使わないことで安全性を確保
    symbolDiv.appendChild(document.createTextNode(symbol));

    // 帯の中に追加
    container.appendChild(symbolDiv);
  });

  // リールの中に帯を入れる
  reel.appendChild(container);

  // 管理用配列に保存
  containers.push(container);
});

/* ==================================================
   2. SPINボタンが押されたときの処理
   ================================================== */
spinButton.addEventListener("click", () => {
  // 連打防止のためボタンを無効化
  spinButton.disabled = true;

  // メッセージ表示
  message.textContent = "Spinning...";
  message.style.color = "white";

  // 各リールを回転させる
  containers.forEach((container, index) => {
    // CSSアニメーションを開始
    container.classList.add("spinning");

    // 少しずつ時間をずらして停止させる
    // → 左から順番に止まる演出
    setTimeout(() => {
      stopReel(index);
    }, 1000 + index * 600);
  });
});

/* ==================================================
   3. リールを停止させる処理
   ================================================== */
function stopReel(index) {
  const container = containers[index];

  // 回転アニメーションを停止
  container.classList.remove("spinning");

  // 停止する絵柄の位置をランダムで決定
  const randomIndex = Math.floor(Math.random() * symbols.length);

  // top の位置を調整して、その絵柄が窓に来るようにする
  // 120px = 絵柄1つ分の高さ
  container.style.top = `-${randomIndex * 120}px`;

  // 最後のリールが止まったら結果判定へ
  if (index === 2) {
    // 停止アニメーションが終わるのを待つ
    setTimeout(checkResult, 600);
  }
}

/* ==================================================
   4. 当たり判定処理
   ================================================== */
function checkResult() {
  // 各リールの top の位置から、表示されている絵柄を特定
  const results = containers.map((container) => {
    // top の値（例: -240px → 240）
    const topValue = Math.abs(parseInt(container.style.top));

    // どの絵柄かをインデックスで求める
    const index = topValue / 120;

    return symbols[index];
  });

  // 3つの絵柄がすべて同じか判定
  if (results[0] === results[1] && results[1] === results[2]) {
    message.textContent = "🎊 JACKPOT! 🎊";
    message.style.color = "#fbbf24";
  } else {
    message.textContent = "Try Again";
    message.style.color = "#94a3b8";
  }

  // SPINボタンを再び有効化
  spinButton.disabled = false;
}
