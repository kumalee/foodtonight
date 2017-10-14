var qcloud = require('../bower_components/wafer-client-sdk/index.js');
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getText(data){
  const language = wx.getStorageSync('language');
  return data[language];
}

function sendParam(playTime, playFinished) {
  qcloud.request({
    url: 'https://api.kumali.cc/qcloud/play',
    login: true,
    method: 'POST',
    data: {
      playTime: playTime,
      playFinished: playFinished
    },
    success(res) {
      //  console.log(res);
    },
    fail(err) {
      console.log(err);
    }
  })
}

function sendTickets(result){
  wx.getShareInfo({
    shareTicket: result.shareTickets[0],
    complete(res) {
      if (res.encryptedData) {
        qcloud.request({
          url: 'https://api.kumali.cc/qcloud/shareTickets',
          login: true,
          method: 'POST',
          data: {
            shareTickets: 1,
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          success(res) {
            console.log(res);
          },
          fail(err) {
            console.log(err);
          }
        })
      } else {
        qcloud.request({
          url: 'https://api.kumali.cc/qcloud/shareTickets',
          login: true,
          method: 'POST',
          data: {
            shareTickets: 0
          },
          success(res) {
            console.log(res);
          },
          fail(err) {
            console.log(err);
          }
        })
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  getText: getText,
  sendParam: sendParam,
  sendTickets: sendTickets
}
