$(document).ready(function() {
    realtimeVerifyForm($('#RoleUpdateForm'));
    new bsn.AutoSuggest('UpdateRoleAdmin', auto_suggest_options);
    $('#roleUpdateBtn').click(function() {
        if (preSubmitVerifyForm($('#RoleUpdateForm')) == false) {
            return;
        }
        $.getJSON('?m=Role&a=Update&f=doUpdate&roleId=' + roleId + '&' + $('#RoleUpdateForm').serialize(), function(ret) {
            if (ret['status'] == 'success') {
                showMessage('更新成功');
            } else {
                showErrMessage(ret['message']);
            }
        });
    });
});