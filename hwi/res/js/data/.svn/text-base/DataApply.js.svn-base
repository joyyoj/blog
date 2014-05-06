$(document).ready(function() {
    $('.tip-desc').poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'center',
        offsetY: 5,
        allowTipHover: true
    });
    $('#backBtn').click(function() {
        window.history.go( -1);
    });
    $('#submitFormBtn').click(function() {
        $('#alertMessageSpan').parent().hide('fast');
        if ($('select[name="pId"]').val() == -1) {
            showErrMessage('请选择产品线');
            return;
        }
        if ($('select[name="jobFreq"]').val() == -1) {
            showErrMessage('请选择周期');
            return;
        }
        var data = $('form.createFactTableForm').serializeArray();
        var hql = editor.getValue();
        $.post('?m=Data&a=Apply&f=saveDataMartTable', {
            'data': data,
            'hql': hql
        }, function(ret) {
            if (ret.status == 'success') {
                window.location.replace('?m=Data&a=List&source=materializeview');
                event.returnValue = false;
                showMessage('数据申请提交成功！');
            } else {
                showErrMessage('申请失败：' + ret.message, 'alertMessageSpan');
            }
        }, 'json').error(function() {
            showErrMessage('申请失败，请联系管理员', 'alertMessageSpan');
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
        CodeMirror.connect(window, 'resize',
        function() {
            var showing = document.body.getElementsByClassName('CodeMirror-fullscreen')[0];
            if (!showing) return;
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
                },
            }
        });
        editor.setValue(createTableHint);
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