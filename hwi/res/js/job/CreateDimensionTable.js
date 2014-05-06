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
        url: '?m=Job&a=Create&f=doajaxfileupload',
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
                    showErrMessage(data.error);
                    $('#uploadStatus').hide();
                } else {
                    $('#uploadStatus span').text(data.msg);
                    $('#uploadStatus').show();
                }
            }
        },
        error: function(data, status, e) {
            showErrMessage('服务暂时不可用，请联系管理员');
        }
    }) 
    return false;
}
$(document).ready(function() {
    // jquery fileupload                                                            
    $('#startUploadBtn').click(function() {
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

    // codemirror fullscreen                                                        
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
            var showing = document.body.getElementsByClassName('CodeMirror-fullscreen')[0];
            if (!showing) {
                return;
            }
            showing.CodeMirror.getScrollerElement().style.height = winHeight() + 'px';
        });
        // Codemirror init                                                           
        var hasAction = true;
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
                },
            }
        });
        editor.setValue(createTableHint);
    })();
    // codemirror dragge resize                                                  
    bindResize($('#queryDragger')[0], [$('.CodeMirror-scroll')[0], $('.CodeMirror-gutter')[0]], {
        'minH': 70,
        'maxH': 500
    }, function() { // call back
        if ($('.CodeMirror-scroll')[0].scrollWidth > $('.CodeMirror-scroll').width()) { // 如果出现了水平滚动条
            $('.CodeMirror-gutter').css({
                'height': +$('.CodeMirror-scroll').height() - 17 + 'px'
            });
        }
    });

    $('#alertMessageClose').live('click', function() {
        $(this).parent().hide('fast');
    });
    // codemirror theme                                                          
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
});
