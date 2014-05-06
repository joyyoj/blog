/**
 * @desc Qewi的主页 
 */
var QueryPanelClient = Class.create();
Object.extend(QueryPanelClient.prototype, {
    name: 'QueryPanelClient',

    // 初始化
    initialize: function () {
        this.initializeData();
        this.initializeDOM();
        this.initializeEvent();
        this.render();
    },

    // 初始化数据
    initializeData: function () {
        this.hqlComment = '-- 注释里写下查询意图，方便在历史记录中查找\n';

        this.onDutyTip = '请联系值班同学，Hi群：' + qewiIndexServer.onDutyHi;
        
        // 排队阈值、并行执行阈值、qewi日志Url前缀 
        this.readyThreshold = qewiIndexServer.readyThreshold;
        this.runningThreshold = qewiIndexServer.runningThreshold;
        this.qewiLogUrlPrefix = qewiIndexServer.qewiLogUrlPrefix;

        // 过滤得到排队、执行、历史队列 
        var queues = qewiIndexServer.readyAndRunningQueues;
        this.readyQueueData = this.filterQueueData('ready', queues);
        this.runningQueueData = this.filterQueueData('running', queues);
        this.historyQueueData = qewiIndexServer.historyQueues;

        // 刷新状态标志(防止刷新进度的AJAX请求挤压)
        this.isProgressing = false;
        
        // dataTable对象
        this.dataTable = null;

        // 历史查询条件对象
        this.condition = {
            beginDate: getDatetime('yyyy-MM-dd'),
            endDate: getDatetime('yyyy-MM-dd'),
            pageNo: 1
        };
    },

    // 初始化DOM元素
    initializeDOM: function () {
        // HQL编辑器
        this.hqlEditor = CodeMirror.fromTextArea($('#queryTextarea')[0], {
            lineNumbers: true,
            mode: 'text/x-mysql',
            tabSize: 4,
            smartIndent: false,
            lineWrapping: true
        });

        // schema元信息
        this.schemaTable = $('#schemaTable');

        // 执行按钮
        this.queryBtn = $('#queryBtn');

        // 弹出对话框
        this.dialog = $('#dialog');
        this.dialogTitle = $('#dialog div.dialog-header h4');
        this.dialogMessage = $('#dialog div.dialog-body p');
        this.dialogErrorInfo = $('#dialog div.dialog-body pre');
        this.continueExecute = $('#continueExecute');
        this.stopExecute = $('#stopExecute');

        // 整个tab区域
        this.tabAreaDom = $('#tabArea');

        // 队列
        this.readyQueueDom = $('.ready-queue');
        this.runningQueueDom = $('.running-queue');
        this.historyQueueDom = $('#queryResultPanel .history-queue');

        // 历史记录
        this.historyDom = $('#queryHistoryPanel .history-queue');

        // 日期区间
        this.condBeginDate = $('#condBeginDate');
        this.condEndDate = $('#condEndDate');
    },

    // 销毁DOM
    destroyDOM: function () {
        // HQL编辑器
        this.hqlEditor = null;

        // 元信息
        this.schemaDetailPanelTab = null;
        this.schemaTable = null;

        // 执行按钮
        this.queryBtn = null;

        // 弹出对话框
        this.dialog = null;
        this.dialogTitle = null;
        this.dialogMessage = null;
        this.continueExecute = null;

        // 整个Tab区域
        this.tabAreaDom = null;

        // 队列
        this.readyQueueDom = null;
        this.runningQueueDom = null;
        this.historyQueueDom = null;

        // 历史记录
        this.historyDom = null;

        // 日期区间
        this.condBeginDate = null; 
        this.condEndDate = null; 
    },

    // 初始化DOM事件
    initializeEvent: function () {
        $(window).unload(this.windowDispose.bind(this));
        $(window).resize(this.windowResize.bind(this));
        this.queryBtn.click(this.queryBtnClick.bind(this));
        this.tabAreaDom.click(this.tabAreaDomClick.bind(this));
        this.dialog.click(this.dialogClick.bind(this));
        setInterval(this.setIntervalUpdateProgress.bind(this), 3000);
        setInterval(this.setIntervalForChangeExpendTime.bind(this), 1000);
    },

    // 销毁事件
    destroyEvent: function () {
        this.queryBtn.unbind('click');
        this.dialog.unbind('click');
        this.tabAreaDom.unbind('click');
        $(window).unbind('resize');
    },

    // 初始化页面UI
    render: function () {
        this.windowResize();
        this.renderDefaultHql();
        this.renderQueryEngine();
        this.renderReadyQueue(this.readyQueueData);
        this.renderRunningQueue(this.runningQueueData);
        this.renderHistoryQueue(this.historyQueueData, false);
        this.renderQueryBtn();
        this.renderCondition();

        if (this.runningQueueData.length > 0) {
            this.changeTab('queryResultPanel');
        }
    },

    // 析构
    windowDispose: function () {
        this.destroyEvent();
        this.destroyDOM();
    },

    // 会话窗口居中
    windowResize: function() {
        // 调整弹出对话框的位置
        var clientWidth = $(window).width();
        var clientHeight = $(window).height();
        var top = (clientHeight - this.dialog.height()) / 2;
        var left = (clientWidth - this.dialog.width()) / 2;
        this.dialog.css({
            'top': top,
            'left': left  
        });             
    },

    // 执行Query事件
    queryBtnClick: function(event) {
        if (this.queryBtn.attr('disabled')) {
            return;
        }

        this.changeTab('queryResultPanel');

        // HQL是否为空
        var hql = this.hqlEditor.getValue();
        if (hql == this.hqlComment) {
            showErrMessage('请输入HQL再提交查询任务');
            return;
        }

        // 打印日志
        if (window.biglogLogPrint) {
            window.biglogLogPrint.setActionName('qewi_query');
            window.biglogLogPrint.send();
        }
        this.executeHql(false);
    },

    // tab区域的点击 
    tabAreaDomClick: function(event) {
        var element = $(event.target || event.srcElement);
        var method = element.attr('method');
        switch (method) {
            case 'toggleHql':
                element.parents('li:first').find('.text-hql').toggle();
                event.preventDefault();
                break;
            case 'deleteQueue':
                var queueDom = element.parents('li:first');
                this.deleteQueue(queueDom);
                event.preventDefault();
                break;
            case 'sortQueue':
                this.readySortBtnClick(element);
                event.preventDefault();
                break;
            case 'queryHistoryTab':
                this.getQueryHistory(this.condition);
                break;
            case 'moreHistory':
                this.changeTab('queryHistoryPanel');
                event.preventDefault();
                this.tabAreaDom.find('a[method="condOneDate"').click();
                break;
            case 'condOneDate' :
            case 'condTwoDate' :
            case 'condThreeDate' :
                element.siblings().removeClass('selected');
                element.addClass('selected');

                this.condition.pageNo = 1;
                this.condition.beginDate = element.attr('data-beginDate');
                this.condition.endDate = element.attr('data-endDate');
                this.getQueryHistory(this.condition);
                break;
            case 'condBetween' :
                this.condition.pageNo = 1;
                this.condition.beginDate = this.condBeginDate.val();
                this.condition.endDate = this.condEndDate.val();
                this.getQueryHistory(this.condition);

                this.tabAreaDom.find('.condition').removeClass('selected');
                break;
            case 'page' :
                this.condition.pageNo = element.attr('data-pageNo');
                this.getQueryHistory(this.condition);
                event.preventDefault();
                break;
            default:
        }
    },

    // 监听会话窗口操作事件
    dialogClick: function(event) {
        var trigger = $(event.target || event.srcElement);
        if (trigger.attr('method') == 'btn') {
            this.hideDialog();
        }

        // 仍然继续执行
        if (trigger.attr('id') == 'continueExecute') {
            this.executeHql(true);
        }
    },

    // 更新进度条 
    setIntervalUpdateProgress: function() {
        if (this.runningQueueData.length === 0 || this.isProgressing === true) {
            return;
        }

        this.isProgressing = true;

        // 提取SessionId
        var queues = [];
        for (var i = this.runningQueueData.length - 1; i >= 0; i--) { 
            queues.push({
                sessionId: this.runningQueueData[i].sessionId, 
                beginExecTime: this.runningQueueData[i].beginExecTime,
                totalQueries: this.runningQueueData[i].totalQueries
            });
        }
        
        $.ajax({
            url: '?m=Qewi&a=Index&f=ajaxGetProgress',
            type: 'post',
            data: {queues: queues},
            dataType: 'json',
            success: function(res) {
                if (res.status == 'success') {
                    if (res.data.hasOver) {
                        // 增加历史查询
                        this.addHistoryQueue(res.data.overInfos);

                        var queues = res.data.readyAndRunningQueues;
                        // 排队
                        this.readyQueueData = this.filterQueueData('ready', queues);
                        this.renderReadyQueue(this.readyQueueData);

                        // 执行
                        this.runningQueueData = this.filterQueueData('running', queues);
                        this.renderRunningQueue(this.runningQueueData);

                        // 绘制执行按钮
                        this.renderQueryBtn();
                    }

                    this.renderProgress(res.data.progress);
                } else {
                    showMessage('获取进度信息失败', 300);       
                }
                this.isProgressing = false;
            }.bind(this),
            error: (function() {
                this.isProgressing = false;
                showMessage('获取进度信息失败', 300);       
            }).bind(this)
        });
    },

    // 定时更新运行查询的持续执行时间
    setIntervalForChangeExpendTime: function() {
        var runningItemList = this.runningQueueDom.find('li');
        for (var i = 0, len = runningItemList.size(); i < len; i++) {
            var tipDom = runningItemList.eq(i).find('span[data-expendSeconds]');
            var expendSeconds = parseInt(tipDom.attr('data-expendSeconds'), 10) + 1;
            var expendTip = this.buildExpendTimeTip(expendSeconds);
            tipDom.attr('data-expendSeconds', expendSeconds).text(expendTip);
        }
    },

    /**
     * 更改页面元信息的展示
     * @param {string} orgName 
     * @param {string} event_action
     * @desc 供外部js对象调用
     */
    changeSchema: function(orgName, actionName) {
        showLoadingMessage('正在获取日志元信息……');
        $.ajax({
            type: 'GET',
            url: '?m=Qewi&a=Index&f=ajaxGetSchema&actionName=' + actionName,
            dataType: 'JSON',
            success: function(res, textStatus) {
                hideLoadingMessage();
                if (res) {
                    this.changeTab('schemaDetailPanel');
                    this.renderSchema(res.data.cols);
                    this.renderSchemaDesc(orgName, actionName, res.data.desc);
                }
            }.bind(this),
            error: function() {
                hideLoadingMessage();
                showErrMessage('获取日志原信息失败，' + this.onDutyTip);
            }.bind(this)
        });
    },

    // 渲染Schema信息
    renderSchema: function(dataList) {
        if (!$.isArray(dataList)) {
            return;
        }
        var tableSetting = {
            bDestroy: true,
            aoColumns: [
                {sTitle: '字段名'},
                {sTitle: '字段说明'},
                {sTitle: '字段类型'},
                {sTitle: '数据样例'},
                {sTitle: '级别'}
            ],
            aoColumnDefs: [
                { sWidth: '145px', aTargets: [0]},
                { sWidth: '197px', aTargets: [1]},
                { sWidth: '1px', aTargets: [2]},
                { sWidth: '140px', aTargets: [3]},
                { sWidth: '88px', aTargets: [4]},
            ],
            aaSorting: [],
            bAutoWidth: false,
            sDom: 'R<"schemaDetail_toolbar datatable_customtoolbar ">frtlip',
            sPaginationType: "full_numbers",
            iDisplayLength: 100,
            aLengthMenu: [[10, 15, 25, 50, 100, 200, -1], [10, 15, 25, 50, 100, 200, "全部"]],
            oLanguage: {
                "sLengthMenu": "每页_MENU_条",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                "sInfoEmpty": "找到0条数据",
                "sInfoFiltered": "(数据表中共为 _MAX_ 条记录)",
                "sProcessing": "正在加载中...",
                "sSearch": "快速过滤",
                "oPaginate": {
                    "sFirst":    "第一页",
                    "sPrevious": " 上一页 ",
                    "sNext":     " 下一页 ",
                    "sLast":     " 最后一页 "
                }
            }
        };

        if (this.dataTable) {
            this.dataTable.fnClearTable();
            this.dataTable.fnAddData(dataList);
        } else {
            this.dataTable = this.schemaTable.dataTable(tableSetting);
            this.dataTable.fnAddData(dataList);
        }
    },

    addSchemaData: function(dataList) {
        if (this.dataTable) {
            this.dataTable.fnAddData(dataList);
        }
    },

    // 渲染Schema编辑区域
    renderSchemaDesc: function(orgName, actionName, desc) {
        // 预览和编辑链接
        var descItems = this.tabAreaDom.find('#schemaDesc').find('tr:last td');
        descItems.eq(0).text(orgName);
        descItems.eq(1).text(actionName);
        descItems.eq(2).text(desc);
    },

    // 初始化QueryEngine
    renderQueryEngine: function() {
        this.hqlEditor.setValue(this.hqlComment);
        this.hqlEditor.focus();
        this.hqlEditor.setCursor({line: 2, ch: 0});
    },

    // 点击树节点，改变右边输入框内容
    renderDefaultHql: function(hql) {
        this.hqlEditor.setValue(hql);
        this.hqlEditor.setCursor({line: 1, ch: 7});
        this.hqlEditor.focus();
    },

    /**
     * 渲染 执行Query 的结果
     * @param {object} ajax执行Query的 结果
     * @param {string] 用户输入的HQL
     * @param {int} 队列排序号
     */
    renderQueryBtnClick: function(res, hql, sortNo) {
        if (res.status == 'success') {
            if (!res.isOverRunning) {
                this.addRunningQueue(res.queue, hql);
            } else if (!res.isOverReady && res.isOverRunning) {
                this.addReadyQueue(res.queue.id, hql, sortNo);
            }
        } else {
            // 语法错误
            if ($.isArray(res.error) && res.error.length > 0) {
                var message = '';
                for (var i = 0; i < res.error.length; i++) {
                    message += res.error[i] + '\n';
                }
                this.continueExecute.attr('style', 'display: inline-block;');
                this.stopExecute.attr('style', 'display: inline-block; margin: 0;');
                this.dialogErrorInfo.attr('style', 'display: block;');
                this.showDialog('是否强制执行？', 'HQL语句未通过较验', message);
                return;
            }

            // 提示框
            this.continueExecute.attr('style', 'display: none;');
            this.stopExecute.attr('style', 'margin: 0 auto;');
            this.dialogErrorInfo.attr('style', 'display: none;');

            // 超过排队队列
            if (res.isOverReady) {
                var tip = '您的队列已满，允许' + this.readyThreshold + '个查询等待执行';
                this.showDialog('', tip);
            } else {
                this.showDialog('提交查询-错误', this.onDutyTip);
            }

        }
    },

    /**
     * 渲染排队队列
     * @param {array} 队列数组
     * @param {boolean} 是否追加到已有队列
     */
    renderReadyQueue: function(queues, isPrepend) {
        var html = '';
        for (var i = queues.length - 1; i >= 0; i--) {
            var queue = queues[i];
            html += this.buildReadyItemHtml(queue.id, queue.sortNo, queue.hql);
        }

        // 追加还是替换
        if (isPrepend) {
            this.readyQueueDom.prepend(html);
        } else {
            this.readyQueueDom.html(html);
        }

        // 隐藏排队队列提示
        if (this.readyQueueData.length === 0) {
            this.readyQueueDom.prev().hide();
        } else {
            this.readyQueueDom.prev().show();
        }
    },

    /**
     * 渲染执行队列
     * @param {array} 队列数组
     * @param {boolean} 是否追加到已有队列
     */
    renderRunningQueue: function(queues, isPrepend) {
        var html = '';
        for (var i = queues.length - 1; i >= 0; i--) {
            html += this.buildRunningItemHtml(queues[i]);
        }

        // 追加还是替换
        if (isPrepend) {
            this.runningQueueDom.prepend(html);
        } else {
            this.runningQueueDom.html(html);
        }

        // 隐藏执行队列提示
        if (this.runningQueueData.length === 0) {
            this.runningQueueDom.prev().hide();
        } else {
            this.runningQueueDom.prev().show();
        }
    },

    /**
     * 渲染执行队列的执行进度
     * @param {array} 进度信息
     */
    renderProgress: function(progressQueues) {
        for (var i = 0, len = progressQueues.length; i < len; i++) {
            var queue = progressQueues[i]; 
            var percent = parseInt(queue.percent, 10);
            var queueDom =this.runningQueueDom.find('li[sessionId="' + queue.sessionId + '"]');
            // 进度
            queueDom.find('div.bar').width(percent + '%');
            // 完成
            if (percent == 100) {
                var progressDom = queueDom.find('div.progress').removeClass('active');
                if (queue.status == 'success') {
                    progressDom.addClass('progress-success');
                } else {
                    progressDom.addClass('progress-danger');
                }
            }

            // 进度信息
            var progressMsgHtml = this.buildProgressMsgHtml(queue);
            queueDom.find('div.progress-message').html(progressMsgHtml);
        }
    },

    /**
     * 执行HQL语句
     * @param {boolean} true强制执行不校验HQL的语法
     */
    executeHql: function(isForceExecute) {
        var hql = this.hqlEditor.getValue();
        var sortNo = null;
        var readySortNo = this.readyQueueData.length;
        var runningSortNo = this.runningQueueData.length;
        if (runningSortNo < this.runningThreshold) {
            sortNo =  runningSortNo + 1;
        }
        if (readySortNo < this.readyThreshold && runningSortNo == this.runningThreshold) {
            sortNo = readySortNo + 1;
        }

        // 执行
        showLoadingMessage('正在提交查询……');
        this.renderQueryBtn(true);
        $.ajax({
            url: '?m=Qewi&a=Index&f=ajaxExecute',
            type: 'post',
            data: {
                hql: hql,
                sortNo: sortNo,
                isForceExecute: !!isForceExecute
            },
            dataType: 'json',
            success: function(res) {
                this.renderQueryBtnClick(res, hql, sortNo);
                this.renderQueryBtn(false);
                hideLoadingMessage();
            }.bind(this),
            error: function(message) {
                hideLoadingMessage();
                showErrMessage('提交失败，' + this.onDutyTip);
                this.renderQueryBtn(false);
            }.bind(this)
        });
    },

    /**
     *  构建进度提示信息
     *  @param {object} 进度信息
     *  @return {string} 进度信息的HTML 
     */
    buildProgressMsgHtml: function(progress) {
        var logUrl = this.qewiLogUrlPrefix + progress.sessionId;
        var html = progress.percent + '%';
        html += '，<a href="' + logUrl + 
            '" target="_blank" title="点击查看日志详情，曾用名【放大镜地址】">执行日志</a>';
        if (progress.status == 'success') {
            return html;
        }

        // hadoop执行信息
        if ($.isArray(progress.taskList) && progress.taskList.length > 0) {
            html += '，共有' + progress.taskList.length + '轮hadoop任务：';
            for (var i = 0, len = progress.taskList.length; i < len; i ++) {
                var task = progress.taskList[i];
                html += '第' + (i + 1) +'轮：' + task.percentage + '%' ;
                html += '，<a href="' + task.trackingUrl + '" target="_blank">trackingUrl</a>';
            }
        }
        
        return html;
    },

    /**
     *  增加历史队列
     *  @param {array<object>} 执行完毕的SessionId的数据
     *  @desc 增加对象到this.historyQueueData和增加DOM到页面
     */
    addHistoryQueue: function(overInfos) {
        if (!$.isArray(overInfos) || overInfos.length === 0) {
            return;
        }
        var existCallbackFun = function(item) {
            return item.sessionId == overInfo.sessionId;
        };

        var historyQueues = [];
        for (var i = 0, len = overInfos.length; i < len; i++) {
            var overInfo = overInfos[i];
            var runningIndex = arrayIndexOfCallback(this.runningQueueData, existCallbackFun);
            if (runningIndex >= 0) {
                var queue = this.runningQueueData[runningIndex];
                queue.status = overInfo.status;
                queue.failReason = overInfo.failReason;
                queue.endExecTime = overInfo.endExecTime;

                historyQueues.push(queue);
                this.historyQueueData.unshift(queue);
            }
        }

        this.renderHistoryQueue(historyQueues, true);
    },

    /**
     * 渲染历史队列
     * @param {array} 队列数组
     * @param {boolean} 是否追加到已有队列
     * @param {DOM} 容器DOM元素(jQuery对象)
     */
    renderHistoryQueue: function(queues, isPrepend, containerDom) {
        var html = '';
        for (var i = 0, len = queues.length; i < len; i++) {
            html += this.buildHistoryItemHtml(queues[i]);
        }

        // 容器
        containerDom = containerDom || this.historyQueueDom;

        // 追加还是替换
        if (isPrepend) {
            containerDom.prepend(html);
        } else {
            containerDom.html(html);
        }

        // 隐藏执行队列提示
        if (this.historyQueueData.length === 0) {
            containerDom.prev().hide();
        } else {
            containerDom.prev().show();
        }
    },

    /**
     * 渲染执行按钮
     * @param {boolean} true在提交查询，false提交查询结束
     */
    renderQueryBtn: function(isDisabled) {
        var tip = '';
        if (isDisabled) {
            tip = this.queryBtn.attr('data-loading-text');
        } else {
            tip = this.queryBtn.attr('data-text'); 
        }

        var overReadyThreshold = this.readyQueueData.length >= this.readyThreshold;
        if (overReadyThreshold) {
            tip = '禁止提交，最多允许' + this.readyThreshold + '个查询排队';
        }

        if (isDisabled || overReadyThreshold) {
            this.queryBtn.attr('disabled', 'disabled').html(tip);
        } else {
            this.queryBtn.removeAttr('disabled').html(tip);
        }
    },

    /**
     * 渲染历史记录的查询条件
     */
    renderCondition: function() {
        var dateToday = getDatetime('yyyy-MM-dd');
        var dateYesterday = getDatetime('yyyy-MM-dd', {day: -1});
        var dateBeforeYesterday = getDatetime('yyyy-MM-dd', {day: -2});
        var week = getDatetime('yyyy-MM-dd', {day: -6});

        this.tabAreaDom.find('a[method="condOneDate"]')
            .attr('data-beginDate', dateToday)
            .attr('data-endDate', dateToday);
        this.tabAreaDom.find('a[method="condTwoDate"]')
            .attr('data-beginDate', dateYesterday)
            .attr('data-endDate', dateToday);
        this.tabAreaDom.find('a[method="condThreeDate"]')
            .attr('data-beginDate', dateBeforeYesterday)
            .attr('data-endDate', dateToday);

        this.condBeginDate.val(week).datepicker({dateFormat: 'yy-mm-dd'});
        this.condEndDate.val(dateToday).datepicker({dateFormat: 'yy-mm-dd'});
    },

    /** 
     * 过滤出排队队列数据
     * @param {string} 队列状态ready或running
     * @param {array} 队列信息
     * @return {array} 排队队列
     */
    filterQueueData: function(status, queues) {
        var runningQueueData = [];
        for (var i = 0, len = queues.length; i < len; i++) {
            if (queues[i].status == status) {
                runningQueueData.push(queues[i]);
            }
        }
        return runningQueueData;
    },

    /**
     * 增加一条排队队列
     * @param {int} 队列id
     * @param {string} HQL语句
     * @param {int} 查询排序号
     */
    addReadyQueue: function(id, hql, sortNo) {
        var queue = { id: id, sessionId: '', sortNo: sortNo, hql: hql }; 
        this.readyQueueData.push(queue);
        this.renderReadyQueue([queue], true);
    },

    /**
     * 增加一条执行队列
     * @param {Object} 队列信息 
     * @param {string} 用户输入的HQL语句
     * @desc 渲染DOM和增加到全局this.runningQueueData
     */
    addRunningQueue: function(queue, hql) {
        var beginExecTime = this.getCurrentTime();
        var expendTime = this.getExpendTime(beginExecTime);

        var tmpQueue = {
            id: queue.id,
            sessionId: queue.sessionId,
            status: 'running',
            hql: hql,
            beginExecTime: beginExecTime,
            expendTime: expendTime,
            totalQueries: queue.totalQueries
        };

        this.runningQueueData.push(tmpQueue);
        this.renderRunningQueue([tmpQueue], true);
    },

    /**
     * 获取当前时间（浏览器）
     * @return {string} 格式yyyy-mm-dd hh:mm:ss
     */
    getCurrentTime: function() {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var second = time.getSeconds();
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second;
    },

    /**
     * 获取耗时
     * @param {string} 开始时间
     * @param {string] 结束执行时间
     * @return {int} 持续秒数
     */
    getExpendTime: function(beginExecTime, endExecTime) {
        var beginTime = stringToDatetime(beginExecTime);
        var endTime = !!endExecTime ? stringToDatetime(endExecTime) : (new Date()).getTime();
        var seconds = ((endTime - beginTime) / 1000).toFixed(0);
        return seconds;
    },

    /**
     * 构建执行持续时间提示
     * @param {int} 总秒数 
     * @param {string} 时间提示
     */
    buildExpendTimeTip: function(totalSeconds) {
        var result = '';

        var hour = Math.floor(totalSeconds / (60 * 60));
        if (hour > 0) {
            result = hour + '小时'; 
        }

        var lastSeconds = totalSeconds % (60 * 60);
        var minute = Math.floor(lastSeconds / 60);
        if (minute > 0) {
            result += minute + '分钟';
        }

        var second = lastSeconds % 60;
        if (second > 0) {
            result += second + '秒';
        }

        return result;
    },

    /**
     * 切换Tab标签
     * @param {string} 标签的标志
     */
    changeTab: function(tabFlag) {
        this.tabAreaDom.find('ul.nav-tabs li.active').removeClass('active');
        this.tabAreaDom.find('ul.nav-tabs a[href="#' + tabFlag + '"]')
            .parent().addClass('active');
        this.tabAreaDom.find('div.tab-content div.active').removeClass('active');
        this.tabAreaDom.find('div.tab-content div[id="' + tabFlag + '"]').addClass('active');
    },

    /**
     *  删除一条队列
     *  @param {Object} 队列所在的单条DOM
     */
    deleteQueue: function(queueDom) {
        var url = '?m=Qewi&a=Index&f=ajaxDeleteQueue&' + 
            'queueId=' + queueDom.attr('id') + 
            '&sessionId=' + queueDom.attr('sessionId') + 
            '&queueStatus=' + queueDom.attr('status');
        showLoadingMessage('正在删除……');
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                hideLoadingMessage();
                if (data.status == 'success') {
                    this.removeQueueDom(queueDom);
                } else {
                    showMessage('删除失败');
                }
            }.bind(this),
            error: function() {
                hideLoadingMessage();
                showErrMessage('删除失败');       
            }.bind(this)
        });
    },

    /**
     * 变更排队队列顺序按钮事件
     * @param {DOM} 点击的排序按钮
     */
    readySortBtnClick: function(readySortBtn) {
        var readyItem = readySortBtn.parents('li:first');

        var sortNo = readyItem.attr('sortNo');
        var targetId = '';
        var targetSrtNo = '';
        
        if (readySortBtn.hasClass('sortUp')) {
            var upItem = readyItem.prev();
            if (upItem.size() === 0) {
                return;
            }
            targetId = upItem.attr('id');
            targetSortNo = upItem.attr('sortNo');

            upItem.attr('sortNo', sortNo);
            readyItem.attr('sortNo', targetSortNo);
            readyItem.after(upItem);
        } else if (readySortBtn.hasClass('sortDown')) {
            var downItem = readyItem.next();
            if (downItem.size() === 0) {
                return;
            }
            targetId = downItem.attr('id');
            targetSortNo = downItem.attr('sortNo');

            downItem.attr('sortNo', sortNo);
            readyItem.attr('sortNo', targetSortNo);
            readyItem.before(downItem);
        }

        var sortArray = [
            {id: readyItem.attr('id'), sortNo: targetSortNo},
            {id: targetId, sortNo: sortNo}
        ];

        this.setQueueSortNo(sortArray);
    },

    /**
     * 移除一条队列DOM元素
     * @param {Object} DOM元素
     */
    removeQueueDom: function(queueDom) { 
        var queueStatus = queueDom.attr('status');
        var queueDomParent = queueDom.parents('div:first');
        var queueData = null; 

        // 删除当前DOM
        queueDomParent.find(queueDom).remove();

        if (queueStatus == 'ready') {
            queueData = this.readyQueueData;
            // 调整序号
            var sortArray = [];
            var queueDomList = queueDomParent.find('li');
            var sortNo = parseInt(queueDom.attr('sortNo'), 10);
            for (var i = 0, len = queueDomList.size(); i < len; i++ ) {
                var queue = queueDomList.eq(i);
                var queueSortNo = parseInt(queue.attr('sortNo'), 10);
                if (queueSortNo > sortNo) {
                    queue.attr('sortNo', queueSortNo - 1);
                    sortArray.push({id: queue.attr('id'), sortNo: queueSortNo - 1});
                }
            }
            this.setQueueSortNo(sortArray);
        } else if (queueStatus == 'running') {
            queueData = this.runningQueueData;
        } else {
            queueData = this.historyQueueData;
        }

        // 删除数据
        var queueId = queueDom.attr('id');
        for (var j = queueData.length - 1; j >= 0; j--) {
            if (queueData[j].id == queueId) {
                queueData.splice(j, 1);
                break;
            }
        }

        // 隐藏提示
        if (queueData.length === 0) {
            queueDomParent.prev('.queue-title').hide();
        }

        this.renderQueryBtn();
    },

    /**
     * 设置队列的序号
     * @param {array<{id: 查询的主键, sortNo: 排序号}} 队列的Id 
     */
    setQueueSortNo: function(sortArray) {
        if (!$.isArray(sortArray) || sortArray.length === 0) {
            return;
        }
        $.ajax({
            url: '?m=Qewi&a=Index&f=ajaxSetQueueSortNo',
            type: 'post',
            data: {sortArray: sortArray},
            dataType: 'json',
            success: function(res) {
            }.bind(this),
            error: function() {
                showErrMessage('队列顺序交换失败');       
            }.bind(this)
        });
    },

    /**
     * 获取查询历史
     * @param {Object} 包含beginDate和endDate和pageNo三个属性 
     */
    getQueryHistory: function(queryCondition) {
        showLoadingMessage('正在获取历史查询……');
        $.ajax({
            url: '?m=Qewi&a=Index&f=ajaxGetQueryHistory',
            type: 'get',
            data: queryCondition,
            dataType: 'json',
            success: function(res) {
                hideLoadingMessage();
                if (res.status == 'success') {
                    this.renderHistoryTab(res.data);
                } else {
                    showErrMessage('搜索查询历史失败，' + this.onDutyTip);
                }
            }.bind(this),
            error: function() {
                showErrMessage('搜索查询历史失败，' + this.onDutyTip);       
            }.bind(this)
        });
    },

    /**
     * 渲染历史记录的查询结果
     * @param {object} 历史信息（当前页码、总页数、数据）
     */
    renderHistoryTab: function(historyInfo) {
        this.renderHistoryQueue(historyInfo.queues, false, this.historyDom);

        // 分页HTML
        var paginationHtml = this.buildPaginationHtml(historyInfo.pageNo, historyInfo.totalPages);
        this.historyDom.next().remove();
        this.historyDom.after(paginationHtml);
    },

    /**
     * 分页信息
     * @param {int} 当前页码
     * @param {int} 总页码
     * @reutrn {string} 分页的HTML
     */
    buildPaginationHtml: function(pageNo, totalPages) {
        pageNo = parseInt(pageNo, 10);
        totalPages = parseInt(totalPages, 10);

        var htmlArray = [];
        htmlArray.push('<div class="pagination pagination-right pagination-large"><ul>');

        if (pageNo <= 1) {
            htmlArray.push('<li class="disabled"><a data-pageNo="0">第一页</a></li>');
            htmlArray.push('<li class="disabled"><a data-pageNo="0">上一页</a></li>');
        } else {
            htmlArray.push('<li><a method="page" data-pageNo="1" href="#">第一页</a></li>');
            htmlArray.push('<li><a method="page" data-pageNo="' + (pageNo - 1) + '" href="#">');
            htmlArray.push('上一页</a></li>');
        }

        // 已当前页为中心显示5个页码
        var showPages = [pageNo];
        for (var i = 1; i < 5; i++) {
            if (pageNo - i >= 1) {
                showPages.unshift(pageNo - i);
            }
            if (pageNo + i <= totalPages) {
                showPages.push(pageNo + i);
            }
            if (showPages.length == 5) {
                break;
            }
        }

        for (var j = 0; j < showPages.length; j++) {
            var tmpNo = showPages[j];
            if (tmpNo == pageNo) {
                htmlArray.push('<li class="active">');
                htmlArray.push('<a method="page" data-pageNo="' + tmpNo + '" href="#">');
                htmlArray.push(tmpNo + '</a></li>');
            } else {
                htmlArray.push('<li><a method="page" data-pageNo="' + tmpNo + '" href="#">');
                htmlArray.push(tmpNo + '</a></li>');
            }
        }

        if (totalPages === 0 || totalPages === pageNo) {
            htmlArray.push('<li class="disabled"><a data-pageNo="0">下一页</a></li>');
            htmlArray.push('<li class="disabled"><a data-pageNo="0">最后一页</a></li>');
        } else {
            htmlArray.push('<li><a method="page" data-pageNo="' + (pageNo + 1) + '" href="#">');
            htmlArray.push('下一页</a></li>');
            htmlArray.push('<li><a method="page" data-pageNo="' + totalPages + '" href="#">');
            htmlArray.push('最后一页</a></li>');
        }

        htmlArray.push('</ul></div>');
        // 呈现
        return htmlArray.join('');
    },

    /**
     * 弹出会话窗口
     * @param {string} 提示信息文本标题
     * @param {string} 提示信息文本内容
     * @param {string} 提示错误消息
     */
    showDialog: function(title, notice, message) {
        this.dialogTitle.text(title);
        this.dialogMessage.text(notice);
        this.dialogErrorInfo.text(message);
        this.dialog.show();
    },

    // 隐藏会话窗口
    hideDialog: function() {
        this.dialogTitle.text();
        this.dialogMessage.text();
        this.dialog.hide();
    },

    /**
     * 创建排队队列HTML元素
     * @param {id} 队列ID
     * @param {number} 排队队列序号
     * @param {string} HQL字符串
     * @return {string} HTML片段
     */
    buildReadyItemHtml: function(id, sortNo, hql) {
        var queries = hql.split('\n');
        return '<li id="' + id + '" sortNo="' + sortNo + '" status="ready"><dl>' +
            '<dt>' + queries[0] + '</dt>' +
            '<dd class="ready-queue-operator">' +
            '<a href="###" class="icon-remove" method="deleteQueue" title="删除排队中的查询">' +
            '</a>' +
            '</dd>' +
            '<dd class="ready-queue-operator">' +
            '<a href="###" class="icon-arrow-up sortUp" method="sortQueue" title="排序上移">' +
            '</a>' +
            '</dd>' +
            '<dd class="ready-queue-operator">' +
            '<a href="###" class="icon-arrow-down sortDown"' +
            ' method="sortQueue" title="排序下移"></a>' +
            '</dd>' +
            '<dd class="ready-queue-operator">' +
            '<a href="###" class="icon-chevron-down" method="toggleHql" title="展开HQL">' +
            '</a>' +
            '</dd>' +
            '</dl>' +
            '<dl><dd class="text-hql" style="display:none"><pre>' + hql +
            '</pre></dd></dl>' +
            '</li>';
    },

    /**
     * 创建执行队列HTML元素
     * @param {object} 字段和数据库对应 
     * @return {string} HTML片段
     */
    buildRunningItemHtml: function(queue) {
        var expendSeconds = this.getExpendTime(queue.beginExecTime);
        var expendTip = this.buildExpendTimeTip(expendSeconds);
        return '<li id="' + queue.id +
            '" sessionId="' + queue.sessionId +
            '" sortNo="' + queue.sortNo + '" status="running">' +
            '<dl class="running-info">' +
            '<dd><span>Running</span></dd>' +
            '<dd><font>SessionId:</font></dd>' +
            '<dd><span>' + queue.sessionId + '</span></dd>' +
            '<dd><font>开始执行:</font></dd>' +
            '<dd><span>' + queue.beginExecTime + '</span></dd>' +
            '<dd><font>耗时:</font></dd>' +
            '<dd><span data-expendSeconds="' + expendSeconds + '">' + expendTip + '</span></dd>' +
            '<dd class="kill-running">' +
            '<a href="###" class="icon-remove" method="deleteQueue" title="删除正在执行的查询">' +
            '</a>' +
            '</dd>' +
            '<dt>' +
            '<a href="###" class="icon-chevron-down" method="toggleHql" title="展开HQL">' +
            '</a>' +
            '</dt>' +
            ' </dl>' +
            '<dl class="running-progress">' +
            '<div class="progress progress-striped active">' +
            '<div class="bar" style="width: 1%;"></div>' +
            '</div>' +
            '<div class="progress-message">2%，正在发起查询</div>' +
            '</dl>' +
            '<dd class="text-hql" style="display:none">' +
            '<pre>' + queue.hql +'</pre>' +
            '</dd>' +
            '</li>';
    },

    /**
     * 创建排队队列HTML元素
     * @param {object} 和数据库字段名称相同 
     * @return {string} HTML片段
     */
    buildHistoryItemHtml: function(queue) {
        var expendSeconds = this.getExpendTime(queue.beginExecTime, queue.endExecTime);
        var expendTip = this.buildExpendTimeTip(expendSeconds);

        var html = '<li id="' + queue.id + '" sessionId="' + queue.sessionId +
            '" sortNo="' + queue.sortNo + '" status="' + queue.status + '">' +
            '<dl class="history-info">' +
            '<dd><span>' + queue.status + '</span></dd>' +
            '<dd><font>SessionId:</font></dd>' +
            '<dd><span>' + queue.sessionId + '</span></dd>' +
            '<dd><font>结束:</font></dd>' +
            '<dd><span>' + queue.endExecTime + '</span></dd>' +
            '<dd><font>耗时:</font></dd>' +
            '<dd><span data-expendSeconds="' + expendSeconds + '">'+ expendTip + '</span></dd>';
            
        if (queue.status == 'success') {
            html += '<dd><a href="?m=Qewi&a=Detail&f=ajaxDownload';
            html += '&sessionId=' + queue.sessionId;
            html += '&totalQueries=' + queue.totalQueries;
            html += '">下载</a></dd><dd><a target="_blank" href="?m=Qewi&a=Detail';
            html += '&sessionId=' + queue.sessionId;
            html += '">数据详情</a></dd>';
        } else if (queue.status == 'failed') {
            var logUrl = this.qewiLogUrlPrefix + queue.sessionId;
            html += '<dd><a href="'+ logUrl + '" target="_blank"';
            html += ' title="点击查看日志详情，曾用名【放大镜地址】">执行日志</a></dd>';
        }

        html += '<dd class="kill-history">' +
        '<a href="###" class="icon-remove" method="deleteQueue" title="删除历史查询"></a>' +
        '</dd><dt>' +
        '<a href="###" class="icon-chevron-down" method="toggleHql" title="展开HQL"></a>' +
        '</dt></dl>';

        // 失败原因
        if (queue.status == 'failed') {
            var failReason = queue.failReason || '';
            html += '<dl class="history-progress">' +
            '<div class="progress-message">' + failReason + '</div>' +
            '</dl>';
        }

        html += '<dd class="text-hql" style="display:none">' +
        '<pre>' + queue.hql +'</pre>' +
        '</dd></li>';

        return html;
    }

});
