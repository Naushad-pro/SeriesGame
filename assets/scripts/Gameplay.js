let Popup = require("Popup")
let CountdownCircle = require("CountdownCircle")
let LevelHandler = require("LevelHandler")
let SeriesType= {
	"ap" : 1,
	"gp" : 2
}

cc.Class({
	extends: cc.Component,

	properties: {
		lavelCounter: {
			default: null,
			type: cc.Label
		},
		foregroundSprite: {
			default: null,
			type: cc.Sprite
		},
		timeSprite: {
			default: null,
			type: cc.Sprite
		},
		pauseButton: {
			default: null,
			type: cc.Button
		},
		countdownCircle: {
			default: null,
			type: CountdownCircle
		},
		winPopup: {
			default: null,
			type: Popup
		},
		losePopup: {
			default: null,
			type: Popup
		},
		settingsPopup: {
			default: null,
			type: Popup
		}, 
		levelInfo:{
			default:null,
			type: LevelHandler,
			visible:false
		},
		seriesLength: {
			type: cc.Integer,
			default: 16,
			visible:false
		},
		textPrefab : {
			type:cc.Prefab,
			default:null,
		},
		textSeqNode : {
			type:cc.Node,
			default:null,
		},

		removedSeqNode : {
			type:cc.Node,
			default:null,
		},

		oddNumberIdxArr : {
			type:Array,
			default:[],
		},
		selectedText: {
			type: cc.Node,
			default: null,
			visible:false
		},
		roundCounter: {
			type: cc.Node,
			default: null,
		},
		levelCounter: {
			type: cc.Node,
			default: null,
			
		},

		message: {
			type: cc.Node,
			default: null,
		},

		removeInstruction: {
			type: cc.Label,
			default: null,
		},
	},

	onLoad() {
	    
	},

	start() {
		this.subscribeEvent();		
	},

	subscribeEvent() {
		this.node.on('timer_completed', this.onTimerCompleted).bind(this);
		this.node.on('level_loaded', this.onLevelLoaded.bind(this));	
	},
	onLevelLoaded(){
		console.log(' on level loaded');
		this.levelInfo = this.node.getComponent(LevelHandler);
		this.startGame();
	},

	onTimerCompleted(){

	},

	startGame() { 
		console.log('this.level counter', this.levelCounter.position);
		//Show Level
		// let previousPositionY = this.levelCounter.position.y;
		// this.levelCounter.active = true;
		// this.levelCounter.setPosition( this.levelCounter.position.x, previousPositionY + 200);
		// this.levelCounter.runAction((cc.moveTo(1, cc.Vec2(  this.levelCounter.position.x, previousPositionY) ).easing(cc.easeBackInOut())));
		//Show Round counter

		//Show instruction
		this.removeInstruction.node.active = true;
		this.levelStart();
		//Start Level
	},

	levelStart() {
		this.countdownCircle.countdown(this.levelInfo.levelInfo.levelSeqInfo[this.levelInfo.currentLevel].allotedTime + 2, this.levelInfo.currentLevel);
		this.lavelCounter.getComponent(cc.Label).string  =  "Level " + (this.levelInfo.currentLevel + 1);
		let previousPositionY = this.levelCounter.position.y;
		this.levelCounter.active = true;
		this.showMessage("Level " + (this.levelInfo.currentLevel + 1) + " started");
		this.levelCounter.setPosition( this.levelCounter.position.x, previousPositionY + 200);
		this.levelCounter.runAction((cc.moveTo(1, cc.Vec2(  this.levelCounter.position.x, previousPositionY) ).easing(cc.easeBackInOut())));
		this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(this.roundStart, this)));
		// this.roundStart();
	},

	roundStart(){
		this.showMessage("Round " + (this.levelInfo.currentRound + 1) + " started");
		this.initaliseSeries();

		this.roundCounter.getComponent(cc.Label).string  =  "Round " + (this.levelInfo.currentRound + 1) + " of  " +  this.levelInfo.levelInfo.levelSeqInfo[this.levelInfo.currentLevel].roundSeq.length;
		let previousPositionY = this.roundCounter.position.y;
		this.roundCounter.setPosition( this.roundCounter.position.x, previousPositionY - 200);
		this.roundCounter.runAction((cc.moveTo(1, cc.Vec2(  this.roundCounter.position.x, previousPositionY) ).easing(cc.easeBackInOut())));

	},
	initaliseSeries() {
		this.textSeqNode.removeAllChildren();
		this.removedSeqNode.removeAllChildren();
		this.oddNumberIdxArr.length = 0;
		this.selectedText = null;
		this.createSequnce();
	},

	createSequnce() {
		let numbers = this.getNumbers();
		let finalArray = this.insertOddNumber([...numbers]);
		this.instantiateTextNode([...finalArray]);
	},

	getNumbers() {
		console.log(' level ', this.levelInfo.currentLevel);
		console.log(' round ', this.levelInfo.currentRound);
		let roundInfo = this.levelInfo.levelInfo.levelSeqInfo[this.levelInfo.currentLevel].roundSeq[this.levelInfo.currentRound];
		let roundSeries = roundInfo.seriesType;
		let countOfEachType = roundInfo.numCount/roundSeries.length;
		let numArr = []
		for(let i = 0; i< roundSeries.length; ++i){
			switch(roundSeries[i]){
				case SeriesType.ap:
					numArr.push( this.getAPSeries(countOfEachType));
					break;
				case SeriesType.gp:
					numArr.push( this.getGPSeries(countOfEachType));
					break;		
			}
		}

		let finalArr = []
		//Merge Numbers to form a seq
		for(let i = 0; i < numArr[0].length; ++i){
			for(let j= 0; j < numArr.length; ++j){
				finalArr.push(numArr[j][i]);
			}
		}

		console.log('final Array', finalArr);
		return finalArr;
	},

	getAPSeries(count) {
		let intialNumber = Math.ceil(Math.random()*2 + 1);
		let difference = Math.ceil(Math.random()*2 + 1);
		let num = []
		for(let i = 1; i <= count; i++){
			num.push(intialNumber + (i - 1 ) * difference);
		}
		return num;
	},

	getGPSeries(count) {
		let intialNumber = Math.ceil(Math.random() + 1);
		let ratio = Math.ceil(Math.random() + 1);
		let num = []
		for(let i = 1; i <= count; i++){
			num.push(intialNumber * (Math.pow(ratio, i)));
		}
		return num;
	},

	insertOddNumber(numArr){
		let countOfOddNum =  this.levelInfo.levelInfo.levelSeqInfo[this.levelInfo.currentLevel].roundSeq[this.levelInfo.currentRound].oddNum;
		let idxArr = [];
		while(countOfOddNum != 0){
			let idx = Math.ceil(Math.random() * (numArr.length - 2));
			if(idxArr.indexOf(idx) == -1){
				idxArr.push(idx);
				--countOfOddNum;
			}
		}
		//Need to spend more time to choose complex num,
		//For now inserting a num between 2 hum
		console.log('idxArr', idxArr);
		this.oddNumberIdxArr = [...idxArr];
		for(let i = 0; i < idxArr.length; ++i){
			numArr.splice(idxArr[i], 0, Math.ceil( Math.random() * numArr[idxArr[i] + 1]   +  numArr[idxArr[i]]));
		}
		console.log("numArray", numArr);
		return numArr;
	},

	instantiateTextNode(numArr) {

		let width = (numArr.length * 30) + ((numArr.length - 1) * 15);
		let height = ((numArr.length/(this.node.width * 0.9)) + 1) * 30;
		let log =  (numArr.length * 30)		
		console.log(' width', width)
		if(width > this.node.width * 0.9){
			this.textSeqNode.setContentSize(this.node.width, height)
		}else{
			this.textSeqNode.setContentSize(width, height)
		}
		
		let xInitial = (-this.textSeqNode.width* 0.5) + 15;
		let yInitial = 0;

		for(let i  = 0; i < numArr.length; ++i){
			let textNode = cc.instantiate(this.textPrefab);
			textNode.rotation = Math.random() * 360;
			console.log('textNode', textNode.getContentSize(), this.node.getContentSize(), this.node.width);
			textNode.color = cc.color( Math.random() * 254 + 1, Math.random() * 254 + 1, Math.random() * 254 + 1, 255 );
			textNode.getComponent(cc.Label).string = numArr[i];
			textNode.parent = this.textSeqNode;
			textNode.index = i;
			textNode.on(cc.Node.EventType.MOUSE_DOWN, this.textClickCallback.bind(this, textNode, cc.Node.EventType.MOUSE_DOWN), this);
			textNode.on(cc.Node.EventType.MOUSE_UP, this.textClickCallback.bind(this, textNode, cc.Node.EventType.MOUSE_UP), this);
			textNode.on(cc.Node.EventType.MOUSE_LEAVE, this.textClickCallback.bind(this, textNode, cc.Node.EventType.MOUSE_UP), this);
			textNode.on(cc.Node.EventType.TOUCH_START, this.textClickCallback.bind(this, textNode, cc.Node.EventType.TOUCH_START), this);
			textNode.on(cc.Node.EventType.TOUCH_END, this.textClickCallback.bind(this, textNode, cc.Node.EventType.TOUCH_END), this);
			textNode.on(cc.Node.EventType.TOUCH_CANCEL, this.textClickCallback.bind(this, textNode, cc.Node.EventType.TOUCH_CANCEL), this);
			textNode.runAction( new cc.sequence(new cc.rotateTo(0.5,  Math.random() * 200 + 500),new cc.rotateTo(0.2, 0 )));
			textNode.setPosition(xInitial, yInitial);
			xInitial += (textNode.width + 20);
			console.log('textNode', textNode);
			if(xInitial  > ((this.textSeqNode.width * 0.49) - (textNode.width * 0.5))){
				xInitial =  (-this.textSeqNode.width* 0.49) + textNode.width*0.5;
				yInitial -= (textNode.width * 30);
			}
		}
	},
	textClickCallback(text, type) {
		console.log('type', type);
		switch(type){
			case cc.Node.EventType.MOUSE_DOWN:
				text.setScale(0.8, 0.8);		
				this.selectedText = text.index;
				break;
			case cc.Node.EventType.MOUSE_UP:
			if(this.selectedText == text.index){
				text.setScale(1.0, 1.0);	
				this.removeTextFromSequece(text);
			}
				break;
			case cc.Node.EventType.MOUSE_LEAVE:	
				text.setScale(1.0, 1.0);	
				break;	
		}
	},

	removeTextFromSequece(text) { 
		text.parent = this.removedSeqNode;
		text.setScale(0.5)
		text.color = cc.color(255, 0, 0, 255);
		if(this.oddNumberIdxArr.indexOf(text.index) == -1){
			this.levelFailed();
		}else{
			this.oddNumberIdxArr.splice(this.oddNumberIdxArr.indexOf(text.index), 1);
			if(this.oddNumberIdxArr.length == 0){
				this.roundCompleted();
			}
		}
	},

	roundCompleted(){
		this.levelInfo.currentRound = this.levelInfo.currentRound + 1;
		if(this.levelInfo.currentRound == this.levelInfo.levelInfo.levelSeqInfo[this.levelInfo.currentLevel].roundSeq.length){
			this.levelCompleted();
		}else{
			this.roundStart();

		}
	},

	roundFaild() {
		this.showMessage("Round Failed!" + "\n" + "Restarting Round!!");
		This.runAction( cc.sequence(cc.delayTime(2.0), cc.callFunc(this.initaliseSeries, this)));
		// this.initaliseSeries();
	},

	levelFailed(){
		this.showMessage("Level Failed Restarting level");
		This.runAction( cc.sequence(cc.delayTime(2.0), cc.callFunc(this.levelStart, this)));
	},

	levelCompleted(){
		console.log(' Level completed ');
		this.levelInfo.currentLevel = this.levelInfo.currentLevel + 1;
		this.levelInfo.currentRound = 0;
		this.showMessage("Level" + this.levelInfo.currentLevel + "started")
		this.levelStart();
	},

	showMessage(msg) {
			this.message.getComponent(cc.Label).string = msg;
			this.message.setScale(1);
			this.message.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.5), cc.fadeIn(0.5), cc.fadeOut(0.5), cc.fadeIn(0.5), cc.fadeOut(0.5)));
	},

});
