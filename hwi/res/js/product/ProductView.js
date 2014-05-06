$(document).ready(function() {
    $('#productAddPanel').hide();
    new bsn.AutoSuggest('projectmanager', auto_suggest_options);
    new bsn.AutoSuggest('nodemanager', auto_suggest_options);
    new bsn.AutoSuggest('derector', auto_suggest_options);
    realtimeVerifyForm($('#addProductForm'));
    realtimeVerifyForm($('#productform'));
    $('#message').parent().addClass('hd');
    $('#mail').parent().addClass('hd');
    $('#applyer').parent().addClass('hd');
    $('#applyreason').parent().addClass('hd');
    var currentId = -1;
    var Organization = { //save as struct Organization in meta thrift-idl         
        'parentID': {
            editable: true,
            value: ''
        },
        'englishName': {
            value: ''
        },
        'chineseName': {
            value: ''
        },
        'admin': {
            value: ''
        },
        'director': {
            value: ''
        },
        'manager': {
            value: ''
        },
    };
    var undisplayUicname;
    var undisplayChineseName = {
        admin: '',
        director: '',
        manager: ''
    };

    var xhr = null;
    orgTreeOnchange = function(infos) {
        restoreModify();
        if (!infos || !infos.length) {
			return;
		}
        $('#removeproduct').removeClass('CommonGray');
        $('#removeproduct').addClass('CommonBtn');
        $('#modifyproduct').removeClass('CommonGray');
        $('#modifyproduct').addClass('CommonBtn');
        var info = infos[0];
        var id = info.value;
        $('#parentOrgId').attr('value', id);
        $('#parentOrgName').attr('value', info.name);
        if (xhr) {
            xhr.abort();
            xhr = null;
        }
        currentId = info.value;
        xhr = $.getJSON('?m=Product&a=View&f=getDetail&id=' + info.value, function(ret) {
            if (ret['status'] == 'success') {
                var list = $('#productNodeDetailkv').find('tr').find('td:eq(1)');
                var info = '';
                for (var i in Organization) {
                    info = ret['displayInfo'][i] || '';
                    $('#' + i).text(info);
                    Organization[i]['value'] = info;
                }
                undisplayUicname = ret['undisplay'];
                undisplayChineseName = ret['displayInfo'];

            } else {
                showErrMessage(ret['message']);
            }
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) {
				showErrMessage('Loadding Error');
			}
        }).complete(function() {
            $('#dataschema_processing').css('visibility', 'hidden');
        });
    }

    function setUpModify() {
        if ($('#englishName').text() == '') {
            showErrMessage('请先选择要修改的产品线');
            return;
        }
        $('#modifyproduct').addClass('hd');
        $('#submitmodify').removeClass('hd');
        $('#cancelmodify').removeClass('hd');
        Organization.director.value = undisplayUicname['director'];
        Organization.manager.value = undisplayUicname['manager'];
        Organization.admin.value = undisplayUicname['admin'];
        for (var key in Organization) {
            var item = Organization[key];
            var id = key;
            var name = item.name || id;
            if (item.editable == false) {
				continue;
			}
            var inputid = id + '_input';
            var html = '<input type="text" id="' + inputid + '" name="' + name + '" value="' + item.value + '" />';
            $('#' + id).html(html);
        }
        $('#englishName_input').addClass('cNotNull');
        $('#chineseName_input').addClass('cNotNull');
        $('#admin_input').addClass('cNotNull cOneName');
        $('#director_input').addClass('cNotNull cOneName');
        $('#manager_input').addClass('cNotNull cOneName');
        $('#parentID_input').attr('disabled', true);
        new bsn.AutoSuggest('admin_input', auto_suggest_options);
        new bsn.AutoSuggest('director_input', auto_suggest_options);
        new bsn.AutoSuggest('manager_input', auto_suggest_options);
    }

    function restoreModify() {
        $('#modifyproduct').removeClass('hd');
        $('#submitmodify').addClass('hd');
        $('#cancelmodify').addClass('hd');
        Organization.director.value = undisplayChineseName['director'];
        Organization.manager.value = undisplayChineseName['manager'];
        Organization.admin.value = undisplayChineseName['admin'];
        for (var key in Organization) {
            var item = Organization[key];
            var id = key;
            var name = item.name || id;
            var inputid = id + '_input';
            $('#' + id).html(item.value);
        }
    }
    $('#removeproduct').click(function() {
        var node = $(this);
        if (node.hasClass('CommonGray')) {
            showErrMessage('请选择需要删除的产品线');
            return;
        }
        if (confirm('是否确定删除该产品线')) {
            var xhr = $.getJSON('?m=Product&a=View&f=removeProduct&id=' + currentId, function(ret) {
                if (ret.status == 'success') {
                    var treeObj = $.fn.zTree.getZTreeObj('applynewroleProduct');
                    var nodes = treeObj.getSelectedNodes();
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        treeObj.removeNode(nodes[i]);
                    }
                    currentId = -1;
                    $('#removeproduct').addClass('CommonGray');
                    $('#removeproduct').removeClass('CommonBtn');
                    showMessage('删除成功');
                } else {
                    showErrMessage('删除失败 : ' + ret.message);
                }
            }).error(function(xhr, textStatus, errorThrown) {
                if (xhr.getAllResponseHeaders()) showErrMessage('Loadding Error');
            }).complete(function() {});
        }
    });

    function markProductState() {
        var inputs = $('#productform input');
        for (var i = 0,
        len = inputs.length; i < len; i++) {
            if (!inputs.eq(i).attr('id')) {
				continue;
			}
            var id = inputs.eq(i).attr('id').replace('_input', '');
            var value = inputs.eq(i).attr('value');
            if (Organization[id]) {
                Organization[id]['value'] = value;
            }
        }
    }
    var xhr = null;

    function submitModify() {
        if (preSubmitVerifyForm($('#productform')) == false) {
            return;
        }
        if (currentId == -1) {
			return;
		}
        var modifystring = $('#productform').serialize();
        xhr = $.getJSON('?m=Product&a=View&f=saveProductInfo&id=' + currentId, modifystring, function(ret) {
            if (ret['status'] == 'success') {
                var infos = [{
                    name: '',
                    value: ''
                }];
                infos[0].value = ret['infos']['value'];
                infos[0].name = ret['infos']['name'];
                markProductState();
                orgTreeOnchange(infos);
                showMessage('更新成功!');
            } else {
                showErrMessage(ret['message']);
            }
        }).error(function(xhr, textStatus, errorThrown) {
            if (xhr.getAllResponseHeaders()) {
				showErrMessage('Loadding Error');
			}
        }).complete(function() {});
    }

    $('#applyNewOrgBtn').click(function() {
        $('#addProductForm input, #addProductForm textarea').not('#parentOrgName,#parentOrgId').attr('value', '');
        $('.cNotSupport').attr('value', 'default');
        $('#productViewPanel').hide();
        $('#productAddPanel').show();
    });

    $('#returnToViewBtn').click(function() {
        $('#productAddPanel').hide();
        $('#productViewPanel').show();
    });

    $('#applyNewOrgSubmit').click(function() {
        if ($('#parentOrgId').attr('value') == '') {
            showErrMessage('请先选择父产品线');
            return;
        }
        if (preSubmitVerifyForm('#addProductForm') == false) {
            return;
        }
        var data = {};
        data['applyDataForm'] = {};
        data['applyDataForm'] = $('#addProductForm').find('input, textarea').serializeArray();
        $.post('?m=WorkflowProcess&a=Start&f=workflowConntroller', data, function(ret) {
            if (ret['status'] == 'success') {
                showErrMessage('发起流程成功！流程审批完毕后生效');
                $('#returnToViewBtn').click();
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });

    $('#modifyproduct').click(setUpModify);
    $('#cancelmodify').click(restoreModify);
    $('#submitmodify').click(submitModify);
});