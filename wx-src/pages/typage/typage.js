//index.js
//获取应用实例
var util = require('../../utils/util.js');
var qcloud = require('../../bower_components/wafer-client-sdk/index.js');

Page({
  data: {
  },
  //事件处理函数
  bindGameStart: function() {
    wx.redirectTo({
      url: '../game/game'
    });
  },
  onLoad: function () {
    const DATA = {
      en: {
        thankyou: 'THANK YOU',
        desc: 'Your free sample will \n\
          be delivered in the next \n\
          48 hours',
        restart: 'PLAY AGAIN',
        title: 'Done'
      },
      cn: {
        thankyou: '感谢您的参与',
        desc: 'Your free sample will \n\
          be delivered in the next \n\
          48 hours',
        restart: '再玩一次',
        title: '完成'
      }
    };
    var me = this;
    //调用应用实例的方法获取全局数据
    const text = util.getText(DATA);
    wx.setNavigationBarTitle({
      title: text.title
    });
    me.setData(text);
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShareAppMessage: function () {
      var me = this;
      try {
        var data = wx.getStorageSync('userInfo')
        if (data) {
          // Do something with return value
          var p = '/pages/index/index?uname=' + (data.nickName || '') + '&avartar=' + (data.avatarUrl || '');
          return {
            title: 'Feel Good',
            path: p,
            success: function (res) {
              // 转发成功
              util.sendTickets(res);
            }
          }
        }
      } catch (e) {
        // Do something when catch error
        console.log(e);
        return {
          title: 'Feel Good',
          path: p,
          success: function (res) {
            // 转发成功
            util.sendTickets(res);
          }
        }
      };
    }
})
