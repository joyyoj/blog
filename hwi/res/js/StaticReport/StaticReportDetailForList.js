// 图数据
var chartData = {};
var chartXData = new Array();
var chart = null;
var seriesData = new Array();
var chartType = 'line';
var showChart = $('#hidChartShow').val() == '1';
var keys = new Array();

// 初始化绑定事件 
$(function() {

    // 分析keys组合
    keys = analyseKeys();

    // 面包屑提示
    $('.tip-desc').poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 5,
        allowTipHover: true
    });

    $('span.rightturn').click(function() {
        var txtTime = $(this).prev();
        var currentTime = new Date(txtTime.val());
        var nextTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

        txtTime.val(nextTime.toCnString());
        txtTime.trigger('change');
    });

    $('span.leftturn').click(function() {
        var txtTime = $(this).next();
        var currentTime = new Date(txtTime.val());
        var preTime = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

        txtTime.val(preTime.toCnString());
        txtTime.trigger('change');
    });

    $('#txtBeginTime').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $('#txtEndTime').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $('#txtBeginTime').change(function(event) {
        var beginTime = $(this).val();
        var oldBeginTime = $(this).attr('data-old-value');
        if (beginTime == oldBeginTime) {
            return;
        }

        clearRenderData();
        getChartsData();
        $(this).attr('data-old-value', beginTime);

        // 设置最近一周和最近30天的选中状态
        setNearlyLink();
    });

    $('#txtEndTime').change(function(event) {
        var endTime = $(this).val();
        var oldEndTime = $(this).attr('data-old-value');
        if (endTime == oldEndTime) {
            return;
        }

        renderTable();
        $(this).attr('data-old-value', endTime);
        $('span.fixed').text(endTime);
        $('div.basetime span').text(endTime);

        // 导出报表
        var reg = /endTime=\d{4}-\d{2}-\d{2}/g;
        var exportLink = $('div.basetime a');
        var link = exportLink.attr('href');
        link = link.replace(reg, 'endTime=' + endTime);
        exportLink.attr('href', link);

        // 设置最近一周和最近30天的选中状态
        setNearlyLink();
    });

    $('#divOperation').click(function(event) {
        var element = $(event.target || event.srcElement);
        var method = element.attr('method');

        var txtBeginTime = $('#txtBeginTime');
        var txtEndTime = $('#txtEndTime');
        switch (method) {
        case 'lastWeek':
        case 'lastMonth':
            clearRenderData();

            // 计算时间
            var days = parseInt(element.attr('data-days'), 10);
            var endTime = new Date(txtEndTime.val());
            var beginTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

            // 记录原来的时间
            txtBeginTime.attr('data-old-value', txtBeginTime.val());
            txtBeginTime.val(beginTime.toCnString());

            // 样式
            element.addClass('selected');
            element.siblings('a').removeClass('selected');

            // 重新获取数据呈现图像
            getChartsData();
            break;
        case 'lineChart':
            chartType = 'line';
            renderCharts(seriesData);
            hiddenChartLineFromTable();
            element.attr('class', 'selected');
            $('[method="columnChart"]').attr('class', 'report');
            break;

        case 'columnChart':
            chartType = 'column';
            renderCharts(seriesData);
            hiddenChartLineFromTable();
            element.attr('class', 'selected');
            $('[method="lineChart"]').attr('class', 'report');
            break;
        }
    });

    $('#tableContent tbody').click(function(event) {
        var element = $(event.target || event.srcElement);

        if (!showChart) {
            return;
        }

        // 选中行
        var parentTr = element.parents('tr');
        if (parentTr.size() == 1 && seriesData.length > 0) {
            var selected = parentTr.attr('data-selected');
            var rowCode = parentTr.find('td:first').attr('data-code');
            if (selected == '1') {
                parentTr.attr('data-selected', '0').removeClass('selected');
                // 重新绘制图
                changeCharts(false, [parentTr.attr('data-index')]);
            } else {
                var selectedTrs = $(this).find('tbody tr[data-selected="1"]');
                // 最多可以选择4行
                if (selectedTrs.size() >= 4) {
                    var oldestTr = selectedTrs.eq(0);
                    for (var i = 1; i < selectedTrs.size(); i++) {
                        if (selectedTrs.eq(i).attr('data-time') < oldestTr.attr('data-time')) {
                            oldestTr = selectedTrs.eq(i);
                        }
                    }

                    oldestTr.attr('data-selected', '0').removeClass('selected');
                    changeCharts(false, [oldestTr.attr('data-index')]);
                }
                parentTr.attr('data-selected', '1').attr('data-time', (new Date()).getTime()).addClass('selected');
                getChartsData(parentTr);
            }
        }
    });

    // 获取并呈现报表数据
    if (showChart) {
        clearRenderData();
        getChartsData();
    }

});

// 清空展示数据
function clearRenderData() {
    if (!showChart) {
        return;
    }

    chartData = {};
    chartXData.splice(0, chartXData.length);
    seriesData.splice(0, seriesData.length);
    $('#tableContent tbody tr').attr('data-selected', '0').removeClass('selected');

    // 清空图
    if (chart != null) {
        chart.destroy();
        chart = null;
    }

    var defaultTr = $('#tableContent tbody tr:first');
    if (defaultTr.find('td').size() == $('#tableContent thead th').size()) {
        defaultTr.attr('data-selected', '1').attr('data-time', (new Date()).getTime()).addClass('selected');
    }
}

// 根据表格的未选中项调整图标
function hiddenChartLineFromTable() {
    if (chart == null) {
        return;
    }

    var series = chart.series;
    $('#tableContent tr[data-selected="0"]').each(function() {
        var tr = $(this);
        var item = chartData[tr.attr('data-index')];
        if (!item) {
            return;
        }
        for (var i = 0; i < series.length; i++) {
            if (series[i].name == item.data.name && series[i].visible) {
                series[i].hide();
            }
        }
    });
}

// 获取报表信息集合
function getChartsData(selectedRow) {
    if (!selectedRow) {
        selectedRow = $('#tableContent tbody tr[data-selected="1"]:first');
        if (selectedRow.size() == 0) {
            return;
        }
    }
    var index = selectedRow.attr('data-index');
    if (chartData[index]) {
        showChartBaseSelected();
        return;
    }

    // 请求参数 
    var data = buildParams(selectedRow);
    showLoadingMessage('正在加载数据...');
    $.ajax({
        type: 'POST',
        url: '?m=StaticReport&a=View&f=ajaxQueryForList',
        dataType: 'JSON',
        data: data,
        success: function(data, textStatus) {
            hideLoadingMessage();
            if (data.status) {

                // 分析数据 
                if (chartXData.length == 0) {
                    analysisXData(data.result.chart);
                }
                analysisSeriesData(data.result.chart, selectedRow.attr('data-index'));

                showChartBaseSelected();
            } else {
                alert(data.message);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hideLoadingMessage();
            alert('系统发生异常，请联系管理员。');
        }
    });
}

// 构建ajax请求头
function buildParams(selectedRow) {
    var chartShow = $('#hidChartShow').val();
    var data = {};
    data['reportId'] = $('#hidReportId').val();
    data['endTime'] = $('#txtEndTime').val();
    data['reportName'] = $('#hidComposedReportName').val();
    data['needTableData'] = '0';
    data['needChartData'] = chartShow;
    if (chartShow == '1' && selectedRow) {
        var keys = new Array();
        var ths = $('#tableContent thead th');
        for (var i = 0; i < ths.size(); i++) {
            var kv = ths.eq(i).attr('data-kv');
            if (kv == 'key') {
                keys.push({
                    'name': ths.eq(i).attr('data-code'),
                    'value': selectedRow.find('td').eq(i).text()
                });
            }
        }
        data['reportId'] = $('#hidReportId').val();;
        data['beginTime'] = $('#txtBeginTime').val();
        data['reportName'] = $('#hidComposedReportName').val();
        data['value'] = $('#tableContent th[data-kv="value"]').attr('data-code');
        data['keys'] = keys;
    }
    return data;
}

function showChartBaseSelected() {
    var rowCodes = new Array();
    var trs = $('#tableContent tbody tr[data-selected="1"]');
    for (var i = 0; i < trs.size(); i++) {
        rowCodes.push(trs.eq(i).attr('data-index'));
    }
    changeCharts(true, rowCodes);
}

// 绘制二维表
function renderTable() {

    // 请求参数 
    var params = {};
    params['endTime'] = $('#txtEndTime').val();
    params['reportName'] = $('#hidComposedReportName').val();
    params['needTableData'] = '1';
    params['needChartData'] = '0';
    showLoadingMessage('正在加载数据...');
    $.ajax({
        type: 'POST',
        url: '?m=StaticReport&a=View&f=ajaxQueryForList',
        dataType: 'JSON',
        data: params,
        success: function(data, textStatus) {
            hideLoadingMessage();
            if (data.status) {
                var table = data.result.table;
                var htmlArray = new Array();
                if ($.isArray(table) && table.length > 0) {

                    // 创建排序按钮 
                    TableSort.flashSortIcon(table, 'list');

                    // 隔行底色
                    TableSort.oddRowColor();

                    for (var i = 0; i < table.length; i++) {
                        htmlArray.push('<tr data-index="' + (i + 1) + '">');
                        for (var j = 0; j < table[i].length - 2; j++) {
                            htmlArray.push('<td>');
                            htmlArray.push(table[i][j]);
                            htmlArray.push('</td>');
                        }
                        htmlArray.push('</tr>');
                    }
                } else {
                    var tdCount = $('#tableContent thead th').size();
                    htmlArray.push('<tr>');
                    htmlArray.push('<td colspan="' + tdCount + '" style="text-align:center;">');
                    htmlArray.push(params['endTime'] + '没数据');
                    htmlArray.push('</td>');
                    htmlArray.push('</tr>');
                }
                $('#tableContent tbody').html(htmlArray.join(''));

                clearRenderData();

                if (showChart) {
                    getChartsData();
                }
            } else {
                alert(data.message);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hideLoadingMessage();
            alert('系统发生异常，请联系管理员。');
        }
    });
}

// 呈现曲线图
function renderCharts(seriesData) {
    if (seriesData.length == 0) {
        return;
    }
    var title = $('#tdReportName').text();
    chart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'reportChartsDiv',
            type: chartType,
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
            categories: chartXData
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
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
        plotOptions: {
            series: {
                events: {
                    hide: chartHide,
                    show: chartShow
                }
            }
        },
        series: seriesData
    });
}

function chartHide(event) {
    var element = event.target || event.srcElement;
    if (!element.name) {
        return false;
    }

    $('#tableContent tr[data-selected="1"]').each(function() {
        var tr = $(this);
        if (chartData[tr.attr('data-index')].data.name == element.name) {
            tr.attr('data-selected', '0').removeClass('selected');
        }
    });
}

function chartShow(event) {
    var element = event.target || event.srcElement;
    if (!element.name) {
        return false;
    }

    $('#tableContent tr[data-selected="0"]').each(function() {
        var tr = $(this);
        if (chartData[tr.attr('data-index')].data.name == element.name) {
            tr.attr('data-selected', '1').addClass('selected');
        }
    });
}

// 更改取消图线条
function changeCharts(add, rowCodes) {

    if (add) {
        for (var i = 0; i < rowCodes.length; i++) {
            var rowCode = chartData[rowCodes[i]];
            if (!rowCode) {
                continue;
            }

            if (rowCode.isShowing) {
                var series = chart.series;
                for (var j = 0; j < series.length; j++) {
                    if (rowCode.data.name == series[j].name && !series[j].visible) {
                        series[j].show();
                    }
                }
                continue;
            }

            rowCode.isShowing = true;
            seriesData.push(rowCode.data);

            if (chart == null) {
                renderCharts(seriesData);
            } else {
                chart.addSeries(rowCode.data);
            }
        }
    }

    if (add == false && chart != null) {
        var series = chart.series;
        for (var i = 0; i < rowCodes.length; i++) {
            for (var j = 0; j < series.length; j++) {
                if (chartData[rowCodes[i]].data.name == series[j].name && series[j].visible) {
                    series[j].hide();
                }
            }
        }
    }
}

// 分析x轴上的坐标点
function analysisXData(data) {
    for (var i = 0; i < data.length; i++) {
        chartXData.push(data[i].name);
    }
}

// 分析坐标数据
function analysisSeriesData(data, index) {

    var name = '';
    var row = $('#tableContent tbody tr[data-index="' + index + '"]');
    for (var i = 0; i < keys.length; i++) {
        name += keys[i].name + ':' + row.find('td').eq(keys[i].index).text() + ',';
    }
    name = name.substring(0, name.length - 1);

    var dots = new Array();
    for (var i = 0; i < data.length; i++) {
        dots.push(parseInt(data[i].value, 10));
    }

    chartData[index] = {
        'data': {
            'name': name,
            'data': dots
        },
        'isShowing': false
    };
}

// 分析keys信息
function analyseKeys() {
    var keys = new Array();

    var ths = $('#tableContent thead th');
    for (var i = 0; i < ths.size(); i++) {
        var th = ths.eq(i);
        if (th.attr('data-kv') != 'key') {
            continue;
        }
        keys.push({
            'index': i,
            'code': th.attr('data-code'),
            'name': th.text()
        });
    }

    return keys;
}

// 设置最近一周和最近30天的选中状态
function setNearlyLink() {
    var beginTime = new Date($('#txtBeginTime').val());
    var endTime = new Date($('#txtEndTime').val());
    var diffDays = (endTime.getTime() - beginTime.getTime()) / (24 * 60 * 60 * 1000);

    var lastWeek = $('a[method="lastWeek"]');
    var lastMonth = $('a[method="lastMonth"]');

    if (diffDays == 6) {
        lastWeek.addClass('selected');
    } else {
        lastWeek.removeClass('selected');
    }
    if (diffDays == 29) {
        lastMonth.addClass('selected');
    } else {
        lastMonth.removeClass('selected');
    }
}
