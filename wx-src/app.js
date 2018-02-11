//app.js
var config = require('./config.js');
var qcloud = require('./bower_components/wafer-client-sdk/index.js');
qcloud.setLoginUrl(config.service.loginUrl);

App({
  onLaunch: function (param) {
    this.setLanguage();
    //调用API从本地缓存中获取数据
    if(param.shareTicket){
      qcloud.request({
        url: 'https://api.kumali.cc/qcloud/openTickets',
        login: false,
        method: 'POST',
        data: {
          shareTickets: param.shareTicket,
          action: 1
        },
        success(res) {
        },
        fail(err) {
          console.log(err);
        }
      });
    }
  },
  setLanguage: function(){
    try {
      var sysInfo = wx.getSystemInfoSync();
        wx.setStorageSync('language', sysInfo.language === 'zh_CN' ? 'en' : 'en');
    } catch (e) {
    }
  }
})