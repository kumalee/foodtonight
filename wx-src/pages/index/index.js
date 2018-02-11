//index.js
//获取应用实例
var util = require('../../utils/util.js');
var qcloud = require('../../bower_components/wafer-client-sdk/index.js');


var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({
  data: {
    userInfo: {},
  },
  //事件处理函数
  bindGameStart: function() {
    wx.redirectTo({
      url: '../game/game'
    });
  },
  doLogin: function(){
    var me = this;
    showBusy('正在登录');
    qcloud.request({
      url: 'https://api.kumali.cc/qcloud/user',
      login: true,
      success(userInfo) {
        showSuccess('登录成功');
        userInfo.data.nickName+=',';
        me.setData({
          userInfo: userInfo.data
        });
        wx.setStorage({
          key:'userInfo', 
          data: userInfo.data
        });
      },
      fail(err) {
        showModel('登录失败', err);
      }
    })
  },
  getUserInfo(){
    var me = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              me.doLogin();
            },
            fail(err){
              console.log(err);
            }
          })
        } else {
          me.doLogin();
        }
      },
      fail(error){
        console.log(error);
      }
    })
  },
  onLoad: function (e) {
    const DATA = {
      en: {
        desc1: 'Stop stressing out!',
        desc2: 'Have some Feel Good on me :)',
        title: '3 Breaths'
      },
      cn: {
        desc1: '不要压抑自己',
        desc2: '跟我一起舒缓情绪',
        title: '享受舒缓情绪'
      }
    };
    var me = this;
    me.setData({
      avatarUrl: e.avartar || '../resources/icon-default.png',
      nickName: e.uname || 'Alqvimia'
    })
    me.getUserInfo();
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
    var p = '/pages/index/index?uname=' + (me.data.userInfo.nickName || '') + '&avartar=' + (me.data.userInfo.avatarUrl || '');
    return {
      title: 'Feel Good',
      path: p,
      success: function (res) {
        // 转发成功
        util.sendTickets(res);
      },
    }
  }
})
