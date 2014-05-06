$(document).ready(function() {
    //自动补全                                                                     
    new bsn.AutoSuggest('reassignactivity', auto_suggest_options);
    //隐藏用户不关心的列                                                           
    setTimeout(function() {
        workNeedToDealTable.fnSort([[4, 'desc']]);
    }, 50);
    realtimeVerifyForm($('#reassignDialog'));

    $('#dealActivityBtn').click(function() {
        var Tr = workNeedToDealTable._('tr.row_selected');
        if (!Tr.length) {
            showErrMessage('请选择一个流程任务');
            return;
        }
        window.location = '?m=WorkflowProcess&a=PreDeal&processId=' + Tr[0][7] + '&activityId=' + Tr[0][8];
    });
    $('#viewProcessBtn').click(function() {
        var Tr = workNeedToDealTable._('tr.row_selected');
        if (!Tr.length) {
            showErrMessage('请选择一个流程任务');
            return;
        }
        window.location = '?m=WorkflowProcess&a=Detail&from=needToDeal&processId=' + Tr[0][7] + '&activityId=' + Tr[0][8];
    });
    $('#reAssignActivityBtn').click(function() {
        var Tr = workNeedToDealTable._('tr.row_selected');
        if (!Tr.length) {
            showErrMessage('请选择一个流程任务');
            return;
        }
        $('#reassignactivity').val('').next().hide();
        $('#reassignDialog').modal('show');
    });

    $('a[name="save"]').click(function() {
        if ($(this).hasClass('disabled')) {
            return;
        }
        $(this).addClass('disabled');
        if (preSubmitVerifyForm('#reassignDialog') == false) {
            $(this).removeClass('disabled');
            return;
        }
        var Tr = workNeedToDealTable._('tr.row_selected');
        var url = '?m=WorkflowProcess&a=NeedToDeal&f=entruct&processId=' + Tr[0][7] + '&activityId=' + Tr[0][8] + '&newPerformer=' + $('#reassignactivity').attr('value');
        $.getJSON(url, function(ret) {
            if (ret['status'] == 'success') {
                window.location = '?m=WorkflowProcess&a=NeedToDeal';
            } else {
                showErrMessage('委托失败:' + ret['message']);
            }
            $(this).removeClass('disabled');
        }).error(function() {
            showErrMessage('系统暂时不可用，请联系管理员');
            $(this).removeClass('disabled');
        });
    });
});