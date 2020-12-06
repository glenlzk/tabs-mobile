/**
 * Created by lenovo on 2016/9/10.
 */

/*'use strict';*/

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

/* 当设备尺寸发生变化时，重新刷新加载页面 */
window.onresize = function(){
    location.reload(true);
}

function categoryMove () {
    var outBox = document.getElementsByClassName('category-titl')[0],
        ulBox = outBox.children[0],
        lis = ulBox.children,
        liH = ulBox.children[0].offsetHeight;


    var addTransition = function () {
        ulBox.style.transition = 'all .6s ease 0s';
        ulBox.style.webkitTransition = 'all .6s ease 0s';
    };

    var removeTransition = function () {
        ulBox.style.transition = 'none';
        ulBox.style.webkitTransition = 'none';
    };

    var tranY = function (d) {
        ulBox.style.transform = 'translateY(' + d + 'px)';
        ulBox.style.webkitTransform = 'translateY(' + d + 'px)';
    };

    var startY = 0,
        endY = 0,
        moveDist = 0,
        curY = 0,
        maxDist = 150,
        childRestH = ulBox.offsetHeight - outBox.offsetHeight,
        startT, endT;
    ulBox.addEventListener('touchstart', function (e) {
        startT = new Date().getTime();
        startY = e.touches[0].clientY;

    });

    ulBox.addEventListener('touchmove', function(e){
        endY = e.touches[0].clientY;
        moveDist = endY - startY;
        /* 限制盒子移动的范围
        * */

            /* 上--下半部移动范围 */
        var flag1 = (curY +moveDist) <= 150 && (curY +moveDist) >= -(childRestH+150);

        if (flag1){
            removeTransition();
            tranY(curY +moveDist);
        };
    });

    ulBox.addEventListener('touchend', function (e) {

        /* 上下两端移动吸附效果分析 */
        /* 在0> curY >= -childRestH范围里， 是可以自由累加的
        *
        *   向下移动时会发生的范围分析：
        *
        *       0<= curY <=150     它会移动回最上端: tranY(0)，且curY移动回原点0，moveDist移动距离必须清掉
        *       curY > 150         它也会移动回最上端: tranY(0)，且curY移动回原点0，moveDist移动距离必须清掉
        *
        *       moveDist如果不清掉，会有一种bug,点击弹起，不移动，moveDist还记录上一次移动的距离
        *
        *   向上移动发生范围分析：
        *
        *       0> curY >= -childRestH
        *           这范围不需要返回原点, 此时curY需要累加每次moveDist移动的距离
        *           期间如果只是点击不移动，在touchstart也必须清除moveDist的值，即是moveDist = 0;
        *
        *       -childRestH > curY >=  -(childRestH+150),   必须移动回最下端 tranY(-childRestH)
        *       curY >  -(childRestH+150)   必须移动回最下端 tranY(-childRestH)，
        *
        *       此时，初始会最下端 curY = -childRestH
        *
        *
        *  最后最重要的一步，每touchend一次：
        *       先累加完后：
        *       curY += moveDist;
        *
        *       必须执行清0操作:(执行这一步，其他地方就可以不用执行清0操作了)
        *
        *       moveDist = 0
        *
        *       最后一步，当设备尺寸发生变化时，重新刷新加载页面    这一步不能缺少（否则模拟器发生机型切换时，会有bug）
        *       window.onresize = function(){
        *            location.reload(true);
        *        }
        *
        *       最后一个顾虑点：
        *       touchcancel：系统停止跟踪触摸时候会触发。
        *        例如突然接到来电，打断系统跟踪触摸，这种情形尚未考虑进去，老师版的已经考虑进去，可以参考
        *
         *
        * */
        /* 在0> curY >= -childRestH范围里， 是可以自由累加的 */
        curY += moveDist;
        addTransition();
        if (curY > 0) {
            tranY(0);
            curY = 0;
        } else if (curY < -childRestH) {
            console.log('移动回去');
            tranY(-childRestH);
            curY = -childRestH;
        };
        /* 这一步很重要， curY += moveDist累加完之后，执行清0操作 */
        moveDist = 0;


        /* 左侧点击移动到指定位置分析：
        *
        *  左侧点击---移动：
        *      tap事件判断：
        *           touchstart记录点击时间， touchend记录点击结束时间
        *           如果时间少于 200ms 代表是点击事件
        *
        *      获取到点击元素给它加current,
        *
        *      获取当前点击元素，计算出它距离第一li顶部的距离:
        *
        *      如果在最大移动范围之内，说明盒子可以移动，否则，盒子则不移动
        *
        *      点击盒子在最大移动范围之内：
        *           盒子移动到当前li距离第一个li的位置
        *
        *      最大的移动范围： ul.offsetHeight - outBox.offsetHeight
        *
        *      请注意：每移动一次盒子，都需要记录它的位移位置
        *
        *      --------------------------------------------
        *
        *      点击右侧对应序号盒子淡入操作；
        *           全部元素隐藏: dispaly: none, opacity = 0
        *           当前元素显示: display: block, opacity = 1;
        * */

        /* 点击左侧分类盒子移动问题 */
        endT = new Date().getTime();

        if (endT-startT < 200) {
            var li = e.target.parentNode,
                idex = -1,
                li_space = 0;
            for (var i= 0, len=lis.length; i<len; i++) {
                lis[i].classList.remove('current');
                lis[i].index = i;
            };
            li.classList.add('current');
            idex = li.index;

            li_space = idex * liH;

            if (li_space < childRestH) {
                tranY(-li_space);
                curY = -li_space;
            } else {
                tranY(-childRestH);
                curY = -childRestH;
            };
        };
    });

};

addLoadEvent(categoryMove);

/* 1.点击目标盒子 touchstart  记录 startX = e.clientY
*  2.touchmove 记录 endY = e.cientY
*       盒子跟随鼠标移动：
*          移动距离：move = endY-startX    移动函数：tran(move);
*
*
 *       初始化：记录盒子位置：curY = 0;
*
*       当touchend时，curY += move;
*
*       上下移动最大距离：maxMove = 200;
*
*       移动范围：
   *        0 >=0 curY >= 200,
   *        200 < curY              回到起点  tran(0);
   *
   *        原始最大移动高度：
   *            initialHeight   负值
*            0> curY >= - initialHeight  移动函数：tran(curY+move);
*
*            - initialHeight > curY >= -(initialHeight + maxMove)   回到起点  tran(initialHeight);
*
   *
   *
* */
function hotCategry () {
    var outBox = document.getElementsByClassName('category-box')[0],
        maxBox = document.getElementsByClassName('category-content')[0],
        maxMoveH = outBox.offsetHeight - maxBox.offsetHeight;

    var addTransition = function () {
        outBox.style.transition = 'all .5s ease 0s';
        outBox.style.webkitTransition = 'all .5s ease 0s';
    };

    var removeTransition = function () {
        outBox.style.transition = 'none';
        outBox.style.webkitTransition = 'none';
    };

    var tran = function (d) {
        outBox.style.transform = 'translateY(' + d + 'px)';
        outBox.style.webkitTransform = 'translateY(' + d + 'px)';
    };

    var startY = 0,
        endY = 0,
        moveY = 0,
        curY = 0,
        maxMove = 150;
    outBox.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });

    outBox.addEventListener('touchmove', function (e) {
        endY = e.touches[0].clientY;
        moveY = endY - startY;

        if ((moveY + curY) <= maxMove && (moveY + curY) >= -(maxMoveH + maxMove)) {
            removeTransition();
            tran(moveY + curY);
            console.log('curY: ' + curY, 'maxMoveH: ' + maxMoveH);
        };

    });

    outBox.addEventListener('touchend', function (e) {
        curY += moveY;
        addTransition();
        if (curY > 0) {
            tran(0);
            curY = 0;
        } else if (curY < -maxMoveH) {
            tran(-maxMoveH);
            curY = -maxMoveH ;
        };
        moveY = 0;
        console.log('curY: ' + curY, 'moveY: ' + moveY);
    });

};

addLoadEvent(hotCategry);