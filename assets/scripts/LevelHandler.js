// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        foo: {
            // ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.SpriteFrame, // optional, default is typeof default
            serializable: true,   // optional, default is true
            visible:false
        },
        levelInfo: {
            get () {
                return this._levelInfo;
            },
            visible:false
        },

        currentLevel: {
            get(){
                return this._currentLevel;
            },
            set(round){
                this._currentLevel  = round;
            },
            visible:false,
        },
        currentRound: {
            get(){
                return this._currentRound;
            },
            set(round){
                this._currentRound  = round;
            },
            visible:false
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var url = cc.url.raw( 'resources/LevelInfo/level.json' )
        cc.loader.load( url, function( err, res)
        {
            this._levelInfo = res.json;
            this.node.dispatchEvent( new cc.Event.EventCustom('level_loaded', true) );
        }.bind(this));
    },

    start () {
        this._currentLevel = 0;
        this._currentRound = 0;
    },


});
