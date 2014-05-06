function getGlobalDataQuality(time) {
    window.location = '?m=Quality&a=Summary&time=' + time;
}

function qualityOnChange(data) {
    if (data == null || data.length == 0) {
        return;
    }

    //for全局数据质量的time参数                                                    
    if (typeof data['timePicker'] != 'undefined') {
        if (data['timePicker'] != currDate) {
            getGlobalDataQuality(data['timePicker']);
            return;
        } else {
            delete data['timePicker'];
        }
    }

    //筛选条件=>class前缀                                                          
    var fMap = {
        'version': 'fIv',
        'logtype': 'fIlt',
        'taskid': 'fIt',
        'jobid': 'fIj',
        'stepid': 'fIs',
        'DQMetricType': 'fIm',
    };

    //dimensionm名称                                                               
    var dimensionMap = [
		'fIcTrVALIDITY', 
		'fIcTrINTEGRITY', 
		'fIcTrCONSISTENCY', 
		'fIcTrTIMEVALIDITY', 
		'fIcTrREDUNDANCY', 
		'fIcTrSTABILITY', 
		'fIcTrUSABILITY', 
		'fIcTrLOGICALITY', 
	];

    var filters = '';
    $('#dataQualityTable tr').addClass('hd');
    $('#dataQualityTable tr').first().removeClass('hd');
    $.each(data, function(i, n) {
        if (n == 'display') {
            $('.fIcTr' + i).removeClass('hd');
        } else {
            filters += '.' + fMap[i] + n;
        }
    });

    //根据filter筛选列                                                             
    $('#dataQualityTable td').not('.tbhdt').addClass('hd');
    $('#dataQualityTable').find('td' + filters).removeClass('hd');

    //如果某个dimension的所有行都隐藏，则这个dimension也隐藏                       
    $.each(dimensionMap, function(i, n) {
        if ($('.' + n).find('td').not('.tbhdt,.hd').length == 0) {
            $('.' + n).addClass('hd');
        }
    });
}

function gotoDataDetail() {
    url = location.search;
    if (dataType == '2') {
        url = url.replace(/^.m=.*dataId=/, '?m=Data&a=Detail&dataId=');
    } else if (dataType == '1') {
        url = url.replace(/^.m=.*dataId=/, '?m=Data&a=LoggingDetail&dataId=');
    }
    window.location = url;
}

function showQualityDetail(id, title) {
    $('#dialog').html($('#' + id));
    $('#ui-dialog-title-dialog').text(title + '详情');
    $('#dialog').dialog('open');
} 

(function() {
    var DataCache = {};
    var dpDiv = [];
    var CurrDisplay = ''; //当前展示的日历页的时间戳                            
    var Currdate = new Date();
    var ajaxPid = ''; //ajax Pid                                                
    function disableDays(dpDiv, days) {
        if (typeof days != 'undefined') {
            $.each($(dpDiv).find('a.ui-state-default'), function(i, n) {
                if (days[$(n).text()] == 0) {
                    $(n).addClass('ui-state-disabled');
                    $(n).attr('href', 'javascript:void(0)');
                    $(n).parent().removeAttr('onclick');
                    $(n).attr('title', '当天没有产生全局质量数据');
                }
            });
        }
    }

    fillDatePicker = function(year, month, inst) {
        var Currtime = Currdate.getTime();
        CurrDisplay = Currtime;
        dpDiv = inst.dpDiv;
        if (typeof DataCache[year] == 'undefined') { //cache 为空                  
            DataCache[year] = {};
        }
        if (typeof DataCache[year][month] == 'undefined') { //cache 为空          
            clearTimeout(ajaxPid);
            ajaxPid = setTimeout(function() {
                url = '?m=Quality&a=Summary&f=getAJAXDaysHaveData&year=' + year + '&month=' + month + '&time=' + Currtime;
                $.getJSON(url, function(ret) {
                    if (typeof ret['status'] != 'undefined' && ret['status'] == 'success') {
                        DataCache[year][month] = ret['days'];
                    }
                    if (ret['time'] == CurrDisplay) { //如果是当前页面                
                        disableDays(dpDiv, ret['days']);
                    }
                });
            }, 200);
        }
        if (typeof DataCache[year][month] != 'undefined') {
            disableDays(dpDiv, DataCache[year][month]);
        }
    }
})();

$(document).ready(function() {
    $('td,span').attr('title', ''); //临时去掉所有Title                       
    $('#navback').click(function() {
        window.history.go( -1);
    });
    $('#dimension_opts span').addClass('selected');
    $('#version_opts span').last().click();

    if ($('#timePicker_opts span').length != 0) {
        //展示datePicker                                                    
        $('#timePicker_opts').parent().before($('<tr class="filterline">' + 
			'<td class="filterkey"> 指定时间:</td> ' +
			'<td class="checkboxOptions">' +
			'<input name = "time" id = "timeSetter" class = "timeStterSty">' +
			'</td></tr>'));

        $('#timeSetter').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function(dateText, inst) {
                getGlobalDataQuality(dateText);
            },
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            changeMonth: true,
            changeYear: true,
            yearRange: '-5:+1',
            showButtonPanel: true,
            closeText: '关闭',
            currentText: '今天',
            beforeShow: function(input, inst) {
                setTimeout(function() { //这里清除pid不是很好，影响反应速度  
                    fillDatePicker(inst.drawYear, inst.drawMonth + 1, inst);
                }, 50);
            },
            onChangeMonthYear: function(year, month, inst) {
                setTimeout(function() {
                    fillDatePicker(year, month, inst);
                }, 50);
            },
        });

        //将当期日期选定                                                    
        $.each($('#timePicker_opts span'), function(i, n) {
            if ($(n).attr('value') == currDate) {
                $(n).addClass('selected');
                $('#timePicker').text($(n).attr('value'));
                $('#timePicker').attr('value', '');
                $('#timePicker').css('display', 'inline');
                return false;
            }
        });
    }

    $('#dialog').dialog({
        autoOpen: false,
        width: 600,
        position: [160, 60],
        close: function(event, ui) {
            $('#qualityDetailPrepare').append($(this).children());
        },
        buttons: {
            '确定': function() {
                $(this).dialog('close');
            }
        }
    });

});