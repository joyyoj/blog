tableColDef = [{
    'sWidth': '1%',
    'aTargets': [0]
},
{
    'sWidth': '20%',
    'aTargets': [1]
},
{
    'sWidth': '40%',
    'aTargets': [2]
},
{
    'sWidth': '39%',
    'aTargets': [3],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        if (sData != '') {
            $(nTd).html('<input type="text" class="relyTimeText span12" value="' + sData + '" />');
        } else {
            $(nTd).html('<input type="text" value="" class="relyTimeText hd" />');
        }
    }
}];

hqlStepFlag = parseInt(hqlStepFlag, 10);
transformStepFlag = parseInt(transformStepFlag, 10);
dorisExportStepFlag = parseInt(dorisExportStepFlag, 10);
dorisExportFlag = parseInt(dorisExportFlag, 10);


$(document).ready(function() {
    $('.tip-desc').poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 5,
        allowTipHover: true
    });
    realtimeVerifyForm($('form.etlJobForm'));
    new bsn.AutoSuggest('warningSms', auto_suggest_options_comma2);
    new bsn.AutoSuggest('warningMail', auto_suggest_options_comma2);

    var defqueueid = $('#defqueueid').text();
    $.post('?m=Queue&a=Job&f=getQueueList', function(data) {
        $.each(data, function() {
            // 禁止用户编辑任务时选择biglog-manual队列
            if (this.name == 'biglog-manual') {
                return;
            }
            if (this.qid == defqueueid) {
                $('#queueselect').append('<option name="queueName" class="queueitem" value="' + this.qid + '" selected="true">' + this.name + '</option>');
            } else {
                $('#queueselect').append('<option name="queueName" class="queueitem" value="' + this.qid + '">' + this.name + '</option>');
            }
        });
    }, 'json');
    
    function sumbmitForm(btn, isUpdate, url) {
        if ($(btn).hasClass('disabled') || !preSubmitVerifyForm($('form.etlJobForm'))) {
            return;
        }
        var inputTableSelects = $('select[name="inputTableSelect[]"]');
        if (inputTableSelects.length > 1) {
            for (var i = 0; i < inputTableSelects.length - 1; i++) {
                if (inputTableSelects[i].selectedIndex <= 0) {
                    showErrMessage('请选择依赖的udwtable表');
                    return;
                }
            }
        }
        var partitions = $('input[name="partitions[]"]');
        for (var i = 0, len = partitions.length; i < len - 1; i++) {
            if ($(partitions[i]).val() == '') {
                showErrMessage('请输入依赖时间');
                return;
            }
        }
        var depSelects = $('select[name="depSelect[]"]');
        for (var i = 0, len = depSelects.length; i < len - 1; i++) {
            if (depSelects[i].selectedIndex <= 0) {
                showErrMessage('请选择依赖的文件');
                return;
            }
        }
        var depTypeSelects = $('select[name="depTypeSelect[]"]');
        for (var i = 0, len = depTypeSelects.length; i < len - 1; i++) {
            if (depTypeSelects[i].selectedIndex <= 0) {
                showErrMessage('请选择依赖文件的类型');
                return;
            }
        }

        if ((from == 'view' || from == 'edit') && dorisExportFlag) {
            var hqlStepFlagVal = $('input[name="hqlStepFlag"]').attr('checked');
            var transformStepFlagVal = $('input[name="transformStepFlag"]').attr('checked');
            var dorisExportStepFlagVal = $('input[name="dorisExportStepFlag"]').attr('checked');
            if (!hqlStepFlagVal && !transformStepFlagVal && !dorisExportStepFlagVal) {
                showErrMessage('请设置至少一个标志');
                return;
            }
        }
        $(btn).addClass('disabled');
        showLoadingMessage('正在提交');
        if (isUpdate) {
            targetUrl = '?m=Job&a=Edit&f=updateEtlJob&jobid=' + jobid;
        } else {
            targetUrl = '?m=Job&a=Edit&f=doCreateEtlJob';
        }
        var data = {};
        data['formData'] = $('form.etlJobForm').serializeArray();
        data['hql'] = editor.getValue();
        $.post(targetUrl, data, function(ret) {
            if (ret.status == 'success') {
                if (typeof url != 'undefined' && typeof ret.result != 'undefined' && typeof ret.result.jobid != 'undefined') {
                    window.location.replace(url + '&jobid=' + ret.result.jobid);
                    event.returnValue = false;
                }
                showMessage('操作成功!');
            } else {
                showErrMessage(ret.message, 'alertMessageSpan');
            }
            $(btn).removeClass('disabled');
        }, 'json').error(function() {
            showErrMessage('系统出现异常，请联系管理员');
            $(btn).removeClass('disabled');
        });
    }

    $("#viewMappingBtn").click(function() {
        window.location = '?m=Job&a=TableExport&from=view&jobid=' + jobid;
    });

    $('#submitFormBtn').click(function() {
        var inputProductSelects = $('select[name="inputProductSelect[]"]');
        var depProductSelects = $('select[name="depProductSelect[]"]');
        if (inputProductSelects.length > 1 || depProductSelects.length > 1) {
            if (!confirm('确定您所提交的作业依赖配置是正确的？')) {
                return false;
            }
        }
        editor.focus();
        if ($(this).text() == '下一步') {
            var cFact = $('#selectExportDest').find('input[name=createFactTable]').is(':checked');
            var cDim = $('#selectExportDest').find('input[name=createDorisTable]').is(':checked');
            if (cFact && cDim) {
                sumbmitForm(this, false, '?m=Data&a=Create&f=factTable&from=apply&createDim=' + cDim);
            } else if (cFact) {
                sumbmitForm(this, false, '?m=Data&a=Create&f=factTable&from=apply');
            } else if (cDim) {
                sumbmitForm(this, false, '?m=Data&a=Create&f=dimensionTable&from=apply');
            } else {
                sumbmitForm(this, false, '?m=Job&a=TableExport&from=apply');
            }
        } else {
            sumbmitForm(this, false, '?m=Job&a=TableExport&from=apply');
        }
    });
    $('#updateFormBtn').click(function() {
        if (!confirm('确定您所提交的作业依赖配置是正确的？')) {
            return false;
        }
        sumbmitForm(this, true, '?m=Job&a=List&type=etl');
    });

    $('#jobFreqSelect').change(function() {
        var val = $(this).val();
        if (val == 'week') {
            $('#auto_week').show();
            $('#auto_month').hide();
        } else if (val == 'month') {
            $('#auto_week').hide();
            $('#auto_month').show();
        } else {
            $('#auto_week').hide();
            $('#auto_month').hide();
        }
        if (val == 0) {
            $('input[name=retryInterval]').val(10);
            $('input[name=retryCount]').val(3);
        } else if (val == 15) {
            $('input[name=retryInterval]').val(10);
            $('input[name=retryCount]').val(1);
        } else if (val == 30) {
            $('input[name=retryInterval]').val(10);
            $('input[name=retryCount]').val(2);
        } else if (val == 60) {
            $('input[name=retryInterval]').val(10);
            $('input[name=retryCount]').val(3);
        } else {
            $('input[name=retryInterval]').val(30);
            $('input[name=retryCount]').val(3);
        }
    });

    $('#advanceOptionBtn').click(function() {
        $('.jobAdvanceOption').toggle('fast');
        var pNode = $(this).parent();
        if (pNode.hasClass('active')) {
            pNode.removeClass('active');
        } else {
            pNode.addClass('active');
        }
        if ($('.outputPathSelect input[flag=exportDoris]:checked').length > 0) {
            $('#selectFlag').show();
        }
    });
    $('.outputPathSelect input[flag=exportFtp]').click(function() {
        $(this).closest('div.control-group').next().toggle('fast');
    }); 
	
	(function() {
        $('.outputPathSelect input[flag=exportDoris]').click(function() {
            if ($('.outputPathSelect input[flag=exportDoris]:checked').length > 0) {
                $('#submitFormBtn').text('下一步');
                $('#selectExportDest').show('fast');
                $('#selectFlag').show('fast');
            } else {
                $('#submitFormBtn').text('提交');
                $('#selectExportDest').hide('fast');
                $('#selectFlag').hide('fast');
            }
        });
    })(); 
	
	(function() {
        function displayExportDetail(detail) {
            $.each(detail, function(i, n) {
                var detail = $('#exportTemplate').clone(true).removeAttr('id');
                detail.attr('tablename', i);
                detail.find('input[name=eventName]').val(n.eventName);
                detail.find('label[name=eventName]').text(n.eventName);
                detail.find('input[name=exportMachine]').val(n.exportMachine);
                detail.find('input[name=exportPath]').val(n.exportPath);
                detail.find('input[name=exportUsername]').val(n.exportUsername);
                detail.find('input[name=exportPassword]').val(n.exportPassword);
                $('#exportPanel').append(detail);
                if (n.exportFtp) {
                    detail.find('input[name=exportFtp]').click();
                }
                if (n.exportDoris) {
                    detail.find('input[name=exportDoris]').click();
                }
                detail.show();
            });
        }
        if (from == 'view' || from == 'edit') {
            displayExportDetail(tableExport);
        }

        function initSelectFlag(selectObj, flag) {
            if (flag) {
                $(selectObj).attr('checked', true);
            }
        }
        if (hqlStepFlag) {
            initSelectFlag($('input[name=hqlStepFlag]'), hqlStepFlag);
        }
        if (transformStepFlag) {
            initSelectFlag($('input[name=transformStepFlag]'), transformStepFlag);
        }
        if (dorisExportStepFlag) {
            initSelectFlag($('input[name=dorisExportStepFlag]'), dorisExportStepFlag);
        }

        $('#freshOutputTableBtn').click(function() {
            if ($(this).attr('disabled') == 'disabled') {
                return;
            }
            var hql = editor.getValue();
            $.post('?m=Job&a=Edit&f=getOutputTables', {
                'hql': hql
            }, function(ret) {
                if (ret.status == 'success') {
                    $('#exportPanel').children('div').removeClass('undeleteTag');
                    $.each(ret.result, function(i, n) {
                        if ($('div[tablename=' + i + ']').length != 0) {
                            $('div[tablename=' + i + ']').addClass('undeleteTag');
                            return;
                        }
                        var detail = $('#exportTemplate').clone(true).attr('id', false);
                        detail.attr('tablename', i);
                        detail.find('input[name=eventName]').val(n);
                        detail.find('label[name=eventName]').text(n);
                        $('#exportPanel').append(detail);
                        detail.show();
                        $('div[tablename=' + i + ']').addClass('undeleteTag');
                    });
                    $('#exportPanel').children('div').not('.undeleteTag').remove();
                } else {
                    showErrMessage(ret.message, 'alertMessageSpan');
                }
            }, 'json');
        });
        $('#freshRelyTableBtn').click(function() {
            if ($(this).attr('disabled') == 'disabled') {
                return;
            }
            var data = {};
            var hql = editor.getValue();
            var exportDoris = $('input[name=exportDoris]').get(0).checked;
            var dorisExportStepFlag = false;
            if ($('input[name=dorisExportStepFlag]').get(0)) {
                dorisExportStepFlag = $('input[name=dorisExportStepFlag]').get(0).checked;
            }
            var jobid = jobid;
            var jobFreq = jobFreq;
            var jobProduct = jobProduct;
            $.post('?m=Job&a=Edit&f=ajaxGetJobDep', {
                'hql': hql,
                'exportDoris': exportDoris,
                'dorisExportStepFlag': dorisExportStepFlag,
                'jobid': jobid,
                'jobFreq': jobFreq,
                'jobProduct': jobProduct
            }, function(ret) {
                if (ret.status == 'success') {
                    $('#inputSelectArea').html('');
                    $('#relySelectArea').html('');
                    $('#relyJobArea').html('');
                    if (ret.result.udw) {
                        $.each(ret.result.udw, function() {
                            addInputSelect(this);
                        });
                    }
                    if (ret.result.rely) {
                        $.each(ret.result.rely, function() {
                            addDepSelect(this);
                        });
                    }
                    if (ret.result.job) {
                        $.each(ret.result.job, function() {
                            addDepJobSelect(this);
                        });
                    }
                    $('#relyListDiv').show();
                } else {
                    showErrMessage(ret.message, 'alertMessageSpan');
                }
            }, 'json');
        });

        $('.relyTimeText').live('click', function(e) {
            stopBubble(e);
            $(this).parent().click();
        });
    })();

    $('#submitTestHqlBtn').click(function() {
        var baseTime = $('#baseTimeInput').val();
        if (baseTime == '') {
            showErrMessage('请设置基准时间！');
            return false;
        }
        $.getJSON('?m=Query&a=Session', function(data) {
            sessionList = data.data;
            state = data.status;
            if (sessionList.length == 0) {
                $.getJSON('?m=Query&a=Session&f=open', {}, function(data) {
                    if (data.status == 'success') {
                        toTestHql();
                    } else {
                        showErrMessage('无法创建Query的Session');
                    }
                });
            } else {
                $.getJSON('?m=Query&a=Session&f=change', {
                    sid: data.data[0]
                }, function(data) {
                    if (data.running == 1) {
                        showErrMessage('当前有Query正在运行');
                    } else {
                        toTestHql();
                    }
                }, 'json');
            }
        });

        $('#testHqlDialog').modal('hide');
    });
    $('#testHqlBtn').click(function() {
        editor.focus();
        $('#testHqlDialog').modal('show');
    }); 

    // 测试HQL语句
    function toTestHql() {
        var baseTime = $('#baseTimeInput').val();
        $.post('?m=Job&a=Edit&f=testHql', {
            'hql': editor.getValue(),
            'baseTime': baseTime
        }, function(ret) {
            if (ret.status == 'success') {
                var url = '/?m=Data&a=EventTree&from=QueryResult';
                window.open(url);
            } else {
                showErrMessage(ret.message, 'alertMessageSpan');
            }
        }, 'json').error(function() {
            showErrMessage('系统错误，请联系管理员');
        });
    }
	
	(function() {
        var hasAction = true;
        function isFullScreen(cm) {
            return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
        }
        function winHeight() {
            return window.innerHeight || (document.documentElement || document.body).clientHeight;
        }
        function setFullScreen(cm, full) {
            var wrap = cm.getWrapperElement(),
            scroll = cm.getScrollerElement();
            if (full) {
                editor.setOption('theme', 'lesser-dark');
                wrap.className += ' CodeMirror-fullscreen';
                scroll.style.height = winHeight() + 'px';
                document.documentElement.style.overflow = 'hidden';
            } else {
                editor.setOption('theme', 'default');
                wrap.className = wrap.className.replace(' CodeMirror-fullscreen', '');
                scroll.style.height = '';
                document.documentElement.style.overflow = '';
            }
            cm.refresh();
        }
        CodeMirror.connect(window, 'resize', function() {
            var showing = $('body.CodeMirror-fullscreen')[0];
            if (!showing) {
                return;
            }
            showing.CodeMirror.getScrollerElement().style.height = winHeight() + 'px';
        });
        window.editor = CodeMirror.fromTextArea(document.getElementById('queryTextarea'), {
            lineNumbers: true,
            mode: 'text/x-mysql',
            onCursorActivity: function() {
                hasAction = true;
            },
            extraKeys: {
                '" "': function(cm) {
                    CodeMirror.udwHint(cm, ' ');
                },
                'F11': function(cm) {
                    setFullScreen(cm, !isFullScreen(cm));
                }
            }
        });
        editor.setValue(hqlHint);
        if (from == 'create') {
            $('div.CodeMirror').css('opacity', 0.45);
            var firstRefresh = true;
            function refreshText() {
                if (firstRefresh) {
                    $('div.CodeMirror').css('opacity', 1);
                    editor.setValue('');
                    firstRefresh = false;
                }
            }
            $('div.CodeMirror').live('focus', refreshText);
        }
    })();

    bindResize($('#queryDragger')[0], [$('.CodeMirror-scroll')[0], $('.CodeMirror-gutter')[0]], {
        'minH': 70,
        'maxH': 500
    }, function() { //call back
        if ($('.CodeMirror-scroll')[0].scrollWidth > $('.CodeMirror-scroll').width()) { //如果出现了水平滚动条
            $('.CodeMirror-gutter').css({
                'height': +$('.CodeMirror-scroll').height() - 17 + 'px'
            });
        }
    });

    $('#alertMessageClose').live('click', function() {
        $(this).parent().hide('fast');
    });

    $('#changeTheme').click(function() {
        var node = $('#changeTheme');
        if (node.text() == '默认配色') {
            node.text('黑色配色');
            editor.setOption('theme', 'default');
        } else {
            node.text('默认配色');
            editor.setOption('theme', 'lesser-dark');
        }
        editor.focus();
    });

    $('#queryKeyMap').click(function() {
        node = $('#queryKeyMap');
        if (node.text() == 'vim模式') {
            node.text('普通模式');
            editor.setOption('keyMap', 'vim');
        } else {
            node.text('vim模式');
            editor.setOption('keyMap', 'default');
        }
        editor.focus();
    });

    $('#jobFreqSelect').val(jobFreq);                                        
                                                                                    
    if (autoWeek) {                                                                
        $('#auto_week').val(autoWeek).show();                                
    }                                                                         
                                                                                    
    if (autoMonth) {                                                               
        $('#auto_month').val(autoMonth).show();                              
    }                                                                         
                                                                                    
    if (jobIsRoutine == true) {                                                   
        $("input[name=jobIsRoutine]").attr('checked', true);                        
    } 

    if (from != 'apply' && from != 'create') {
        $('input,select,#freshOutputTableBtn,#freshRelyTableBtn,#addInputTableBtn,#addRelyTableBtn,#addRelyJobBtn').attr('disabled', true);
        $('#baseTimeInput').attr('disabled', false);
    } else {
        $('#deadline').css('background-color', '#fff').css('cursor', 'text');
        $('#delayTime').css('background-color', '#fff').css('cursor', 'text');
    }

    $('#editFormBtn').click(function() {
        $('input,select,#freshOutputTableBtn,#freshRelyTableBtn,#testHqlBtn,#addInputTableBtn,#addRelyTableBtn,#addRelyJobBtn').attr('disabled', false);
        $('#jobFreqSelect,select[name=jobOrgId],#auto_week,#auto_month').attr('disabled', true);
        $('#deadline').css('background-color', '#fff').css('cursor', 'text');
        $('#delayTime').css('background-color', '#fff').css('cursor', 'text');
        $('#updateFormBtn').show();
        $(this).hide();
    });
    var inputList = {};
    var relyList = {};
    var jobList = {};

    if (jobDepList.udw) {
        inputList = jobDepList.udw;
    }
    if (jobDepList.rely) {
        relyList = jobDepList.rely;
    }

    if (jobDepList.job) {
        jobList = jobDepList.job;
    }

    $('#addInputTableBtn').click(function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        addInputSelect();
        event.cancelBubble = true;
        return false;
    });

    $('#removeInputBtn').live('click', function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        rmInputSelect(this);
        return false;
    });

    $('#removeDepJobBtn').live('click', function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        rmInputSelect(this);
        return false;
    });

    $('select[name="inputProductSelect[]"]').change(function() {
        selectDataProduct(this, 'select[name="inputTableSelect[]"]', '?m=Job&a=Edit&f=ajaxGetTableListByOrgid&orgid=');
        return false;
    });

    $('select[name="depProductSelect[]"]').change(function() {
        selectDataProduct(this, 'select[name="depSelect[]"]', '?m=Job&a=Edit&f=ajaxGetRelyListByOrgid&orgid=');
        return false;
    });

    $('select[name="depJobProductSelect[]"]').change(function() {
        selectDataProduct(this, 'select[name="depJobTableSelect[]"]', '?m=Job&a=Edit&f=ajaxGetJobListByOrgid&orgid=');
        return false;
    });

    $.each(inputList, function() {
        addInputSelect(this);
    });

    $.each(relyList, function() {
        addDepSelect(this);
    });

    $.each(jobList, function() {
        addDepJobSelect(this);
    });

    $('#addRelyTableBtn').click(function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        addDepSelect();
        event.cancelBubble = true;
        return false;
    });

    $('#removeDepBtn').live('click', function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        rmInputSelect(this);
        return false;
    });

    $('select[name="depSelect[]"]').change(function() {
        setDepName(this);
    });

    $('#addRelyJobBtn').click(function() {
        if ($('#freshRelyJobBtn').attr('disabled') == 'disabled') {
            return;
        }
        addDepJobSelect();
        event.cancelBubble = true;
        return false;
    });

    $('#removeDepBtn').live('click', function() {
        if ($('#freshRelyTableBtn').attr('disabled') == 'disabled') {
            return;
        }
        rmInputSelect(this);
        return false;
    });

    $('select[name="depSelect[]"]').change(function() {
        setDepName(this);
    });

    function addInputSelect(data) {
        // 数据源格式数据                                                        
        data = data || {
            orgid: $('#jobOrgId').val(),
            freq: $('#defaultPartitions').val()
        };
        var div = $('#inputSelectTemp').clone(true).removeAttr('id').css('display', 'block'),
        select = $('select', div),
        input = $('input', div);
        // 选中产品线                                                            
        selectIt(select[0], data.orgid);
        // 填写表达式                                                            
        if (data.freq) {
            $(input[0]).val(data.freq);
        }

        div.appendTo('#inputSelectArea');
        // 加载日志模块                                                          
        selectDataProduct(select[0], 'select[name="inputTableSelect[]"]', '?m=Job&a=Edit&f=ajaxGetTableListByOrgid&orgid=', data.tableid);
    }

    // 选中select                                                                
    function selectIt(select, val) {
        if (!$.nodeName(select, 'select')) {
            return;
        }
        for (var options = select.options, len = options.length, i = 0; i < len; i++) {
            if (val == options[i].value) {
                select.options[i].selected = true;
                select.value = val;
                select.selectedIndex = i;
                return;
            }
        }
    }

    // 选择产品线的udwtable                                                      
    function selectDataProduct(me, select, url, sv) {
        var p = getParentElement(me, 'li');
        var li = $(p);
        sv = sv || -1;
        type = $(me).prevAll('select:first').val();
        $(select, li).FillOptions(url + me.value, {
            datatype: 'json',
            textfield: 'key',
            valuefield: 'value',
            selectedValue: sv
        });
    }

    // 获取父级指定nodename的元素                                                
    function getParentElement(el, nodename) {
        el = $(el);
        nodename = nodename || 'li';
        if ($.nodeName(el[0], nodename)) {
            return el;
        }
        do {
            if ($.nodeName(el[0], nodename)) {
                return el[0];
            }
        } while ( el = el . parent ());
    }

    // 删除数据源                                                                
    function rmInputSelect(me) {
        var p = getParentElement(me, 'li');
        var li = $(p);
        return li.remove();
    }

    function addDepSelect(data) {
        // 数据源格式数据                                                        
        data = data || {
            orgid: $('#jobOrgId').val(),
            relyType: -1,
            relyId: -1
        };
        var div = $('#depSelectTemp').clone(true).removeAttr('id').css('display', 'block'),
        select = $('select', div),
        input = $('input', div);
        // 选中产品线                                                            
        selectIt(select[0], data.orgid);
        // 选中依赖文件类型                                                      
        selectIt(select[2], data.relyType);

        div.appendTo('#relySelectArea');
        // 加载日志模块                                                          
        selectDataProduct(select[0], 'select[name="depSelect[]"]', '?m=Job&a=Edit&f=ajaxGetRelyListByOrgid&orgid=', data.relyId);
        setDepName(select[1]);
    }

    function addDepJobSelect(data) {
        // 数据源格式数据                                                        
        data = data || {
            orgid: $('#jobOrgId').val(),
            freq: $('#defaultPartitions').val()
        };
        var div = $('#depJobTemp').clone(true).removeAttr('id').css('display', 'block'),
        select = $('select', div),
        input = $('input', div);
        // 选中产品线                                                            
        selectIt(select[0], data.orgid);
        if (data.freq) {
            $(input[0]).val(data.freq);
        }

        div.appendTo('#relyJobArea');
        // 加载日志模块                                                          
        selectDataProduct(select[0], 'select[name="depJobTableSelect[]"]', '?m=Job&a=Edit&f=ajaxGetJobListByOrgid&orgid=', data.jobid);
    }

    function setDepName(me) {
        var p = getParentElement(me, 'li');
        input = $('input', p);
        select = $('select', p);
        input[0].value = $(select[1]).find('option:selected').text();
    }
});
