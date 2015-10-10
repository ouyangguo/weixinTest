var request = require("request");
var tokenService = require("./accessTokenService");
var eventproxy = require("eventproxy");

module.exports = {
	getAllOpenId: function(cb) {
		var ep = new eventproxy();
		var users = [];
		var _this = this;

		ep.on("continue", function(next) {
			_this.getOpenId(function(err, result) {
				console.log(err,result);
				if (err || result.errorcode) return ep.emit(err, "get openId faild");
				ep.emit("success", result);
			});
		});

		ep.on("success", function(result) {
			users = users.concat(result.data.openid);
			if (users.length == result.total) ep.emit("end");
			else ep.emit("continue",result.next_openid);
		});

		ep.on("error",function(err){
			cb(err);
		});

		ep.on("end",function(){
			cb(null,users);
		});
		ep.emit("continue");
	},
	getOpenId: function(next, cb) {
		if (arguments.length < 2) {
			cb = next;
			next = null;
		};
		var url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${tokenService.token}`;
		if (next) url += "&next_openid=" + next;
		request.get(url, function(err, res, body) {
			var result = JSON.parse(body);
			cb(err, result);
		});
	},
	getUserInfo:function(openid,cb){
		var url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${tokenService.token}&openid=${openid}&lang=zh_CN`;
		request.get(url,function(err,res,body){
			var result = 	JSON.parse(body);
			if(result.errorcode||err) return cb("getInfo error");
			cb(err,result);
		})
	},
	batchGetUserInfo:function(openids,cb){
		var data = {user_list:[]};
		openids.forEach(function(id){
			data.user_list.push({openid:id})
		});
		request({
			url:`https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${tokenService.token}`,
			method:"post",
			json:true,
			body:data
		},function(err,res,body){
			console.log(body);
			if(err||body.errorcode) return cb("betchget error");
			cb(err,body);
		});
	}
}