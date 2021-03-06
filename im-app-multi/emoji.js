;(function(RongIM){
	var emoji = {
		init : function(){
			RongIMLib.RongIMEmoji.init();
		},
		emojiToHTML : function(emojiContent){
            return RongIMLib.RongIMEmoji.emojiToHTML(emojiContent);
        },
        symbolToEmoji : function(sym){
            return RongIMLib.RongIMEmoji.symbolToEmoji(sym);
        },
        getEmoji : function(){
            return RongIMLib.RongIMEmoji.list.map(function(data) {
                return data.node;
            });
        }
	}
	RongIM.emoji = emoji;
})(RongIM);