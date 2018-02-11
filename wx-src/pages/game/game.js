//game.js
//获取应用实例
var engine = require('./engine.js');
var util = require('../../utils/util.js');
var breathing = false;
var flagPlay;
Page({
  data: {
    initShow: 'show',
    ballSrc: '../resources/ball.06ad26.png'
  },
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
        title: '3 Breaths',
        tip_init: 'OK, let’s take 3 breathe',
        tip_play: 'Touch and follow me',
        tip_inhale: 'Nice! now breathe in',
        tip_exhale: 'Great! breathe out now',
        tip_waiting: 'Hold your breath…',
        tip_cong: 'YEAH! YOU DID IT! :D',
        language: 'en'
      },
      cn: {
        title: '三次深呼吸放松',
        tip_init: '好了，来做三次深呼吸',
        tip_play: '长按屏幕跟随我',
        tip_inhale: '干得漂亮！现在保持吸气',
        tip_exhale: '太棒了！可以吐气了',
        tip_waiting: '屏住你的呼吸...',
        tip_cong: '耶！恭喜你做到了! :D',
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
