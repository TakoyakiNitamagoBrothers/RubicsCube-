let cube = document.getElementById('cube');
let isDragging = false;
let startX, startY, startRotationX, startRotationY;

// 現在の回転角度を保存する変数
let rotationX = 0;
let rotationY = 0;

cube.addEventListener('mousedown', function(event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  startRotationX = rotationX;
  startRotationY = rotationY;
});

window.addEventListener('mousemove', function(event) {
  if (isDragging) {
    let dx = event.clientX - startX;
    let dy = event.clientY - startY;
    rotationX = startRotationX - dy * 0.5;
    rotationY = startRotationY + dx * 0.5;
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }
});

window.addEventListener('mouseup', function(event) {
  isDragging = false;
});

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
          this.style.backgroundColor = selectedColor;
        }
    });   
});

let selectedColor = 'white'; // 初期色

// パレットから色を選択
document.querySelectorAll('#palette .color').forEach(function(colorDiv) {
  colorDiv.addEventListener('click', function() {
    selectedColor = this.style.backgroundColor;
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