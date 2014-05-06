$(document).ready(function() {
    //隐藏用户不关心的列                                                           
    $('#dialogDeleteRole').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            'Ok': function() {
                var roleId = roleListTableVar._('tr.row_selected')[0][1];
                var url = '?m=Role&a=List&f=deleteRoleById&roleId=' + roleId;
                $(this).dialog('close');
                var xhr = null;
                showLoadingMessage('正在删除角色...');
                xhr = $.getJSON(url, function(ret) {
                    if (ret['status'] == 'success') {
                        $.each($('#roleListTable tr.row_selected'), function(i, n) {
                            roleListTableVar.fnDeleteRow(n);
                        });
                        showMessage('删除成功!');
                    } else {
                        showErrMessage(ret['message']);
                    }
                }).error(function(xhr, textStatus, errorThrown) {
                    if (xhr.getAllResponseHeaders()) {
						showErrMessage('Loadding Error');
					}
                }).complete(function() {});

            }, 'Cancel': function() {
                $(this).dialog('close');
            }
        }
    });

    $('#roleMemberManageBtn').click(function() {
        var selected = roleListTableVar._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个角色');
            return;
        }
        var url = '?m=Role&a=Member&roleId=' + selected[0][1];
        window.location = url;
    });

    $('#rolePermissionViewBtn').click(function() {
        var selected = roleListTableVar._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个角色');
            return;
        }
        var url = '?m=Role&a=Permission&roleId=' + selected[0][1];
        window.location = url;
    });

    $('#roleUpdateBtn').click(function() {
        var selected = roleListTableVar._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个角色');
            return;
        }
        var rowInfo = {};
        rowInfo['id'] = selected[0][1];
        rowInfo['name'] = selected[0][2];
        rowInfo['comment'] = selected[0][5];
        rowInfo['admin'] = selected[0][6];
        window.location = '?m=Role&a=Update&' + $.param(rowInfo);
    });

    $('#roleDeleteBtn').click(function() {
        var selected = roleListTableVar._('tr.row_selected');
        if (!selected.length) {
            showErrMessage('请选择一个角色');
            return;
        }
        $('#dialogDeleteRole label').text(selected[0][2]);
        $('#dialogDeleteRole').dialog('open');
    });
});