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
    $('#advanceOptionBtn').click(function() {
        $('.jobAdvanceOption').toggle('fast');
        var pNode = $(this).parent();
        if (pNode.hasClass('active')) {
            pNode.removeClass('active');
        } else {
            pNode.addClass('active');
        }
    });
    $('.outputPathSelect input').click(function() {
        if (this.value == 'single') {
            $('#submitFormBtn').text('提交');
            $(this).closest('div.control-group').next().show('fast');
        } else {
            $(this).closest('div.control-group').next().hide('fast');
            $('#submitFormBtn').text('下一步');
        }
    }); (function() {
        $('#submitAddViewBtn').click(function() {
            var viewName = $.trim($('#viewNameDialog').val());
            if (viewName == '') {
                showErrMessage('物化视图名称不能为空，请检查');
                return;
            }
            var columns = '';
            $.each(viewColumns._('tr.row_selected'),
            function(i, n) {
                columns += n[1] + ', ';
            });
            columns = $.trim(columns).replace(/,$/, '');
            if (columns == '') {
                showErrMessage('未选择物化视图列，请重新选择');
                return;
            }
            $('#addViewDialog').modal('hide');
            var node = $('.addViewItem').first().clone(true);
            node.find('label').text(viewName);
            node.find('input[name=viewName]').text(viewName);
            node.find('input[name=viewDetail]').val(columns);
            $('#materializedViewOption').append(node);
            node.show('fast');
        });
        $('div.addViewItem a.deleteViewBtn').click(function() {
            $(this).closest('div.addViewItem').remove();
        });
    })();
    $('.jobAdvaneOptionControl>div.controls>label>input').click(function() {
        $(this).parent().next().toggle('fast');
    });
    $('#addViewBtn').click(function() {
        $('#addViewDialog').modal('show');
    }); (function() {
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
    })();
    bindResize($('#queryDragger')[0], [$('.CodeMirror-scroll')[0], $('.CodeMirror-gutter')[0]], {
        'minH': 70,
        'maxH': 500
    },
    function() { // call back
        if ($('.CodeMirror-scroll')[0].scrollWidth > $('.CodeMirror-scroll').width()) { // 如果出现了水平滚动条
            $('.CodeMirror-gutter').css({
                'height': +$('.CodeMirror-scroll').height() - 17 + 'px'
            });
        }
    });

    $('#alertMessageClose').live('click',
    function() {
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
