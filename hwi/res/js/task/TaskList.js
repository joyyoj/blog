dataColDef = [{
    "sWidth": "1px",
    "aTargets": [0]
},
{
    "sWidth": "30%",
    "aTargets": [1],
    "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a href="?m=Task&a=Detail&type=etl&taskId=' + oData[0] + '" target="_blank" >' + sData + '</a>');
    }
},
{
    "sWidth": "12%",
    "aTargets": [2]
},
{
    "sWidth": "15%",
    "aTargets": [3]
},
{
    "sWidth": "5%",
    "aTargets": [4],
    "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
        if (sData == '完成' || sData == '失败' || sData == '杀死') {
            $(nTd).parent().addClass("toRerun");
        } else {
            $(nTd).parent().addClass("toKill");
        }
    }
},
{
    "sWidth": "1px",
    "aTargets": [5]
},
{
    "sWidth": "29%",
    "aTargets": [6]
}]; 

(function() {

    if (jobid == '0' || jobid == '') {
        $('#batchRerunBtn,#batchKillBtn').hide();
    }
    var isFirst = true;
    changeParams = function(aoData) {
        if (isFirst) {
            $("input[name='jobid']").val(jobid);
            $("input[name='type']").val(smartyGetType);
            isFirst = false;
        }
        var params = $("#advancedSearchForm").serializeArray();
        showLoadingMessage("正在加载数据...");
        $.each(params, function(i, n) {
            if (n.name != 'jobid' || n.value != '') {
                aoData.push(n);
            }
        });
    }
    myTableDraw = function() {
        hideLoadingMessage();

        $("#tasklisttablecheckbox").click(function() {
            if ($(this).attr("checked")) {
                taskListTable.$('tr').addClass('row_selected');
                taskListTable.$('input').attr("checked", true);
            } else {
                taskListTable.$('tr').removeClass('row_selected');
                taskListTable.$('input').attr("checked", false);
            }
        });

        if (jobid == '0' || jobid == '') {
            $('#batchRerunBtn,#batchKillBtn').hide();
            $('input[type="checkbox"]').parent().hide();
        }
    }
    $(document).ready(function() {
        realtimeVerifyForm($("#advancedSearchForm"));
        $("#advancedSearchContainer .close").click(function() {
            $("#advancedSearchContainer").toggle("fast");
        });
        $("#searchBtn").click(function() {
            if (preSubmitVerifyForm("#advancedSearchForm") == false) {
                return;
            }
            taskListTable.fnSort([1, 'asc']);
        });
        $("#entityIdTooltip").tooltip({
            "placement": "bottom"
        });
        $("#idTooltip").tooltip({
            "placement": "bottom"
        });
        $("#advancedSearchBtn").click(function() {
            $("#advancedSearchContainer").toggle("fast");
        });
        $("#navback").click(function() {
            window.history.go( - 1);
        });
        $("#viewDetailBtn").click(function() {
            var selected = taskListTable._("tr.row_selected");
            if (!selected.length) {
                showErrMessage("请选择一个任务");
                return;
            }
            var url = "?m=Task&a=Detail&type=" + smartyGetType + "&taskId=" + selected[0][0];
            window.location = url;
        });
        $("#resetBtn").click(function() {
            $(".checkerrmsgItem").hide();
        });
        $("#backToPreBtn").click(function() {
            window.history.go( - 1);
        });

        $("#batchRerunBtn").click(function() {
            // hack

            alert('请勿批量提交回溯任务，ecomon资源受限，先保证线上任务运行');
            return false;

            if (taskListTable._("tr.row_selected.toRerun").length == 0) {
                showErrMessage("您没有选择任务或选择的任务不能被重跑！");
                return;
            }
            $('#queueselect').empty();
            $.post('?m=Queue&a=Job&f=getQueueList', function(data) {
                $.each(data, function() {
                    // 禁止用户手动启动任务时选择biglog-default队列
                    if (this.name == 'biglog-default') {
                        return;
                    }
                    $('#queueselect').append('<option name="queueName" class="queueitem" value="' + this.qid + '">' + this.name + '</option>');
                });
            }, 'json');
            $("#rerunCount").text(taskListTable._("tr.row_selected.toRerun").length);
            $("#rerunDialog").modal("show");
        });

        $("#batchKillBtn").click(function() {
            if (taskListTable._("tr.row_selected.toKill").length == 0) {
                showErrMessage("您没有选择任务或选择的任务不能被杀死！");
                return;
            }
            $("#killCount").text(taskListTable._("tr.row_selected.toKill").length);
            $("#killDialog").modal("show");
        });

        $("#startRerun").click(function() {
            var qid = $('#queueselect').val();
            $.get('?m=Queue&a=Edit&f=getClusterid', {
                queueid: qid
            }, function(clusterid) {
                submitOperation("submitRerun", clusterid, qid);
            });
        });

        $("#startKill").click(function() {
            submitOperation("submitKill", "", "");
        });

        function submitOperation(name, clusterid, qid) {
            var dataArr = [];
            var selectRow;

            if (jobid == "0" || jobid == "") {
                showErrMessage("您选择的任务不能被杀死或重跑");
                return;
            }
            if (name == "submitRerun") {
                url = "?m=Task&a=Detail&f=rerunJob";
                selectRow = taskListTable._("tr.row_selected.toRerun");
            } else {
                url = "?m=Task&a=Detail&f=killJob&type=batch";
                selectRow = taskListTable._("tr.row_selected.toKill");
            }
            $.each(selectRow, function() {
                var data = {};
                data.jobid = jobid;
                data.baseTime = this[3];
                data.type = smartyGetType;
                data.taskid = this[0];
                data.dataRecovery = false;
                data.queueid = qid;
                data.clusterid = clusterid;
                dataArr.push(data);
            });

            $.post(url, {
                "opDataArr": dataArr
            }, function(ret) {
                if (ret.status == "success") {
                    taskListTable.fnSort([1, 'asc']);
                    $("#rerunDialog").modal("hide");
                    $("#killDialog").modal("hide");
                    showMessage('您的操作已被系统受理');
                } else {
                    showErrMessage("操作失败：" + ret.message);
                }
            }, "json").error(function() {
                showErrMessage("操作失败，请联系管理员");
            });
        }
    });
})();
