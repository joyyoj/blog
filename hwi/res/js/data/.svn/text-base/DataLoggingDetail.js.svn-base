(function() {
    var colData = [];
    updateLoggingSchema = function(infos) {
        colData = infos;
        loggingSchema.fnClearTable();
        var data = [],
        info = null;
        for (var i = 0, size = infos.length; i < size; i++) {
            info = infos[i];
            info.value = info.value || {};
            var index = info.nodePath.replace(/[.# ]/g, '-');
            data.push([index || i, info.nodePath || '', info.value.type || '', info.value.comment || '', info.value.sample || '']);
            var detail = '';
            var id = 'loggingdetail' + index;
            if ($('#' + id).length) {
				continue;
			}
            for (var j in info.value) {
                switch (j) {
                case 'name':
                case 'type':
                case 'comment':
                case 'sample':
                    break;
                default:
                    if (info.value[j] == ' ') {
                        info.value[j] = '(空格)';
                    }
                    detail += '<div><strong>' + j + ' : </strong>' + (info.value[j] || '') + '</div>'
                    break;
                }
            }
            if (!detail) {
				continue;
			}
            detail = '<div class=innerDetails id=' + id + '>' + detail + '</div>';
            $('#detail_prepare').append(detail);
        }
        loggingSchema.fnAddData(data);
        loggingSchema.$('tr').find('td:eq(1)').addClass('hd');
    }
    logColDef = [{
        'sWidth': '10%',
        'aTargets': [1]
    },
    {
        'sWidth': '20%',
        'aTargets': [2]
    },
    {
        'sWidth': '30%',
        'aTargets': [3]
    },
    {
        'sWidth': '30%',
        'aTargets': [4]
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
        $('#pageName').popover({
            'placement': 'bottom'
        });
        $('#tableDetail').find('td').eq(0).hide();
        $('#tableDetail').find('td').eq(8).hide();
        $('#tableDetail').find('td').eq(4).hide();
        $('#tableDetail').find('td').eq(12).hide();
        $('#tableDetail').find('td').eq(6).hide();
        $('#tableDetail').find('td').eq(14).hide();
        $('#tableDetail').find('td').eq(7).hide();
        $('#tableDetail').find('td').eq(15).hide();
        var colTotal = 0;
        setTimeout(function() {
            $('#loggingtree_1_check').click();
            var treeObj = $.fn.zTree.getZTreeObj('loggingtree');
            colTotal = treeObj.getCheckedNodes().length;
        }, 300);
        $('#backToPreBtn').click(function() {
            window.history.go( -1);
        });
        $('#dataQualityBtn').click(function() {
            url = location.search;
            url = url.replace(/^.m=.*dataId=/, '?m=Quality&a=Version&dataId=');
            window.location = url;

        });
        $('#logDataApply').click(function() {
            var dataToApply = {
                'formData': {}
            };
            dataToApply['formData'] = {
                'id': $('#logId').text(),
                'level': 2,
                //TODO 数据级别                                           
                'name': $('#logName').text(),
                'type': 'LOG',
                'orgId': $('#logorgId').text(),
                'colTotal': colTotal,
                'comment': $('#logDescription').text(),
                'columns': {}
            };
            $.each(colData, function(i, n) {
                var obj = {};
                if (typeof n.value.type != 'undefined') {
                    obj.type = n.value.type;
                } else {
                    obj.type = '';
                }
                if (typeof n.value.sample != 'undefined') {
                    obj.sample = n.value.sample;
                } else {
                    obj.sample = '';
                }
                if (typeof n.value.comment != 'undefined') {
                    obj.comment = n.value.comment;
                } else {
                    obj.comment = '';
                }
                dataToApply['formData']['columns'][n.nodePath] = obj;
            });
            showLoadingMessage('保存所选的' + colData.length + '条schema字段...');
            $.post('?m=Data&a=Detail&f=addToCart', dataToApply,
            function(ret) {
                if (ret.status == 'success') {
                    showMessage('加入列表成功，现已选' + ret.count + '张表/schema');
                    if (top && top.setDataCount) {
                        top.setDataCount(ret.count);
                    }
                } else {
                    showErrMessage('操作失败：' + ret.message);
                }
            }, 'json').error(function() {
                showErrMessage('申请数据操作暂时不可用，请稍后再试，或者联系管理员');
            }).complete(function() {});
        });
    });
})();