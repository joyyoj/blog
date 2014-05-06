String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};
commandTableColDef = [];

function getData(step) {
    $.post("?m=Task&a=Detail&f=getData", {
        "step": step,
        "taskid": taskid, 
        "taskType": taskType, 
        "jobid": jobid, 
        "lmachineName": lmachineName
    }, function(ret) {
        if (ret.status == "success") {
            $("#dataResult").html("<pre>" + ret.message.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>") + "</pre>");
            $("#showLog").modal("show");
        } else {
            showErrMessage("操作失败：" + ret.message);
        }
    }, "json").error(function() {
        showErrMessage("操作失败，请联系管理员");
    });
}

function getReason() {
    $.post("?m=Task&a=Detail&f=getReason", {
        "taskid": taskid
    },
    function(ret) {
        if (ret.status == "success") {
            $("#reasonResult").html("<ul>");
            $.each(ret.message, function(i, n) {
                $("#reasonResult").append("<li>" + n + "</li>");
            });

            $("#reasonResult").append("</ul>");
            $("#showReason").modal("show");
        } else {
            showErrMessage("操作失败：" + ret.message);
        }
    }, "json").error(function() {
        showErrMessage("操作失败，请联系管理员");
    });
}

(function() {
    stepTableColDef = [{
        "sWidth": "33%",
        "aTargets": [0]
    },
    {
        "sWidth": "33%",
        "aTargets": [1]
    },
    {
        "sWidth": "33%",
        "aTargets": [2],
        "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<a class="btn btn-warning" onclick="getData(' + oData[0] + ')">获取数据</a>');
        }
    }];

    function creatQueueList(defqueueid) {
        $('#queueselect').empty();
        $.post('?m=Queue&a=Job&f=getQueueList', function(data) {
            $.each(data, function() {
                // 禁止用户手动启动任务时选择biglog-default队列
                if (this.name == 'biglog-default') {
                    return;
                }
                if (this.qid == defqueueid) {
                    $('#queueselect').append('<option name="queueName" class="queueitem" value="' + this.qid + '"  selected="true">' + this.name + '</option>');
                } else {
                    $('#queueselect').append('<option name="queueName" class="queueitem" value="' + this.qid + '">' + this.name + '</option>');
                }
            });
        }, 'json');
    }

    $(document).ready(function() {
        taskid = $('#task_id').text();
        $.post('?m=Task&a=Detail&f=getDefQueueid', {
            taskId: taskid
        }, function(data) {
            creatQueueList(data);
        });

        $("#viewReason").live('click', function() {
            getReason();
        });

        function submitOperation(name, clusterid, qid) {
            if (name == "submitRerun") {
                url = "?m=Task&a=Detail&f=rerunJob";
            } else {
                url = "?m=Task&a=Detail&f=killJob";
            }

            var data = {};
            data.jobid = jobid;
            data.baseTime = baseTime;
            data.type = smartyGetType;
            data.taskid = taskid;
            data.dataRecovery = false;
            data.queueid = qid;
            data.clusterid = clusterid;

            var dataArr = new Array();
            dataArr.push(data);

            $.post(url, {
                "opDataArr": dataArr
            }, function(ret) {
                if (ret.status == "success") {
                    $("#rerunText").removeClass("hd");
                    if (name == "submitKill") {
                        commandTable.fnClearTable();
                        commandTable.fnAddData(ret.data || []);
                    }
                    showMessage('您的操作已被系统受理');
                    if (type == "etl") {
                        creatQueueList(qid, data.taskid);
                    }
                } else {
                    showErrMessage("操作失败：" + ret.message);
                }
            }, "json").error(function() {
                showErrMessage("操作失败，请联系管理员");
            });

        }

        var qid = queueid;

        $("#submitOperation").live('click', function() {
            var subName = $(this).attr('name');;
            if (subName == "submitRerun") {
                qid = $('#queueselect').val();
            }
            var name = this.name;
            $.get('?m=Queue&a=Edit&f=getClusterid', {
                queueid: qid
            }, function(clusterid) {
                submitOperation(name, clusterid, qid);
            });
        });

        $("#backToPreBtn").click(function() {
            window.history.go( -1);
        });
    });
})();
