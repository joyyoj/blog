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
function ajaxFileUpload() {
    $('#uploadStatus').ajaxStart(function() {
        showLoadingMessage('正在上传');
    }).ajaxComplete(function() {
        hideLoadingMessage();
    });

    $.ajaxFileUpload({
        url: '?m=Data&a=Create&f=doajaxfileupload',
        secureuri: false,
        fileElementId: 'fileToUpload',
        dataType: 'json',
        data: {
            name: 'logan',
            id: 'id'
        },
        success: function(data, status) {
            if (typeof(data.error) != 'undefined') {
                if (data.error != '') {
                    showErrMessage(data.error, 'alertMessageSpan');
                    $('#uploadStatus').hide();
                } else {
                    $('#uploadStatus span').text(data.msg);
                    $('#filePathInput').val(data.filePath);
                    $('#uploadStatus').show();
                }
            }
        },
        error: function(data, status, e) {
            showErrMessage('服务暂时不可用，请联系管理员');
        }
    });
	return false;
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

    $('#editorHelp').popover({
        'placement': 'left'
    });

    function sumbmitForm(btn, isUpdate, url) {
        $('#uploadStatus').hide();
        if (isUpdate) {
            targetUrl = '?m=Data&a=Create&f=updateDimensionTable';
        } else {
            targetUrl = '?m=Data&a=Create&f=doCreateDimensionTable';
        }
        var hql = editor.getValue();
        var data = $('form.createFactTableForm').serializeArray();
        $.post(targetUrl, {
            'formData': data,
            'hql': hql
        },
        function(ret) {
            if (ret.status == 'success') {
                if (typeof url != 'undefined') {                                  
                    window.location.replace(url);
                    event.returnValue = false;
                }
                $('#alertMessageSpan').parent().hide();
                showMessage('操作成功!');
            } else {
                showErrMessage(ret.message, 'alertMessageSpan');
            }
            $('#fileToUpload').val('');
            $('#filePathInput').val('');
            $(btn).removeClass('disabled');
        }, 'json').error(function() {
            showErrMessage('系统出现异常，请联系管理员');
            $('#fileToUpload').val('');
            $('#filePathInput').val('');
            $(btn).removeClass('disabled');
        });
    }

    $('#submitFormBtn').click(function() {
        sumbmitForm(this, false, '?m=Data&a=Manage&f=dimensionTable');
    });
    $('#updateFormBtn').click(function() {
        sumbmitForm(this, true, '?m=Data&a=Manage&f=dimensionTable');
    });
    $('#backBtn').click(function() {
        window.history.go( - 1);
    });
    $('#saveAndNextBtn').click(function() {
        sumbmitForm(this, false, '?m=Job&a=TableExport&from=apply&jobid=' + jobid);
    });
    $('#abandomAndNextBtn').click(function() {
        window.location = '?m=Job&a=TableExport&from=apply&jobid=' + jobid;
    });
    $('#addMoreDimBtn').click(function() {
        sumbmitForm(this, false, '?m=Data&a=Create&f=dimensionTable&from=apply&jobid=' + jobid);
    });
    //jquery fileupload                                                         
    $('#startUploadBtn').click(function() {
        if (typeof FileReader !== 'undefined') {
            var size = document.getElementById('fileToUpload').files[0].size;
            if (size >= 104857600) {
                showErrMessage('文件大小超过上传限制');
                return;
            }
        }
        return ajaxFileUpload();
    });

    $('#chooseInitType').find('input[name=initTable]').click(function() {
        if ($(this).val() == 'upload') {
            $('#initFtpPanel').hide('fast');
            $('#initUploadPanel').show();
        } else if ($(this).val() == 'ftp') {
            $('#initFtpPanel').show('fast');
            $('#initUploadPanel').hide();
        } else {
            $('#initFtpPanel').hide('fast');
            $('#initUploadPanel').hide();
        }
    });

    //codemirror fullscreen                                                     
    (function() {
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
        //Codemirror init                                                           
        var hasAction = true;
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
                },
            }
        });
        editor.setValue(createTableHint); 
		if (from != 'view') {
			$('div.CodeMirror').css('opacity', 0.45);
			var firstRefresh = true;
			function refreshText() {
				if (firstRefresh) {
					$('div.CodeMirror').css('opacity', 1);
					editor.setValue('CREATE TABLE examplename (\n column1 INT COMMENT "example comment"\n) COMMENT "example comment";');
					firstRefresh = false;
				}
			}
			$('div.CodeMirror').live('focus', refreshText); 
		}
    })();
    //codemirror dragge resize                                                  
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

    //codemirror theme                                                          
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
		$('input,select').attr('disabled', true);
    }
    $('#editFormBtn').click(function() {
        $('input,select').attr('disabled', false);
        editor.setOption('readOnly', true);
        $('#updateFormBtn').show();
        $(this).hide();
    });
});
