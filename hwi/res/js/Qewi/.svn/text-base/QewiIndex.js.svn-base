/**
 * @author zhushengyun@baidu.com
 * @desc QEWI首页
 */

var QewiIndexClient = Class.create();
Object.extend(QewiIndexClient.prototype, {
    name: 'QewiIndexClient',

    // 初始化
    initialize: function() {
        this.initializeData();
        this.initializeDOM();
        this.initializeEvent();
        this.render();
    },

    // 初始化数据
    initializeData: function() {
        this.allColumns = qewiIndexServer.allColumns;
        this.schemaPageSize = qewiIndexServer.schemaPageSize;
    },

    // 初始化DOM元素
    initializeDOM: function() {
        this.slideTreeBtnBox = $('#slideTreeBtnBox');
        this.logTreeSwitchBtn = $('#logTree li span.switch');
        this.queryPanelClient = new QueryPanelClient();
        this.treeNodeClient = new TreeNodeClient(qewiIndexServer.treeNodes);
        this.sampleLink = $('#dataSampleLink');
    },

    // 初始化DOM事件
    initializeEvent: function() {
        this.slideTreeBtnBox.click(this.slideTreeBtnBoxClick.bind(this));
        this.logTreeSwitchBtn.click(this.logTreeSwitchBtnClick.bind(this));
        this.treeNodeClient.bindEvent('onLeafNodeClick', this.onLeafNodeClick.bind(this));
        this.treeNodeClient.bindEvent('onRootNodeClick', this.onRootNodeClick.bind(this));
        $(window).unload(this.dispose.bind(this));
    },

    // 销毁DOM
    destroyDOM: function() {
        this.slideTreeBtnBox = null;
        this.logTreeSwitchBtn = null;
        this.queryPanelClient = null;
        this.treeNodeClient = null;
        this.sampleLink = null;
    },

    // 销毁事件
    destroyEvent: function() {
        this.logTreeSwitchBtn.unbind('click');
        this.treeNodeClient.unbindEvent('onLeafNodeClick');
        this.treeNodeClient.unbindEvent('onRootNodeClick');
    },

    // 析构
    dispose: function() {
        this.destroyEvent();
        this.destroyDOM();
    },

    // 初始化页面UI
    render: function() {
        this.renderSlideTreeFnc();
        this.queryPanelClient.renderSchema(this.allColumns);
    },

    // 日志节点击事件
    onLeafNodeClick: function(leafNode) {
        var parentNode = leafNode.getParentNode();
        var orgName = parentNode == null ? '' : parentNode.value;
        var actionName = leafNode.value;
        
        // 默认HQL
        var yesterday = new Date(new Date() - 24 * 3600 * 1000);
        var eventDay = datetimeFormat(yesterday, 'yyyyMMdd');
        var eventHour = datetimeFormat(yesterday, 'hh');
        var hql = '-- 查询表' + leafNode.value + "\n";
        hql += 'select * \nfrom ' + qewiIndexServer.eventTableName +
                '\nwhere event_day="' + eventDay +
                '" and event_hour = "' + eventHour + '" and event_action="' + actionName + '"\nlimit 30;';
        this.queryPanelClient.renderDefaultHql(hql);

        // 表元信息
        this.queryPanelClient.changeSchema(orgName, actionName);

        // 数据样例链接
        if (orgName) {
            var url = '/sample/?product=' + parentNode.value + '&event=' + leafNode.value;
            this.sampleLink.attr('href', url);
        }
    },

    // 日志节点击事件
    onRootNodeClick: function(rootNode) {
        this.queryPanelClient.renderSchema(this.allColumns);
        this.queryPanelClient.renderSchemaDesc('全百度', 'event', 'UDW Event大表');
        this.sampleLink.attr('href', '/sample/');
    },

    // 日志树产品线收起展开
    logTreeSwitchBtnClick: function(event) {
        var element = $(event.currentTarget); 
        if (element.hasClass('center_open')) {
            element.removeClass('center_open');
            element.addClass('center_close');
            element.next().next('ul').css({'display': 'none'});
        } else {
            element.removeClass('center_close');
            element.addClass('center_open');
            element.next().next('ul').css({'display': 'block'});
        }
    },

    // 日志树收缩展开事件
    slideTreeBtnBoxClick: function(event) {
        var leftDiv = this.slideTreeBtnBox.prev();
        var rightDiv = this.slideTreeBtnBox.next();
        var slideBtn = this.slideTreeBtnBox.children('span');
        if (leftDiv.is(':hidden')) {
            leftDiv.show();
            rightDiv.css({'width': '73%'});
            slideBtn.removeClass('icon-chevron-right').addClass('icon-chevron-left');
        } else {
            leftDiv.hide();
            rightDiv.css({'width': '97%'});
            slideBtn.removeClass('icon-chevron-left').addClass('icon-chevron-right');
        }   
    },

    // 日志树收缩栏
    renderSlideTreeFnc: function() {
        this.slideTreeBtnBox.height(this.slideTreeBtnBox.next().height() + 2);
    },

    getAllColumns: function() {
        $.ajax({
            url: '?m=Qewi&a=Index&f=ajaxGetAllColumns&offset=' + this.schemaPageSize,
            type: 'get',
            dataType: 'json',
            success: function(res) {
                this.allColumns = this.allColumns.concat(res.data);
                this.queryPanelClient.addSchemaData(res.data);
            }.bind(this),
            error: function(message) {
                console.info('异步获取剩余元数据失败');
            }.bind(this)
        });
    }
        
});

// 初始化绑定事件
$(function() {
    window.qewiIndexClient = new QewiIndexClient();
    window.qewiIndexClient.getAllColumns();
});
