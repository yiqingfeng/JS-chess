/*
 * 关键点：
 * 赢法数组、赢法统计数组、胜负判断
 */

function $(id){
	return document.getElementById(id);
}

var chess = $("chess"),
	context = chess.getContext("2d");

var me = true,// 黑子还是白子
	over = false;// 游戏是否结束
var chessBoard = [],// 棋盘数组
	wins = [],// 赢法数组
	myWin = [],// 我方赢法统计数组
	computerWin = [];// 计算机赢法统计数组
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
		wins[i][j] = [];
	};
};

var count = 0;
// 统计所有的横线
for (i = 0; i < 15; i++) {
	for (j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
// 竖线
for (i = 0; i < 15; i++) {
	for (j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
// 斜线
for (i = 0; i < 11; i++) {
	for (j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
// 反斜线
for (i = 0; i < 11; i++) {
	for (j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

for (i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

context.strokeStyle = "#bfbfbf";

var drawChessBoard = function (){
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
	};
	context.stroke();
}

var oneStep = function (i, j, me){
	context.beginPath();
	context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15+i*30, 15+j*30, 13, 15+i*30+2, 15+j*30-2, 2);
	if (me) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636766");
	} else{
		gradient.addColorStop(0, "#d1d1d1");
		gradient.addColorStop(1, "#f9f9f9");
	};
	context.fillStyle = gradient;
	context.fill();
}

drawChessBoard();

chess.addEventListener('click', function (event){
	if (over) return;
	if (!me) return;
	event = event || window.event;
	var x = event.offsetX,
		y = event.offsetY;
	var i = Math.floor(x / 30),
		j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] == 5) {
					alert("你赢了！");
					over = true;
				}
			};
		}
		if (!over) {
			me = !me;// 将下棋的权利交给计算机
			computerAi();
		}
	};
});

var computerAi = function (){
	var myScore = [],
		computerScore = [],
		max = 0,// 保存最高分数
		u = 0, v = 0;// 保存最高分数点坐标
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (i = 0; i < 15; i++) {
		for (j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						// 拦截情况
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4){
							myScore[i][j] += 10000;
						};
						// 本身情况
						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if (computerWin[k] == 4){
							computerScore[i][j] += 20000;
						};
					};
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					};
				}
				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					};
				}
			};
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				alert("你输了！");
				over = true;
			};
		};
	}
	if (!over) {
		me = !me;
	};
}