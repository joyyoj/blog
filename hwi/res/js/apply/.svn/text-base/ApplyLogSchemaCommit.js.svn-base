$(document).ready(function() {
    new bsn.AutoSuggest('qaList', auto_suggest_options_comma);
    new bsn.AutoSuggest('opList', auto_suggest_options_comma);
    realtimeVerifyForm($('#applyForm'));
    $('#applySubmit').click(function() {
        if (preSubmitVerifyForm('#applyForm') == false) {
            return;
        }
        var data = {};
        data['applyForm'] = $('#applyForm').find('input, textarea').serializeArray();
        $.post('?m=WorkflowProcess&a=Start&f=logSchemaCommit', data, function(ret) {
            if (ret['status'] == 'success') {
                showMessage('发起流程成功！审批流程完成后生效');
                window.location = '?m=WorkflowProcess&a=List&filter=ViewAll';
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });
    $('#applyReturn').click(function() {
        var url = loggingPlatformEditUri + '&logid=' + logId + '&logName=' + logName + '&productName=' + logProductName;
        window.location = url;
    });
});