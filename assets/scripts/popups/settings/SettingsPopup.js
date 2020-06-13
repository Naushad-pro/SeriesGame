var Popup = require('Popup');

cc.Class({
	extends: Popup,

	properties: {
		
	},

	onLoad: function () {
		Popup.prototype.onLoad.call(this);

		
	},

	onSoundPressed: function () {
		//require('AudioManager').instance.music = !require('AudioManager').instance.music;
		//require('AudioManager').instance.sound = !require('AudioManager').instance.sound;
	} 
});
