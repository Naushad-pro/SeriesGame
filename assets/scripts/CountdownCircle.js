let FILL_SPEED = 33;

cc.Class({
	extends: cc.Component,

	properties: {
		countLabel: {
			default: null,
			type: cc.Label
		},
		levelLabel: {
			default: null,
			type: cc.Label
		},
		fillSprite: {
			default: null,
			type: cc.Sprite
		},
		countdownNode: {
			default: null,
			type: cc.Node
		},
		wellDoneNode: {
			default: null,
			type: cc.Node
		}
	},

	// use this for initialization
	onLoad: function () {
		this._countdownTime = 10.0;
		this._time = 0.0;

		this._countingDown = false;

		Object.defineProperties(this, {
			
		});
	},

	start: function () {
		this.node.scale = 0.3;
		this.node.on('timer_completed', ()=>{
		console.log(' Timer completd in circle');
		});
	},

	update: function (dt) {
		if (this._countingDown) {
			this._time += dt;

			if (this._time >= this._countdownTime) {
				this._time = this._countdownTime;
				this._countingDown = false;

				// this.hide();
				console.log('time completed');
				this.node.dispatchEvent( new cc.Event.EventCustom('timer_completed', true) );
			}

			this.fillSprite.fillRange = -(this._time / this._countdownTime);

			this.countLabel.string = !this._countingDown ? 'GO!' : Math.ceil(this._countdownTime - this._time);
		}
	},

	countdown: function (time, level) {
		this._countdownTime = time;
		this._time = 0.0;

		this.node.scale = 0;

		this.countdownNode.active = true;
		this.wellDoneNode.active = false;

		this.levelLabel.node.active = true;
		this.levelLabel.string = 'LEVEL\n' + level.toString();
		this.countLabel.node.active = false;
		this.fillSprite.fillRange = 0.0;

		this.node.runAction(cc.sequence(cc.scaleTo(0.33, 0.3).easing(cc.easeBackOut()), cc.delayTime(2.0), cc.callFunc(function () {
			this.levelLabel.node.runAction(cc.fadeOut(0.33).easing(cc.easeSineOut()));

			this.countLabel.node.active = true;
			this.countLabel.node.opacity = 0;
			this.countLabel.node.runAction(cc.fadeIn(0.33).easing(cc.easeSineIn()));

			this._countingDown = true;
		}, this)));

		this.countdownNode.opacity = 0;
		this.countdownNode.runAction(cc.fadeIn(0.33).easing(cc.easeSineIn()));

		return time + 2.0 + 0.33 * 2;
	},

	wellDone: function () {
		this.node.scale = 0;

		this.countdownNode.active = false;
		this.wellDoneNode.active = true;

		this.node.runAction(cc.sequence(cc.scaleTo(0.33, 1.0).easing(cc.easeBackOut()), cc.delayTime(3.0), cc.callFunc(function () {
			this.hide();
		}, this)));

		this.wellDoneNode.opacity = 0;
		this.wellDoneNode.runAction(cc.fadeIn(0.33).easing(cc.easeSineIn()));

		return 3.0 + 0.33 + 0.33;
	},

	hide: function () {
		this.node.runAction(cc.scaleTo(0.33, 0.0).easing(cc.easeBackIn()));

		if (this.countdownNode.active) {
			this.countdownNode.runAction(cc.fadeOut(0.33).easing(cc.easeSineOut()));
		}
		if (this.wellDoneNode.active) {
			this.wellDoneNode.runAction(cc.fadeOut(0.33).easing(cc.easeSineOut()));
		}
	}
});
