$(document).ready(function() {
    baiduBiglog.createDataTable({
        elementId: 'userCostDetail',
        colDef: [],
        displayLength: 10,
        aaData: resourceStatProfileObj.costDetailList,
    });

    function renderCharts(data) {
        var chart = new Highcharts.Chart({
            credits: {
                enabled: false
            },
            chart: {
                renderTo: 'userHistoryCost'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: data.dateTime
            },
            yAxis: {
                title: {text: '单位：元'}
            },
            tooltip: {
                formatter: function() {
                    var costStr = '';
                    if (this.y < 1) {
                        costStr = (new Number(this.y)).toPrecision(2);
                    } else {
                        costStr = (new Number(this.y)).toFixed(1);
                    }
                    return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + costStr + '元';
                }
            },
            series: [
            {
                name: '总消费额',
                data: data.sumCost,
                type: 'column'
            },
            {
                name: '个人消费额',
                data: data.selfCost
            },
            {
                name: '下属消费额',
                data: data.subCost
            }]
        });
        var selfSum = 0, subSum = 0;
        $.each(data.selfCost, function(idx, num) {
            selfSum += num;
        });
        $.each(data.subCost, function(idx, num) {
            subSum += num;
        });
        chart.series[0].hide();
        if (subSum < 1) {
            chart.series[2].hide();
        } else if (selfSum < 1) {
            chart.series[1].hide();
        } 
    }
    renderCharts(resourceStatProfileObj.userHistoryCost);

    function updateCostTrend() {
        $.ajax({
            url: '?m=ResourceStat&a=Profile&user=' + resourceStatProfileObj.targetUser
                + '&f=getUserHistoryCostAjax'
                + '&date=' + resourceStatProfileObj.targetDate
                + '&bdate=' + $('#trendStartDateInput').val()
                + '&edate=' + $('#trendEndDateInput').val(),
            dataType: 'json',
            success: function(data) {
                renderCharts(data);
            }
        });
    }

    $('#resourceStatProfileCurDayInput').bind('click', function() {
        WdatePicker({
            minDate: resourceStatProfileObj.minDate,
            maxDate: resourceStatProfileObj.maxDate,
            onpicked: function() {
                window.location = '/?m=ResourceStat&a=Profile&date=' + this.value;
            }
        });
    });

    $('#trendStartDateInput').bind('click', function() {
        WdatePicker({
            minDate: resourceStatProfileObj.minDate,
            maxDate: resourceStatProfileObj.maxDate,
            onpicked: updateCostTrend
        });
    });

    $('#trendEndDateInput').bind('click', function() {
        WdatePicker({
            minDate: resourceStatProfileObj.minDate,
            maxDate: resourceStatProfileObj.maxDate,
            onpicked: updateCostTrend
        });
    });
});
