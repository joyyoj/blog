$(document).ready(function() {
    $('#approveoption').after($('<span class="errmsgItem">如果打回表单，审批人意见不需要填写,仅填写打回原因即可</span>'));

    var dataFillForm = {};
    dataFillForm['activityId'] = activityId;
    $('#submitWorkflowForm').click(function() {
        dataFillForm['processForm'] = {};
        dataFillForm['processForm'] = arrayToMap($('#workflowProcessForm').serializeArray());
        for (var i in dataFillForm['processForm']) {
            if (dataFillForm['processForm'][i].length > 500) {
                showErrMessage('表单内容太长，最多只能500字');
                return;
            }
        }

        if (dataFillForm['processForm']['dynreject[\'reject\']'] == 'reject') {
            dataFillForm['processForm']['BPM_REJECT_TARGET'] = $('#dynreject select').attr('value');
            dataFillForm['processForm']['BPM_REJECT_REASON'] = dataFillForm['processForm']['dynreject[\'reason\']'];
            delete dataFillForm['processForm']['approveoption'];
        }
        delete dataFillForm['processForm']['dynreject[\'reason\']'];
        delete dataFillForm['processForm']['dynreject[\'reject\']'];
        delete dataFillForm['processForm']['dynreject[\'target\']'];
        $.post('?m=WorkflowProcess&a=Submit&f=submitForm', dataFillForm, function(ret) {
            if (ret['status'] == 'success') {
                showMessage('处理成功');
                $.ajax({
                    type: 'GET',
                    url: '?m=WorkflowProcess&a=PreDeal&f=getMsgCount',
                    async: false,
                    success: function(data) {
                        $('#menuNewMsg .badge-warning').html(data);
                        if (parseInt(data) == 0) {
                            $('#menuNewMsg').hide();
                        }
                    }
                });
                window.location = '?m=WorkflowProcess&a=NeedToDeal';
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });
});
