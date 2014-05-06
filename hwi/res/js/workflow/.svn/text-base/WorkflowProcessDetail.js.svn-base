$(document).ready(function() { (function() {
        var so = new SWFObject(flexUrl, 'flexProcessDetail', '100%', '390', '10', '#dcdcdc');
        so.useExpressInstall(expressUrl);
        //流程实例Id                                                            
        so.addVariable('processId', processId);
        so.addVariable('basePath', basePath);
        so.addParam('allowScriptAccess', 'always');
        so.addParam('allowFullScreen', true);
        so.addParam('wmode', 'opaque');
        so.write('flashcontent');
    })();

    new bsn.AutoSuggest('reassignactivity', auto_suggest_options);
    $('#currentProcessor tr').find('th:eq(4), th:eq(5),td:eq(4), td:eq(5)').attr('class', 'hd');
    realtimeVerifyForm($('#addMessageDialog'));
    realtimeVerifyForm($('#reassignDialog'));
    var dialogUrl;

    $('a[name="saveReassign"]').click(function() {
        if ($(this).hasClass('disabled')) {
            return;
        }
        $(this).addClass('disabled');
        if (preSubmitVerifyForm('#reassignDialog') == false) {
            $(this).removeClass('disabled');
            return;
        }
        var Tr = $('#currentProcessor tr');
        var url = '?m=WorkflowProcess&a=NeedToDeal&f=entruct&processId=' + $(Tr).children('td:eq(4)').text() + '&activityId=' + $(Tr).children('td:eq(5)').text() + '&newPerformer=' + $('#reassignactivity').attr('value');
        $.getJSON(url, function(ret) {
            if (ret['status'] == 'success') {
                window.location = '?m=WorkflowProcess&a=Detail&processId=' + $(Tr).children('td:eq(4)').text();
            } else {
                showErrMessage('委托失败:' + ret['message']);
            }
            $(this).removeClass('disabled');
        }).error(function() {
            showErrMessage('系统暂时不可用，请联系管理员');
            $(this).removeClass('disabled');
        });
    });

    $('a[name="saveMessage"]').click(function() {
        if ($(this).hasClass('disabled')) {
            return;
        }
        $(this).addClass('disabled');
        if (preSubmitVerifyForm('#addMessageDialog') == false) {
            $(this).removeClass('disabled');
            return;
        }
        var Tr = $('#currentProcessor tr');
        var url = '?m=WorkflowProcess&a=NeedToDeal&f=' + dialogUrl + '&processId=' + $(Tr).children('td:eq(4)').text() + '&activityId=' + $(Tr).children('td:eq(5)').text() + '&reason=' + $('#dialogMessage').attr('value');
        $.getJSON(url, function(ret) {
            if (ret['status'] == 'success') {
                window.location = '?m=WorkflowProcess&a=Detail&processId=' + $(Tr).children('td:eq(4)').text();
            } else {
                showErrMessage('委托失败:' + ret['message']);
            }
            $(this).removeClass('disabled');
        }).error(function() {
            showErrMessage('系统暂时不可用，请联系管理员');
            $(this).removeClass('disabled');
        });
    });

    if (smartyGetFrom == 'needToDeal') {
        $('#dealActivityBtn').click(function() {
            var Tr = $('#currentProcessor tr');
            if ($(Tr).children('td:eq(4)').length == 0) {
                showErrMessage('没有可以处理的任务');
                return;
            }

            if ($(Tr).children('td:eq(1)').text() != userName) {
                showErrMessage('你不是当前处理人');
                return;
            }
            window.location = '?m=WorkflowProcess&a=PreDeal&processId=' + $(Tr).children('td:eq(4)').text() + '&activityId=' + $(Tr).children('td:eq(5)').text();
        });
    }
    if (smartyGetFrom == 'needToDeal') {
        $('#reAssignActivityBtn').click(function() {
            $('#reassignDialog').modal('show');
        });
    }

    $('#skipActivityBtn').click(function() {
        dialogUrl = 'skip';
        $('#dialogMessage').attr('value', '');
        $('#addMessageDialog').modal('show');
    });
    if (smartyGetFrom != 'needToDeal') {
        $('#urgeActivityBtn').click(function() {
            dialogUrl = 'urge';
            $('#dialogMessage').attr('value', '');
            $('#addMessageDialog').modal('show');
        });
    }
});