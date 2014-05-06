/**
* 系统js，不可与具体系统依赖 
* @author wangshouchuang@baidu.com
**/

/**
 * 用于创建类
 */
var Class = {

    /**
     * 所创建的类必须有initialize方法，否则构造函数异常
     * @return function object
     */
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        };
    }

};

/**
 * 添加extend方法，实现继承
 * @param {Object} 可看作子类
 * @param {Object} 可看作父类
 * @return {Object} 实现继承后的子类
 */
Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
};

/**
 * 绑定函数执行上下文（替换函数默认的this对象）
 * @param {Object} 目标执行环境
 * @return {function} 执行时会在目标环境下执行
 */
Function.prototype.bind = function(context) {
    var args = Array.from(arguments);
    args.shift();

    var __method = this;
    return function() {
        return __method.apply(context, args.concat(Array.from(arguments)));
    }
};

/**
 * 转化为数组
 * @param {Object} 可迭代的类型
 * @return {Array} 总会返回数组
 */
Array.from = function(iterable) {
    if (!iterable) { 
        return [];
    }
    if (iterable.toArray) {
        return iterable.toArray();
    } else {
        var results = [];
        for (var i = 0, length = iterable.length; i < length; i++) {
            results.push(iterable[i]);
        }
        return results;
    }
};

/**
 * 查找第1个在数组中匹配元素的数组
 * @param {array} 待查找的数据
 * @param {object} 要匹配的元素
 * @param {int} 元素在数组中的索引位置，不存在返回-1
 * @desc 非严格相等，非===
 */
arrayIndexOf = function(input, item) {
   if (!input) {
       return -1;
   }

   for (var i = 0, len = input.length; i < len; i++) {
       if (input[i] == item) {
           return i;
       }
   }

   return -1;
};

/**
 * 查找元素在数组中的索引
 * @param {array} 待查找的数据
 * @param {function(item)} 要匹配的元素
 * @param {int} 元素在数组中的索引位置，不存在返回-1
 */
arrayIndexOfCallback = function(input, callback) {
    if (!input) {
        return -1;
    }

   for (var i = 0, len = input.length; i < len; i++) {
       if (callback(input[i]) === true) {
           return i;
       }
   }

   return -1;
};

/**
 * 时间字符串转为时间类型
 * @param {string} 时间字符串（格式yyyy-MM-dd hh:mm:ss)
 * @return {Date}
 */
function stringToDatetime(datetimeString) {
    if (!datetimeString) {
        return null;
    }

    var arr = datetimeString.split(/\D/);
    var datetime = new Date();

    if (arr.length > 0) {
        datetime.setYear(parseInt(arr[0], 10));
    }

    if (arr.length > 1) {
        datetime.setMonth(parseInt(arr[1], 10) - 1);
    }

    if (arr.length > 2) {
        datetime.setDate(parseInt(arr[2], 10));
    }

    if (arr.length > 3) {
        datetime.setMinutes(parseInt(arr[3], 10));
    }

    if (arr.length > 4) {
        datetime.setMinutes(parseInt(arr[4], 10));
    }

    if (arr.length > 5) {
        datetime.setSeconds(parseInt(arr[5], 10));
    }

    return datetime;
}

/**
 * 格式化日期
 * @param {Date} 需要格式化的时间, 默认当前时间
 * @param {string} 格式化字符串, 默认yyyy-MM-dd hh:mm:ss
 * @return {string} 格式化后的时间字符串
 * @desc formatString默认格式：
 */
function datetimeFormat(datetime, formatString) {
    // 默认值
    datetime = datetime || new Date();
    formatString = formatString || 'yyyy-MM-dd hh:mm:ss';
    
    // 从当前时间提取时间各个部分
    var year = datetime.getFullYear(),
        month = datetime.getMonth() + 1,
        day = datetime.getDate(),
        hour = datetime.getHours(),
        min = datetime.getMinutes(),
        sec = datetime.getSeconds(),
        s = formatString;
    
    // 判断并格式化年份
    if (/yyyy/.test(s)) {
        s = s.replace(/yyyy/, year);
    } else if (/yy/.test(s)) {
        s = s.replace(/yy/, year.toString().substring(2));
    }
    
    // 判断格式化月份
    if (/MM/.test(s)) {
        s = s.replace(/MM/, month < 10 ? '0' + month : month);
    } else if (/M/.test(s)) {
        s = s.replace(/M/, month);
    }

    // 判断并格式化日期
    if (/dd/.test(s)) {
        s = s.replace(/dd/, day < 10 ? '0' + day : day);
    } else if (/d/.test(s)) {
        s = s.replace(/d/, day);
    }

    // 判断并格式化小时
    if (/hh/.test(s)) {
        s = s.replace(/hh/, hour < 10 ? '0' + hour : hour);
    } else if (/h/.test(s)) {
        s = s.replace(/h/, hour);
    }

    // 判断并格式化分钟
    if (/mm/.test(s)) {
        s = s.replace(/mm/, min < 10 ? '0' + min : min);
    } else if (/m/.test(s)) {
        s = s.replace(/m/, min);
    }

    // 判断并格式化秒数
    if (/ss/.test(s)) {
        s = s.replace(/ss/, sec < 10 ? '0' + sec : sec);
    } else if (/s/.test(s)) {
        s = s.replace(/s/, sec);
    }
    
    return s;
}

/**
 * 获取时间
 * @param {string} 格式化字符串, 默认yyyy-MM-dd hh:mm:ss
 * @param {object} 针对当前时间的修改
 * @param 一定格式化的时间字符串
 */
function getDatetime(formatString, option) {
    var defaultOption = {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    };
    var setting = Object.extend(defaultOption, option);

    var datetime = new Date();
    var year = datetime.getFullYear(),
        month = datetime.getMonth(),
        day = datetime.getDate(),
        hour = datetime.getHours(),
        min = datetime.getMinutes(),
        sec = datetime.getSeconds();

    datetime.setFullYear(year + setting.year);
    datetime.setMonth(month + setting.month);
    datetime.setDate(day + setting.day);
    datetime.setHours(hour + setting.hour);
    datetime.setMinutes(min + setting.minute);
    datetime.setSeconds(sec + setting.second);

    return datetimeFormat(datetime, formatString);
}

// 时间格式化(2013-03-01)
Date.prototype.toCnString = function(){
   var format = "yyyy-mm-dd";  

   format = format.replace("yyyy",this.getFullYear());

   var month = this.getMonth() + 1;
   format = format.replace("mm", month >= 10 ? month: "0" + month);

   var day = this.getDate();
   format = format.replace("dd", day >= 10 ? day: "0" + day);
   
   return format;
};


// 触发的当前元素
function isThis(e,target){
    e = e || window.event;
    if(e.type == "mouseover"){
       var fromEle = e.relatedTarget || e.fromElement;
       return !containNode(target,fromEle);
    }
   
    if(e.type == "mouseout"){
       var toEle = e.relatedTarget || e.toElement;
       return !containNode(target,toEle);
    }

}

 // 节点包含关系
 function containNode(parentNode,childNode){
   try{
      if(parentNode.contains){
         return parentNode !== childNode && parentNode.contains(childNode);
      }else{
         return !!(parentNode.compareDocumentPosition(childNode) & 16);
      }
   }catch(e){}
 }

$(function() {
    if ($('#sideBar').html() == null) {
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
            + '</div>');

        $('#helpcontent').html($('.breadcrumb span.tip-desc').attr('title'));
        
        $('#sideBarTab').bind('click', function() {
            extendContract();
        });

        var isExtended = 0;

        function extendContract() {
            if (isExtended == 0) {
                $('#sideBar').animate({width: '278px',height: '450px'}, 300);
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
    }
});

