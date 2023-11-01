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

// 回転マップの定義。各面（'U', 'F', 'R', 'B', 'L'）とその回転に影響を受ける面と色の順序をマッピングしている。
const faceMap = {
  'U': 'up',
  'D': 'down',
  'L': 'left',
  'R': 'right',
  'F': 'front',
  'B': 'back',
  'U_inv': 'up',
  'D_inv': 'down',
  'L_inv': 'left',
  'R_inv': 'right',
  'F_inv': 'front',
  'B_inv': 'back'
};

const rotationMap = {
  'U': [  // 'U'面を回転させたときに影響を受ける面とその色の順序
          //時計回り
    { face: 'U', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
    { face: 'B', order: [1, 2, 3], from: 'L', fromOrder: [1, 2, 3]},
    { face: 'R', order: [1, 2, 3], from: 'B', fromOrder: [1, 2, 3]},
    { face: 'F', order: [1, 2, 3], from: 'R', fromOrder: [1, 2, 3]},
    { face: 'L', order: [1, 2, 3], from: 'F', fromOrder: [1, 2, 3]}
  ],
  'U_inv': [ // 反時計回り
    { face: 'U', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { face: 'B', order: [1, 2, 3], from: 'R', fromOrder: [1, 2, 3]},
    { face: 'L', order: [1, 2, 3], from: 'B', fromOrder: [1, 2, 3]},
    { face: 'F', order: [1, 2, 3], from: 'L', fromOrder: [1, 2, 3]},
    { face: 'R', order: [1, 2, 3], from: 'F', fromOrder: [1, 2, 3]}
  ],
  'F': [ //時計回り
  //squaresの要素がそれぞれのインデックスに従って、order内で数字に示された位置に格納される。
  //つまりorderに記されている数字はsquares[]で何番目に格納されていた要素かということを示している。
  //そしてそれらの数字に対応する要素は、orderのインデックス順に従って適用される。
     //Lのsquaresの、７，８，９番目の要素が格納される。Uの１，２，３に適用される。
    { face: 'F', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
    { face: 'U', order: [9, 8, 7], from: 'L', fromOrder: [3, 6, 9]},
    { face: 'R', order: [7, 4, 1], from: 'U', fromOrder: [7, 8, 9]},
    { face: 'D', order: [1, 2, 3], from: 'R', fromOrder: [1, 4, 7]},
    { face: 'L', order: [3, 6, 9], from: 'D', fromOrder: [1, 2, 3]}
  ],
  'F_inv': [ //反時計回り
    { face: 'F', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { face: 'U', order: [7, 8, 9], from: 'R', fromOrder: [1, 4, 7]},
    { face: 'L', order: [9, 6, 3], from: 'U', fromOrder: [7, 8, 9]},
    { face: 'D', order: [3, 2, 1], from: 'L', fromOrder: [3, 6, 9]},
    { face: 'R', order: [1, 4, 7], from: 'D', fromOrder: [1, 2, 3]}
  ],
  'D': [  //時計回り
    { face: 'D', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
    { face: 'F', order: [7, 8, 9], from: 'L', fromOrder: [7, 8, 9]},
    { face: 'R', order: [7, 8, 9], from: 'F', fromOrder: [7, 8, 9]},
    { face: 'B', order: [7, 8, 9], from: 'R', fromOrder: [7, 8, 9]},
    { face: 'L', order: [7, 8, 9], from: 'L', fromOrder: [7, 8, 9]}
  ],
  'D_inv': [ // 反時計回り
    { face: 'D', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { face: 'F', order: [7, 8, 9], from: 'R', fromOrder: [7, 8, 9]},
    { face: 'L', order: [7, 8, 9], from: 'F', fromOrder: [7, 8, 9]},
    { face: 'B', order: [7, 8, 9], from: 'L', fromOrder: [7, 8, 9]},
    { face: 'R', order: [7, 8, 9], from: 'B', fromOrder: [7, 8, 9]}
  ],
  'R': [  //時計回り
    { face: 'R', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
    { face: 'U', order: [3, 6, 9], from: 'F', fromOrder: [3, 6, 9]},
    { face: 'B', order: [7, 4, 1], from: 'U', fromOrder: [3, 6, 9]},
    { face: 'D', order: [3, 6, 9], from: 'B', fromOrder: [1, 4, 7]},
    { face: 'F', order: [3, 6, 9], from: 'D', fromOrder: [3, 6, 9]}
  ],
  'R_inv': [ // 反時計回り
    { face: 'R', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
    { face: 'U', order: [9, 6, 3], from: 'B', fromOrder: [1, 4, 7]},
    { face: 'F', order: [9, 6, 3], from: 'U', fromOrder: [3, 6, 9]},//
    { face: 'D', order: [9, 6, 3], from: 'F', fromOrder: [3, 6, 9]},
    { face: 'B', order: [1, 4, 7], from: 'D', fromOrder: [3, 6, 9]}//

  ],'L': [  //時計回り
  { face: 'L', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
  { face: 'U', order: [7, 4, 1], from: 'B', fromOrder: [3, 6, 9]},
  { face: 'F', order: [7, 4, 1], from: 'U', fromOrder: [1, 4, 7]},
  { face: 'D', order: [7, 4, 1], from: 'F', fromOrder: [1, 4, 7]},
  { face: 'B', order: [3, 6, 9], from: 'D', fromOrder: [1, 4, 7]}
],
'L_inv': [ // 反時計回り
  { face: 'L', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
  { face: 'D', order: [7, 4, 1], from: 'B', fromOrder: [3, 6, 9]},
  { face: 'F', order: [7, 4, 1], from: 'D', fromOrder: [1, 4, 7]},//これで正しく動くのはなぜだ？
  { face: 'U', order: [7, 4, 1], from: 'F', fromOrder: [1, 4, 7]},
  { face: 'B', order: [3, 6, 9], from: 'U', fromOrder: [1, 4, 7]}
],
'B': [  //時計回り
  { face: 'B', order: [7, 4, 1, 8, 5, 2, 9, 6, 3] },
  { face: 'U', order: [1, 2, 3], from: 'R', fromOrder: [3, 6, 9]},
  { face: 'L', order: [7, 4, 1], from: 'U', fromOrder: [1, 2, 3]},
  { face: 'D', order: [9, 8, 7], from: 'L', fromOrder: [3, 6, 9]},
  { face: 'R', order: [3, 6, 9], from: 'D', fromOrder: [7, 8, 9]}
],
'B_inv': [ // 反時計回り
  { face: 'B', order: [3, 6, 9, 2, 5, 8, 1, 4, 7] },
  { face: 'U', order: [3, 2, 1], from: 'L', fromOrder: [1, 4, 7]},
  { face: 'R', order: [9, 6, 3], from: 'U', fromOrder: [1, 2, 3]},
  { face: 'D', order: [7, 8, 9], from: 'R', fromOrder: [3, 6, 9]},
  { face: 'L', order: [1, 4, 7], from: 'D', fromOrder: [7, 8, 9]}
],
};

// 回転処理の関数。引数faceは回転させる面（'U', 'F', 'R', 'B', 'L'など）。
function rotateCube(face) {
  // 影響を受ける面とその色の順序をrotationMapから取得
  const affectedFaces = rotationMap[face];
  // 初期化処理
  let tempColors=[];
  let newColors = [];
  let squares = [];

  // 各影響を受ける面に対して処理を行う
  affectedFaces.forEach(affectedFace => {
   
    // affectedFace.face（影響を受ける面）をHTMLのクラス名に変換
    const faceClass = faceMap[affectedFace.face];
 
     // 新しい色の順序を取得。fromが指定されている場合はその面から色を取得。
     if (affectedFace.from) {
      if (tempColors.length > 0) {
        // 条件1: affectedFace.fromが存在し、tempColorsが空でない場合の処理
        newColors = [...tempColors]; // tempColorsの内容をnewColorsにコピー
        } else {
          // 条件2: affectedFace.fromが存在し、tempColorsが空の場合の処理
          squares = document.querySelectorAll(`.${faceMap[affectedFace.from]} .square`);
          newColors = affectedFace.fromOrder.map(i => squares[i - 1].style.backgroundColor);
        }
      } else {
      // 条件3: affectedFace.fromが存在しない場合の処理
          // 影響を受ける各マス（square）をHTMLから取得
     squares = document.querySelectorAll(`.${faceClass} .square`);
      newColors = affectedFace.order.map(i => squares[i - 1].style.backgroundColor);
    }
// 新しい色を各マスに適用
if (affectedFace.from) {
  squares = document.querySelectorAll(`.${faceClass} .square`);
  // 一時保存用の配列を作成（色を塗り替えるマスの色）
  tempColors = affectedFace.order.map(index => squares[index - 1].style.backgroundColor);
  //色の塗り替え
  affectedFace.order.forEach((targetIndex, i) => {
  squares[targetIndex - 1].style.backgroundColor = newColors[i];
  });
} else {
  squares.forEach((square, i) => {
    square.style.backgroundColor = newColors[i];
  });
}
  });
}





