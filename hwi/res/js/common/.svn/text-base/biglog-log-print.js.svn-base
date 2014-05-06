/***********************************************
 * 日志打印类 
 * @author wangshouchuang@baidu.com 
 * @desc 使用方法：
 * 1. 在所有页面引入此js文件即可
 * 2. 如果您统计具体action处如下（统计QEWI的查询）：
 *    var actionName = 'qewi_query';
 *    biglogLogPrint.setActionName(actionName);
 *    biglogLogPrint.send();
 ***********************************************/

try {
    (function() {

        // 日志统计类，构造函数
        window.BiglogLogPrint = function() {
            var cookiePairs = this.analyseCookies();

            // 日志信息 
            this.logInfo = {
                baiduid: cookiePairs['baiduid'] || '',
                bduss: cookiePairs['BDUSS'] || '',
                url: document.location.href || '',
                user_agent: navigator.userAgent || '',
                referrer: document.referrer || '',
                cookie: document.cookie || '',
                action_name: '' 
            };

            this.printUrl = '/?m=pb-log-print&';
        };

        /**
         * 发送统计信息
         * @desc 利用img的src属性发送统计信息
         */
        window.BiglogLogPrint.prototype.send = function() {
            var imgDom = document.createElement('img');
            imgDom.style.display = "none";
            var paramString = this.buildParamString(this.logInfo);
            imgDom.src = this.printUrl + this.buildParamString(this.logInfo);
            document.body.appendChild(imgDom);
        };

        /**
         * 设置具体action名称
         * @param {string} 具体action名称
         * @desc 要为具体action打印日志时设置
         */
        window.BiglogLogPrint.prototype.setActionName = function(actionName) {
            this.logInfo['action_name'] = actionName;
        };

        /**
         * 构建url参数
         * @param {object} 日志信息，this.logInfo变量成员
         * @return {string} key=value&key1=value2格式字符串，key和value都经过编码
         */
        window.BiglogLogPrint.prototype.buildParamString = function(logInfo) {
            var params = [];
            for (var key in logInfo) {
                if (key){
                    params.push(encodeURIComponent(key) + '=' 
                        + encodeURIComponent(logInfo[key]));
                }
            }

            // 给图片价格随机时间戳避免缓存
            params.push('img_random_version=' + (new Date()).getTime());

            return params.join('&');
        };

        /**
         * 分析Cookies值
         * @return {Object} Cookies键值对
         */
        window.BiglogLogPrint.prototype.analyseCookies = function() {
            var cookieString = document.cookie;
            var reg = /([^&]+?)=([^&]*?)/g;

            var cookiePairs = {};
            var match = null;
            while (match = reg.exec(cookieString)) {
                cookiePairs[match[1]] = match[2];
            }

            return cookiePairs;
        };

    })();

    // 日志打印对象 
    window.biglogLogPrint = new BiglogLogPrint();
    window.biglogLogPrint.send();
} catch (e) {
    // 吃掉异常，以免影响正常业务
    console.log(e);
}
