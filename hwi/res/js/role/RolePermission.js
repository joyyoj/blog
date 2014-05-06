roleColDef = [{
    'sWidth': '13%',
    'aTargets': [0]
},
{
    'sWidth': '87%',
    'aTargets': [1]
}];
dataColDef = [{
    'sWidth': '10%',
    'aTargets': [0]
},
{
    'sWidth': '20%',
    'aTargets': [1]
},
{
    'sWidth': '10%',
    'aTargets': [2]
},
{
    'sWidth': '10%',
    'aTargets': [3]
},
{
    'sWidth': '30%',
    'aTargets': [4]
}];

(function() {
    changeRoleParams = function(aoData) {
        showLoadingMessage('正在加载数据...');
    };

    roleTableDraw = function() {
        hideLoadingMessage();
    };

    changeDataParams = function(aoData) {
        showLoadingMessage('正在加载数据...');
    };

    dataTableDraw = function() {
        hideLoadingMessage();
    };

    function applyRole() {
        var data = $('#applyRoleForm').serializeArray();
        $.post('?m=WorkflowProcess&a=Begin&f=applyOrgDefRole', {
            data: data
        }, function(ret) {
            if (ret.status == 'success') {
                showMessage('角色申请提交成功！');
            } else {
                showErrMessage('申请失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('申请失败，或者联系管理员');
        });
        $('#addRoleDialog').modal('hide');
    }

    $(document).ready(function() {
        $('.tip-desc').poshytip({
            className: 'tip-yellowsimple',
            showTimeout: 1,
            alignTo: 'target',
            alignX: 'center',
            offsetY: 5,
            allowTipHover: true
        });
        realtimeVerifyForm($('#applyRoleForm'));
        $('#addRoleBtn').click(function() {
            $('#addRoleDialog').modal('show');
        });
        $('#applyJobBtn').click(function() {
            $('#addDataDialog').modal('show');
        });
        $('a[name="save"]').click(function() {
            if (preSubmitVerifyForm('#applyRoleForm') == false) {
                return;
            }
            applyRole();
        });
    });
})();

$('select[name="permissionType"]').change(function() {
    var changeInfo = $('#permissionInfo')[0];
    if (this.value == '1') {
		changeInfo.innerHTML = ' 基本权限可在【数据建设】中编辑产品线下ETL任务';
	} else {
		changeInfo.innerHTML = ' 高级权限可在【基础数据建设】中编辑该产品下UETL任务';
	}
});
