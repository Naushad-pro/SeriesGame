var OpenAnimations;
OpenAnimations = cc.Enum({
	Drop: 0,
	Scale: 1
});

cc.Class({
	extends: cc.Component,

	properties: {
		startOpen: {
			default: false
		},
		backDropClickable: {
			default: true
		},
		backDropVisible: {
			default: true
		},
		backDrop: {
			default: null,
			type: cc.Node
		},
		mainContainer: {
			default: null,
			type: cc.Node
		},
		openAnimation: {
			default: OpenAnimations.Drop,
			type: OpenAnimations
		},
		openTime: {
			default: 0.5
		},
		closeTime: {
			default: 0.5
		}
	},

	// use this for initialization
	onLoad: function () {
		this._popupWillOpenCallback = null;
		this._popupDidOpenCallback = null;
		this._popupWillCloseCallback = null;
		this._popupDidCloseCallback = null;

		this._startScale = this.mainContainer.scaleX;
		
		if (this.backDrop) {
			this.backDrop.active = false;
			if (this.backDropClickable) {
				this.backDrop.addComponent(cc.Button);

				var clickEventHandler = new cc.Component.EventHandler();
				clickEventHandler.target = this.node;
				clickEventHandler.component = 'Popup';
				clickEventHandler.handler = '_backDropClicked';

				this.backDrop.getComponent('cc.Button').clickEvents = [];
				this.backDrop.getComponent('cc.Button').clickEvents.push(clickEventHandler);
			}
			else {
				this.backDrop.addComponent(cc.BlockInputEvents);
			}
		}

		this._open = this.startOpen;
		this.mainContainer.active = this._open;

		if (this._open) {
			this._openBackDrop();

			this._popupDidOpen();
			if (this._popupDidOpenCallback) {
				this._popupDidOpenCallback();
			}
		}

		//TODO: add popup manager that collects all popups onLoad and contains a stack of currently open popups so we know which popup is on top
			//then we can access popups from any script without needing a reference

		Object.defineProperties(this, {
			'open': {
				'get': function () {
					return this._open;
				}
			},
			'popupWillOpen': {
				'get': function () {
					return this._popupWillOpenCallback;
				},
				'set': function (func) {
					this._popupWillOpenCallback = func;
				}
			},
			'popupDidOpen': {
				'get': function () {
					return this._popupDidOpenCallback;
				},
				'set': function (func) {
					this._popupDidOpenCallback = func;
				}
			},
			'popupDidClose': {
				'get': function () {
					return this._popupDidCloseCallback;
				},
				'set': function (func) {
					this._popupDidCloseCallback = func;
				}
			},
			'popupWillClose': {
				'get': function () {
					return this._popupWillCloseCallback;
				},
				'set': function (func) {
					this._popupWillCloseCallback = func;
				}
			}
		});
	},

	//OVERRIDE THESE IF NEEDED IN ANY NEW POPUP SCRIPT
	_popupWillOpen: function () {

	},
	_popupDidOpen: function () {

	},
	_popupWillClose: function () {

	},
	_popupDidClose: function () {
		
	},
	//OVERRIDE THIS FUNCTION IF YOU NEED TO CALL A DIFFERENT FUNCTION WHEN BACKDROP IS CLICKED; OTHERWISE WHEN BACKDROP IS CLICKED POPUP WILL CLOSE
	_backDropClicked: function () {
		this.closePopup();
	},

	openPopup: function () {
		if (!this._open){
			this.mainContainer.active = true;

			this._popupWillOpen();
			if (this._popupWillOpenCallback) {
				this._popupWillOpenCallback();
			}

			var tests = this.mainContainer.getComponentsInChildren("ButtonAnimation");
			for (var i = 0; i < tests.length; i++) {
				tests[i].spawnIn(this.openTime);
			}
			this._openBackDrop();

			let actionCallback = function () {
				this._popupDidOpen();
				if (this._popupDidOpenCallback) {
					this._popupDidOpenCallback();
				}

				this._open = true;
			};

			if (this.openAnimation === OpenAnimations.Drop) {
				this.mainContainer.y = this.node.height;

				var dropIn = cc.sequence(cc.moveTo(this.openTime, 0, 0).easing(cc.easeBackOut()), cc.callFunc(actionCallback, this));
				this.mainContainer.runAction(dropIn);
			}
			else if (this.openAnimation === OpenAnimations.Scale) {
				this.mainContainer.opacity = 0;
				this.mainContainer.scale = 0;

				var fadeIn = cc.sequence(cc.fadeIn(this.openTime).easing(cc.easeSineIn()), cc.callFunc(actionCallback, this));
				this.mainContainer.runAction(fadeIn);
				this.mainContainer.runAction(cc.scaleTo(this.openTime, this._startScale).easing(cc.easeSineIn()));
			}
		}
	},

	closePopup: function () {
		if (this._open) {
			this._popupWillClose();
			if (this._popupWillCloseCallback) {
				this._popupWillCloseCallback();
			}

			this._closeBackDrop();

			let actionCallback = function () {
				this._popupDidClose();
				if (this._popupDidCloseCallback){
					this._popupDidCloseCallback();
				}
				this.mainContainer.active = false;

				this._open = false;
			};

			if (this.openAnimation === OpenAnimations.Drop) {
				var dropOut = cc.sequence(cc.moveTo(this.closeTime, 0, -this.node.height).easing(cc.easeBackIn()), cc.callFunc(actionCallback, this));
				this.mainContainer.runAction(dropOut);
			}
			else if (this.openAnimation === OpenAnimations.Scale) {
				var fadeOut = cc.sequence(cc.fadeOut(this.closeTime).easing(cc.easeSineIn()), cc.callFunc(actionCallback, this));
				this.mainContainer.runAction(fadeOut);
				this.mainContainer.runAction(cc.scaleTo(this.closeTime, 0.0).easing(cc.easeSineIn()));
			}
		}
	},

	_openBackDrop: function () {
		if (this.backDrop === null) {
			return;
		}
		this.backDrop.active = true;
		this.backDrop.opacity = 0;
		let fadeTarget = this.backDropVisible ? 200 : 0;
		this.backDrop.runAction(cc.fadeTo(this.openTime, fadeTarget).easing(cc.easeSineIn()));
	},

	_closeBackDrop: function () {
		if (this.backDrop === null) {
			return;
		}

		var fadeOut = cc.sequence(cc.fadeTo(this.closeTime, 0).easing(cc.easeSineIn()), cc.callFunc(function () {this.backDrop.active = false;}, this));
		this.backDrop.runAction(fadeOut);
	}
});
