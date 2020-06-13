let FILL_SPEED = 200; 
var Popup = require('Popup');

cc.Class({
	extends: Popup,

	properties: {
		titleLabel: {
			default: null,
			type: cc.Label
		},
		scoreLabel: {
			default: null,
			type: cc.Label
		},
		messageLabel: {
			default: null,
			type: cc.Label
		},
		fillSprite: {
			default: null,
			type: cc.Sprite
		},
		passSprite: {
			default: null,
			type: cc.Sprite
		}
	},

	onLoad: function () {
		Popup.prototype.onLoad.call(this);

		this._synced = true;
	},

	update: function (dt) {
		if (!this._synced) {
			this.fillSprite.node.width = this.fillSprite.node.width + (FILL_SPEED * dt);
			if (this.fillSprite.node.width > this.fillSprite.node.parent.width * this._fillPcent) {
				this.fillSprite.node.width = this.fillSprite.node.parent.width * this._fillPcent;
				this._synced = true;
			}
		}
	},

	init: function (score, passGoal, perfectGoal, currentLevel) {
		this._fillPcent = score / perfectGoal;
		this._passPcent = passGoal / perfectGoal;

		this.titleLabel.string = score === perfectGoal ? 'Perfect!' : 'Well done!'
		this.messageLabel.string = 'You unlocked a new level!';	//TODO: change this based on mode player is in?
		this.messageLabel.node.active = currentLevel;

		this.scoreLabel.string = score.toString() + '/' + perfectGoal.toString();

		this.passSprite.node.x = -(this.passSprite.node.parent.width/2) + (this.passSprite.node.parent.width * this._passPcent);
		
		this.fillSprite.node.width = 0;
		this._synced = false;
	}
});
