var root = process.env.API_WX_PAY_DEV;

// 生产环境接口
// http://fortest.innourl.com/sanse_wap_v2/dist/home
// var root = 'http://fortest.innourl.com/sanse_wap_v2/api'

// 引用axios
var axios = require('axios')


function apiAxios (method, url, params, success) {
	let headerInfo = {
        'platform_src': 'WAP',
        'cookie_id': '23456006805d970d5438a354dc019fc295614979',
        'systype': 'wap'
    };

	axios({
		method: method,
		url: url,
		headers: headerInfo ? headerInfo : null,
	    baseURL: root,
	    withCredentials: false
	})
	.then(function (res) {
		if(res.error != '1') {
			if (typeof success == 'function') {
				success(res);
			}
		}
	})
	.catch(function (err) {
		let res = err.response;
		if (err) {
			window.alert('api error, HTTP CODE: ' + err)
			return
		}
	})
}



function jsApiCall (data) {
	console.log(data, '=============');
	if(!WeixinJSBridge) {
		alert('请用微信浏览器打开');
		return;
	}
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest',
		data,
		function(res){
			WeixinJSBridge.log(res.err_msg);
			if(res.err_msg=="get_brand_wcpay_request:cancel"){
				//取消结算后的动作
				alert('取消支付');
            }
          	if(res.err_msg=="get_brand_wcpay_request:ok"){
          		//支付成功后的动作
          		alert('支付成功');
           	}
		   	if(res.err_msg=="get_brand_wcpay_request:fail"){
		   		//支付失败后的动作
		   		alert('支付失败');
            }
		}
	);
}

export default {
	callpay: function(data) {
		if (typeof WeixinJSBridge == "undefined"){
		    if( document.addEventListener ){
		        document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
		    }else if (document.attachEvent){
		        document.attachEvent('WeixinJSBridgeReady', jsApiCall); 
		        document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
		    }
		}else{
		    jsApiCall(data);
		}
	},

	wxPayGetRequest: function (url, params, success) {
		// console.log(url, params, success);
		return apiAxios('GET', url, params, success);
	}
}