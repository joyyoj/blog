$(document).ready(function() {
    new bsn.AutoSuggest('rolemembers', auto_suggest_options_comma);
    new bsn.AutoSuggest('rolemailgroups', auto_suggest_options_mail_comma);
    realtimeVerifyForm($('#applyNewRoleForm'));
    var xhr = null;
    orgTreeOnChange = function(infos) {
        if (!infos || !infos.length) {
            return;
        }
        if (xhr) {
            xhr.abort();
            xhr = null;
        }
        $('#roleorgname').attr('value', infos[0].name);
        $('#roleorgid').attr('value', infos[0].value);
        showLoadingMessage('数据正在加载中...');
        xhr = $.getJSON('?m=Role&a=List&f=getUserRoleListInOrgAjax&orgid=' + infos[0].value + '&userid=' + userid, function(data) {
            roleListTable.fnClearTable();
            roleListTable.fnAddData(data || []);
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) showErrMessage('Loadding Error');
        }).complete(function() {
            hideLoadingMessage();
        });

    }
    $('#applynewroleSubmit').click(function() {
        if ($('#roleorgid').attr('value') == '') {
            showErrMessage('请先选择要申请的角色所在的产品线');
            return;
        }
        if (preSubmitVerifyForm('#applyNewRoleForm') == false) {
            return;
        }
        var data = {};
        data['applyDataForm'] = {};
        data['applyDataForm'] = $('#applyNewRoleForm').find('input, textarea').serializeArray();
        $.post('?m=WorkflowProcess&a=Start&f=workflowConntroller', data, function(ret) {
            if (ret['status'] == 'success') {
                alert('success! 转到我的角色列表');
                window.location = '?m=Role&a=List';
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });
});