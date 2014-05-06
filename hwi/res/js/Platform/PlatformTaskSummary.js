/**
 * @desc 平台管理，Task任务信息汇总
 * for ui/template/Platform/PlatformTaskSummary.html
 */

/**
 * 运行时信息的HTML的缓存
 * @type {Object.<string,string>}
 */
var taskRuntimeCacheDom = {
    'startType': '', 
    'taskType': '',
    'startTypeAndTaskType': ''
};

/**
 * 历史信息图表的X坐标
 * @type {Array.<string>}
 */
var historyChartXPoints = [];

/**
 * 历史信息图表的曲线信息
 * @type {Array.<Object>}
 */
var historyChartSeries = [];

/**
 * 历史信息图表
 * @type {Object}
 */
var historyChart = null;

/**
 * DOM的ready事件,初始化事件绑定,初始化页面
 */
$(function() {

    // 切换运行时信息的类型
    $(':radio[name="contentType"]').change(function(event) {
        var errorTip = $('.runtime span.errorTip').text('');
        var tableBody = $('.runtime table tbody');
        var visibleTr = $('.runtime table tbody tr[method]');

        var contentType = $(this).val();
        var cacheKey = taskRuntimeCacheDom[contentType];
        var url = '?m=Platform&a=TaskSummary&f=ajaxRuntime&contentType=' + contentType;
        if (cacheKey == '') {
            showLoadingMessage('正在加载数据...');
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == true) {
                        // 校验数据
                        if ($.isArray(res.result) == false || res.result.length == 0) {
                            errorTip.text(res.message);
                            return;
                        }

                        // 拼接HTML
                        var htmlBuilder = [];
                        for (var i = 0, row; row =  res.result[i]; i++) {
                             htmlBuilder.push('<tr method="' + contentType + '">');
                             for (var j = 0, text; text = row[j]; j++) {
                                 htmlBuilder.push('<td '+ 
                                                  (j == 0 ? 'class="head">' : '>') + 
                                                  text.name + '</td>'
                                                  );
                             }
                             htmlBuilder.push('</tr>');
                        }

                        // 隐藏显示的Tr
                        visibleTr.hide();

                        // 追加DOM
                        tableBody.append(htmlBuilder.join(''));

                        // 缓存键值
                        taskRuntimeCacheDom[contentType] = '.runtime tr[method="' + contentType + '"]';
                    } else {
                        errorTip.text(res.message);
                    }

                    // 隐藏加载提示
                    hideLoadingMessage();
                },
                error: function() {
                    // 隐藏加载提示
                    hideLoadingMessage();
                    alert('系统发生异常。');
                }
            });
        } else {
            visibleTr.hide();
            $(cacheKey).show(400);
        }
    });

    // 初始化开始时间
    $('#txtBeginTime').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: $('#txtEndTime').val()
    });

    // 初始化结束时间
    $('#txtEndTime').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: $('#txtBeginTime').val()
    });

    // 变更开始时间
    $('#txtBeginTime').change(function() {
        renderHistoryTable();
        $('#txtEndTime').datepicker('option', 'minDate', $(this).val());
    });

    // 变更结束时间
    $('#txtEndTime').change(function() {
        renderHistoryTable();
        $('#txtBeginTime').datepicker('option', 'maxDate', $(this).val());
    });

    // 历史信息区域绑定click
    $('div.history').click(function(event) {
        var element = $(event.target || event.srcElement);
        var method = element.attr('method');
        switch(method) {
            case 'lineChart' :
                var chartDiv = $('#historyChartDiv');
                var className = element.attr('class');
                if (className == 'chart') {
                    if (historyChart == null) {
                        renderHistoryChart();
                    } else {
                        chartDiv.show();
                    }
                    element.attr('class', 'selected');
                } else if (className == 'selected') {
                    if (historyChart) {
                        chartDiv.hide();
                    }
                    element.attr('class', 'chart');
                }
                break;
        }
    });

    // 呈现历史信息的
    renderHistoryTable();
});

/**
 * 呈现历史信息的表格
 */
function renderHistoryTable() {
    var errorTip = $('.history span.errorTip').text('');
    var tableBody = $('.history table tbody');
    var beginTime = $('#txtBeginTime').val();
    var endTime = $('#txtEndTime').val();

    var url = '?m=Platform&a=TaskSummary&f=ajaxHistory&beginTime='
        + beginTime + '&endTime=' + endTime;
    showLoadingMessage('正在加载数据...');
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'JSON',
        success: function(res) {
            if (res.status == true) {
                // 校验数据
                if (!res.result) {
                    errorTip.text('不是有效的返回值');
                   hideLoadingMessage();
                    return;
                }

                // 拼接HTML
                var data = res.result;
                var htmlBuilder = [];
                for (day in data) {
                    if (data[day].auto != 0) {
                        data[day].autoFail = Math.round(data[day].autoFail / data[day].auto * 100, 2);
                        data[day].autoRelay = Math.round(data[day].autoRelay / data[day].auto * 100, 2);
                    }
                    if (data[day].manual != 0) {
                        data[day].manualFail = Math.round(data[day].manualFail / data[day].manual * 100, 2);
                    }
                    htmlBuilder.push('<tr>');
                    htmlBuilder.push('<td class="head">' + day.substr(5) + '</td>');
                    htmlBuilder.push('<td>' + data[day].total + '</td>');
                    htmlBuilder.push('<td>' + data[day].auto + '</td>');
                    htmlBuilder.push('<td>' + data[day].autoFail + '</td>');
                    htmlBuilder.push('<td>' + data[day].autoRelay + '</td>');
                    htmlBuilder.push('<td>' + data[day].manual + '</td>');
                    htmlBuilder.push('<td>' + data[day].manualFail + '</td>');
                    htmlBuilder.push('</tr>');
                }

                // 追加DOM
                tableBody.html(htmlBuilder.join(''));

                // 绘图数据
                buildHistoryChartData(data);
            } else {
                errorTip.text(res.message);
            }

            // 隐藏加载提示
            hideLoadingMessage();
        },
        error: function() {
            // 隐藏加载提示
            hideLoadingMessage();
            errorTip.text('系统发生异常。');
        }
    });

}

/**
 * 构造绘图数据
 * @param {Object}
 */
function buildHistoryChartData(data) {
    historyChart = null;
    historyChartXPoints = [];
    historyChartSeries = [];
    historyChartSeries.push({name: '总数', data: []});
    historyChartSeries.push({name: '例行数', data: []});
    historyChartSeries.push({name: '失败率%', data: []});
    historyChartSeries.push({name: '延时率%', data: []});
    historyChartSeries.push({name: '手动数', data: []});
    historyChartSeries.push({name: '失败率%', data: []});

    for (day in data) {
        var shortDay = day.substr(5);
        historyChartXPoints.push(shortDay);
        historyChartSeries[0].data.push(data[day].total);
        historyChartSeries[1].data.push(data[day].auto);
        historyChartSeries[2].data.push(data[day].autoFail);
        historyChartSeries[3].data.push(data[day].autoRelay);
        historyChartSeries[4].data.push(data[day].manual);
        historyChartSeries[5].data.push(data[day].manualFail);
    }

    var isShowing = $('img[method="lineChart"]').attr('class') == 'selected';
    if (isShowing) {
        renderHistoryChart();
    }
}

/**
 * 呈现曲线图
 */
function renderHistoryChart() {
    if (historyChartXPoints.length == 0 || historyChartSeries.length == 0) {
        return;
    }
    var title = '';
    historyChart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'historyChartDiv',
            type: 'line',
            marginRight: 130,
            marginBottom: 50,
            zoomType: 'x',
            resetZoomButton: {
                position: { 
                    x: 0,
                    y: -30
                }
            }
        },
        title: {
            text: title,
            x: -20
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: historyChartXPoints
        },
        yAxis: {
            title: {text: ''},
            plotLines: [{value: 0, width: 1, color: '#808080'}]
        },
        tooltip: {},
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 0,
            borderWidth: 0
        },
        series: historyChartSeries
    });
}
