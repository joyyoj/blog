$(document).ready(function() {
    $('#applydataNext').click(function() {
        if ($('#applylistdata td:eq(2)').length == 0) {
            showErrMessage('还没有选择数据，请先在'数据浏览'选择要申请的数据');
            return;
        }
        window.location = '?m=Apply&a=Form';
    });
    $('#deleteSeletedBtn').click(function() {
        if ($('#applylistdata, #detail_prepare').find('tr.row_selected').length == 0) {
            showErrMessage('没有数据或者未选择要删除的数据');
            return;
        }
        var tableToDelete = {};
        $.each($('#applylistdata > tbody >tr.row_selected'), function(i, n) {
            if (!$(n).children('td').hasClass('details')) {
                tableToDelete[($(n).find('td:eq(1)').text())] = 'All';
            } else {}
        });
        $.each($('#detail_prepare .innerDetails, #applylistdata .innerDetails'), function(i, n) {
            var tableId = $(n).attr('name');
            var selectedRows = $(n).find('tr.row_selected');
            if (tableToDelete[tableId] != 'All' && selectedRows.length != 0) {
                tableToDelete[tableId] = new Array();
                $.each(selectedRows, function(j, row) {
                    tableToDelete[tableId].push($(row).find('td:eq(1)').text());
                });
            }
        });
        debugger;

        var jqxhr = $.post('?m=Apply&a=ListData&f=deleteSelectedRows', tableToDelete, function(ret) {
            if (ret['status'] == 'success') {
                if (top && top.setDataCount) {
                    top.setDataCount(ret['count']);
                }
                deleteSelectedRows(applyListDataTable);
                $(applyListDataTable).find('tr.row_selected').remove();
                $('#detail_prepare tr.row_selected').remove();
                showMessage('删除成功');
            } else {
                showErrMessage(ret['message']);
            }
        }, 'json').error(function() {
            showErrMessage('Loading Error, perhaps response contain debug info or Notice/Warning');
        });

    });
    $('#deleteAllBtn').click(function() {
        if ($('#applylistdata td').hasClass('dataTables_empty')) {
            showErrMessage('已选列表为空，请先去数据浏览选择要申请的数据');
            return;
        }
        var jqxhr = $.getJSON('?m=Apply&a=ListData&f=deleteAllRows', function(ret) {
            if (ret['status'] == 'success') {
                if (top && top.setDataCount) {
                    top.setDataCount(ret['count']);
                }
                applyListDataTable.fnClearTable();
                $('#detail_prepare').remove();
                showMessage('清空已选数据成功');
            } else {
                showErrMessage(ret['message']);
            }
        }).error(function() {
            showErrMessage('Cannot delete Column from Apply List !');
        });
    });
});