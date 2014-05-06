$(function() {
    // 给关联开始和结束时间的点击事件绑定日期控件                                  
    $('#baseTimeStart').unbind('click').click(function() {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:mm',
            maxDate: '%y-%M-#{%d}'
        });
    });
    $('#baseTimeEnd').unbind('click').click(function() {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:mm',
            maxDate: '%y-%M-#{%d}'
        });
    });
    realtimeVerifyForm($('#taskRerunForm'));
    realtimeVerifyForm($('#stateChangeForm'));

    $('#rerunTaskBtn').click(function() {
        if (preSubmitVerifyForm('#taskRerunForm') == false) {
            return;
        }
        var baseTimeStart = $('#baseTimeStart').val();
        var baseTimeEnd = $('#baseTimeEnd').val();
        var jobid = $('#jobid').val();
        if (baseTimeStart < '1970') {
            showErrMessage('起始时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd && baseTimeEnd < '1970') {
            showErrMessage('结束时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd && baseTimeStart > baseTimeEnd) {
            showErrMessage('开始时间不能大于结束时间');
            return false;
        }
        var data = {};
        data.baseTimeStart = baseTimeStart;
        data.baseTimeEnd = baseTimeEnd;
        data.jobid = jobid;
        showLoadingMessage('正在处理中...');
        $.post('?m=Task&a=Deal&f=rerunTask', {
            data: data
        }, function(ret) {
            if (ret.status == 'success') {
                showMessage('处理成功！');
            } else {
                showErrMessage('处理失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('处理失败！');
        });
    });

    $('#changeStateBtn').click(function() {
        if (preSubmitVerifyForm('#stateChangeForm') == false) {
            return;
        }
        var data = {};
        data.taskid = $('#taskid').val();
        data.state = $('#state').val();
        showLoadingMessage('正在处理中...');
        $.post('?m=Task&a=Deal&f=changeTaskState', {
            data: data
        }, function(ret) {
            if (ret.status == 'success') {
                showMessage('处理成功！');
            } else {
                showErrMessage('处理失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('处理失败！');
        });
    });
});