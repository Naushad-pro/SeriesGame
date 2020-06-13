cc.Class({
	extends: cc.Component,

	properties: {
		buttonSprite: {
			default: null,
			type: cc.Sprite
		},
		buttonLabels: {
			default: [],
			type: cc.Label
		},
		idleSpriteFrame: {
			default: null,
			type: cc.SpriteFrame
		},
		highlightedSpriteFrame: {
			default: null,
			type: cc.SpriteFrame
		},
		idleColor: {
			default: cc.Color.BLACK
		},
		highlightedColor: {
			default: cc.Color.WHITE
		}
	},

	// use this for initialization
	onLoad: function () {
		this.node.on(cc.Node.EventType.MOUSE_ENTER, this._highlight, this);
		this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._idle, this);
		this.node.on(cc.Node.EventType.MOUSE_MOVE, this._highlight, this);

		this._down = false;
	},

	_idle: function () {
		this.buttonSprite.spriteFrame = this.idleSpriteFrame;

		for (var i = 0; i < this.buttonLabels.length; i++) {
			this.buttonLabels[i].node.color = this.idleColor;
		}
	},

	_highlight: function () {
		this.buttonSprite.spriteFrame = this.highlightedSpriteFrame;

		for (var i = 0; i < this.buttonLabels.length; i++) {
			this.buttonLabels[i].node.color = this.highlightedColor;
		}
	}
});
