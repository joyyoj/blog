$(document).ready(function() {
    new bsn.AutoSuggest('joinMemberList', auto_suggest_options);
    new bsn.AutoSuggest('joinMailgroupList', auto_suggest_options_mail);
    //隐藏用户不关心的列                                                           
    realtimeVerifyForm($('#applyJoinRoleForm'));
    var xhr = null;
    orgTreeOnChange = function(infos) {
        if (!infos || !infos.length) {
            return;
        }
        if (xhr) {
            xhr.abort();
            xhr = null;
        }
        showLoadingMessage('数据正在加载中...');
        $('#joinRoleOrgId').attr('value', infos[0].value);
        xhr = $.getJSON('?m=Role&a=List&f=getUserRoleListInOrgAjax&orgid=' + infos[0].value + '&userid=' + userid, function(data) {
            fnAddData(roleListTable, data);
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) {
                showErrMessage('Loadding Error');
            }
        }).complete(function() {
            hideLoadingMessage();
        });

    }
    $('#joinrolelist tbody tr').live('click', function() {
        var selected = roleListTable._('tr.row_selected ');
        if (!selected.length) {
            return;
        }
        $('#joinRoleId').attr('value', selected[0][1]);
        $('#joinRoleName').attr('value', selected[0][2]);
    });
    $('#joinRoleSubmit').click(function() {
        if ($('#joinRoleId').attr('value') == '') {
            showErrMessage('请先选择要申请的角色(点击产品线查看角色)');
            return;
        }
        if (preSubmitVerifyForm('#applyJoinRoleForm') == false) {
            return;
        }
        var names = $('#joinMemberList').attr('value');
        var mailgroups = $('#joinMailgroupList').attr('value');
        if (names.replace('[;\s]', '') == '' && mailgroups.replace('[;\s]', '') == '') {
            showErrMessage('人与邮件组至少需要填写一个');
            return;
        }

        var data = {};
        data['applyDataForm'] = {};
        data['applyDataForm'] = $('#applyJoinRoleForm').find('input, textarea').serializeArray();
        $.post('?m=WorkflowProcess&a=Start&f=workflowConntroller', data, function(ret) {
            if (ret['status'] == 'success') {
                showMessage('发起流程成功！审批流程完成后生效');
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });
});