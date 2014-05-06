if (type == 'etl') {
	dataColDef = [{
		'sWidth': '1px',
		'aTargets': [0]
	},
	{
		'sWidth': '60%',
		'aTargets': [1],
		'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
			$(nTd).html('<a href="?m=Job&a=Edit&from=view&type=' + type + '&jobid=' + oData[0] + '" target="_blank">' + sData + '</a>');
		}
	},
	{
		'sWidth': '50px',
		'aTargets': [2]
	},
	{
		'sWidth': '50px',
		'aTargets': [3]
	},
	{
		'sWidth': '50px',
		'aTargets': [4]
	},
	{
		'sWidth': '220px',
		'aTargets': [5]
	}]; 	
} else if (type == 'download') {
	dataColDef = [{
		'sWidth': '1px',
		'aTargets': [0]
	},
    {
        'sWidth': '60%',
        'aTargets': [1],
        'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<a href="?m=Job&a=AddRelyFile&from=view&type=' + type + '&jobid=' + oData[0] + '" target="_blank">' + sData + '</a>');
        }
    },
	{
		'sWidth': '50px',
		'aTargets': [2]
	},
	{
		'sWidth': '50px',
		'aTargets': [3]
	},
	{
		'sWidth': '50px',
		'aTargets': [4]
	},
	{
		'sWidth': '220px',
		'aTargets': [5]
	}]; 
} else {
	dataColDef = [{
		'sWidth': '1px',
		'aTargets': [0]
	},
    {
        'sWidth': '60%',
        'aTargets': [1]
    },
	{
		'sWidth': '50px',
		'aTargets': [2]
	},
	{
		'sWidth': '50px',
		'aTargets': [3]
	},
	{
		'sWidth': '50px',
		'aTargets': [4]
	},
	{
		'sWidth': '220px',
		'aTargets': [5]
	}];
}

// hack（张志宏），使用if语句：if (dataTableLastSearch == curSearch) 
// 替换了if语句：if ($('#searchBtn').attr('disabled') == 'disabled') 
// 之前的问题是翻页的时候搜索条件会全部失效，现在改为判断DataTable是否
// 变换了filter条件，变换了的话才认为是DataTable的filter事件，否则就将
// DataTable的filter条件清空
var dataTableLastSearch = '';
var changeParams = function(aoData) {
    showLoadingMessage('正在加载数据...');
    var params = $('#advancedSearchForm').serializeArray();

    var searchIdx = -1;
    var curSearch = '';
    $.each(aoData, function(i, n) {
        if (n.name == 'sSearch') {
            searchIdx = i;
            curSearch = n.value;
        }
    });

    if (dataTableLastSearch == curSearch) {
        $.each(params, function(i, n) {
            aoData.push(n);
        });
        if (searchIdx >= 0) {
            aoData[searchIdx].value = '';
            curSearch = '';
        }

        $('#searchBtn').attr('disabled', false);
    } else {
        var pid = parseInt($('form select[name=pid]').val(), 10);
        if (pid != -1) {
            $.each(params, function(i, n) {
                if (n.name == 'm' || 
                    n.name == 'a' || 
                    n.name == 'type' || 
                    n.name == 'pid') {
                    aoData.push(n);
                }
            });
        } else {
            $.each(params, function(i, n) {
                if (n.name == 'm' || n.name == 'a' || n.name == 'type') {
                    aoData.push(n);
                }
            });
        }
    }
    dataTableLastSearch = curSearch;
    if ($('#searchBtn').attr('disabled') == 'disabled') {
        $('#searchBtn').attr('disabled', false);
    }
};

(function() {
    myTableDraw = function() {
        jobListTable.$('tr').find('td:eq(1)').addClass('hd');
        jobListTable.$('tr').find('td:eq(7)').addClass('hd');
        jobListTable.$('tr').find('td:eq(8)').addClass('hd');
        jobListTable.$('tr').find('td:eq(9)').addClass('hd');
        hideLoadingMessage();
    }

    $('#getNewTime').live('click', function() {
        var qid = $('#queueselect2').val();
        $.ajax({
            url: '?m=Queue&a=View&f=getCluster',
            data: {
                queueid: qid
            },
            dataType: 'json',
            success: function(data) {
                startgetNewTime(data['clusterid'], qid);
            }
        });
    });

    $('#savejob').live('click', function() {
        var qid = $('#queueselect2').val();
        $.ajax({
            url: '?m=Queue&a=View&f=getCluster',
            data: {
                queueid: qid
            },
            dataType: 'json',
            success: function(data) {
                startJob(data['clusterid'], qid);
            }
        });
    });

    $('#confirm_start').live('click', function() {
        var qid = $('#queueselect2').val();
        $.ajax({
            url: '?m=Queue&a=View&f=getCluster',
            data: {
                queueid: qid
            },
            dataType: 'json',
            success: function(data) {
                startJob(data['clusterid'], qid);
            }
        });
    });

    var fastSelectedTr;
    startJob = function(clusterid, qid) {
        var selected;
        if (fastSelectedTr) {
            selected = fastSelectedTr;
        } else {
            selected = jobListTable._('tr.row_selected');
        }
        var jobid = selected[0][0];
        var jobVersion = selected[0][6];
        var baseTimeStart = $('#baseTimeStart').val();
        var baseTimeEnd = $('#baseTimeEnd').val();
        var startRecovery = $('#startRecovery').is(':checked');
        var freq = selected[0][7];
        var queueid = qid;
        var recoveryType = $('#recoveryType').val();

        if (baseTimeStart == '') {
            showErrMessage('请选择关联起始时间后再启动任务！');
            return false;
        }
        if (baseTimeStart < '1970') {
            showErrMessage('起始时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd != '' && baseTimeEnd < '1970') {
            showErrMessage('结束时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd != '' && baseTimeStart > baseTimeEnd) {
            showErrMessage('结束时间不能大于起始时间');
            return false;
        }
        var content = {};
        content.jobid = jobid;
        content.jobVersion = jobVersion;
        content.queueid = queueid;
        content.clusterid = clusterid;
        if ($('#startRecovery').attr('checked') == 'checked' && recoveryType == 0) {
            content.baseTimeStart = $('#newStartTime').text();
            content.baseTimeEnd = $('#newEndTime').text();
            content.dorisTimeStart = baseTimeStart;
            content.dorisTimeEnd = baseTimeEnd == '' ? baseTimeStart: baseTimeEnd;
        } else if ($('#startRecovery').attr('checked') == 'checked' && recoveryType > 0) {
            content.baseTimeStart = baseTimeStart;
            content.baseTimeEnd = baseTimeEnd == '' ? baseTimeStart: baseTimeEnd;
            content.dorisTimeStart = baseTimeStart;
            content.dorisTimeEnd = baseTimeEnd == '' ? baseTimeStart: baseTimeEnd;
        } else {
            content.baseTimeStart = baseTimeStart;
            content.baseTimeEnd = baseTimeEnd;
            content.dorisTimeStart = '';
            content.dorisTimeEnd = '';
        }
        if ($('#startRecovery').attr('checked') == 'checked') {
            content.recoveryType = recoveryType;
        } else {
            content.recoveryType = '';
        }
        content.freq = freq;
        content.startRecovery = startRecovery;
        content = JSON.stringify(content);

        startJob.returnFlag = '';
        var url = '?m=Job&a=Command&f=startJob';

        $.post(url, {
            content: content
        }, function(ret) {
            if (ret.status == 'success') {
                showMessage('任务提交成功！');
            } else {
                showErrMessage('操作失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('任务提交失败，或者联系管理员');
        });
        $('#add_proj2').modal('hide');
        $('#add_proj').modal('hide');                         
    }

    startgetNewTime = function(queueid, qid) {
        var selected;
        if (fastSelectedTr) {
            selected = fastSelectedTr;
        } else {
            selected = jobListTable._('tr.row_selected');
        }
        var jobid = selected[0][0];
        var jobVersion = selected[0][6];
        var baseTimeStart = $('#baseTimeStart').val();
        var baseTimeEnd = $('#baseTimeEnd').val();
        var startRecovery = $('#startRecovery').is(':checked');
        var freq = selected[0][7];
        var queueid = queueid;
        var clusterid = qid;

        if (baseTimeStart == '') {
            showErrMessage('请选择关联起始时间');
            return false;
        }
        if (baseTimeStart < '1970') {
            showErrMessage('起始时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd != '' && baseTimeEnd < '1970') {
            showErrMessage('结束时间不能在1970年以前');
            return false;
        }
        if (baseTimeEnd != '' && baseTimeStart > baseTimeEnd) {
            showErrMessage('结束时间不能大于起始时间');
            return false;
        }

        var content = {};
        content.jobid = jobid;
        content.jobVersion = jobVersion;
        content.baseTimeStart = baseTimeStart;
        content.baseTimeEnd = baseTimeEnd;
        content.freq = freq;
        content.queueid = queueid;
        content.clusterid = clusterid;
        content = JSON.stringify(content);
        startJob.returnFlag = '';
        var url = '?m=Job&a=Command&f=getNewTime';

        $.post(url, {
            content: content
        }, function(ret) {
            if (ret.status == 'success') {
                $('#newStartTime').text(ret.data.newStartTime);
                $('#newEndTime').text(ret.data.newEndTime);
                $('#add_proj2').modal('show');
            } else {
                showErrMessage('操作失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('关联时间获取失败，或者联系管理员');
        });
    }

    function applyData() {
        var data = $('#applyDataForm').serializeArray();
        $.post('?m=WorkflowProcess&a=Begin&f=applyData', {
            data: data
        }, function(ret) {
            if (ret.status == 'success') {
                showMessage('数据申请提交成功！');
            } else {
                showErrMessage('申请失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('申请失败，或者联系管理员');
        });
        $('#addPermissionDialog').modal('hide');
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

        if (from != 'apply') {
            $('#joblisttable tr').live('mouseover', function() {
                if ($('#fastLinkDiv').length == 0) {
                    $(this).children('td:eq(2)').append($('#fastLinkTemp').clone('true').attr('id', 'fastLinkDiv').show());
                } else {
                    $(this).children('td:eq(2)').append($('#fastLinkDiv'));
                }
            });

            if (navigator.userAgent.toLowerCase().indexOf('ie') > 0) {
                $('#fastLinkDiv, #fastLinkTemp').remove(); //ie8 无法点击                  
            }
        }
        $('.fastLinkPanel a.fastStartJobBtn').click(function(e) {
            $('#queueselect2').empty();
            var ntr = this;
            if ($(this).hasClass('disabled')) {
                return;
            }
            $(this).addClass('disabled');
            stopBubble(e);
            jobListTable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            $('#startJobBtn').click();
            setTimeout(function() {
                $(ntr).removeClass('disabled');
            }, 4000);
        });

        $('.fastLinkPanel a.fastDeleteJobBtn').click(function(e) {
            var ntr = this;
            if ($(this).hasClass('disabled')) {
                return;
            }
            $(this).addClass('disabled');
            stopBubble(e);
            jobListTable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            $('#deleteJobBtn').click();
            setTimeout(function() {
                $(ntr).removeClass('disabled');
            }, 4000);
        });

        $('.fastLinkPanel a.fastViewTaskBtn').click(function(e) {
            stopBubble(e);
            jobListTable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            var selected = jobListTable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请选择一个任务');
                return;
            }
            var url = '?m=Task&a=List&type=' + type + '&jobId=' + selected[0][0];
            $(this).attr('href', url);
        });

        realtimeVerifyForm($('#applyDataForm'));
        realtimeVerifyForm($('#advancedSearchForm'));
        realtimeVerifyForm($('#applyJobForm'));
        $('#jobTooltip').tooltip({
            'placement': 'bottom'
        });
        $('#joblisttable th:eq(0)').addClass('hd');
        $('#joblisttable th:eq(6)').addClass('hd');
        $('#joblisttable th:eq(7)').addClass('hd');
        $('#joblisttable th:eq(8)').addClass('hd');

        $('#advancedSearchBtn').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });

        $('#advancedSearchContainer .close').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });

        $('#searchBtn').click(function() {
            if (preSubmitVerifyForm('#advancedSearchForm') == false) {
                return;
            }
            $('#joblisttable_filter input').val('');
            $(this).attr('disabled', true);
            var pid = $('form select[name=pid]').val();
            jobListTable.fnSort([pid, 'asc']);
        });

        $('#viewJobHistoryBtn').click(function() {
            var selected = jobListTable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请选择一个任务');
                return;
            }
            var url = '?m=Task&a=List&type=' + type + '&jobId=' + selected[0][0];
            $(this).attr('href', url);
        });

        $('#newJobBtn').click(function() {
            if (type == 'etl') {
                window.location = '?m=Job&a=Edit&type=etl&from=create';
            } else if (type == 'download') {
                window.location = '?m=Job&a=AddRelyFile&from=create';
            }
        });

        $('#deleteJobBtn').click(function() {
            var selected = jobListTable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请选择一个任务');
                return;
            }
            $('#del_proj').modal('show');
        });

        $('a[name="deleteConfirm"]').click(function() {
            var selected = jobListTable._('tr.row_selected');
            $.post('?m=Job&a=List&f=removeJob', {
                'jobid': selected[0][0],
                'type': type
            }, function(ret) {
                if (ret.status != 'success') {
                    showErrMessage(ret.message);
                    return;
                } else {
                    showMessage('操作成功');
                    jobListTable.fnSort([1, 'asc']);
                }
            }, 'json').error(function() {
                showErrMessage('系统出现异常，请联系管理员');
            });
            $('#del_proj').modal('hide');
        });
        $('#startJobBtn').click(function() {
            var selected = jobListTable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请选择一个任务');
                return;
            }
            if ($(this).hasClass('disabled')) {
                return;
            }
            var thisBtn = this;
            $(this).addClass('disabled');
            $('#recoveryType').addClass('hd');
            showLoadingMessage('正在加载数据...');
            if (selected[0][7] == 1440) {
                $('#baseTimeStart').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
                $('#baseTimeEnd').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
            } else if (selected[0][7] >= 60) {
                $('#baseTimeStart').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd HH:00',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
                $('#baseTimeEnd').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd HH:00',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
            } else {
                $('#baseTimeStart').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd HH:mm',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
                $('#baseTimeEnd').unbind('click').click(function() {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd HH:mm',
                        maxDate: '%y-%M-#{%d}'
                    });
                });
            }
            $('#baseTimeStart').val('').next().hide();
            $('#baseTimeEnd').val('').next().hide();

            var selected = jobListTable._('tr.row_selected');
            if (type == 'etl') {
                $.post('?m=Job&a=List&f=getJobExportDoris', {
                    'jobid': selected[0][0],
                    'jobVersion': selected[0][6]
                }, function(ret) {
                    var defqueueid = ret.message;
                    $.post('?m=Queue&a=Job&f=getQueueList', function(data) {
                        $('#queueselect2').empty();
                        $.each(data, function() {
                            // 禁止用户手动启动任务时选择biglog-default队列
                            if (this.name == 'biglog-default') {
                                return;
                            }
                            if (this.qid == defqueueid) {
                                $('#queueselect2').append('<option name="queueName" class="queueitem" value="' + this.qid + '" selected="true">' + this.name + '</option>');
                            } else {
                                $('#queueselect2').append('<option name="queueName" class="queueitem" value="' + this.qid + '">' + this.name + '</option>');
                            }

                        });
                    }, 'json');
                    if (ret.status == false) {
                        showErrMessage(ret.message);
                        $(thisBtn).removeClass('disabled');
                        return;
                    } else if (ret.result == true) {
                        $('#startRecoveryHtml').html('<input type="checkbox" id="startRecovery"> 启动数据恢复');
                        $('#startRecovery').change(function() {
                            if ($('#startRecovery').attr('checked') == 'checked') {
                                if ($('#recoveryType').val() == 0) {
                                    $('a[name="save"]').addClass('hd');
                                    $('#getNewTime').removeClass('hd');
                                }
                                $('#recoveryType').removeClass('hd');
                            } else {
                                $('a[name="save"]').removeClass('hd');
                                $('#getNewTime').addClass('hd');
                                $('#recoveryType').addClass('hd');
                            }
                        });
                        $('#recoveryType').change(function() {
                            if ($(this).val() == 0) {
                                $('a[name="save"]').addClass('hd');
                                $('#getNewTime').removeClass('hd');
                            } else {
                                $('a[name="save"]').removeClass('hd');
                                $('#getNewTime').addClass('hd');
                            }
                        });
                    } else {
                        $('#startRecoveryHtml').html('');
                    }
                    $('a[name="save"]').removeClass('hd');
                    $('#getNewTime').addClass('hd');
                    $('#add_proj').modal({
                        keyboard: false
                    });
                    $('#add_proj').modal('show');
                    hideLoadingMessage();
                    $(thisBtn).removeClass('disabled');
                }, 'json').error(function() {
                    $(thisBtn).removeClass('disabled');
                    showErrMessage('数据获取失败，请联系管理员');
                });
            } else {
                $('a[name="save"]').removeClass('hd');
                $('#getNewTime').addClass('hd');
                $('#add_proj').modal({
                    keyboard: false
                });
                $('#add_proj').modal('show');
                hideLoadingMessage();
                $(this).removeClass('disabled');
            }

            if (type == 'download') {
                $('#queueselect2').parent().find('#queuetitle').remove();
                $('#queueselect2').parent().find('#queueselect2').remove();
            }

        });

        $('#applyPermissionBtn').click(function() {
            var selected = jobListTable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            $('.checkerrmsgItem').hide();
            $('#applyDataForm').get(0).reset();
            $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true);
            $('#selectedTableName').text(selected[0][1]);
            $('input[name="selectedPid"]').val(selected[0][8]);
            $('input[name="entityId"]').val(selected[0][0]);
            $('input[name="entityName"]').val(selected[0][1]);
            $('#addPermissionDialog').modal('show');
        });
        $('input[name="applyUser"]').change(function() {
            if ($('input[name="applyUser"]:checked').val() == 'other') {
                $('input[name="userName"]').addClass('cNotNull cOneName').attr('readonly', false);
            } else {
                $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true).next('.checkerrmsgItem').remove();
            }
        });
        $('a[name="saveApply"]').click(function() {
            if (preSubmitVerifyForm('#applyDataForm') == false) {
                return;
            }
            applyData();
        });
        $('#joblisttable_filter input').keyup(function() {
            $('.checkerrmsgItem').hide();
            $('#advancedSearchForm').get(0).reset();
        });
        $('#resetBtn').click(function() {
            $('.checkerrmsgItem').hide();
        });
    });
})();
