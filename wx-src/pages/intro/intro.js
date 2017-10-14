//game.js
//获取应用实例
var util = require('../../utils/util.js');

Page({
  data: {
  },
  //事件处理函数
  bindToFreeSample: function() {
    wx.navigateTo({
      url: '../getsample/getsample'
    })
  },
  bindToGame: function(){
    wx.redirectTo({
      url: '../game/game'
    })
  },
  onLoad: function () {
    const me = this;
    const DATA = {
      en: {
      title: 'Done',
      mindrelax: 'MIND RELAXED :)\n\
        WHAT ABOUT YOUR BODY?',
      mindfeel: 'Now your mind is more\n\
        relaxed, you deserve to \n\
        relax your body.',
      playagain: 'Play Again',
      sendto: 'Send to Friend',
      royal: 'ROYAL RELAXING \n\
BODY CARE FROM SPAIN',
      product: 'Anti-Stress Body Oil',
      productsize: '150 ml',
      productdesc: 'A sublime body oil with Almond oil combined \n\
       with the essential oils of Orange, Grapefruit, \n\
       Lemon, Lavender, Marjoram and Petitgrain. \n\n\n\
      Its stimulating fragrance provides an \n\
      immediate sensation of all-over wellbeing. \n\
      This oil helps relaxation and alleviates \n\
      tension when applied in massage.',
      getSample: 'GET FREE SAMPLE',
      follow: 'FOLLOW US',
      companytitle1: 'WHO IS ALQVIMIA?',
      companydesc1:'Today you have discovered a Special Brand.  \n\
        We are a small and beautiful Concious Cosmetic \n\
        Company from Sunny Barcelona in Spain. \n\
        We have spent 30 years refining ancient \n\
        Alchemical European treatments \n\
        for the body and mind',
      companytitle2: '100% NATURAL AND SAFE',
      companydesc2: 'All our products are chemical free, \n\
        made only with the best natural ingreedients. \n\
        Some of those ingredients we even harvest from \n\
        the wild in the Spanish mountains.',
      companytitle3: 'ANCIENT WISDOM',
      companydesc3: 'Our products are inspired by ancient eurpoean \n\
        Alchemical formuals and principles. \n\
        Some of them follow very traditional ways \n\
        of extracting the purest essence from plants.',
      companytitle4: 'CONCIOUS COSMETICS',
      companydesc4: 'In todays high stress, overloaded lives we \n\
        need cosmetics that go beyond just making our \n\
        face and body look good, we need comsetics \n\
        that make us feel good on the inside. \n\n\
        Cosmetics that understand beauty \n\
        is as much a mental state as a physical image. \n\
        Beautiful Mind, Beautiful Body.'
    },
    cn: {
      title: '完成',
      mindrelax: '心灵放松了，那你的身体呢？',
      mindfeel: '当紧绷的神经放松后，\n\
        你的身体同样值得细心对待，这时候……\n\
        应该好好舒缓放松你的身体。',
      playagain: '再玩一次',
      sendto: '与朋友分享',
      royal: '来自西班牙的\n\
        皇家舒缓身体护理方案',
      product: '减压舒缓护肤按摩油',
      productsize: '150 ml',
      productdesc: '这款减压舒缓护肤精油由杏仁油加橘子，\n\
      葡萄柚精油，柠檬、薰衣草、牛至、苦橙叶等\n\
      纯植物精油调配而成。打开瓶盖就能闻到\n\
      迎面而来的幸福感，有助于放松身体和\n\
      缓解调节紧张情绪。特别适合处于压力、\n\
      焦虑或失眠之下的人群，配合按摩效果更佳。',
      getSample: '申领免费小样',
      follow: '关注我们',
      companytitle1: '关于爱奇蜜雅(ALQVIMIA)',
      companydesc1: '我们来自于充满阳光和热情的西班牙城市巴塞罗那，\n\
      是一个有着30多年历史、关注社会责任\n\
      和人文关怀的护肤品牌。\n\
      我们专注于改良古代欧洲宫廷配方，\n\
      致力于对身心灵带来更好的护理方案。',
      companytitle2: '天然、安全',
      companydesc2: '纯天然、无化学添加， \n\
        是 Alqvimia 美容护肤产品的标签，\n\
        我们选用最优质的纯天然植物， \n\
        配方中的成分中还有 \n\
        采摘自西班牙亘野山林中的野生植物。',
      companytitle3: '古老的智慧',
      companydesc3: 'Alqvimia 的产品受启发于 \n\
        欧洲古代炼金术的配方和原理， \n\
        其中一些产品甚至仍沿用了 \n\
        最传统的方法来提取最精纯的植物精华。',
      companytitle4: ' 我们关注心灵',
      companydesc4: '在压力过大的今天， \n\
        我们需要的美容护肤产品不能只是单纯地美颜护肤， \n\
        而是应该能够同时让我们获得内在的幸福。 \n\
        我们理解并推崇的美是身体和心灵 \n\n\
        同时达到平衡的一种状态， \n\
        一种内而及外的美。'
    }};
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
