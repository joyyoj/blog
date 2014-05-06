$(document).ready(function() {
    //隐藏用户不关心的列                                                           
    setTimeout(function() {
        myStartWorkflowTable.fnSort([[7, 'desc']]);
    }, 200);
    $('#viewProcessBtn').click(function() {
        var selected = myStartWorkflowTable._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个流程');
            return;
        }
        window.location = '?m=WorkflowProcess&a=Detail&processId=' + selected[0][1];
    });
    $('#terminateProcessBtn').click(function() {
        var selected = myStartWorkflowTable._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个流程');
            return;
        }
        $('#del_workflow').modal('show');
    });
    $('a[name="delConfirm"]').click(function() {
        var selected = myStartWorkflowTable._('tr.row_selected');
        $.getJSON('?m=WorkflowProcess&a=Terminate&processId=' + selected[0][1], function(ret) {
            if (ret['status'] == 'success') {
                showMessage('删除成功');
                myStartWorkflowTable.fnDeleteRow(myStartWorkflowTable.$('tr.row_selected')[0]);
            } else {
                showErrMessage('执行失败:' + ret['message']);
            }
        });
        $('#del_workflow').modal('hide');
    });
});