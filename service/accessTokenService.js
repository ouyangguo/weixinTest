var request = require("request"),
	config = require("../config/base.js");

module.exports = {
	getToken:function(cb){
		var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.secret}`;
			request.get(url,function(err,res,body){
				console.log(body);
				var result = JSON.parse(body);
				cb(err,result);
			})
	},
	token:""
}
