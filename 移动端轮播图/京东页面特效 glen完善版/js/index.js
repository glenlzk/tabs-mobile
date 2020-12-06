/**
 * Created by lenovo on 2016/9/9.
 */

var addLoadEvent = function (func) {
    var oldLoad = window.onload;

    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldLoad();
            func();
        };
    };
};

//不可以执行 changeBg函数还未执行赋值操作
/*

changeBg();
addLoadEvent(changeBg);
*/

/*可以执行: 嵌套一个匿名函数之后，匿名函数被调用的同时，下面的changeBgH函数已经被赋值操作;
*/
addLoadEvent(function () {
    changeBg();
});

addLoadEvent(function () {
    countDown('2016/09/09 15:38:00');
});

/* 顶部topBar背景色变化 */

var changeBg = function () {
    var headerBg = document.getElementsByClassName('header_wrapper')[0],
        banner = document.getElementsByClassName('banner')[0],
        banner_h = banner.offsetHeight,
        top = 0;

    window.onscroll = function () {
        top = window.pageYOffset;
        if (top > banner_h) {
            headerBg.style.backgroundColor = 'rgba(209, 55, 67, 0.85)';
        } else {
            top = top/banner_h*0.85;
            headerBg.style.backgroundColor = 'rgba(209, 55, 67, ' + top + ')';
        };
    };
};

/* 倒计时 */
var countDown = function (timer) {
    var ms_time = document.getElementsByClassName('ms_time')[0],
        timeList = ms_time.getElementsByClassName('num'),
        endTime = new Date(timer).getTime(),
        h, m, s, timer = null;

    timer = setInterval (function() {
       var  startTime = new Date().getTime(),
            restTime = (endTime > startTime ? endTime - startTime : 0)/1000;

        if (restTime) {
            h = addZero(Math.floor(restTime/60/60));
            m = addZero(Math.floor(restTime/60%60));
            s = addZero(Math.floor(restTime%60));

            timeList[0].innerHTML = h.charAt(0);
            timeList[1].innerHTML = h.charAt(1);
            timeList[2].innerHTML = m.charAt(0);
            timeList[3].innerHTML = m.charAt(1);
            timeList[4].innerHTML = s.charAt(0);
            timeList[5].innerHTML = s.charAt(1);
        } else {
            clearInterval(timer);
        }

    }, 1000);
};

var addZero = function (num) {
    return num < 10? '0'+num : num + '';
};

/* banner区域 */

/*
*  无法触发touchstart/touchmove/touchend的原因是，
*  或者只是触发一两次
*  所在的盒子ul，没有高度宽度，里面的li浮动后，没有清除浮动
*
*     .banner ul {
*         width: 1000%;
*         transform: translateX(-10%);          //这种表达方式是：width的百分之10
*         -webkit-transform: translateX(-10%);
*         overflow: hidden;
*     }
* */

var slides = function () {
    var outBox = document.getElementsByClassName('banner-imgs')[0],
        width = outBox.offsetWidth,
        imgBox = outBox.getElementsByTagName('ul')[0],
        circle =document.getElementsByClassName('circle')[0],
        spots = circle.children,
        timer = null,
        timer2 = null,
        timeOutEvent = null,
    index = 1;

    /* 增加过渡效果 */
    var addTransition = function () {
        imgBox.style.transition = 'all 0.2s ease 0s';
       imgBox.style.webkitTransition = 'all 0.2s ease 0s';
    };
    /* 清除过渡效果 */
    var removeTransition = function () {
        imgBox.style.transition = 'none';
        imgBox.style.webkitTransition = 'none';
    };
    /* 元素位移 */
    var move = function (d) {
        imgBox.style.transform = 'translateX(' + d + 'px)';
        imgBox.style.webkitTransform = 'translateX(' + d + 'px)';
    };

    function gogo() {
        index ++;
        addTransition();
        move(-index*width);
    }

    timer = setInterval(gogo, 3000);
    /* 过渡效果结束后出发此事件 */
    imgBox.addEventListener('transitionEnd', function () {
        if (index >= 9) {
            index = 1;
        } else if (index <= 0){
            index = 8;
        };
        removeTransition();
        move(-index*width);

        /* 下标小圆圈切换 */
        for (var i= 0, len=spots.length; i<len; i++) {
            spots[i].classList.remove('current');
        };
        spots[index-1].classList.add('current');
    });

    imgBox.addEventListener('webkitTransitionEnd', function () {
        /* 无缝滚动设置 */
        if (index >= 9) {
            index = 1;
        } else if (index <= 0){
            index = 8;
        };

        removeTransition();
        move(-index*width);

        /* 下标小圆圈切换 */
        for (var i= 0, len=spots.length; i<len; i++) {
            spots[i].classList.remove('current');
        };
        spots[index-1].classList.add('current');
    });

    var startX = 0, endX = 0, moveX = 0;

    /* 原生长按事件原理： */
    function longPress() {
        timeOutEvent = null;
        console.log('长按事件');
        clearInterval(timer);
    };

    imgBox.addEventListener('touchstart', function(e){
        timeOutEvent = setTimeout(longPress, 500);
        e.preventDefault();
    });

    imgBox.addEventListener('touchmove', function (e) {
        e.preventDefault();
        clearTimeout(timeOutEvent);
        timeOutEvent = setTimeout(longPress, 500);
    });

    imgBox.addEventListener('touchend', function (e) {
        clearTimeout(timeOutEvent);
    });

    /* /原生长按事件原理： */

    /* 以下(touchstart/touchmove/touchend)是拖动时，元素跟随鼠标位移/达到一定距离，进行切换  */
    imgBox.addEventListener('touchstart', function(e){
        /* 必须清除，重新计算start和end的距离 */
        moveX = 0;
        /* 取消定时器启动 */
        clearTimeout(timer2);
        /* 注意清除默认行为 */
        e.preventDefault();
        startX = e.touches[0].clientX;
    });

     imgBox.addEventListener('touchmove', function (e) {
        clearInterval(timer);
         /* 取消定时器启动 */
        clearTimeout(timer2);
        e.preventDefault();     /* 注意清除默认行为 */
        endX = e.touches[0].clientX;
        moveX = endX - startX;

        removeTransition();
        move(-index*width+moveX);
    });

    imgBox.addEventListener('touchend', function (e) {
        endX = e.changedTouches[0].clientX;    /*获取方式和touchstart/touchmove不太一样*/
        if (Math.abs(moveX) > 1/3*width) {  /* && endX != 0 加这个没感觉有什么用 */
            if (moveX > 0) {
                index --;
            } else {
                index ++;
            }
            move(-index*width);
        };
        console.log(moveX, endX, index);
        addTransition();
        move(-index*width);
        /* 重新启动定时器 */
        timer2 = setTimeout(function() {
            timer = setInterval(gogo, 3000);
        }, 3000);
    });



};


addLoadEvent(slides);
