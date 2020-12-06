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
        lis = ulBox.children;


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
        childRestH = ulBox.offsetHeight - outBox.offsetHeight;
        console.log(ulBox.offsetHeight, outBox.offsetHeight, childRestH);
    ulBox.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
        console.log('startY:' + startY);

    });

    ulBox.addEventListener('touchmove', function(e){
        endY = e.touches[0].clientY;
        moveDist = endY - startY;
        /* 限制盒子移动的范围
        * */

            /* 上半部移动范围 */
        var flag1 = (curY +moveDist) <= 150 && (curY +moveDist) >= 0,
            /* 下半部移动范围 */
            flag2 = (curY +moveDist) >= -(childRestH+150) && (curY +moveDist) <= 0;

        if (flag1 || flag2) {
            console.log(flag2);
            removeTransition();
            tranY(curY +moveDist);
        };
    });

    ulBox.addEventListener('touchend', function (e) {
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
        console.log(-childRestH,'end curY: ' + curY , 'moveDist: ' + moveDist);
    });

};


addLoadEvent(categoryMove);