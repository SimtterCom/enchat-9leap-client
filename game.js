var socket = io.connect('http://enchat-9leap.herokuapp.com');
name = window.prompt("ユーザー名を入力してください");

var enchat = {};
enchat.main = {};
enchat.main.loadingImages = {};

enchat.main.loadImage = function(player, imageFile) {
	var core = enchant.Core.instance;
	var loadingImages = enchat.main.loadingImages[imageFile];
	if(!loadingImages) {
		loadingImages = [];
		enchat.main.loadingImages[imageFile] = loadingImages;
	}
	loadingImages.push(player);
	core.load(imageFile, enchat.main.setLoadedImage);
};

enchat.main.setLoadedImage = function(e) {
	var core = enchant.Core.instance;
	var bracketStart = e.target._css.indexOf( "(" );
	var brackeEend = e.target._css.indexOf( ")" );
	var imageFile = e.target._css.slice( bracketStart+1, brackeEend );
	if(core.assets[imageFile]) {
		var loadingPlayers = enchat.main.loadingImages[imageFile];
		for(var i = 0; i < loadingPlayers.length; i++) {
			loadingPlayers[i].image = core.assets[imageFile];
		}
		delete enchat.main.loadingImages[imageFile];
	}
};

enchat.main.loadingSettingPlayer = null;
enchat.main.loadingSettingFile = null;

enchat.main.loadSettingFile = function(settingPlayer, settingFile) {
	var core = enchant.Core.instance;
	if(enchat.main.loadingSettingPlayer || enchat.main.loadingSettingFile) {
		return;
	}
	enchat.main.loadingSettingPlayer = settingPlayer;
	enchat.main.loadingSettingFile = settingFile;
	core.load(settingFile, enchat.main.setLoadedSettingFile);
};

enchat.main.setLoadedSettingFile = function(e) {
	var core = enchant.Core.instance;
	if(core.assets[enchat.main.loadingSettingFile]) {
		enchat.main.loadingSettingPlayer.setSetting(core.assets[enchat.main.loadingSettingFile]);
		enchat.main.loadingSettingPlayer = null;
		enchat.main.loadingSettingFile = null;
	}
};

var player_info = {
	id : "",
	login_name : name,
	x : (6 * 16 - 8),
	y : (10 * 16),
	direction : 0,
	message : "…", // フキダシの中身
	settingFile : "chara0.json"
};

var player = null;
var other_players = {};
var chattingHistories = [];
var chattingHistoryLabels = [];
var maxChattingHistories = 5;
var chattingHistoryChangeFlag = false;

socket.on("connect", function() {
	player_info.id = socket.socket.sessionid;
	if(player) {
		player.id = player_info.id;
	}
	socket.emit("name", player_info);
});

enchant();

enchat.main.Player = enchant.Class.create(enchant.Sprite, {
	initialize: function(playerInfo) {
		enchant.Sprite.call(this, 32, 32);
		var core = enchant.Core.instance;
		this.playerInfo = playerInfo;

		this.setSettingFile(playerInfo.settingFile);

		this.x = this.playerInfo.x;
		this.y = this.playerInfo.y;
		this.isMoving = false;
		this.direction = this.playerInfo.direction;
		this.walk = 1;

		// 名前の表示
		this.login_name = new Label( this.playerInfo.login_name );
		this.login_name.textAlign = 'center';
		this.login_name.width = 100;
		this.login_name.color = 'black';
		this.login_name.x = this.x - 35;
		this.login_name.y = this.y + 32;

		// チャット内容の表示
		this.message = new Label( this.playerInfo.message );
		this.message.textAlign = 'center';
		this.message.width = 100;
		this.message.height = 16;
		this.message.color = 'black';
		this.message.backgroundColor = 'rgba(255, 255, 255, 0.75)';
		this.message.x = this.x - 30;
		this.message.y = this.y - 16;
	},
	setImage: function(imageFile) {
		this.imageFile = imageFile;
		var core = enchant.Core.instance;
		if(core.assets[this.imageFile]) {
			this.image = core.assets[this.imageFile];
		} else {
			enchat.main.loadImage(this, this.imageFile);
		}
	},
	setSettingFile: function(settingFile) {
		/*enchat.main.loadingSettingFile = */this.settingFile = settingFile;
		var core = enchant.Core.instance;
		if(core.assets[this.settingFile]) {
			this.setSetting(core.assets[this.settingFile]);
		} else {
			enchat.main.loadSettingFile(this, this.settingFile);
		}
	},
	setSetting: function(setting) {
		var info = JSON.parse(setting);
		this.width = info.width;
		this.hight = info.hight;
		this.setImage(info.image);
		this.front = info.front;
		this.left = info.left;
		this.right = info.right;
		this.back = info.back;
		this.actions = info.actions;
	}}
);

enchat.main.MainPlayer = enchant.Class.create(enchat.main.Player, {
	initialize: function(playerInfo, map) {
		enchat.main.Player.call(this, playerInfo);
		this.map = map;

		this.addEventListener('enterframe', function() {
			var core = enchant.Core.instance;
			this.frame = this.direction * 3 + this.walk;
			if (this.isMoving) {
				this.moveBy(this.vx, this.vy);
				this.login_name.x = this.x - 35;
				this.login_name.y = this.y + 32;
				this.message.x = this.x - 30;
				this.message.y = this.y - 16;
				this.playerInfo.x = this.x;
				this.playerInfo.y = this.y;
				this.playerInfo.direction = this.direction;
				socket.emit("position", { x : this.x, y : this.y , direction: this.direction });

				if (!(core.frame % 3)) {
					this.walk++;
					this.walk %= 3;
				}
				if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
					this.isMoving = false;
					this.walk = 1;
				}
			} else {
				this.vx = this.vy = 0;
				if (core.input.left) {
					this.direction = 1;
					this.vx = -4;
				} else if (core.input.right) {
					this.direction = 2;
					this.vx = 4;
				} else if (core.input.up) {
					this.direction = 3;
					this.vy = -4;
				} else if (core.input.down) {
					this.direction = 0;
					this.vy = 4;
				}
				if (this.vx || this.vy) {
					var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
					var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
					if (0 <= x && x < this.map.width && 0 <= y && y < this.map.height && !this.map.hitTest(x, y)) {
						this.isMoving = true;
						arguments.callee.call(this);
					}
				}
			}
		});
	}}
);

enchat.main.SettingDialog = enchant.Class.create(enchant.Scene, {
	initialize: function() {
		enchant.Scene.call(this)
		var parent = this;
		this.backgroundColor = 'rgb(238, 238, 238)';

		this.onaccept = function(imageUrl) {
		}
		
		this.oncancel = function() {
		}
		
		this.infoUrlLabel = new Label('キャラ情報(json)URL:');
		this.infoUrlLabel.x = 0;
		this.infoUrlLabel.y = 8;
		this.addChild(this.infoUrlLabel);

		this.infoUrlInputTextBox = new InputTextBox();
		this.infoUrlInputTextBox.x = 64;
		this.infoUrlInputTextBox.y = 8;

		this.settingDialogOkButton = new Button('OK');
		this.settingDialogOkButton.x = 8;
		this.settingDialogOkButton.y = this.height - this.settingDialogOkButton.height - 8;
		this.settingDialogOkButton.ontouchend = function() {
			parent.onaccept.call(this, parent.infoUrlInputTextBox.value);
			enchant.Core.instance.popScene();
		};
		this.addChild(this.settingDialogOkButton);

		this.settingDialogCancelButton = new Button('キャンセル');
		this.settingDialogCancelButton.x = this.width - this.settingDialogCancelButton.width - 8;
		this.settingDialogCancelButton.y = this.height - this.settingDialogCancelButton.height - 8;
		this.settingDialogCancelButton.ontouchend = function() {
			parent.oncancel.call(this);
			enchant.Core.instance.popScene();
		};
		this.addChild(this.settingDialogCancelButton);
	},
	open: function() {
		enchant.Core.instance.pushScene(this);
		this.addChild(this.infoUrlInputTextBox);
	}}
);

window.onload = function() {
	var game = new Game(320, 320);
	game.fps = 15;
	game.preload('map1.gif');
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

		player = new enchat.main.MainPlayer(player_info, map);

		// キャラクタ表示レイヤーとメッセージ表示レイヤーに追加
		chara_group.addChild(player);
		chara_group.addChild(player.login_name);
		message_group.addChild(player.message);

		// 他のユーザのログイン
		socket.on("name", function(other_player_info) {
			var id = other_player_info.id;

			var other_player = other_players[id] = new Sprite(32, 32);
			other_player.id = id;
			other_player.x = 7 * 16 - 8;
			other_player.y = 11 * 16;
			other_player_info.imageUrl = other_player.loadingImageUrl = other_player_info.imageUrl;
			other_player.setImage = function() {
				if(game.assets[other_player.loadingImageUrl]) {
					other_player.image = game.assets[other_player.loadingImageUrl];
					if(other_player_info.imageUrl!=other_player.loadingImageUrl) {
						other_player_info.imageUrl = other_player.loadingImageUrl;
						socket.emit("setImage", other_player_info.imageUrl);
					}
				}
			};
			if(game.assets[other_player.loadingImageUrl]) {
				other_player.setImage();
			} else {
				game.load(other_player.loadingImageUrl, other_player.setImage);
			}

			// 名前の表示
			other_player.login_name = new Label( other_player_info.login_name );
			other_player.login_name.textAlign = 'center';
			other_player.login_name.width = 100;
			other_player.login_name.color = 'blue';
			other_player.login_name.x = other_player.x - 35;
			other_player.login_name.y = other_player.y + 32;
	
			// チャット内容の表示
			other_player.message = new Label( other_player_info.message );
			other_player.message.textAlign = 'center';
			other_player.message.width = 100;
			other_player.message.height = 16;
			other_player.message.color = 'blue';
			other_player.message.backgroundColor = 'rgba(255, 255, 255, 0.75)';
			other_player.message.x = other_player.x - 30;
			other_player.message.y = other_player.y - 16;

			// 位置の設定
			other_player.setPosition = function(pos) {
				this.x = pos.x;
				this.y = pos.y;
				this.direction = pos.direction;
				this.message.x = this.x - 30;
				this.message.y = this.y - 16;
				this.login_name.x = this.x - 35;
				this.login_name.y = this.y + 32;
				this.frame = this.direction * 3;
			}
			other_player.setPosition(other_player_info);
			
			// キャラクタ表示レイヤーとメッセージ表示レイヤーに追加
			chara_group.addChild(other_player);
			chara_group.addChild(other_player.login_name);
			message_group.addChild(other_player.message);

			// サーバからこのユーザの移動が来たら移動させる
			socket.on("position:" + id, function(pos) {
				other_player.setPosition(pos);
			});

			// サーバからこのユーザのメッセージが来たらフキダシに表示
			socket.on("message:" + id, function(text) {
				other_player.message.text = text;
				chattingHistories.unshift({name:other_player.login_name.text, message:other_player.message.text});
				if(chattingHistories.length > maxChattingHistories) {
					chattingHistories.pop();
				}
				chattingHistoryChangeFlag = true;
			});

			// 切断が送られてきたら表示とオブジェクトの消去
			socket.on("disconnect:" + id, function() {
				// レイヤーから削除
				chara_group.removeChild(other_player);
				chara_group.removeChild(other_player.login_name);
				message_group.removeChild(other_player.message);
				delete other_players[other_player.id];
				delete other_player;
			});

			// サーバからこのユーザのメッセージが来たらフキダシに表示
			socket.on("setImage:" + id, function(imageUrl) {
				other_player_info.imageUrl = other_player.loadingImageUrl = imageUrl;
				game.load(other_player.loadingImageUrl, other_player.setImage);
			});
		});

		var stage = new Group();
		stage.addChild(map);
		stage.addChild(chara_group);
		stage.addChild(foregroundMap);
		stage.addChild(message_group);
		game.rootScene.addChild(stage);

		var settingButton = new Button('設定');
		settingButton.x = 100;
		settingButton.y = 280;
		settingButton.ontouchend = function() {
			var settingDialog = new enchat.main.SettingDialog();
			settingDialog.onaccept = function(settingFile) {
				player.setSettingFile(settingFile);
			};
			settingDialog.open();
		};
		game.rootScene.addChild(settingButton);

		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);

		// メッセージの入力とフキダシ内容変更
		var inputTextBox = new InputTextBox(); // テキストボックスを作成
		inputTextBox.x = 175;
		inputTextBox.y = 280;
		inputTextBox.addEventListener(enchant.Event.CHANGE, function(e) {
			var message = this.value;
			if ( message != '' ) {
				player.message.text = player_info.message = message;
				chattingHistories.unshift({name:player.login_name.text, message:player.message.text});
				if(chattingHistories.length > maxChattingHistories) {
					chattingHistories.pop();
				}
				chattingHistoryChangeFlag = true;
				socket.emit("message", message);
				this.value = '';
			}
		});
		game.rootScene.addChild(inputTextBox);

		var chattingHistoriesDisplay = new Group();
		chattingHistoriesDisplay.x = 175;
		chattingHistoriesDisplay.y = 280 - (16*maxChattingHistories);
		game.rootScene.addChild(chattingHistoriesDisplay);
		var chattingHistoryDisplayY = 16*(maxChattingHistories-1);
		for(var i = 0; i < maxChattingHistories; i++) {
			var chattingHistoryDisplay = new Group();
			chattingHistoryDisplay.x = 0;
			chattingHistoryDisplay.y = chattingHistoryDisplayY;
			chattingHistoriesDisplay.addChild(chattingHistoryDisplay);
			var nameLabel = new Label( '' );
			nameLabel.width = 50;
			nameLabel.height = 16;
			nameLabel.color = 'black';
			nameLabel.backgroundColor = 'rgba(255, 255, 255, 0.75)';
			nameLabel.x = 0;
			nameLabel.y = 0;
			chattingHistoryDisplay.addChild(nameLabel);

			var messageLabel = new Label( '' );
			messageLabel.width = 100;
			messageLabel.height = 16;
			messageLabel.color = 'black';
			messageLabel.backgroundColor = 'rgba(255, 255, 255, 0.75)';
			messageLabel.x = 50;
			messageLabel.y = 0;
			chattingHistoryDisplay.addChild(messageLabel);

			chattingHistoryLabels.push({name:nameLabel, message:messageLabel});

			chattingHistoryDisplayY -= 16;
		}

		game.rootScene.addEventListener('enterframe', function(e) {
			var x = Math.min((game.width  - 16) / 2 - player.x, 0);
			var y = Math.min((game.height - 16) / 2 - player.y, 0);
			x = Math.max(game.width,  x + map.width)  - map.width;
			y = Math.max(game.height, y + map.height) - map.height;
			stage.x = x;
			stage.y = y;
			if(chattingHistoryChangeFlag) {
				for(var i = 0; i < chattingHistories.length; i++) {
					chattingHistoryLabels[i].name.text = chattingHistories[i].name;
					chattingHistoryLabels[i].message.text = chattingHistories[i].message;
				}
				chattingHistoryChangeFlag = false;
			}
		});
	};
	game.start();
};
