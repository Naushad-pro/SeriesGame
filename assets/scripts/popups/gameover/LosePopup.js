let FILL_SPEED = 200; 
var Popup = require('Popup');

cc.Class({
	extends: Popup,

	properties: {
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
		},
		retryButton: {
			default: null,
			type: cc.Button
		},
		continueButton: {
			default: null,
			type: cc.Button
		},
	},

	onLoad: function () {
		Popup.prototype.onLoad.call(this);

		this._messageString = this.messageLabel.string;

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

	init: function (score, passGoal, perfectGoal) {
		this._fillPcent = score / perfectGoal;
		this._passPcent = passGoal / perfectGoal;

		this.scoreLabel.string = score.toString() + '/' + perfectGoal.toString();
		this.messageLabel.string = this._messageString.replace('%n%', (passGoal-score).toString());

		this.passSprite.node.x = -(this.passSprite.node.parent.width/2) + (this.passSprite.node.parent.width * this._passPcent);

		this.fillSprite.node.width = 0;
		this._synced = false;
	}
});
