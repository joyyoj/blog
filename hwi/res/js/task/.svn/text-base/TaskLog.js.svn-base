/**
 * @author wangshouchuang@baidu.com
 * @desc TaskLog.html的js文件 
 */

var TaskLogClient = Class.create();
Object.extend(TaskLogClient.prototype, {
    name: 'TaskLogClient',

    // 初始化
    initialize: function() {
        this.initializeData();
        this.initializeDOM();
        this.initializeEvent();
        this.render();
    },

    // 初始化数据
    initializeData: function() {
    },

    // 初始化DOM元素
    initializeDOM: function() {
        this.logDetailBtn = $('input.log-detail');
        this.logDetailDiv = $('#logDetail');
    },

    // 初始化DOM事件
    initializeEvent: function() {
        this.logDetailBtn.click(this.logDetailBtnClick.bind(this));
        $(window).unload(this.dispose.bind(this));
    },

    // 销毁DOM
    destroyDOM: function() {
        this.logDetailBtn = null;
        this.logDetailDiv = null;
    },

    // 销毁事件
    destroyEvent: function() {
        this.logDetailBtn.unbind('click');
    },

    // 析构
    dispose: function() {
        this.destroyEvent();
        this.destroyDOM();
    },

    // 初始化页面UI
    render: function() {
    },

    // 点击查看日志详情
    logDetailBtnClick: function(event) {
        var element = $(event.target || event.srcElement);
        var method = element.attr('method');

        var jobId = element.attr('data-jobId');
        var taskId = element.attr('data-taskId');
        var fileName = element.attr('data-fileName');
        var url = '?m=Task&a=Log&f=ajaxGetLogContent&jobId=' + 
            jobId + '&taskId=' + taskId + '&fileName=' + fileName;
        
        showLoadingMessage('正在获取日志内容……');
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'text',
            success: function(logContent, textStatus) {
                this.logDetailDiv.prev().html(fileName);
                this.logDetailDiv.html('<pre>' + logContent + '</pre>');
                hideLoadingMessage();
            }.bind(this),
            error: function() {
                this.logDetailDiv.prev().html(fileName);
                this.logDetailDiv.html('<pre></pre>');
                hideLoadingMessage();
            }.bind(this)
        });
    }

});

// 初始化绑定事件
$(function() {
    window.taskLogClient = new TaskLogClient();
});
