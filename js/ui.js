function $(id){
	return document.getElementById(id);
}

var chess = $("chess"),
	context = chess.getContext("2d");

var me = true;
var chessBoard = [];
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	};
};

context.strokeStyle = "#bfbfbf";

var logo = new Image();
logo.src = "image/test.jpg";
logo.onload = function (){
	// context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
	oneStop(0, 0, true);
	oneStop(1, 1, false);
}

var drawChessBoard = function (){
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
	};
	context.stroke();
}

var oneStop = function (i, j, me){
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

chess.addEventListener('click', function (event){
	event = event || window.event;
	var x = event.offsetX,
		y = event.offsetY;
	var i = Math.floor(x / 30),
		j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStop(i, j, me);
		if (me) {
			chessBoard[i][j] = 1;
		} else{
			chessBoard[i][j] = 2;
		};
		me = !me;
	};
});