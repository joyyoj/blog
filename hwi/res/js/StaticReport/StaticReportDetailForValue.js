// 图数据
var chartData = {};
var chartXData = new Array();
var seriesData = new Array();
var chartType = 'line';
var chart = null;

// 初始化绑定事件 
$(function() {

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

        // 刷新图标和表格
        getChartsData('1');

        // 记录原来的值
        $(this).attr('data-old-value', endTime);

        // 基线时间
        $('div.basetime span').text(endTime);
        $('span.fixed').text(endTime);

        // 导出报表链接的时间参数
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
            // 计算开始时间
            var days = parseInt(element.attr('data-days'), 10);
            var endTime = new Date(txtEndTime.val());
            var beginTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

            // 设置起始时间输入框
            txtBeginTime.attr('data-old-value', txtBeginTime.val());
            txtBeginTime.val(beginTime.toCnString());

            // 样式
            element.addClass('selected');
            element.siblings('a').removeClass('selected');

            // 重新绘图
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

        // 选中行
        var selectedTrs = $(this).find('tbody tr[data-selected="1"]');
        var parentTr = element.parents('tr');
        if (parentTr.size() != 1) {
            return;
        }

        var selected = parentTr.attr('data-selected');
        var rowCode = parentTr.find('td:first').attr('data-code');
        var add = true;
        if (selected == '1') {
            parentTr.attr('data-selected', '0').removeClass('selected');
            add = false;
        } else {
            // 最多可以选择4行，否则取消第一个
            if (selectedTrs.size() >= 4) {
                var oldestTr = selectedTrs.eq(0);
                for (var i = 1; i < selectedTrs.size(); i++) {
                    if (selectedTrs.eq(i).attr('data-time') < oldestTr.attr('data-time')) {
                        oldestTr = selectedTrs.eq(i);
                    }
                }

                oldestTr.attr('data-selected', '0').removeClass('selected');
                changeCharts(false, [oldestTr.find('td:first').attr('data-code')]);
            }

            parentTr.attr('data-selected', '1').attr('data-time', (new Date()).getTime()).addClass('selected');
            add = true;
        }

        // 重新绘制图
        changeCharts(add, [rowCode]);
    });

    // 获取并呈现报表数据
    getChartsData();

});

// 获取报表信息集合
function getChartsData(needTableData) {

    // 请求参数 
    var data = buildParams(needTableData);
    showLoadingMessage('正在加载数据...');
    $.ajax({
        type: 'POST',
        url: '?m=StaticReport&a=View&f=ajaxQueryForValue',
        dataType: 'JSON',
        data: data,
        success: function(data, textStatus) {
            hideLoadingMessage();
            if (data.status) {

                // 重新绘制二维表
                if (needTableData == '1') {
                    renderTable(data.result.table);

                    // 创建排序按钮
                    TableSort.flashSortIcon(data.result.table, 'value');

                    // 隔行底色
                    TableSort.oddRowColor();
                }

                // 分析数据 
                analysisXData(data.result.chart);
                analysisSeriesData(data.result.chart);

                // 默认展示第一行的图标
                var rowCodes = new Array();
                var selectTrs = $('#tableContent tbody tr[data-selected="1"]');
                if (selectTrs.size() == 0) {
                    var defaultTr = $('#tableContent tbody tr:first');
                    var rowCode = defaultTr.find('td:first').attr('data-code');
                    rowCodes.push(rowCode);
                    defaultTr.attr('data-selected', '1').attr('data-time', (new Date()).getTime()).addClass('selected');
                } else {
                    selectTrs.each(function() {
                        rowCodes.push($(this).find('td:first').attr('data-code'));
                    });
                }
                changeCharts(true, rowCodes);
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
function buildParams(needTableData) {
    var rowCodes = new Array();
    $('#tableContent tbody tr').each(function() {
        rowCodes.push($(this).find('td:first').attr('data-code'));
    });

    var data = {};
    data['rowCode'] = rowCodes;
    data['reportId'] = $('#hidReportId').val();
    data['needTableData'] = needTableData == '1' ? needTableData: '0';
    data['beginTime'] = $('#txtBeginTime').val();
    data['endTime'] = $('#txtEndTime').val();

    return data;
}

// 绘制二维表
function renderTable(table) {
    var htmlArray = new Array();
    for (var i = 1; i < table.length; i++) {
        htmlArray.push('<tr>');
        for (var j = 0; j < table[i].length; j++) {
            htmlArray.push('<td data-code="' + table[i][j].value + '">');
            htmlArray.push(table[i][j].name);
            htmlArray.push('</td>');
        }
        htmlArray.push('</tr>');
    }

    $('#tableContent tbody').html(htmlArray.join(''));
}

// 隐藏表格未选中的曲线
function hiddenChartLineFromTable() {
    if (chart == null) {
        return;
    }

    var series = chart.series;
    $('#tableContent tr[data-selected="0"]').each(function() {
        var tr = $(this);
        for (var i = 0; i < series.length; i++) {
            if (series[i].visible == true && series[i].name == tr.find('td:first').text()) {
                series[i].hide();
            }
        }
    });

}

// 呈现曲线图
function renderCharts(seriesData) {
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
            text: '',
            x: -20
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: chartXData,
            labels: {
                overflow: 'hidden',
                style: ''
            }
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

// chart默认的显示
function chartShow(event) {
    var element = event.target || event.srcElement;
    if (!element.name) {
        return false;
    }
    // 修改对应行的显示状态
    $('#tableContent tr[data-selected="0"]').each(function() {
        var tr = $(this);
        if (tr.find('td:first').text() == element.name) {
            tr.attr('data-selected', '1').addClass('selected');
        }
    });
}
// chart默认的隐藏
function chartHide(event) {
    var element = event.target || event.srcElement;
    if (!element.name) {
        return;
    }

    // 修改对应行的显示状态
    $('#tableContent tr[data-selected="1"]').each(function() {
        var tr = $(this);
        if (tr.find('td:first').text() == element.name) {
            tr.attr('data-selected', '0').removeClass('selected');
        }
    });
}

// 更改取消图线条
function changeCharts(add, rowCodes) {
    if (!$.isArray(rowCodes) || rowCodes.length <= 0) {
        return;
    }

    // 显示曲线
    if (add == true) {
        for (var i = 0; i < rowCodes.length; i++) {
            var rowCode = chartData[rowCodes[i]];
            if (!rowCode) {
                continue;
            }

            if (rowCode.used) {
                var series = chart.series;
                for (var j = 0; j < series.length; j++) {
                    if (rowCode.data.name == series[j].name && !series[j].visible) {
                        series[j].show();
                    }
                }
            } else {
                rowCode.used = true;
                seriesData.push(rowCode.data);

                if (chart == null) {
                    renderCharts(seriesData);
                } else {
                    chart.addSeries(rowCode.data);
                }
            }

            // 记录每条线的显示状态和显示状态更新时间
            rowCode.visibleChangeTime = (new Date()).getTime();
            rowCode.visible = true;
        }
    }

    // 隐藏曲线
    if (add == false && chart != null) {
        var series = chart.series;
        for (var i = 0; i < rowCodes.length; i++) {
            for (var j = 0; j < series.length; j++) {
                if (chartData[rowCodes[i]].data.name == series[j].name && series[j].visible) {
                    series[j].hide();
                    // 记录每条线的显示状态和显示状态更新时间
                    chartData[rowCodes[i]].visibleChangeTime = (new Date()).getTime();
                    chartData[rowCodes[i]].visible = false;
                }
            }
        }
    }

}

// 分析x轴上的坐标点
function analysisXData(data) {
    chartXData.splice(0, chartXData.length);
    for (var i = 0; i < data[0].value.length; i++) {
        chartXData.push(data[0].value[i].name);
    }
}

// 分析坐标数据
function analysisSeriesData(data) {
    chart = null;
    seriesData.splice(0, seriesData.length);
    chartData = {};
    for (var i = 0; i < data.length; i++) {
        var name = $('#tableContent td[data-code="' + data[i].name + '"]').text();
        var dots = new Array();
        for (var j = 0; j < data[i].value.length; j++) {
            dots.push(parseFloat(data[i].value[j].value, 10));
        }
        chartData[data[i].name] = {
            'data': {
                'name': name,
                'data': dots
            },
            'used': false
        };
    }
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
