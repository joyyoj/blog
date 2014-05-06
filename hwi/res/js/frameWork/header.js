/*
 * "header.js": biglog header naviagator
 */

/*
 * Function: currentNav;
 * Description: Active current navigator item style;
 * @param:{};
 * @return:{};
 */
var currentNav = function() {
    var moduleIndexStart = location.search.indexOf('m=') + 2,
        moduleIndexEnd = location.search.indexOf('&a=') - 3,
        pageIndexStart = location.search.indexOf('&a=') + 3,
        moduleCategory = location.search.substr(moduleIndexStart, moduleIndexEnd),
        pageStrTemp = location.search.substr(pageIndexStart),
        pageCategory = pageStrTemp.substr(0, pageStrTemp.indexOf('&'));

    switch(moduleCategory) {
    case 'StaticReport':
        $('ul.nav li.menutab').eq(0).addClass('active');
        break;
    case 'Data':
        var soureceFlag = location.search.indexOf('source=');
        if (soureceFlag != -1) {
            var eventFlag = location.search.indexOf('source=Event');
            if (eventFlag != -1) {
                $('ul.nav li.menutab').eq(1).addClass('active');
            }
            var materializeviewFlag = location.search.indexOf('source=materializeview');
            if (materializeviewFlag != -1) {
                $('ul.nav li.menutab').eq(1).addClass('active');
            }
            var logFlag = location.search.indexOf('source=Log');
            if (logFlag != -1) {
                $('ul.nav li.menutab').eq(3).addClass('active');
            }

        } else {
            if (pageCategory == 'Statistic') {
                $('ul.nav li.menutab').eq(4).addClass('active');
            } else {
                var dataType = location.search.substr(-1);
                if (dataType == 1) {
                    $('ul.nav li.menutab').eq(3).addClass('active');
                } else {
                    $('ul.nav li.menutab').eq(1).addClass('active');
                }
            }
        }
        break;
    case 'Job':
        var typeFlag = location.search.indexOf('type=');
        if (typeFlag != -1) {
            var etlFlag = location.search.indexOf('type=etl');
            if (etlFlag != -1) {
                $('ul.nav li.menutab').eq(2).addClass('active');
            }
            var uetlFlag = location.search.indexOf('type=uetl');
            if (uetlFlag != -1) {
                $('ul.nav li.menutab').eq(3).addClass('active');
            }
        } else {
            $('ul.nav li.menutab').eq(2).addClass('active');
        }
        break;
    case 'Task':
        if (pageCategory == 'Deal') {
            $('ul.nav li.menutab').eq(4).addClass('active');
        } else {
            $('ul.nav li.menutab').eq(3).addClass('active');
        }
        break;
    case 'Platform':
        $('ul.nav li.menutab').eq(4).addClass('active');
        break;
    case 'Queue':
        $('ul.nav li.menutab').eq(4).addClass('active');
        break;
    case 'Role':
        $('ul.nav li.menutab').eq(5).addClass('active');
        break;
    case 'WorkflowProcess':
        var itemFlag = $('ul.nav li.menutab').eq(5).attr('flag');
        if (itemFlag == 'menuNewMsg') {
            var menuTabFlag6 = location.search.indexOf('menuTab=6');
            if (menuTabFlag6 != -1) {
                $('ul.nav li.menutab').eq(5).addClass('active');
            }
            var menuTabFlag7 = location.search.indexOf('menuTab=7');
            if (menuTabFlag7 != -1) {
                $('ul.nav li.menutab').eq(6).addClass('active');
            }
        } else {
            $('ul.nav li.menutab').eq(5).addClass('active');
        }
        break;
    }
};

/*
 * Function: addIframe;
 * Description: Add a iframe
 * @parame: {string} The url for iframe;
 */
var addIframe = function(url) {
    var flag = false;
    var errorHtml = function() {
        if (!flag) {
            window.location.href = '/error.html';
        }
    };
    $.ajax({
        url: url,
        dataType: 'jsonp',
        statusCode: {
            200: function() {
                var header = $('#navBar');
                $('body').append(header).append('<div class="main-container"><div class="place-holder" id="place-holder"></div></div>');
                $('#place-holder').append('<iframe frameborder="0" id="mainframe" name="mainframe" scrolling="auto" src=""></iframe>');
                $('#mainframe').attr('src',url);
                $('#mainframe contentDocument').ready(function(){
                    $('body').css({'height': $(this).height()});
                });
                flag = true;
            }
        }
    });
    window.setTimeout(errorHtml, 5000);
};

/*
 * Function: markVersionForCssFile;
 * Description: Load css files add version param;
 * @parame: {string} The version for reload explorer with css files cache;
 */
var markVersionForCssFile = function(version) {
    var cssLinks = $('link');
    for (var i = 0; i < cssLinks.length; i++) {
        var src = $(cssLinks[i]).attr('href');
        if (src != undefined) {
            $(cssLinks[i]).attr('href', src + '?ver=' + version);
        }
    }
};

/*
 * Function: markVersionForJsFile
 * Description: Load js files add version param;
 * @parame: {string} The version for reload explorer with js files cache;
 */
var markVersionForJsFile = function(version) {
    var jsLinks = $('script');
    for (var i = 0; i < jsLinks.length; i++) {
        var src = $(jsLinks[i]).attr('src');
        if (src != undefined) {
            $(jsLinks[i]).attr('src', src + '?ver=' + version);
        }
    }
};


/*
 * page loading area
 */
$(document).ready(function() {
    // 载入当前菜单激活样式
    currentNav();

    // IE6兼容
    if ($.browser.msie&&parseInt($.browser.version, 10) === 6) {
        $('.row div[class^="span"]:last-child').addClass('last-child');
        $('[class*="span"]').addClass('margin-left-20');
        $('[class*="span"][class*="offset"]').removeClass('margin-left-20');
        $(':button[class="btn"], :reset[class="btn"], :submit[class="btn"], input[type="button"]').addClass('button-reset');
        $(':checkbox').addClass('input-checkbox');
        $('[class^="icon-"], [class*=" icon-"]').addClass("icon-sprite");
        $('.pagination li:first-child a').addClass('pagination-first-child');
    }

    // 当前莱单激活样式
    $('.navbar .nav > li').click(function() {
        $(this).closest('.nav-collapse').find('.nav>li').removeClass('active');
        $(this).addClass('active');
    });

    // 弹出当前子菜单
    $('.dropdown-toggle').dropdownHover({'delay': 100, 'instantlyCloseOthers': true});

    // 导航子莱单弹出
    $('#navBar .dropdown-toggle').click(function(e) {
        if (window.event) {
            window.event.cancelBubble = true;
        } else {
            e.stopPropagation();
        }
    });

    // 理员账号管理
    if (DTAdmin) {
        $('#addDTAdminBtn').click(function() {
            $('#addDTAdmin').modal('show');
        });
        $('#submitAddDTAdmin').click(function() {
            $.post('?m=Role&a=Permission&f=add_dt_admin&' + $('#addDTAdmin').find('input').serialize(), function(ret) {
                if (ret.status == 'success') {
                    showMessage('添加成功');
                } else {
                    showErrMessage(ret.message);
                }
            }, 'json');
            $('#addDTAdmin').modal('hide');
        });
    }

    // 用户帮助
    $('body').append('<div id="sideBar">'
        + '<a href="#" id="sideBarTab"><img src="res/img/slide-button.jpg"'
        + 'alt="sideBar" title="sideBar" /></a>'
        + '<div id="sideBarContents" style="width: 0px;">'
        + '<div id="sideBarContentsInner">'
        + '<div id="helpcontent"></div>'
        + '<p>biglog用户交流群：1405287</p>'
        + '<p>Wiki帮助文档：'
        + '<a href="http://wiki.babel.baidu.com/twiki/bin/view/Com/Inf/BiglogManual" target="_blank">点我</a>'
        + '</p>'
        + '</div>'
        + '</div>'
        + '</div>'
    );

    $('#helpcontent').html($('.breadcrumb span.tip-desc').attr('title'));

    $('#sideBarTab').bind('click', function() {
        extendContract();
    });

    var isExtended = 0;

    function extendContract() {
        if (isExtended == 0) {
            $('#sideBar').animate({width: '278px', height: '450px'}, 300);
            $('#sideBarContents').animate({width: '250px'}, 300);
            isExtended = 1;
            $('#sideBarTab img').attr('src', 'res/img/slide-button-active.jpg');
        } else {
            $('#sideBar').animate({width: '28px',height: '137px'}, 300);
            $('#sideBarContents').animate({width: '0'}, 300);
            isExtended = 0;
            $('#sideBarTab img').attr('src', 'res/img/slide-button.jpg');
        }
    }

    $.ajax({
        type: 'GET',
        url: '?m=Common&a=Util&f=getUserInfoAjax&msgcount=1&yesterdaycost=1',
        dataType: 'json',
        success: function(data) {
            var msgCount = data['msgcount'];
            $('#menuNewMsg .badge-warning').html(msgCount);
            if (parseInt(msgCount)) {
                $('#menuNewMsg').show();
            } else {
                $('#menuNewMsg').hide();
            }
            var yesterdayCost = data['yesterdaycost'];
            if (yesterdayCost) {
                $('#menuYesterdayCost span').text(yesterdayCost);
            }
            $('#menuYesterdayCost').show();
        },
        error: function() {
            showErrMessage('获取昨日消费以及工作流信息出错！');
        }
    });
});
