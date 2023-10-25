let cube = document.getElementById('cube');
let isDragging = false;
let startX, startY, startRotationX, startRotationY;
let selectedColor = 'white'; // 初期色

const colorCount = {
  "red": 0,
  "green": 0,
  "blue": 0,
  "white": 0,
  "yellow": 0,
  "orange": 0
};

// 現在の回転角度を保存する変数
let rotationX = 0;
let rotationY = 0;
//マウス押下時のイベント
cube.addEventListener('mousedown', function(event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  startRotationX = rotationX;
  startRotationY = rotationY;
});
//回転の方向と距離の計算
window.addEventListener('mousemove', function(event) {
  if (isDragging) {
    let dx = event.clientX - startX;
    let dy = event.clientY - startY;
    rotationX = startRotationX - dy * 0.5;
    rotationY = startRotationY + dx * 0.5;
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }
});
//マウスアップ時のイベント
window.addEventListener('mouseup', function(event) {
  isDragging = false  ;
});
//各1/54に対して、色変更のためのクリックとキューブの回転のためのドラッグを距離で識別
document.querySelectorAll('#cube .face .square').forEach(function(squareDiv) {
    squareDiv.addEventListener('mousedown', function(event) {
        startX = event.clientX;  // mousedown時のマウスのX座標を保存
        startY = event.clientY;  // mousedown時のマウスのY座標を保存
    });
    
    squareDiv.addEventListener('mouseup', function(event) {
        const endX = event.clientX;  // mouseup時のマウスのX座標
        const endY = event.clientY;  // mouseup時のマウスのY座標
    
        // mousedown時とmouseup時の座標が同じであれば色を変更
        if (startX === endX && startY === endY) {
          //同じ色が９か所より多く使われていないかチェック
          if (!colorCount[selectedColor] || colorCount[selectedColor] < 9) {
          //色を塗り替える場合、直前の色のカウントを減らす。
          const currentColor = this.style.backgroundColor; // 現在の色
          if (colorCount[currentColor] > 0) {
            colorCount[currentColor] -= 1;
          }
          // パレット上に塗付回数を表示
          if(currentColor!=""){
          const paletteColorDiv = document.querySelector(`#palette .color[style="background-color: ${currentColor};"]`);
          const countSpan = paletteColorDiv.querySelector('.count');
          countSpan.textContent = colorCount[currentColor];
          }
          //squareの色変更
          this.style.backgroundColor = selectedColor;
          // 塗付回数を更新
          colorCount[selectedColor] = (colorCount[selectedColor] || 0) + 1;
          // パレット上に塗付回数を表示
          paletteColorDiv = document.querySelector(`#palette .color[style="background-color: ${selectedColor};"]`);
          countSpan = paletteColorDiv.querySelector('.count');
          countSpan.textContent = colorCount[selectedColor];
          }
        }
    });   
});

// パレットから色を選択
document.querySelectorAll('#palette .color').forEach(function(colorDiv) {
    colorDiv.addEventListener('click', function() {
      // すでに選択されている色の枠線を削除
      document.querySelectorAll('.selected').forEach(function(selectedDiv) {
        selectedDiv.classList.remove('selected');
      });
  
      // 新しく選択された色に枠線を追加
      this.classList.add('selected');
  
      // 選択された色を保存
      selectedColor = this.style.backgroundColor;
    });
  });