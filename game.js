name = window.prompt("Input name:");

var socket = io.connect('http://enchat-9leap.herokuapp.com');

socket.on("connect", function() {
  socket.emit("name", name);
  socket.emit("position", (6 * 16 - 8) + "," + (10 * 16) + "," + 0); // 初期位置
  socket.emit("message", "…"); // 初期メッセージ
});

enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 15;
    game.preload('map1.gif', 'chara0.gif');
    game.onload = function() {
        var map = new Map(16, 16);
        map.image = game.assets['map1.gif'];
        map.loadData([
            [322,322,322,322,322,322,224,225,225,225,225,225,167,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205,205],
            [322,322,322,322,322,322,322,322,322,322,322,322,224,225,225,225,225,225,167,205,205,205,205,205,205,205,205,205,205,205],
            [322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,224,225,225,225,225,225,225,225,225,225,225,225],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322,342,342,342,342,342,342,342,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322,342,342,342,341,341,341,342,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322, 24, 25, 25, 25, 26,322,322,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322, 44, 45, 45, 45, 46,322,322,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322, 64,  7,  6, 65, 66,322,322,322,322,322,322,322,322,322,342,342,342,342,342,342,342,342,342,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,342,342,342,342,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,342,342,342,342,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,342,342,342,342,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,322, 24, 26,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322],
            [322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322],
            [ 25, 25, 25, 25,  5, 46,322,322,322,322,322,322,322,322,322,322,322,322, 44, 46,322,322,322,322,322,322,322,322,322,322],
            [ 45, 45, 45, 45, 45,  4, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,  5, 49,322,322,322,322,322,322,322,322,322,322],
            [ 45, 45, 45, 45, 45, 45,  6, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 66,322,322,322,322,322,322,322,322,322,322],
            [ 45, 45, 45, 45, 45, 45, 46,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322],
            [ 45, 45, 45, 45, 45,  6, 66,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,184,185,185,186,322,322,322],
            [ 65, 65, 65, 65, 65, 66,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,184,165,205,205,164,186,322,322],
            [322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,204,205,205,205,205,164,185,185],
            [322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,180,161,161,161,207,205,205,205,205,205,205,205],
            [322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,203,322,322,322,204,205,205,205,205,205,205,205],
            [322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,322,203,322,322,322,204,205,205,205,205,205,205,205]
        ],[
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462, -1,461,462, -1,461,462,421,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,481,482, -1,481,482,421,481,482,421,481,482, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,421,421,321,341,341,341,341,341,321, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462,321,422, -1, -1,400,400,321,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,481,482,321, -1, -1, -1, -1,400,321,481,482, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1,321,521,521,521,521,521,321,421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462,321, -1, -1, -1, -1, -1,321,461,462, -1, -1, -1, -1, -1,321,341,341,341,341,341,341,341,321, -1, -1, -1, -1],
            [ -1,481,482,321, -1, -1, -1, -1,400,321,481,482, -1, -1, -1, -1, -1,321,420, -1, -1, -1, -1,400,400,321, -1,421, -1, -1],
            [ -1, -1, -1,341, -1, -1, -1, -1, -1,341,421, -1, -1, -1, -1, -1, -1,321, -1, -1, -1, -1, -1, -1,400,321,461,462, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1,421,421, -1, -1, -1, -1, -1, -1, -1,321, -1, -1,321, -1, -1, -1, -1,321,481,482, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,321,521,521,321,402, -1, -1, -1,321, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462,321, -1, -1,321,341,341,341, -1,341, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,481,482,321, -1, -1,321, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421,321, -1, -1,321, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,341, -1, -1,341, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,481,482,481,482, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421, -1, -1, -1, -1,460, -1, -1, -1, -1, -1, -1, -1,461,462, -1,421, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,480, -1, -1, -1, -1, -1, -1, -1,481,482,421, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,481,482, -1, -1, -1, -1, -1, -1, -1,421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,421,420, -1, -1, -1, -1, -1, -1, -1, -1]
        ]);
        map.collisionData = [
            [  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  1,  1,  0,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  1,  1,  1,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0],
            [  0,  1,  1,  1,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  1,  1,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  0,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1]
        ];

        var foregroundMap = new Map(16, 16);
        foregroundMap.image = game.assets['map1.gif'];
        foregroundMap.loadData([
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462, -1,461,462, -1,461,462, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1,461,462, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,402, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,461,462, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ]);

        var chara_group = new Group();
        var message_group = new Group();

        var player = new Sprite(32, 32);
        player.x = 6 * 16 - 8;
        player.y = 10 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        player.isMoving = false;
        player.direction = 0;
        player.walk = 1;

        // 名前の表示
        player.login_name = new Label( name );
        player.login_name._element.setAttribute( 'class', 'login_name' );
        player.login_name.width = 100;
        player.login_name.color = 'black';
        // player.login_name.backgroundColor = 'white';
        player.login_name.x = player.x - 35;
        player.login_name.y = player.y + 32;

        // チャット内容の表示
        player.message = new Label( "…" );
        player.message._element.setAttribute( 'class', 'message' );
        player.message.width = 100;
        player.message.color = 'black';
        player.message.backgroundColor = 'white';
        player.message.x = player.x - 30;
        player.message.y = player.y - 16;

        // キャラクタ表示レイヤーとメッセージ表示レイヤーに追加
        chara_group.addChild(player);
        chara_group.addChild(player.login_name);
        message_group.addChild(player.message);

        player.addEventListener('enterframe', function() {
            this.frame = this.direction * 3 + this.walk;
            if (this.isMoving) {
                this.moveBy(this.vx, this.vy);
                this.login_name.x = this.x - 35;
                this.login_name.y = this.y + 32;
                this.message.x = this.x - 30;
                this.message.y = this.y - 16;
                socket.emit("position", { x : this.x, y : this.y , direction: this.direction });

                if (!(game.frame % 3)) {
                    this.walk++;
                    this.walk %= 3;
                }
                if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                    this.isMoving = false;
                    this.walk = 1;
                }
            } else {
                this.vx = this.vy = 0;
                if (game.input.left) {
                    this.direction = 1;
                    this.vx = -4;
                } else if (game.input.right) {
                    this.direction = 2;
                    this.vx = 4;
                } else if (game.input.up) {
                    this.direction = 3;
                    this.vy = -4;
                } else if (game.input.down) {
                    this.direction = 0;
                    this.vy = 4;
                }
                if (this.vx || this.vy) {
                    var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                    var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                    if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
                        this.isMoving = true;
                        arguments.callee.call(this);
                    }
                }
            }
        });

        // メッセージの入力とフキダシ内容変更
        player.message.addEventListener('touchend',function(e) {
            var message = prompt( 'input message:', 'hi!' );
            if ( message != '' ) {
                player.message.text = message;
                socket.emit("message", message);
            }
        });

        // 他のユーザのログイン
        socket.on("name", function(text) {
            var login_name = text;

            var other_player = new Sprite(32, 32);
            other_player.x = 7 * 16 - 8;
            other_player.y = 11 * 16;
            var image2 = new Surface(96, 128);
            image2.draw(game.assets['chara0.gif'], 100, 0, 96, 128, 0, 0, 96, 128);
            other_player.image = image2;

            // 名前の表示
            other_player.login_name = new Label( login_name );
            other_player.login_name._element.setAttribute( 'class', 'login_name' );
            other_player.login_name.width = 100;
            other_player.login_name.color = 'blue';
            // other_player.login_name.backgroundColor = 'white';
            other_player.login_name.x = other_player.x - 35;
            other_player.login_name.y = other_player.y + 32;
    
            // チャット内容の表示
            other_player.message = new Label( "こんにちは" );
            other_player.message._element.setAttribute( 'class', 'message' );
            other_player.message.width = 100;
            other_player.message.color = 'blue';
            other_player.message.backgroundColor = 'white';
            other_player.message.x = other_player.x - 30;
            other_player.message.y = other_player.y - 16;

            // キャラクタ表示レイヤーとメッセージ表示レイヤーに追加
            chara_group.addChild(other_player);
            chara_group.addChild(other_player.login_name);
            message_group.addChild(other_player.message);

            // サーバからこのユーザの移動が来たら移動させる
            socket.on("position:" + login_name, function(pos) {
                other_player.x = pos.x;
                other_player.y = pos.y;
                other_player.direction = pos.direction;
                other_player.message.x = other_player.x - 30;
                other_player.message.y = other_player.y - 16;
                other_player.login_name.x = other_player.x - 35;
                other_player.login_name.y = other_player.y + 32;
                other_player.frame = other_player.direction * 3;
            });

            // サーバからこのユーザのメッセージが来たらフキダシに表示
            socket.on("message:" + login_name, function(text) {
                other_player.message.text = text;
            });

            // 切断が送られてきたら表示とオブジェクトの消去
            socket.on("disconnect:" + login_name, function() {
                // レイヤーから削除
                chara_group.removeChild(other_player);
                chara_group.removeChild(other_player.login_name);
                message_group.removeChild(other_player.message);
                delete other_player;
            });
        });

        var stage = new Group();
        stage.addChild(map);
        stage.addChild(chara_group);
        stage.addChild(foregroundMap);
        stage.addChild(message_group);
        game.rootScene.addChild(stage);

        var pad = new Pad();
        pad.x = 0;
        pad.y = 220;
        game.rootScene.addChild(pad);

        game.rootScene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;
        });
    };
    game.start();
};
