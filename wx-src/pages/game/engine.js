const animate = require('../../utils/animate.js').animate;
const util = require('../../utils/util.js');
const ballnormal = '../resources/ball.06ad26.png'
const ballbig = '../resources/ball-big.6f3ace.png'
const ballempty = '../resources/ball-empty.png'
let flagFinished;
const BALL = {
    width: 360,
    height: 316,
    x:  Math.floor(Math.random()*50),
    y: Math.floor(Math.random()*30)
};
let delayShowPlay;
let delayBreatheOut;

const UNIT = {
    x: 6,
    y: 12
}

let GLOBAL_DIRECT = [
    'LRUD',
    'LRDU',
    'RLDU',
    'RLUD'][[(Math.floor(Math.random()*100)) % 3]];

const SYS_INFO = wx.getSystemInfoSync();
const RANGE = {
    min_x: -20,
    max_x: 750,
    min_y: 80,
    max_y: 1240
}

const POINTS = {
    BottomToTop: {
        x: (RANGE.max_x + 20 - 360) / 2,
        y: RANGE.min_y + 20 + 60
    },
    TopToBottom: {
        x: (RANGE.max_x + 20 - 360) / 2,
        y: RANGE.max_y - 316 + 20
    },
    Cong: {
        x: (RANGE.max_x + 20 - 360) / 2,
        y: RANGE.min_y + 145 + 60
    }
}

const SCALE = {
    BottomToTop: {
        from: 1,
        to: 1.8
    },
    TopToBottom:{
        from: 1.8,
        to: 1
    },
    Cong: {
      from: 1,
      to: 2.2
    }
}

let HIDE_FINGER_FOLLOW = true;
let FLAG_STOP = false;
let FLAG_BREATH = true;
let TimerLoop;
let updownCount = 0;
let updowntime = 2500;
let maxCount = 3;

// set next direct
const _setDirect = function(){
    const x = BALL.x;
    const y = BALL.y;
    switch(GLOBAL_DIRECT){
        case 'LRUD':
            // 左到右，上到下
            if (x < RANGE.max_x){
                // 在 X 轴范围内
                GLOBAL_DIRECT = 'LRDU';
            } else {
                // 顶到了 X 轴右边缘
                GLOBAL_DIRECT = 'RLUD';
            }
            break;
        case 'LRDU':
            // 左到右，下到上
            if (y > RANGE.min_y) {
                // 在 Y 轴范围内
                GLOBAL_DIRECT = 'RLDU';
            } else {
                // 在 Y 轴上边缘
                GLOBAL_DIRECT = 'RLUD';
            }
            break;
        case 'RLDU':
            // 右到左，下到上
            if (x > RANGE.min_x){
                // 在 X 轴范围内
                GLOBAL_DIRECT = 'RLUD';
            } else {
                // 在 X 轴左边缘
                GLOBAL_DIRECT = 'LRUD';
            }
            break;
        case 'RLUD':
            // 右到左，上到下
            if ( y < RANGE.max_y ){
                // 在 Y 轴范围内
                GLOBAL_DIRECT = 'LRUD';
            } else {
                // 在 Y 轴下边缘
                GLOBAL_DIRECT = 'LRDU';
            }
            break;
        case 'UD':
            GLOBAL_DIRECT = 'DU';
            break;
        case 'DU':
            GLOBAL_DIRECT = 'UD';
            break;
        default:
            break;
    }
}

// Set Operate
const _setMoveOperate = function(){
    switch(GLOBAL_DIRECT){
        case 'LRUD':
            return {x: '+', y: '+'}
        case 'LRDU':
            return {x: '+', y: '-'}
        case 'RLDU':
            return {x: '-', y: '-'}
        case 'RLUD':
            return {x: '-', y: '+'}
        case 'UD':
            return {x: '=', y: '+'}
        case 'DU':
            return {x: '=', y: '-'}
    }
}

// set min spped of x,y
const _setSpeed = function(){
    UNIT.y = Math.random()*6;
    UNIT.x = Math.random()*3;
    // if (UNIT.y < 10) {
    //     UNIT.y = 10;
    // }
    // if (UNIT.x < 4) {
    //     UNIT.x = 4;
    // }
}

// set move direct and unit
const _getAction = function(){
    if ( 
        BALL.x <= RANGE.min_x ||
        BALL.x >= RANGE.max_x - BALL.width + 20 ||
        BALL.y <= RANGE.min_y ||
        BALL.y >= RANGE.max_y - BALL.height + 40
    ){
        _setDirect();
        if (GLOBAL_DIRECT !== 'UD' && GLOBAL_DIRECT !=='DU'){
            _setSpeed();
        }
    }
    var operate = _setMoveOperate();
    
    if (operate.x == '+'){
        BALL.x += UNIT.x;
    } else if (operate.x == '-'){
        BALL.x -= UNIT.x;
    }
    if (operate.y == '+'){
        BALL.y += UNIT.y;
    } else if (operate.y == '-'){
        BALL.y -= UNIT.y;
    }
    if (BALL.x < RANGE.min_x){
        BALL.x = RANGE.min_x;
    }
    else if (BALL.x >= RANGE.max_x - BALL.width + 20){
        BALL.x = RANGE.max_x - BALL.width + 20;
    }
    if (BALL.y < RANGE.min_y){
        BALL.y = RANGE.min_y;
    }
    else if (BALL.y >= RANGE.max_y - BALL.height + 40){
        BALL.y = RANGE.max_y - BALL.height + 40;
    }
}

const _paint = function(){
  if (delayShowPlay){
    clearTimeout(delayShowPlay);
    delayShowPlay = undefined;
  }
  if (delayBreatheOut){
    clearTimeout(delayBreatheOut);
    delayBreatheOut = undefined;
  }
    FLAG_STOP = false;
    var me = this;
    me.setData({
        'left': BALL.x + 'rpx',
        'top': BALL.y + 'rpx',
        'ballScale': 1,
        'initShow': 'show',
        'playShow': '',
        'congShow': '',
        'inhaleShow': '',
        'exhaleShow': '',
        'inhaleScale': 1,
        'exhaleScale': 1,
        'ballClass': 'scale',
        'ballSrc': ballnormal
    });
    delayShowPlay = setTimeout(function(){
      me.setData({
        'initShow': '',
        'playShow': 'show'
      })
    },2500)
    _loopPaint.call(me);
}

// Ball auto move infinite
const _loopPaint = function(){
    var me = this;
    if (FLAG_STOP){
        clearTimeout(TimerLoop);
        TimerLoop = undefined;
    } else {
        _getAction();
        me.setData({
          'left': BALL.x + 'rpx',
          'top': BALL.y + 'rpx',
        });
        TimerLoop = setTimeout(function(){
            _loopPaint.call(me);
        }, 17);
    }
}

const _showCongAndNav = function (values, flag){
  var me = this;
  var point = POINTS['Cong'];
  var tpoint = {
    points: {
      x: {
        from: BALL.x,
        to: point.x
      },
      y: {
        from: BALL.y,
        to: point.y
      }
    },
    scale: SCALE['Cong']
  };
  if (!values){
    animate.call(me, tpoint.points, tpoint.scale, 2200, 'Cubic.easeInOut', _showCongAndNav);
    return;
  } else {
    BALL.x = values.x;
    BALL.y = values.y;
    BALL.scale = values.scale;
    me.setData({
      'left': values.x + 'rpx',
      'top': values.y + 'rpx',
      'ballScale': values.scale
    });
  }
  if (flag){
    _navToIntro();
  } 
}

const _paintEaseInOut = function(values, flag, direct){
    var me = this;
    if (FLAG_BREATH){
        return false;
    }
    else if (flag){
        if (direct == 'BottomToTop'){
            if(updownCount > 0 && updownCount < 3){
                updowntime += 250;
            }
            if(updownCount > maxCount - 1){
                updownCount += 1;
                FLAG_BREATH = true;
                me.setData({
                    'congShow': 'show',
                    'inhaleShow': '',
                    'exhaleShow': '',
                    'initShow': '',
                    'playShow': '',
                    'waitingShow': '',
                    'ballClass': 'cong',
                    'ballSrc': ballbig
                });
                if (flagFinished) {
                  clearTimeout(flagFinished);
                  flagFinished = undefined;
                }
                util.sendParam(0,1);
                _showCongAndNav.call(me);
            } else {
                var tpoint = _getTargetPoint('BottomToTop');
                me.setData({
                  'inhaleShow': 'show',
                  'exhaleShow': '',
                  'initShow': '',
                  'playShow': '',
                  'congShow': '',
                  'waitingShow': ''
                });
                animate.call(me, tpoint.points, tpoint.scale, updowntime, 'Cubic.easeInOut', _paintEaseInOut, 'TopToBottom');
                updownCount += 1;
            }
        } else if (direct == 'TopToBottom'){
            var tpoint = _getTargetPoint('TopToBottom');
            me.setData({
              'ballClass': 'stop',
              'inhaleShow': '',
              'exhaleShow': '',
              'playShow': '',
              'initShow': '',
              'waitingShow': 'show',
            });
            delayBreatheOut = setTimeout(function () {
              me.setData({
                'ballClass': '',
                'inhaleShow': '',
                'exhaleShow': 'show',
                'playShow': '',
                'waitingShow': '',
              });
              animate.call(me, tpoint.points, tpoint.scale, updowntime, 'Cubic.easeInOut', _paintEaseInOut, 'BottomToTop');
            }, 3000);
        }
    } else {
        BALL.x = values.x;
        BALL.y = values.y;
        BALL.scale = values.scale;
        me.setData({
            'left': values.x + 'rpx',
            'top': values.y + 'rpx',
            'ballScale': values.scale,
            // 'inhaleScale':values.scale,
            // 'exhaleScale': values.scale
        });
    }
}

const _getTargetPoint = function(position){
    var point = POINTS[position];
    return {points: {
        x: {
            from: BALL.x,
            to: point.x
        },
        y: {
            from: BALL.y,
            to: point.y
        }
    }, scale: SCALE[position]};
}

const _breathStart = function(){
    var me = this;
    clearTimeout(TimerLoop);
    TimerLoop = undefined;
    FLAG_STOP = true;
    FLAG_BREATH = false;
    var points = {
        x: {
            from: BALL.x,
            to: POINTS.TopToBottom.x
        },
        y: {
            from: BALL.y,
            to: POINTS.TopToBottom.y
        }
    }
    var scale = {
        from: 1,
        to: 1
    }
    updownCount = 0;
    me.setData({
        'playShow': 'none',
        'followShow': 'block',
        'ballSrc': ballempty,
        'ballClass': ''
    });
    animate.call(me, points, scale, 1000, 'Cubic.easeInOut', _paintEaseInOut, 'BottomToTop');
}

const _breathStop = function(){
    if (delayBreatheOut){
      clearTimeout(delayBreatheOut);
      delayBreatheOut = undefined;
    }
    var me = this;
    FLAG_BREATH = true;
    if (updownCount>maxCount){
        return false;
    } else {
        me.setData({
            'initShow': 'show',
            'playShow': '',
            'exhaleShow': '',
            'inhaleShow': '',
            'ballClass': 'scale',
            'waitingShow': '',
            'ballScale': 1,
            'ballSrc': ballnormal
        })
        setTimeout(function(){
            if (GLOBAL_DIRECT.indexOf('U')<GLOBAL_DIRECT.indexOf('D')){
                GLOBAL_DIRECT = 'LRUD';
            } else {
                GLOBAL_DIRECT = 'LRDU';
            }
            BALL.width = 300;
            BALL.height = 264;
            FLAG_STOP = false;
            _loopPaint.call(me);
        },300);
    }
}

const _navToIntro = function(){
  setTimeout(function () {
    updownCount = 0;
    wx.redirectTo({
      url: '../intro/intro'
    });
  }, 3000);
}

module.exports = {
    init: _paint,
    breath: _breathStart,
    stop: _breathStop
}