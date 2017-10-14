// getsample.js
var util = require('../../utils/util.js');
var provinces = require('../../utils/province.js');
var citys = require('../../utils/city.js');
var areas = require('../../utils/areaNew.js');
var config = require('../../config.js');
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

var changePickerView = function(val){
  var me = this;
  if (val[0]!= me.data.value[0]){
    var province = provinces[val[0]];
    var curCitys = citys[provinces[val[0]].id];
    var curAreas = areas[curCitys[0].id];
    me.setData({
      province: province.name,
      citys: curCitys,
      city: curCitys[0].name,
      areas: curAreas,
      area: curAreas[0].name,
      value: val
    });
  } else if (val[1]!= me.data.value[1]){
    var curAreas = areas[me.data.citys[val[1]].id];
    me.setData({
      city: me.data.citys[val[1]].name,
      areas: curAreas,
      area: curAreas[0].name,
      value: val
    });
  } else if (val[2]!=me.data.value[2]){
    me.setData({
      area: me.data.areas[val[2]].name,
      value: val
    });
  } 
}

Page({
  data: {
    provinces: provinces,
    province: '北京市',
    areas: areas[citys[provinces[0].id][0].id],
    area: '东城区',
    citys: citys[provinces[0].id],
    city: '',
    value: [0, 0, 0],
    showPicker: 'none',
    preAddress: '选择省市',
    inputName: '',
    inputAddress: '',
    inputMobile: ''
  },
  showSelector: function(e){
    this.setData({
      showPicker: 'block'
    })
    setTimeout(function(){
      wx.hideKeyboard();
    },500);
  },
  bindChange: function (e) {
    var me = this;
    const val = e.detail.value;
    changePickerView.call(me, val);
  },
  bindDone: function(e){
    var me = this;
    me.setData({
      preAddress: me.data.province + me.data.city.replace('市辖区', '') + me.data.area,
      showPicker: 'none'
    });
  },
  bindCancel: function(e){
    this.setData({
      showPicker: 'none'
    });
  },
  bindinputName: function(e){
    this.setData({
      inputName: e.detail.value
    });
  },
  bindinputAddress: function (e) {
    this.setData({
      inputAddress: e.detail.value
    });
  },
  bindinputMobile: function (e) {
    this.setData({
      inputMobile: e.detail.value
    });
  },
  //事件处理函数
  applySample: function(){
    showBusy('Waiting');
    var me = this;
    var submitInfo = {
      name: me.data.inputName,
      preAddress: me.data.preAddress,
      address: me.data.inputAddress,
      mobile: me.data.inputMobile
    }
    if (!submitInfo.name || !submitInfo.preAddress 
      || !submitInfo.address || !submitInfo.mobile){
      wx.showModal({
        title: '提示',
        content: '请填写完整的资料',
        showCancel: false
      });
      return false;
    }

    qcloud.request({
      url: 'https://api.kumali.cc/qcloud/apply',
      login: true,
      method: 'POST',
      data: submitInfo,
      success(userInfo) {
        wx.hideToast();
        wx.redirectTo({
          url: '../typage/typage'
        })
      },
      fail(err) {
        showModel('抱歉，系统或者网络有问题，请稍后重试。', err);
      }
    })
  },
  bindToThankyou: function() {
    var me = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              me.applySample();
            },
            fail(err) {
              console.log(err);
            }
          })
        } else {
          me.applySample();
        }
      },
      fail(error) {
        console.log(error);
      }
    });
  },
  onLoad: function () {
    const DATA = {
      en: {
        title: 'Relax',
        product: "ANTI_STRESS BODY OIL",
        delivery: "Free delivery and postage",
        submit: "SEND TO ME"
      },
      cn: {
        title: '放松',
        product: "减压舒缓护肤按摩油",
        delivery: "免费快递或邮寄",
        submit: "我要小样"
      }
    };
    var me = this;
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
