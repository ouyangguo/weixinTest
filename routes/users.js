var express = require('express');
var router = express.Router();
var request = require("request");
var userService = require("../service/userService");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/alluser",function(req,res,next){
	userService.getAllOpenId(function(err,result){
		if(err) return res.json({
			code:500,
			message:err
		});
		return res.json({
			code:200,
			message:"success",
			data:result
		})
	})
});
router.get("/userInfo",function(req,res){
	if(!req.query.openId){
		return res.json({
			code:1000,
			message:"缺少参数openId"
		});
	};
	userService.getUserInfo(req.query.openId,function(err,result){
		if(err) return res.json({
			code:500,
			message:"error"
		});
		res.json({
			code:200,
			message:"success",
			data:result
		});
	});
})

module.exports = router;
