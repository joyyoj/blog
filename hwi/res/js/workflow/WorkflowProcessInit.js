$(document).ready(function() {
    $('#workflowRoles0').attr('value', username);
    var processInfo = {};
    var dataFillForm = {};
    $('#submitParticipantBtn').click(function() {
        processInfo['packageId'] = packageId;
        processInfo['defineId'] = defineId;
        processInfo['processName'] = processName;
        processInfo['participant'] = {};
        $.each($('#WorkflowInitForm input'), function(i, n) {
            processInfo['participant'][$(n).attr('name')] = new Array();
            processInfo['participant'][$(n).attr('name')].push($(n).attr('value'));
        });

        $.post('?m=WorkflowProcess&a=Start&f=saveWorkflowParticipant', processInfo, function(ret) {
            if (ret['status'] == 'success') {
                $('#setParticipant').hide();
                $('#fillWorkflowForm').show();
                $('#startProcessForm').append(ret['formContent']);
                dataFillForm['activityId'] = ret['activityId'];
            }
        }, 'json');
    });
    $('#submitWorkflowForm').click(function() {
        dataFillForm['processForm'] = {};
        $.each($('#fillWorkflowForm input, #fillWorkflowForm textarea'), function(i, n) {
            if ($(n).attr('name') != null) {
                dataFillForm['processForm'][$(n).attr('name')] = $(n).attr('value');
            }
        });
        dataFillForm['defineId'] = defineId;
        dataFillForm['packageId'] = packageId;
        $.post('?m=WorkflowProcess&a=Submit&f=submitForm', dataFillForm, function(ret) {
            if (ret['status'] == 'success') {
                showMessage('流程发起成功');
                window.location = '?m=WorkflowProcess&a=List';
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json');
    });
});