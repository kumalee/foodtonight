//game.js
//获取应用实例
var engine = require('./engine.js');
var util = require('../../utils/util.js');
var breathing = false;
var flagPlay;
Page({
  data: {},
  //事件处理函数
  bindToIntro: function() {
    wx.redirectTo({
      url: '../intro/intro'
    })
  },
  end: function(e){
    var me = this;
    if (breathing){
      engine.stop.call(me);
      breathing = false;
    }
  },
  cancel: function(e){
    if (breathing) {
      engine.stop.call(me);
      breathing = false;
    }
  },
  longtap: function(e){
    if (flagPlay){
      clearTimeout(flagPlay);
      flagPlay = undefined;
    }
    var me = this;
    breathing = true;
    engine.breath.call(me);
    flagPlay = setTimeout(function(){
      util.sendParam(1,0);
    }, 1000);
  },
  onLoad: function () {
    const DATA = {
      en: {
        title: 'Relax By 3 Breath',
        tip_play: 'TAP AND HOLD TO START',
        tip_follow: 'FOLLOW THE CIRCLE',
        tip_inhale: 'BREATHE IN',
        tip_exhale: 'BREATHE OUT',
        tip_waiting: 'HOLD YOUR BREATH',
        tip_cong: 'YOU DID IT',
        language: 'en'
      },
      cn: {
        title: '三次深呼吸放松',
        tip_play: '保持长按屏幕来开始',
        tip_follow: '心随球走',
        tip_inhale: '吸气',
        tip_exhale: '呼气',
        tip_waiting: '保持住你的呼吸',
        tip_cong: '恭喜你做到了',
        language: 'cn'
      }
    };
    var me = this;
    const text = util.getText(DATA);
    wx.setNavigationBarTitle({
      title: text.title
    });
    me.setData(text);
    engine.init.call(me);
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
