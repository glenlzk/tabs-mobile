/**
 * Created by lenovo on 2016/9/10.
 */
 
var addLoadEvent = function (func) {
    var oldEvent = window.onload;

    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldEvent();
            func();
        };
    };
};

window.onresize = function () {
    location.reload(true);
};


/* tap事件封装 */
var tap = function (elem, callback) {
    var startT,
        endT;
    elem.addEventListener('touchstart', function () {
        startT = new Date().getTime();
    });
    elem.addEventListener('touchend', function () {
        endT = new Date().getTime();
        if (endT - startT < 200) {
            callback && callback(this);
        };
    });
};

var prompt = document.getElementsByClassName('popup')[0],
    promptH = prompt.offsetHeight,
    mask = document.getElementsByClassName('mask')[0],
    promptW = prompt.offsetWidth;

prompt.style.marginTop = -promptH/2 + 'px';
prompt.style.marginLeft  = -promptW/2 + 'px';


var checkB = function () {
    var checkBoxs = document.getElementsByClassName('icon_checkbox');

    for (var i= 0, len=checkBoxs.length; i<len; i++) {
        tap(checkBoxs[i], function (elem) {
            var attr = elem.getAttribute('checked');
            if (attr !== null) {
                elem.removeAttribute('checked')
            } else {
                elem.setAttribute('checked', '');
            };
        });
    };
};

addLoadEvent(checkB);

var gaiMao,
    mouseScroll = false;
/* 禁止页面滑动 */
mask.addEventListener('touchmove', function (e) {
    e.stopPropagation();
    e.preventDefault();
});

/* 禁止滚轮事件 */
document.onmousewheel = function(e) {
    if (mouseScroll) {
        e.preventDefault();
        e.stopPropagation();
    };
};

var popUp = function () {
    var deleBtn = document.getElementsByClassName('del');
        mask.style.display = 'none';

    for (var i= 0, len=deleBtn.length; i<len; i++) {
        tap(deleBtn[i], function (elem) {
            gaiMao = elem;
            mask.style.display = 'block';
            mouseScroll = true;
            mask.children[0].classList.add('jumpout');
            elem.children[0].classList.add('fangai');
        });
    };
};

addLoadEvent(popUp);

var cancelPop = function () {
    var cancelPop = document.getElementsByClassName('cancelPop')[0];
    tap(cancelPop, function (elem) {
        mask.children[0].classList.remove('jumpout');
        mask.style.display = 'none';
        mouseScroll = false;
        gaiMao.children[0].classList.remove('fangai');
    });
};


addLoadEvent(cancelPop);
