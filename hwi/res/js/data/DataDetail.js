dataColDef = [{
    'sWidth': '20%',
    'aTargets': [0]
},
{
    'sWidth': '40%',
    'aTargets': [1]
},
{
    'sWidth': '2px',
    'aTargets': [2]
},
{
    'sWidth': '30%',
    'aTargets': [3]
}];

dataSchemaColDef = [{
    'sWidth': '18%',
    'aTargets': [0]
},
{
    'sWidth': '7%',
    'aTargets': [1]
},
{
    'sWidth': '75%',
    'aTargets': [2]
}];

recordColDef = [{
    'sWidth': '10%',
    'aTargets': [0]
}];

exampleColDef = [{
    'sWidth': '30%',
    'aTargets': [0]
},
{
    'sWidth': '70%',
    'aTargets': [1]
}];

function switchButtonState(count) {
    setButtonState(['#applydata'], count);
}

$(document).ready(function() {
    $.each(dataschemaTable.$('tr').find('td:eq(2)'), function(i, n) {
        try {
            var obj = jQuery.parseJSON($(n).text());
        } catch (err) {
        };
        if (typeof obj == 'object') {
            var str = '';
            if (typeof obj['brief'] == 'object') {
                $.each(obj['brief'],
                function(j, m) {
                    str += '<span class = "b ' + m['type'] + '">' + m['content'] + '</span>';
                });
            }
            if (typeof obj['description'] == 'object') {
                str += ' ： ';
                $.each(obj['description'], function(j, m) {
                    str += '<span class = "' + m['type'] + '">' + m['content'] + '</span>';
                });
            }
            $(n).text('');
            $(n).append($(str));
        }
    });

    $('#datadetail').find('td').eq(0).hide();
    $('#datadetail').find('td').eq(9).hide();
    $('#datadetail').find('td').eq(4).hide();
    $('#datadetail').find('td').eq(13).hide();
    $('#datadetail').find('td').eq(6).hide();
    $('#datadetail').find('td').eq(15).hide();
    $('#datadetail').find('td').eq(7).hide();
    $('#datadetail').find('td').eq(16).hide();
    $('#datadetail').find('td').eq(8).hide();
    $('#datadetail').find('td').eq(17).hide();
    $('#datadetail').find('td').eq(2).width('40%');

    $('#backToPreBtn').click(function() {
        window.history.go( -1);
    });

    $('#applydata').click(function() {
        var selected = dataschemaTable.$('.row_selected');
        if (!selected.length) {
			return;
		}
        var columns = {};
        var typeIndex = 2,
        sampleIndex = 3,
        commentIndex = 5,
        nameIndex = 1;
        for (var i = 0, size = selected.length; i < size; i++) {
            var item = selected.eq(i).children('td');
            var obj = {};
            obj.type = item.eq(typeIndex).text();
            obj.sample = item.eq(sampleIndex).text();
            obj.comment = item.eq(commentIndex).text();
            columns[item.eq(nameIndex).text()] = obj;
        }
        var info = {
            'formData': {
                'id': $('#tableid').text(),
                'level': 2,
                //TODO 数据级别                                           
                'name': $('#tablename').text(),
                'type': $('#datatype').text(),
                'orgId': $('#orgid').text(),
                'colTotal': dataschemaTable._('tr').length,
                'comment': $('#description').text(),
                'columns': columns
            }
        };
        showLoadingMessage('保存所选的' + selected.length + '列...');
        var jqxhr = $.post('?m=Data&a=Detail&f=addToCart', info, function(ret) {
            if (ret.status == 'success') {
                showMessage('加入列表成功，现已选' + ret.count + '张表');
                if (top && top.setDataCount) {
                    top.setDataCount(ret.count);
                }
            } else {
                showErrMessage('操作失败：' + ret.message);
            }
        }, 'json').error(function() {
            alert('Cannot Add Column into Apply List !');
        }).complete(function() {});
    });

    $('#dataQualityBtn').click(function() {
        url = location.search;
        url = url.replace(/^.m=.*dataId=/, '?m=Quality&a=Version&dataId=');
        window.location = url;
    });

    var data = {};
    data.dataId = tableid;
    data.tablename = tablename;
    data.type = type;
    data.exampleJson = exampleJson;

    showLoadingMessage('数据正在加载中...');
    $.post('?m=Data&a=Detail&f=getTableSample', data, function(ret) {
        if (ret.status == true) {
            dataExample.fnClearTable();
            dataExample.fnAddData(ret.data || []);
        } else {
            showErrMessage('数据样例获取失败：' + ret.message);
        }
    }, 'json').error(function() {
        showErrMessage('数据样例获取失败，请联系管理员');
    }).complete(function() {
        hideLoadingMessage();
    });
});
