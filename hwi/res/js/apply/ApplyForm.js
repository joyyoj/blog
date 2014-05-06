$(document).ready(function() {
    $('#setRoleToDataTab').tabs();
    new bsn.AutoSuggest('rolemembers', auto_suggest_options_comma);
    new bsn.AutoSuggest('rolemailgroups', auto_suggest_options_mail);
    realtimeVerifyForm($('#applyDataForm'));
    realtimeVerifyForm($('#createNewRoleDialog'));
    $('.cDate').datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText, inst) {
            $(this).trigger('focusout');
        },
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        changeMonth: true,
        changeYear: true,
        yearRange: '-5:+1',
        showButtonPanel: true,
        closeText: '关闭',
        currentText: '今天'
    });

    showLoadingMessage('数据加载中');
    xhr = $.getJSON('?m=Role&a=List&f=getJsonRoleListByUserAndOrg&userId=' + userId, function(data) {
        fnAddData(roleListTable, data || []);
    }).complete(function() {
        hideLoadingMessage();
    });

    $('.applyTimeRange').live('change', function() {
        if ($(this).attr('value') == 'setTime') {
            $('.timeRangeInput').removeClass('hd');
        } else {
            $('.timeRangeInput').addClass('hd');
        }
    });
    $('#submitApplyBtn').click(function() {
        if ($('#selectedroleid').attr('value') == '' && $('#newrolename').attr('value') == '') {
            showErrMessage('请选择一个角色，或者新建一个角色');
            return;
        }
        var toSubmitForm = $('#setRoleToDataTab-1:not(.ui-tabs-hide), #setRoleToDataTab-2:not(.ui-tabs-hide), #applyDataForm');
        if (preSubmitVerifyForm(toSubmitForm) == false) {
            return;
        }
        if ($(toSubmitForm).find('#roleorgname').length != 0 && $('#roleorgname').attr('value') == '') {
            showErrMessage('请选择产品线');
            return;
        }
        if ($('#selectTimeRangeRadio input').serialize() == '') {
            showErrMessage('请选择时间范围');
            return;
        } else if ($('#selectTimeRangeRadio input').serialize() == 'aptmrg=setTime' && ($('.timeRangeInput input').first().attr('value') == '' || $('.timeRangeInput input').last().attr('value') == '')) {
            showErrMessage('请填写开始时间与结束时间');
            return;
        } else if ($('.timeRangeInput input').first().attr('value') > $('.timeRangeInput input').last().attr('value')) {
            showErrMessage('开始时间不能大于结束时间');
            return;

        }
        if ($('#applyPermissionCheckBox input').serialize() == '') {
            showErrMessage('请选择要申请的权限');
            return;
        }
        var data = {};
        data['applyDataForm'] = {};
        data['applyDataForm'] = $('#setRoleToDataTab-1:not(.ui-tabs-hide), #setRoleToDataTab-2:not(.ui-tabs-hide),               
        $(#applyDataForm').find('input, textarea').serializeArray();
        $.post('?m=WorkflowProcess&a=Start&f=workflowConntroller', data, function(ret) {
            if (ret['status'] == 'success') {
                alert('success! 转到我的角色列表');
                window.location = '?m=Role&a=List';
            } else {
                showErrMessage(ret['message']);
            }
        },
        'json');
    });
    $('#applylistrole tbody tr').live('click', function() {
        var selected = roleListTable._('tr.row_selected');
        if (!selected.length) return;
        $('#roleappliedname').attr('value', selected[0][2]);
        $('#selectedroleid').attr('value', selected[0][1]);
    });
    orgTreeOnChange = function(infos) {
        if (!infos || !infos.length) return;
        $('#roleorgname').attr('value', infos[0].name);
        $('#roleorgid').attr('value', infos[0].value);
    }
});
