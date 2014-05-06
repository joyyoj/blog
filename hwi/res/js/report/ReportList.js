reportColDef = [{
    'sWidth': '1%',
    'aTargets': [0],
    'bSearchable': false
},
{
    'sWidth': '1%',
    'aTargets': [1],
    'bSearchable': false
},
{
    'sWidth': '1%',
    'aTargets': [2],
    'bSearchable': false
},
{
    'sWidth': '25%',
    'aTargets': [3],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a href="' + oData[7] + '" target="_blank">' + sData + '</a>');
    }
},
{
    'sWidth': '55%',
    'aTargets': [4]
},
{
    'sWidth': '10%',
    'aTargets': [5]
},
{
    'sWidth': '10%',
    'aTargets': [6],
    'bSearchable': false,
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        if (sData == 'false') {
            clazz = 'class="btn btn-mini btn-success favorBtn"';
            text = '收藏';
        } else {
            clazz = 'class="btn btn-mini btn-danger favorBtn"';
            text = '取消收藏';
        }
        html = '<button ' + clazz + ' >';
        html += text + '</button>';
        $(nTd).html(html);
    }
},
{
    'sWidth': '1%',
    'aTargets': [7],
    'bSearchable': false
},
{
    'sWidth': '1%',
    'aTargets': [8],
    'bSearchable': false
}];

(function() {
    var params;
    //第一次datatable会自己调用一次，导致加载两次，所以屏蔽第一次
    var firsttime = true;

    fillButtonClick = function(size) {
        var list = ['#datadetail', '#datarecord', '#applydata', '#dataQualityBtn'];
        setButtonState(list, size);
    }

    updateTable = function(str) {
        params = str;
        if (!firsttime) {
            setTimeout(function() {
                listtable.fnSort([1, 'asc']);
            }, 100);
        } else {
            firsttime = false;
        }
    }

    function applyData() {
        var data = $('#applyDataForm').serializeArray();
        $.post('?m=WorkflowProcess&a=Begin&f=applyReport', {
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

        realtimeVerifyForm($('#applyDataForm'));
        $('#datavizdt_filter input').attr('placeholder', '输入关键字快速发现数据');
        setTimeout(function() {
            $('#advancedsearch').removeClass('hd');
        }, 300);

        $('#advancedsearchBtn').addClass('hd'); //暂不支持                       
        if (dataTypeEnum == 4) { //暂时没有对dataMart支持，暂时屏蔽入口  4:datamart
            $('#dataQualityBtn').addClass('hd');
        } else if (dataTypeEnum == 1) { //暂时不能申请log的权限                
            $('#applydata').addClass('hd');
        }
        $('#dataQualityBtn').click(function() {
            nTr = listtable.$('tr.row_selected');
            if (nTr.find('td:eq(2)').length == 0) {
                showErrMessage('请先选择一行');
                return;
            }
            var url = '?m=Quality&a=Version&dataId=' + nTr.find('td:eq(2)').text() + '&version=' + nTr.find('td:eq(2)').text() + '&type=' + dataTypeEnum;
            window.location = url;
        });
        $('#applydata').click(function() {
            $('#datadetail').click();
            return;
        });
        $('#datadetail').click(function() {
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            var idIndex = 2,
            typeIndex = 4,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var type = selected.eq(typeIndex).text().toLowerCase();
            var version = selected.eq(versionIndex).text().toLowerCase();
            var url = '';
            switch (type) {
            case 'udw':
            case 'datamart':
                url = '?m=Data&a=Detail&dataId=' + id + '&version=' + version;
                break;
            case 'logging':
                url = '?m=Data&a=LoggingDetail&dataId=' + id + '&version=' + version;
                break;
            default:
                break;
            }
            switch (type) {
            case 'logging':
                url += '&type=1';
                break;
            case 'udw':
                url += '&type=2';
                break;
            case 'datamart':
                url += '&type=4';
                break;
            default:
                break;
            }
            if (url) window.location = url;
        });
        $('#datarecord').click(function() {
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) return;
            var idIndex = 2,
            typeIndex = 4,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var type = selected.eq(typeIndex).text().toLowerCase();
            var url = '?m=Data&a=Record&dataId=' + id;
            switch (type) {
            case 'logging':
                url += '&type=1';
                break;
            case 'udw':
                url += '&type=2';
                break;
            case 'datamart':
                url += '&type=4';
                break;
            default:
                break;
            }
            if (url) {
				window.location = url;
			}
        });
        $('#adsreset').click(function() {
            $('#adsform').each(function() {
                this.reset();
            });
        });
        $('#adsclose').click(function() {
            $('#advancedsearchcontainer').css('display', 'none');
        });
        $('#applyPermissionBtn').click(function() {
            var selected = listtable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            $('.checkerrmsgItem').hide();
            $('#applyDataForm').get(0).reset();
            $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true);
            $('#selectedTableName').text(selected[0][3]);
            $('input[name="entityId"]').val(selected[0][1]);
            $('input[name="owner"]').val(selected[0][8]);
            $('#addPermissionDialog').modal('show');
        });
        $('input[name="applyUser"]').change(function() {
            if ($('input[name="applyUser"]:checked').val() == 'other') {
                $('input[name="userName"]').addClass('cNotNull cOneName').attr('readonly', false);
            } else {
                $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true).next('.checkerrmsgItem').remove();
            }
        });
        $('a[name="save"]').click(function() {
            if (preSubmitVerifyForm('#applyDataForm') == false) {
                return;
            }
            applyData();
        });
        $('#favorTab').click(function() {
            updateTable('');
            $(this).parent().addClass('active');
            $(this).parent().next().removeClass('active');
        });
        $('#allTableTab').click(function() {
            updateTable('');
            $(this).parent().addClass('active');
            $(this).parent().prev().removeClass('active');
        });
        $('#searchPanel').hide();
        $('#toggleAdvancedSearch').click(function() {
            if ($('#searchPanel')[0].style.display != 'none') {
                $('#searchPanel').hide('fast');
            } else {
                $('#searchPanel').show('fast');
            }
        });

        $('.btn-mini').live('click', function(e) {
            stopBubble(e);
            if (listtable._('tr.row_selected').length == 0) {
                $(this).parent().click();
            }
            orgID = listtable._('tr.row_selected')[0][0];
            tableID = listtable._('tr.row_selected')[0][1];
            name = listtable._('tr.row_selected')[0][3];
            description = listtable._('tr.row_selected')[0][4];
            priv = listtable._('tr.row_selected')[0][5];
            url = listtable._('tr.row_selected')[0][7];
            btn = this;
            if ($(this).hasClass('btn-danger')) {
                showLoadingMessage('正在取消收藏');
                $.post('?m=Report&a=BieeFavorite&f=remove', {
                    orgID: orgID,
                    tableID: tableID
                }, function(data) {
                    if (data.status == 'success') {
                        if (smarty.get.a == 'BieeList') {
                            $(btn).removeClass('btn-danger');
                            $(btn).addClass('btn-success');
                            $(btn).html('收藏');
                        } else {
                            listtable.fnDeleteRow(listtable.$('tr.row_selected')[0]);
                        }
                        hideLoadingMessage();
                    } else {
                        showErrMessage('操作失败:' + data.message);
                    }
                }, 'json');
            } else {
                showLoadingMessage('正在添加收藏');
                $.post('?m=Report&a=BieeFavorite&f=add', {
                    orgID: orgID,
                    tableID: tableID,
                    name: name,
                    description: description,
                    priv: priv,
                    url: url
                },
                function(data) {
                    if (data.status == 'success') {
                        hideLoadingMessage();
                        $(btn).removeClass('btn-success');
                        $(btn).addClass('btn-danger');
                        $(btn).html('取消收藏');
                    } else {
                        showErrMessage('操作失败:' + data.message);
                    }
                }, 'json');
            }
        });
    });
})();