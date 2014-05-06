$(document).ready(function() {
    new bsn.AutoSuggest('memberList', auto_suggest_options_comma);
    new bsn.AutoSuggest('mailgroupList', auto_suggest_options_mail_comma);
    realtimeVerifyForm($('#addMemberForm'));
    var xhr = null;
    $('#rolememberselector').change(function() {
        getRoleListAJAX();
    });
    getRoleListAJAX = function() {
        showLoadingMessage('正在加载角色成员...');
        xhr = $.getJSON('?m=Role&a=Member&f=getAJAXRoleMemberByRoleId&' + $('#rolememberselector').serialize(), function(data) {
            fnAddData(roleMemberTable, data || []);
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) showErrMessage('Loadding Error');
        }).complete(function() {
            hideLoadingMessage();
        });
    };
    $('#roleMemberDelete').click(function() {
        var selected = roleMemberTable._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个成员');
            return;
        }
        var xhr = null;
        var data = {};
        data['toDeleteMembers'] = {};
        $.each(selected, function(i, n) {
            data['toDeleteMembers'][i] = {};
            data['toDeleteMembers'][i]['id'] = selected[i][1];
            data['toDeleteMembers'][i]['type'] = selected[i][6];
        });
        data['roleId'] = $('#rolememberselector').attr('value');
        showLoadingMessage('正在删除成员...');
        xhr = $.post('?m=Role&a=Member&f=deleteMember', data, function(ret) {
            if (ret['status'] == 'success') {
                $.each($('#rolemembertable tr.row_selected'), function(i, n) {
                    roleMemberTable.fnDeleteRow(n);
                });
                showMessage('删除成功');
            } else {
                showErrMessage(ret['message']);
            }

        }, 'json').error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) showErrMessage('Loadding Error');
        }).complete(function() {});
    });

    $('#closeAddMemberPanel').click(function() {
        $('#AddMemberDialogContainer').css('display', 'none');
    });
    $('#AddMemberSubmit').click(function() {
        if (preSubmitVerifyForm('#addMemberForm') == false) {
            return;
        }
        var names = $('#memberList').attr('value');
        var mailgroups = $('#mailgroupList').attr('value');
        if (names.replace('[;\s]', '') == '' && mailgroups.replace('[;\s]', '') == '') {
            showErrMessage('人与邮件组至少需要填写一个');
            return;
        }
        $('#AddMemberDialogContainer').css('display', 'none');
        showLoadingMessage('正在添加成员...');
        url = '?m=Role&a=Member&f=addMember&roleId=' + $('#rolememberselector').attr('value');
        url += '&' + $('#addMemberForm').serialize();
        xhr = $.getJSON(url, function(ret) {
            if (ret['status'] == 'success') {
                getRoleListAJAX();
                showMessage('添加成功');
            } else {
                showErrMessage(ret['message']);
            }
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) showErrMessage('Loadding Error');
        }).complete(function() {});
    });
});