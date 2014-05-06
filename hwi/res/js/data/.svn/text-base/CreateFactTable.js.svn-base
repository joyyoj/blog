tableColDef = [{
    'sWidth': '1px',
    'aTargets': [0],
    'bSortable': false
},
{
    'sWidth': '30%',
    'aTargets': [1]
},
{
    'sWidth': '68%',
    'aTargets': [2]
}];
$(document).ready(function() {
    $('.tip-desc').poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 5,
        allowTipHover: true
    });
    realtimeVerifyForm($('#addViewDialog'));
    realtimeVerifyForm($('.well'));
    $('#editorHelp').popover({
        'placement': 'left'
    });

    function sumbmitForm(btn, isUpdate, url) {
        if (preSubmitVerifyForm('.well') == false) {
            return;
        }
        if ($(btn).hasClass('disabled')) {
            return;
        }
        $(btn).addClass('disabled');
        if ($('select[name="pId"]').val() == -1) {
            showErrMessage('请选择产品线');
            $(btn).removeClass('disabled');
            return;
        }
        if ($('select[name="jobFreq"]').val() == -1) {
            showErrMessage('请选择周期');
            $(btn).removeClass('disabled');
            return;
        }
        var data = $('form.createFactTableForm').serializeArray();
        var hql = editor.getValue();
        $.post('?m=Data&a=Create&f=saveFactTable', {
            'data': data,
            'hql': hql
        }, function(ret) {
            if (ret.status == 'success') {
                if (typeof url != 'undefined') {                                       
                    window.location.replace(url);
                    event.returnValue = false;
                }
                $('#alertMessageSpan').parent().hide();
                showMessage('操作成功！');
            } else {
                showErrMessage(ret.message, 'alertMessageSpan');
            }
            $(btn).removeClass('disabled');
        }, 'json').error(function() {
            showErrMessage('系统出现异常，请联系管理员');
            $('#submitFormBtn').removeClass('disabled');
        });
    }

    $('#submitFormBtn').click(function() {
        sumbmitForm(this, false, '?m=Data&a=Manage&f=factTable');
    });
    $('#updateFormBtn').click(function() {
        sumbmitForm(this, true, '?m=Data&a=Manage&f=factTable');
    });
    $('#backBtn').click(function() {
        window.history.go( - 1);
    });
    $('#saveAndNextBtn').click(function() {
        if (createDimTable) {
            sumbmitForm(this, false, '?m=Data&a=Create&f=dimensionTable&from=apply&jobid=' + jobid);
        } else {
            sumbmitForm(this, false, '?m=Job&a=TableExport&from=apply&jobid=' + jobid);
        }
    });
    $('#abandomAndNextBtn').click(function() {
        if (createDimTable) {
            window.location = '?m=Data&a=Create&f=dimensionTable&from=apply&jobid=' + jobid;
        } else {
            window.location = '?m=Job&a=TableExport&from=apply&jobid=' + jobid;
        }
    });
    $('#addMoreTableBtn').click(function() {
        sumbmitForm(this, false, '?m=Data&a=Create&f=factTable&from=apply&jobid=' + jobid + '&createDim=' + createDimTable);
    });

    $('#advanceOptionBtn').click(function() {
        $('.jobAdvanceOption').toggle('fast');
        var pNode = $(this).parent();
        if (pNode.hasClass('active')) {
            pNode.removeClass('active');
        } else {
            pNode.addClass('active');
        }
    });

    $('select[name="jobFreq"]').change(function() {
        $('select[name="formerTimer"]').val($(this).val());
        $('select[name="latterTimer"]').val($(this).val());
    });

    (function() {
        $('#submitAddViewBtn').click(function() {
            if (preSubmitVerifyForm('#addViewDialog') == false) {
                return;
            }

            var columns = '';
            $.each(viewColumns._('tr.row_selected'), function(i, n) {
                columns += n[1] + ', ';
            });

            columns = $.trim(columns).replace(/,$/, '');
            if (columns == '') {
                showErrMessage('未选择物化视图列，请重新选择');
                return;
            }

            var repeatColumnFlag = false;
            $.each($('.addViewItem').find('input[name="viewDetail"]'), function(i, n) {
                if (columns == $(n).val()) {
                    showErrMessage('物化视图已存在相同的列，请检查');
                    repeatColumnFlag = true;
                    return false;
                }
            });
            if (repeatColumnFlag) {
                return;
            }
            var predictValue = $.trim($('#predictValue').val());
            if (predictValue == '') {
                showErrMessage('数据预估值不能为空，请检查');
                return;
            }
            if (predictValue <= 0) {
                showErrMessage('数据预估值必须大于0，请检查');
                return;
            }
            $('#addViewDialog').modal('hide');
            var node = $('.addViewItem').first().clone(true);
            node.find('label[name="predictValueLabel"]').text(predictValue + 'MB');            
            node.find('input[name=predictValue]').val(predictValue);
            node.find('input[name=viewDetail]').val(columns);
            $('#materializedViewOption').append(node);
            node.show('fast');
        });
        $('div.addViewItem a.deleteViewBtn').click(function() {
            $(this).closest('div.addViewItem').remove();
        });
    })();

    $('.jobAdvaneOptionControl>div.controls>label>input').click(function() {
        if (this.checked) {
            if ($('input[name="supportDoris35"]').attr('checked') == 'checked') {
                this.checked = false 
                alert('兼容Doris35的事实表请在Doris35的系统中建立物化视图');
            } else {
                $(this).parent().next().show('fast');
            }
        } else {
            $(this).parent().next().hide('fast');
        }
    });
    $('#addViewBtn').click(function() {
        $.post('?m=Data&a=Create&f=getCloumnsByHql', {
            'hql': editor.getValue()
        }, function(ret) {
            if (ret.status == 'success') {
                fnAddData(viewColumns, ret.data || []);                              
                $('#predictValue').val('');
                $('#addViewDialog').modal('show');
            } else {
                showErrMessage(ret.message, 'alertMessageSpan');
            }
        }, 'json').error(function() {
            showErrMessage('系统错误，请检查SQL，或联系管理员');
        });
    }); 
	
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
            var showing = $('.CodeMirror-fullscreen')[0];
            if (!showing) return;
            showing.CodeMirror.getScrollerElement().style.height = winHeight() + 'px';
        });
        window.editor = CodeMirror.fromTextArea(document.getElementById('queryTextarea'), {
            lineNumbers: true,
            indentUnit: 4,
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

        editor.setValue(createTableHint);
        if (from != 'view') {
            $('div.CodeMirror').css('opacity', 0.45);
            var firstRefresh = true;
            function refreshText() {
                if (firstRefresh) {
                    $('div.CodeMirror').css('opacity', 1);
                    editor.setValue('CREATE TABLE examplename (\n `timestamp` INT COMMENT "unix timestamp"\n) COMMENT "example comment";');
                    firstRefresh = false;
                }
            }
            $('div.CodeMirror').live('focus', refreshText);
        }

    })();
    bindResize($('#queryDragger')[0], [$('.CodeMirror-scroll')[0], $('.CodeMirror-gutter')[0]], {
        'minH': 70,
        'maxH': 500
    },

    function() { //call back
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
        var node = $('#queryKeyMap');
        if (node.text() == 'vim模式') {
            node.text('普通模式');
            editor.setOption('keyMap', 'vim');
        } else {
            node.text('vim模式');
            editor.setOption('keyMap', 'default');
        }
        editor.focus();
    });

    if (from != 'apply' && from != 'create') {
        $('input,textarea,select').attr('disabled', true);
        $('.deleteViewBtn').hide();
    } else {
        $('input[name="setFactView"]').click();
        $('#materializedViewOption').hide();
    }

    $('#editFormBtn').click(function() {
        showMessage('出于服务的稳定性考虑，事实表建立后不能修改，如有需求，请向管理员反馈');
    });
});