fromColDef = [{
    'sWidth': '30%',
    'aTargets': [0]
},
{
    'sWidth': '70%',
    'aTargets': [1]
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

    $('#backBtn').click(function() {
        window.history.go( - 1);
    });

    $('.eventColAdd').click(function() {
        var nTr = $(this).closest('tr');
        if (nTr.find('input[name=useDim]:checked').length == 0) {
            showErrMessage('只有使用维度表才能添加多行映射');
            return;
        }
        var tTr = nTr.clone('true');
        tTr.find('.exportToCol, .exportUseDim, .exportDimTable, .eventColAdd').remove();
        tTr.find('.eventColDelete').show();
        nTr.after(tTr);
    });

    $('.eventColDelete').click(function() {
        $(this).closest('tr').remove();
    });

    $('.exportUseDim input').click(function() {
        var nTr = $(this).closest('tr');
        if (this.checked) {
            nTr.find('.exportDimTable, .exportDimCol').show();
        } else {
            nTr.find('.exportDimTable, .exportDimCol').hide();
        }
        nTr.nextAll('[colname=' + nTr.attr('colname') + ']').remove();
    }); 
	
	(function() {
        var cache = {
            'factTable': {},
            'factCol': {},
            'eventCol': {},
            'dimCol': {}
        };
        var url = {
            'factTable': '?m=Job&a=TableExport&f=getFactTableList',
            'factCol': '?m=Job&a=TableExport&f=getFactColLists',
            'eventCol': '?m=Job&a=TableExport&f=getEventColLists',
            'dimCol': '?m=Job&a=TableExport&f=getDimTableCols'
        };

        var getEventId = {};
        var getOrgName = {};

        function updateSelect(node, param, type, value, callback) {
            var sname = node.attr('sname');
            var newSelect;
            var id = '';
            $.each(param, function(i, n) {
                id += n + '-';
            }); //认为传递的参数可以唯一标识同类请求

            if (typeof cache[type][id] != 'undefined') {
                //命中cache                                                        
                if (sname != id) {
                    newSelect = cache[type][id].clone(true).val(value);
                    node.replaceWith(newSelect);
                } else {
                    newSelect = node;
                } //如果当前正好是，就不必操作了                                    
                if ($.isFunction(callback)) {
                    callback(newSelect);
                }
            } else {
                $.post(url[type], param, function(ret) {
                    if (ret.status == 'success') {                        
                        cache[type][id] = $('<select></select>').attr('sname', id).attr('name', type);
                        $.each(ret.result, function(i, n) {
                            if (type == 'factTable') {
                                cache[type][id].append($('<option></option>').attr('value', i).text(i).attr('desc', n));
                            } else {
                                cache[type][id].append($('<option></option>').attr('value', n).text(n));
                            }
                        });
                        if (ret.result.length == 0) {
                            cache[type][id].append($('<option value="-1">没有数据</option>'));
                        }
                        var newSelect = cache[type][id].clone(true).val(value);
                        node.replaceWith(newSelect);
                        if ($.isFunction(callback)) {
                            callback(newSelect);
                        }
                    } else {
                        showErrMessage(ret.messge);
                    }
                }, 'json');
            }
        }

        function initTableToExport(marts) {
            $.each(marts, function(i, n) {
                var toExport = $('#tableToExportTemplate').clone(true).removeAttr('id');
                toExport.attr('tablename', i.replace(/\W/g, '-')); //jquery选择时，不能有特殊字符,因此命名去掉特殊字符
                toExport.find('.martTableNameLabel').text(i);
                toExport.find('.martDescription').text(n.description);
                getEventId[i] = n.id;
                getOrgName[i] = n.orgName;
                $('#tableToExportPanel').append(toExport);
            });
        }

        function initTableExportDetail(info) {
            $.each(info, function(i, n) { //设置每一个doris表的导出                 
                var oName = i.replace(/^.*#/, ''); //去掉前置产品线              
                var martName = oName.replace(/\W/g, '-'); //jquery选择时，不能有特殊字符
                var toExport = $('#tableToExportPanel').find('div[tablename=' + martName + ']');
                if (n.exportDoris != null && toExport.length == 1) { //如果mart表存在 且有导出到doris
                    toExport.find('select[name=orgList]').val(n.exportDoris.dstTable.orgid);
                    updateSelect(toExport.find('select[name=factTable]'), {
                        'orgid': n.exportDoris.dstTable.orgid
                    }, 'factTable', n.exportDoris.dstTable.tableName, function(select) {
                        $(select).next('label.dorisDescription').text($(select[0].selectedOptions).attr('desc'));
                    });

                    //至此上面结束,开始设置映射详细关系                         
                    var setExport = $('#setTableExportTemplate').clone(true).removeAttr('id');
                    setExport.attr('dorisname', n.exportDoris.dstTable.tableName);
                    setExport.attr('martname', oName);
                    setExport.find('.tableToExport').text(oName);
                    setExport.find('.tableExportTo').text(n.exportDoris.dstTable.tableName);
                    setExport.find('input[name=orgId]').val(n.exportDoris.dstTable.orgid);
                    setExport.find('input[name=martName]').val(oName);
                    setExport.find('input[name=dorisName]').val(n.exportDoris.dstTable.tableName);
                    $('#setTableExportPanel').append(setExport);
                    $.each(n.exportDoris.dimMap, function(colname, colmap) { //设置每一个doris列的导出
                        var exportCol = $('#exportColumnTemplate').clone('true').removeAttr('id').attr('colname', colname);
                        exportCol.find('.factColName').text(colname);
                        if (colmap.direct == 1) {
                            updateSelect(exportCol.find('select[name=eventCol]'), {
                                'eventTableId': getEventId[oName]
                            }, 'eventCol', colmap.columnDirect);
                            setExport.find('.setExportColumn').append(exportCol);
                            exportCol.find('.exportDimTable,.exportDimCol').hide();
                        } else {
                            exportCol.find('input[name=useDim]').attr('checked', 'checked');
                            exportCol.find('select[name=dimTable]').val(colmap.dimTbl);
                            var count = 0;
                            $.each(colmap.columnMap, function(i, n) { //每一个doris列的导出可能是多个mart列得到，设置每一个mart列的映射关系
                                if (count++==0) {
                                    updateSelect(exportCol.find('select[name=eventCol]'), {
                                        'eventTableId': getEventId[oName]
                                    }, 'eventCol', i);
                                    updateSelect(exportCol.find('select[name=dimCol]'), {
                                        'dimTableName': colmap.dimTbl
                                    }, 'dimCol', n);
                                    setExport.find('.setExportColumn').append(exportCol);
                                } else {
                                    var otherTr = $('#exportColumnTemplate').clone('true').removeAttr('id').attr('colname', colname);
                                    otherTr.find('.exportToCol, .exportUseDim, .exportDimTable, .eventColAdd').remove();
                                    otherTr.find('.exportFromCols a').show();
                                    updateSelect(otherTr.find('select[name=eventCol]'), {
                                        'eventTableId': getEventId[oName]
                                    }, 'eventCol', i);
                                    updateSelect(otherTr.find('select[name=dimCol]'), {
                                        'dimTableName': colmap.dimTbl
                                    }, 'dimCol', n);
                                    setExport.find('.setExportColumn').append(otherTr);
                                }
                            }); //$.each 设置每一个mart列的映射关系          
                        }
                    }); //$.each 设置每一个doris列的导出                         
                }
            }); //$.each 设置每一个doris表的导出                                 
        }
        initTableToExport(udwTables);
        initTableExportDetail(exportInfo);
        $('.productSelect').change(function() {
            if ($(this).val() != '-1') {
                updateSelect($(this).closest('div.boxBody').find('select[name=factTable]'), {
                    'orgid': $(this).val()
                }, 'factTable', '-1', function(select) {
                    $(select).next('label.dorisDescription').text($(select[0].selectedOptions).attr('desc'));
                });
            }
        });

        $('.dimTableSelect').change(function() {
            var value = $(this).val();
            if (value != '-1') {
                var nTr = $(this).closest('tr');
                $.each(nTr.parent().find('[colname=' + nTr.attr('colname') + ']  select[name=dimCol]'), function(i, n) {
                    updateSelect($(n), {
                        'dimTableName': value
                    }, 'dimCol', '-1');
                });
                $(this).next('a.dimensionDesc').attr('data-content', $(this.selectedOptions).attr('desc'));
            }
        });

        $('.tableExportBtn').click(function() {
            if ($(this).hasClass('disabled')) {
                return;
            }
            var dorisname = $(this).closest('div.boxBody').find('select[name=factTable]').val();
            var martname = $(this).closest('div.boxBody').find('label.martTableNameLabel').text();
            var orgid = $(this).closest('div.boxBody').find('select[name=orgList]').val();
            if (martname == '-1' || orgid == '-1' || dorisname == '-1') {
                showErrMessage('请选择doris表');
                return;
            }
            var target = $('#setTableExportPanel').children('div[martname=' + martname + ']');
            if (target.length > 0) {
                if (target.attr('dorisname') != dorisname) {
                    target.remove();
                } else {
                    showErrMessage('已经导出了');
                    return;
                }
            }
            if ($('#setTableExportPanel').children('div[dorisname=' + dorisname + ']').length > 0) {
                showErrMessage('暂不支持多张mart表导入到同一张doris表，如有需求，请联系管理员');
                return;
            }

            var posturl = '?m=Job&a=TableExport&f=getFactColLists&factTableOrgId=' + orgid + '&factTableName=' + dorisname;
            $.post(posturl, function(ret) {
                if (ret.status == 'success') {
                    var setExport = $('#setTableExportTemplate').clone(true).removeAttr('id').attr('dorisname', dorisname).attr('martname', martname);
                    setExport.find('.tableToExport').text(martname);
                    setExport.find('input[name=martName]').val(martname);
                    setExport.find('.tableExportTo').text(dorisname);
                    setExport.find('input[name=orgId]').val(orgid);
                    setExport.find('input[name=dorisName]').val(dorisname);
                    $.each(ret.result, function(i, n) {
                        var exportCol = $('#exportColumnTemplate').clone('true').removeAttr('id').attr('colname', n);
                        exportCol.find('.factColName').text(n);
                        updateSelect(exportCol.find('select[name=eventCol]'), {
                            'eventTableId': getEventId[martname]
                        },
                        'eventCol', '-1');
                        setExport.find('.setExportColumn').append(exportCol);
                        exportCol.find('.exportDimTable, .exportDimCol').hide();
                    });
                    $('#setTableExportPanel').append(setExport);
                } else {
                    showErrMessage(ret.message);
                }
            }, 'json');
        });

        $('.closeSetTableExport').click(function(e) {
            $(this).closest('.setExportDetail').remove();
            stopBubble(e);
        });

        $('.boxHeader').click(function() {
            $(this).next().toggle('fast');
        });

        function verifySelects(selects) { //判断是否列重复                        
            var hash = {};
            var ret = true;
            $.each(selects, function(i, n) {
                if (typeof hash[$(n).val()] == 'undefined') {
                    $(n).parent().removeClass('error');
                    hash[$(n).val()] = n;
                } else {
                    $(n).parent().addClass('error');
                    $(hash[$(n).val()]).parent().addClass('error');
                    ret = false;
                }
            });
            return ret;
        }

        function checkNullSelects(selects) { //判断是否选择                       
            if (selects.parent().css('display') == 'none') {
                return true;
            }
            var hash = {};
            var ret = true;
            $.each(selects, function(i, n) {
                if ($(n).val() != -1) {
                    $(n).parent().removeClass('error');
                } else {
                    $(n).parent().addClass('error');
                    ret = false;
                }
            });
            return ret;
        }
        function sumbmitForm(btn, isUpdate, url) {
            if ($(btn).hasClass('disabled')) {
                return;
            }
            $(btn).addClass('disabled');
            var ret = true;
            var ret2 = true;
            $.each($('#setTableExportPanel').find('.exportToCol>label.factColName'), function(i, n) {
                var col = $(this).closest('tr').attr('colname');
                if (!verifySelects($('tr[colname=' + col + ']').find('select[name=eventCol]'))) {
                    ret = false;
                }
                if (!verifySelects($('tr[colname=' + col + ']').find('select[name=dimCol]'))) {
                    ret = false;
                }
                if (!checkNullSelects($('tr[colname=' + col + ']').find('select[name=dimTable]'))) {
                    ret2 = false;
                }
            });
            if (ret == false) {
                showErrMessage('列名设置重复了，请检查');
                $('#setTableExportPanel').find('.exportDetail').show('fast');
                $(btn).removeClass('disabled');
                return;
            }
            if (ret2 == false) {
                showErrMessage('请选择维度表');
                $('#setTableExportPanel').find('.exportDetail').show('fast');
                $(btn).removeClass('disabled');
                return;
            }
            targetUrl = '?m=Job&a=TableExport&f=updateExport&jobid=' + jobid;
            var data = [];
            $.each($('#setTableExportPanel').children(), function(i, n) {
                var tMap = {};
                $.each($(n).find('tbody.setExportColumn').children(), function(j, node) {
                    var col = $(node).attr('colname');
                    if (typeof tMap[col] != 'object') {
                        tMap[col] = {
                            'dimMap': {}
                        };
                        tMap[col]['colname'] = $(node).find('label.factColName').text();
                        tMap[col]['useDim'] = $(node).find('input[name=useDim]').is(':checked');
                        tMap[col]['dimTable'] = $(node).find('select[name=dimTable]').val();
                        tMap[col]['martCol'] = $(node).find('select[name=eventCol]').val();
                    }
                    tMap[col]['dimMap'][$(node).find('select[name=eventCol]').val()] = $(node).find('select[name=dimCol]').val();

                });
                data.push({
                    'data': $(n).find('.boxHeader').find('input').serializeArray(),
                    'exportDoris': tMap,
                    'martOrgName': getOrgName[$(n).find('input[name=martName]').val()]
                });

            });
            $.post(targetUrl, {
                'formData': data,
                'dorisExportStepFlag': $('#dorisExport:checked').length
            }, function(ret) {
                if (ret.status == 'success') {
                    if (typeof url != 'undefined') {
                        window.location = url;
                    }
                    showMessage('操作成功!');
                } else {
                    $('#alertMessageSpan').text(ret.message).parent().show('fast');
                }
                $(btn).removeClass('disabled');
            }, 'json').error(function() {
                showErrMessage('系统出现异常，请联系管理员');
                $(btn).removeClass('disabled');
            });
        }
        $('#submitFormBtn').click(function() {
            sumbmitForm(this, false, '?m=Job&a=List&type=etl');
        });
        $('#updateFormBtn').click(function() {
            sumbmitForm(this, true, '?m=Job&a=List&type=etl');
        });
    })();
    if (from != 'apply' && from != 'create') {
        setTimeout(function() {
            $('input,select').attr('disabled', true);
            $('a.eventColAdd,a.eventColDelete,a.dimensionDesc').css('visibility', 'hidden');
        }, 500);
    }
    $('#editFormBtn').click(function() {
        $('input,select').attr('disabled', false);
        $('#updateFormBtn').show();
        $('a.eventColAdd,a.eventColDelete,a.dimensionDesc').css('visibility', 'visible');
        $(this).hide();
    });
    $('select[name=factTable]').live('change', function() {
        $(this).next('label.dorisDescription').text($(this.selectedOptions).attr('desc'));
    });
    $('select[name=dimTable]').live('change', function() {
        $(this).next('a.dimensionDesc').attr('data-content', $(this.selectedOptions).attr('desc')).show();
    });
    $('a.dimensionDesc').popover({
        'placement': 'top'
    });
});
