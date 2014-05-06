(function() {
    var childMap = {};
    var id2Index = [];
    function walkChild(index, nodes, list) {
        if (!childMap[index]) {
            return;
        }
        for (var i = 0, size = childMap[index].length; i < size; i++) {
            var obj = {};
            var id = childMap[index][i];
            obj['name'] = list[id2Index[id]]['name'] || '';
            obj['value'] = list[id2Index[id]]['orgID'] || -1;
            obj['children'] = [];
            walkChild(id, obj['children'], list);
            nodes.push(obj);
        }
    }

    convertProductList2ZNodes = function(list) {
        var nodes = [];
        for (var i = 0, size = list.length; i < size; i++) {
            var item = list[i];
            var id = item['orgID'];
            var pid = item['parentID'];
            id2Index[id] = i;
            if (childMap[pid]) {
                childMap[pid].push(id);
            } else {
                childMap[pid] = [id];
            }
        }
        walkChild(0, nodes, list);
        return nodes;
    }
})();

//set button state
function setButtonState(list, selectRowCount) {
    var add = 'CommonBtn';
    var remove = 'CommonGray';
    if (!selectRowCount) {
        add = 'CommonGray';
        remove = 'CommonBtn';
    }
    for (var i = 0, len = list.length; i < len; i++) {
        $(list[i]).addClass(add);
        $(list[i]).removeClass(remove);
    }
}

var auto_suggest_options_mail = {
    script: '?m=Common&a=Util&f=SearchMailgroupAsXml&',
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: false
};

var auto_suggest_options_mail_comma = {
    script: function(data) {
        var t = data.split(encodeURIComponent(this.seperator));
        if (t[t.length - 1] == '') {
            return;
        } else {
            return '?m=Common&a=Util&f=SearchMailgroupAsXml&prefix=' + t[t.length - 1];
        }
    },
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: true,
    seperator: ';'
};

var auto_suggest_options_mail_comma2 = {
    script: function(data) {
        var t = data.split(encodeURIComponent(this.seperator));
        if (t[t.length - 1] == '') {
            return;
        } else {
            return '?m=Common&a=Util&f=SearchMailgroupAsXml&prefix=' + t[t.length - 1];
        }
    },
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: true,
    seperator: ','
};

var auto_suggest_options = {
    script: '?m=Common&a=Util&f=SearchUserAsXml&',
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: false
};

var auto_suggest_options_comma = {
    script: function(data) {
        var t = data.split(encodeURIComponent(this.seperator));
        if (t[t.length - 1] == '') {
            return;
        } else {
            return '?m=Common&a=Util&f=SearchUserAsXml&prefix=' + t[t.length - 1];
        }
    },
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: true,
    seperator: ';'
};

var auto_suggest_options_comma2 = {
    script: function(data) {
        var t = data.split(encodeURIComponent(this.seperator));
        if (t[t.length - 1] == '') {
            return;
        } else {
            return '?m=Common&a=Util&f=SearchUserAsXml&prefix=' + t[t.length - 1];
        }
    },
    varname: 'prefix',
    cache: false,
    maxentries: 10,
    isAppendComma: true,
    seperator: ','
};
var messageDivTimer;

function showLoadingMessage(msg) {
    $('#msgBoxDiv').hide();
    $('#msgItem').attr('class', 'loadingmsgItem');
    $('#msgItem').text(msg);
    $('#msgBoxDiv').fadeIn(400);
    clearTimeout(messageDivTimer);
    messageDivTimer = setTimeout(function() {
        $('.dataTable.display td.dataTables_empty').text('数据正在加载中...');
    }, 100);
}

function hideLoadingMessage() {
    if ($('#msgBoxDiv span').hasClass('loadingmsgItem')) {
        $('#msgBoxDiv').fadeOut(400);
    }
    $('.dataTable.display td.dataTables_empty').text('对不起，查询不到任何相关数据');
}

function showErrMessage(msg, id) {
    $('#msgBoxDiv').hide();
    $('#msgItem').attr('class', 'errmsgItem');
    $('#msgItem').text(msg);
    if (id != undefined && $('#' + id).length != 0 && $('#' + id).parent().hasClass('alert')) {
        $('#' + id).text('').append(msg).parent().show('fast');
    } else {
        $('#msgBoxDiv').fadeIn(400, function() {
            clearTimeout(messageDivTimer);
            messageDivTimer = setTimeout(function() {
                $('#msgBoxDiv').fadeOut(400);
            }, 7000);
        });
    }
}

function showMessage(msg, timeout) {
    $('#msgBoxDiv').hide();
    $('#msgItem').attr('class', 'msgItem');
    $('#msgItem').text(msg);
    if (timeout == undefined) {
        $('#msgBoxDiv').fadeIn(400, function() {
            clearTimeout(messageDivTimer);
            messageDivTimer = setTimeout(function() {
                $('#msgBoxDiv').fadeOut(400);
            }, 4000);
        });
    } else {
        $('#msgBoxDiv').fadeIn(400, function() {
            clearTimeout(messageDivTimer);
            messageDivTimer = setTimeout(function() {
                $('#msgBoxDiv').fadeOut(400);
            }, timeout);
        });
    }
}

function arrayToMap(Data) {
    var MapData = {};
    for (var i = 0; i < Data.length; i++) {
        MapData[Data[i].name] = Data[i].value;
    }
    return MapData;
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr != null) return unescape(arr[2]);
    return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
}

function getValueFromClassName(className) {
    className = className || '';
    var reg = /filtervalue_([^ ]+)\b/;
    var match = reg.exec(className);
    if (match) {
        return match[1];
    }
    return '';
}

(function() { //yanjinzhou@baidu.com
    var opt = {};
    opt['cache'] = true;
    opt['ajID'] = '';
    opt['delay'] = 500;
    opt['messagedelay'] = 200;
    opt['uicname'] = '?m=Common&a=Util&f=checkUserNameExist&userInput=';
    opt['mailgroup'] = '?m=Common&a=Util&f=checkMailGroupNameExist&userInput=';
    opt['organization'] = '?m=Common&a=Util&f=checkOrganizationNameExist&userInput=';
    opt['datagroup'] = '?m=Common&a=Util&f=checkDataGroupNameExist&userInput=';
    opt['rolename'] = '?m=Common&a=Util&f=checkRoleNameExist&userInput=';
    var NameCache = {};
    NameCache['uicname'] = {};
    NameCache['mailgroup'] = {};
    NameCache['organization'] = {};
    NameCache['datagroup'] = {};
    NameCache['rolename'] = {};
    var message = {
        'uicname': '用户名',
        'mailgroup': '百度邮件'
    };

    /**
     * 按bool标志输出错误信息,当元素value为空，但是又不是判断为空的case则跳过
     * n:input或textarea元素、
     * id: 错误信息的className
     * b:输出标志
     * m：错误信息
     * */
    showCheckMessage = function(n, id, b, m) {
        var input = $.trim($(n).attr('value'));
        //如果输入是空，而又不是是否判断为空的case，则跳过
        if (input == '' && id != 'cNotNullMessage') {
            clearTimeout(opt['ajID']);
            $(n).siblings('.' + id).remove();
            if ($(n).hasClass('cNotNull')) {} else {
                $(n).closest('.control-group').removeClass('error');
            }
            return true;
        }
        if (b) {
            clearTimeout(opt['ajID']);
            $(n).siblings('.' + id).remove();
            $(n).closest('.control-group').removeClass('error');
            return true;
        } else {
            $(n).siblings('.' + id).remove();
            $(n).after($('<span class="checkerrmsgItem ' + id + '">' + m + '</span>'));
            $(n).closest('.control-group').addClass('error');
            return false;
        }
    }

    /**
     * 使用正则表达式验证
     * n:input或textarea元素、
     * id: 错误信息的className
     * r:正则表达式
     * m：错误信息
     * */
    regExpCheck = function(n, id, r, m) {
        var input = $(n).attr('value');
        var patten = new RegExp(r);
        return showCheckMessage(n, id, patten.test(input), m);
    }

    /**
     * 使用正则表达式验证,将正则结果取反
     * n:input或textarea元素、
     * id: 错误信息的className
     * r:正则表达式
     * m：错误信息
     * */
    regExpCheckReverse = function(n, id, r, m) {
        var input = $(n).attr('value');
        var patten = new RegExp(r);
        return showCheckMessage(n, id, !patten.test(input), m);
    }

    function ajaxEnsureNameNotExist(n, id, input, type, sync) {
        if (opt['cache'] && typeof NameCache[type][input] != 'undefined') {
            //命中cache cache生命周期：当前页面 
            return showCheckMessage(n, id, NameCache[type][input], type + ':' + input + '不存在');
        } else {
            //开始ajax请求
            clearTimeout(opt['ajID']);
            opt['ajID'] = setTimeout(function() {
                $.getJSON(opt[type] + input, function(ret) {
                    NameCache[type][input] = showCheckMessage(n, id, ret['status'], ret['message']);
                });
            }, opt['delay']);
            return true;
        }
    }

    function ajaxEnsureNameExist(n, id, input, type, sync) {
        if (opt['cache'] && typeof NameCache[type][input] != 'undefined') {
            //命中cache cache生命周期：当前页面 
            return showCheckMessage(n, id, NameCache[type][input], message[type] + ':' + input + '不存在');
        } else {
            //开始ajax请求
            if (sync) {
                $.ajaxSetup({
                    async: false
                });
                $.getJSON(opt[type] + input, function(ret) {
                    NameCache[type][input] = showCheckMessage(n, id, ret['status'], ret['message']);
                });
                $.ajaxSetup({
                    async: true
                });
                if (typeof NameCache[type][input] == 'undefined') {
                    return true;
                } else {
                    return NameCache[type][input];
                }
            } else {
                clearTimeout(opt['ajID']);
                opt['ajID'] = setTimeout(function() {
                    $.getJSON(opt[type] + input, function(ret) {
                        NameCache[type][input] = showCheckMessage(n, id, ret['status'], ret['message']);
                    });
                }, opt['delay']);
                return true;
            }
        }
    }

    function ajaxEnsureNameListExist(n, id, input, type, sync) {
        var names = input.split(/[;,]/);
        var nameMap = {}; //判断是否重复
        for (var i = 0; i < names.length; i++) {
            var name = $.trim(names[i]);
            if (name == '') {
                continue;
            }
            if (typeof nameMap[name] != 'undefined') {
                //有重复的 
                ret = showCheckMessage(n, 'cAjax' + type + 'ListMessage', false, message[type] + name + '重复');
            } else {
                ret = nameMap[name] = ajaxEnsureNameExist(n, 'cAjax' + type + 'ListMessage', name, type, sync);
            }
            //检测到错误直接return 避免被提示消息被覆盖
            if (!ret) {
                return ret;
            }
        }
        return ret;
    }

    //调用方式：realtimeVerifyForm($("#表单id",[option]));
    realtimeVerifyForm = function(Form, options) {
        if (typeof options == 'object') {
            opt = options;
        }
        $(Form).find('.cNotNull').live('keyup focusout', checkNotNull);
        $(Form).find('.cPlainName').live('keyup focusout', checkPlainName);
        $(Form).find('.cPlainNameForSearch').live('keyup focusout', checkPlainNameForSearch);
        $(Form).find('.cOneName').live('keyup focus focusout', checkOneName);
        $(Form).find('.cNameList').live('keyup focus', checkNameList);
        $(Form).find('.cMailGroup').live('keyup focus', checkMailGroup);
        $(Form).find('.cMailGroupList').live('keyup focus', checkMailGroupList);
        $(Form).find('.cDate').live('keyup focusout', checkDate);
        $(Form).find('.cNumber').live('keyup focusout', checkNumber);
        $(Form).find('.cfNumber').live('keyup focusout', checkNumberFloat);
        $(Form).find('.cMaxLength200').live('keyup focusout', 200, checkMaxLength);
        $(Form).find('.cMaxLength2000').live('keyup focusout', 2000, checkMaxLength);
        $(Form).find('.cMaxLength5000').live('keyup focusout', 5000, checkMaxLength);
    }

    //调用方式：preSubmitVerifyForm($("#表单id"));
    preSubmitVerifyForm = function(Form) {
        var ret = true;
        $.each($(Form).find('.cNotNull'), function(i, n) {
            var flag = checkNotNull(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cPlainName'), function(i, n) {
            var flag = checkPlainName(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cPlainNameForSearch'), function(i, n) {
            var flag = checkPlainNameForSearch(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cOneName'), function(i, n) {
            var flag = checkOneName(n, true);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cNameList'), function(i, n) {
            var flag = checkNameList(n, true);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cMailGroup'), function(i, n) {
            var flag = checkMailGroup(n, true);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cMailGroupList'), function(i, n) {
            var flag = checkMailGroupList(n, true);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cDate'), function(i, n) {
            var flag = checkDate(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cNumber'), function(i, n) {
            var flag = checkNumber(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cfNumber'), function(i, n) {
            var flag = checkNumberFloat(n);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cMaxLength200'), function(i, n) {
            var flag = checkMaxLength(n, 200);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cMaxLength2000'), function(i, n) {
            var flag = checkMaxLength(n, 2000);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        $.each($(Form).find('.cMaxLength5000'), function(i, n) {
            var flag = checkMaxLength(n, 5000);
            if (typeof flag != 'undefined' && flag == false) {
                ret = false;
            }
        });
        if (ret == false) {
            showErrMessage('表单输入有误,详见输入框提示');
        }
        return ret;
    }

    //事件动作:检查表单
    //return: true/false[bool]
    function checkNotNull(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        return regExpCheckReverse(n, 'cNotNullMessage', '^\\s*$', '输入不能为空');
    }

    function checkPlainName(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        return regExpCheck(n, 'cPlainNameMessage', '^[A-Za-z]{1,10}[A-Za-z0-9_.-]{0,70}$', '需要英文字母开头，不要超过80个字符,中间不能有非法字符（包括空格）');
    }

    function checkPlainNameForSearch(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        return regExpCheck(n, 'cPlainNameForSearchMessage', '^[A-Za-z0-9_.-]{0,50}$', '不要超过50个字符,中间不能有非法字符（包括空格）');
    }

    function checkOneName(e, sync) {
        var n = typeof e.target == 'undefined' ? e: this;
        var ret = regExpCheck(n, 'cOneNameMessage', '^[a-z_.-]{1,16}[a-z0-9_.-]{0,10}$', '用户名输入不正确');
        var input = $.trim($(n).attr('value'));
        //如果正则匹配失败，则不再请求后台验证,判断是否是因为input为空而强制true
        if (!ret || input == '') {
            if (input == '') { //去掉之前的message
                showCheckMessage(n, 'cAjaxuicnameMessage', true, 'messageNotShow');
            }
            return ret;
        }
        return ajaxEnsureNameExist(n, 'cAjaxuicnameMessage', input, 'uicname', sync);
    }

    function checkNameList(e, sync) {
        var n = typeof e.target == 'undefined' ? e: this;
        var ret = regExpCheck(n, 'cNameListMessage', '^[;,]*[a-z_.-]{1,16}[a-z0-9_.-]{0,10}([;,]+[a-z_.-]{1,16}[a-z0-9_.-]{0,10})*[;,]*$', '用户名输入不正确');
        var input = $.trim($(n).attr('value'));
        //如果正则匹配失败，则不再请求后台验证,判断是否是因为input为空而强制true
        if (!ret || input == '') {
            if (input == '') { //去掉之前的message
                showCheckMessage(n, 'cAjaxuicnameListMessage', true, 'messageNotShow');
            }
            return ret;
        }
        return ajaxEnsureNameListExist(n, 'cAjaxuicnameListMessage', input, 'uicname', sync);
    }

    function checkMailGroup(e, sync) {
        var n = typeof e.target == 'undefined' ? e: this;
        var ret = regExpCheck(n, 'cMailGroupMessage', '^[A-Za-z0-9_.-]{1,32}@([A-Za-z0-9_-]{2,8}.){0,1}baidu.com$', '百度邮件组输入不正确');
        var input = $.trim($(n).attr('value'));
        //如果正则匹配失败，则不再请求后台验证,判断是否是因为input为空而强制true
        if (!ret || input == '') {
            if (input == '') { //去掉之前的message
                showCheckMessage(n, 'cAjaxmailgroupMessage', true, 'messageNotShow');
            }
            return ret;
        }
        return ajaxEnsureNameExist(n, 'cAjaxmailgroupMessage', input, 'mailgroup', sync);
    }

    function checkMailGroupList(e, sync) {
        var n = typeof e.target == 'undefined' ? e: this;
        var ret = regExpCheck(n, 'cMailGroupListMessage', '^[;,]*[A-Za-z0-9_.-]{1,32}@([A-Za-z0-9_-]{2,8}.){0,1}baidu.com([;,]+[A-Za-z0-9_.-]{1,32}@([A-Za-z0-9_-]{2,8}.){0,1}baidu.com)*[;,]*$', '百度邮件组名输入不正确');
        var input = $.trim($(n).attr('value'));
        //如果正则匹配失败，则不再请求后台验证,判断是否是因为input为空而强制true
        if (!ret || input == '') {
            if (input == '') { //去掉之前的message
                showCheckMessage(n, 'cAjaxmailgroupListMessage', true, 'messageNotShow');
            }
            return ret;
        }
        return ajaxEnsureNameListExist(n, 'cAjaxmailgroupListMessage', input, 'mailgroup', sync);
    }

    function checkDate(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        var input = $.trim($(n).attr('value'));
        input = input.replace(/^(\d{4})[\\\/ \.]?(\d{2})[\\\/ \.]?(\d{2})$/, '$1-$2-$3');
        $(n).attr('value', input);
        var ret = regExpCheck(n, 'cDateMessage', '^[0-9]{4}-[0-9]{2}-[0-9]{2}$', '日期输入范围：19900101-20301231');
        //如果正则匹配失败，则不再请求后台验证,判断是否是因为input为空而强制true
        if (!ret || input == '') {
            return ret;
        }
        var year = input.replace(/^(\d{4})-\d{2}-\d{2}$/, '$1');
        var month = input.replace(/^\d{4}-(\d{2})-\d{2}$/, '$1');
        var day = input.replace(/^\d{4}-\d{2}-(\d{2})$/, '$1');
        if (year > 2030 || year < 1970 || month > 12 || month < 1 || day > 31 || day < 1) {
            return showCheckMessage(n, 'cOutRangeDateMessage', false, '日期输入范围：19900101-20301231');
        } else {
            return true;
        }
    }

    function checkNumber(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        return regExpCheck(n, 'cDateMessage', '^[0-9]{0,65}$', '输入必须是数字');
    }

    function checkNumberFloat(e) {
        var n = typeof e.target == 'undefined' ? e: this;
        return regExpCheck(n, 'cDateMessage', '^[0-9]+\.?[0-9]+$', '输入必须是数字，支持小数');
    }

    function checkMaxLength(e, length) {
        var n = typeof e.target == 'undefined' ? e: this;
        var len = typeof length == 'undefined' ? e.data: length;
        return showCheckMessage(n, 'cMaxLength' + len + 'Message', $(n).attr('value').length < len, '输入不能超过' + len + '个字符');
    }
})();

//获得浏览器侧边栏滚动条的偏移量 返回{X:num,Y:num}
GetPageScroll = function() {
    var x, y;
    if (window.pageYOffset) {
        // all except IE    
        y = window.pageYOffset;
        x = window.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        // IE 6 Strict    
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
    } else if (document.body) {
        // all other IE    
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
    }
    return {
        X: x,
        Y: y
    };
};

//绑定resize dragger and 元素，还有callback,待完善支持泛用，木有时间
(function() {
    var y;
    var Ym;
    var _el;
    var _targets;
    var _option;
    var _onChange;
    bindResize = function(el, targets, option, onChange) {
        _el = el;
        _option = option;
        _onChange = onChange;
        _targets = targets;
        y = Ym = 0;
        $(_el).mousedown(function(e) {
            y = e.clientY - targets[0].offsetHeight;
            //if支持 setCapture
            _el.setCapture ? (
            //捕捉焦点
            _el.setCapture(),
            //设置事件
            _el.onmousemove = function(ev) {
                mouseMove(ev || event)
            },
            _el.onmouseup = mouseUp) : (
            //绑定事件
            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp))
            //防止默认事件发生
            e.preventDefault()
        });
        //移动事件
        function mouseMove(e) {
            Ym = e.clientY - y;
            typeof _option.minH != 'undefined' && Ym <= _option.minH && (Ym = _option.minH);
            typeof _option.maxH != 'undefined' && Ym >= _option.maxH && (Ym = _option.maxH);
            $.each(_targets, function(i, n) {
                n.style.height = Ym + 'px';
            });
            _onChange();
        }
        //停止事件
        function mouseUp() {
            _el.releaseCapture ? (_el.releaseCapture(), _el.onmousemove = _el.onmouseup = null) : ($(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp));
        }
    };
})();

stopBubble = function(e) {
    if (window.event) {
        window.event.cancelBubble = true;
    } else {
        e.stopPropagation();
    }
}

mySyncPost = function(action, values) {
    var id = Math.random();
    document.write('<form id="post' + id + '" name="post' + id + '" action="' + action + '" method="post">');
    for (var key in values) {
        document.write('<input type="hidden" name="' + key + '" value="' + values[key] + '" />');
    }
    document.write('</form>');
    document.getElementById('post' + id).submit();
};