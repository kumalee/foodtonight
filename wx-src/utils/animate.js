var tween = require('./tween').tween;

var AnimateCanvas = function(point, scale, duration, easing, callback, direct){
    var me = this;
    var isUndefined = function (obj) {
        return typeof obj == 'undefined';
    };
    var isFunction = function (obj) {
        return typeof obj == 'function';
    };
    var isNumber = function(obj) {
        return typeof obj == 'number';
    };
    var isString = function(obj) {
        return typeof obj == 'string';
    };
    // duration, easing, callback均为可选参数
    // 而且顺序可以任意
    var options = {
        duration: duration,
        easing: easing,
        callback: callback,
    };

    // 算法需要的几个变量
    var start = 0;
    // during根据设置的总时间计算
    var during = Math.ceil(options.duration / 17);
    
    // 当前动画算法
	// 确保首字母大写
	options.easing = options.easing.slice(0, 1).toUpperCase() + options.easing.slice(1);
    var arrKeyTween = options.easing.split('.');
    var fnGetValue;
    
    if (arrKeyTween.length == 1) {
        fnGetValue = tween[arrKeyTween[0]];
    } else if (arrKeyTween.length == 2) {
        fnGetValue = tween[arrKeyTween[0]] && tween[arrKeyTween[0]][arrKeyTween[1]];
    }
	if (isFunction(fnGetValue) == false) {
		console.error('没有找到名为"'+ options.easing +'"的动画算法');
		return;	
	}
    
    // 运动
    var step = function() {
        // 当前的运动位置
        var valueX = fnGetValue(start, point.x.from, point.x.to - point.x.from, during);
        var valueY = fnGetValue(start, point.y.from, point.y.to - point.y.from, during);
        var valueScale = fnGetValue(start, scale.from, scale.to - scale.from, during);
        var values = {
            x: valueX,
            y: valueY,
            scale: valueScale
        }
        
        // 时间递增
        start++;
        // 如果还没有运动到位，继续
        if (start <= during) {
            options.callback.call(me, values);
            setTimeout(step, 20);
        } else {
            // 动画结束，这里可以插入回调...
            options.callback.call(me, values, true, direct);
        }
    };
    // 开始执行动画
    step();
}

module.exports = {
    animate: AnimateCanvas
}