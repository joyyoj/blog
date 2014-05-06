/**
 * 静态报表新增和编辑页js，StaticReportAdd.html
 * 本js中的关键file代表列表型list的意思（开始列表型称为文件型报表）
 * @author wangshouchuang@baidu.com
 * @date 2013/03/01 09:58:00
 */

$(function() {

  // 初始化页面
  initEditPage();

  // 面包屑提示
  $('.tip-desc').poshytip({
    className: 'tip-yellowsimple',
    showTimeout: 1,
    alignTo: 'target',
    alignX: 'center',
    offsetY: 5,
    allowTipHover: true
  });

 $('#btnSubmit').click(function(event) {

    // 验证用户输入
    var pass = validInput($('#baseTable'));
    pass = pass && validLogic();
    if (!pass) {
       return false;
    }

    postData = buildInputs();
    if (parseInt(postData['reportId'], 10) > 0 &&
        postData['reportStyle'] == '0') {
        if (confirm('编辑值类型报表，删除行的历史数据会被清空？') == false) {
            return;
        }
    }

    // 进度提示
    showLoadingMessage('正在加载数据...');
    // 提交请求
    $.ajax({
       type: 'POST',
       url: '?m=StaticReport&a=Add&from=pb',
       data: postData,
       dataType: 'json',
       success: function(data, textStatus) {
           hideLoadingMessage();
           if (data.status) {
               // 跳转到编辑页面
               window.location.search = '?m=StaticReport&a=Add&id=' + data.result + '&menuTab=1'; 
           } else {
               // 保存失败的原因
               var msg = '保存失败，位置错误';
               if (data.message) {
                  msg = data.message;
               }
               $('#btnSubmit').next().text(msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          hideLoadingMessage();
          $('#btnSubmit').next().text('系统出现异常，请联系管理员');
       }
    });

    function buildInputs() {
        var inputs = {
            'reportId': $('input[name="reportId"]').val(), 
            'txtCnName': $('input[name="txtCnName"]').val(), 
            'txtEnName': $('input[name="txtEnName"]').val(), 
            'selectOrgId': $('select[name="selectOrgId"]').val(), 
            'selectCategory': $('select[name="selectCategory"]').val(), 
            'selectFreq': $('select[name="selectFreq"]').val(), 
            'areaComment': $('textarea[name="areaComment"]').val(), 
            'reportStyle': $('[name="reportStyle"]:checked').val()
        };
        if (inputs['reportStyle'] == '0') {
            inputs['columns'] = buildNumColumns();
            inputs['rows'] = buildNumRows();
        } else {
            inputs['columns'] = buildFileColumns();
        }
        return inputs;
    }

 });

// 报表英文名
$('[name="txtEnName"]').keyup(function(event) {
    enNameKeyUp($(this));
    changePrefix();
});

// 数值型字段英文名
$('#txtNumRowEnName').keyup(function(event) {
    enNameKeyUp($(this));
});

// 列表型字段英文名
$('#txtFileColEnName').keyup(function(event) {
    enNameKeyUp($(this));
 });

// 更改产品线
$('[name="selectOrgId"]').change(function(event) {
    changePrefix();
});
 
// 切换 数值型 和 列表型
$('[name="reportStyle"]').change(function(event) {
    changeReportStyle();
});

 // 数值型区域绑定click事件
 $('#divValue').click(function(event) {
     var divValue = $('#divValue');
     var rows = divValue.find('table.number tr');
     var colCount = rows.eq(0).find('td').size();
     var element = $(event.target || event.srcTarget);
     var method = element.attr('method');

     switch (method) {
        case 'addCol':
            // 验证用户输入
            var pass = validInput(element.parents('td'));
            if (!pass) {
               return;
            }
            
            addNumCol();
            break;
        case 'delCol':
            var delCol = element.parents('td');
            deleteNumCol(delCol);

            break;
        case 'addRow':
            // 验证用户输入
            var pass = validInput(divValue.children('div:first'));
            if (!pass) {
               return;
            }
 
            var cnName = $('#txtNumRowCnName').val();
            var enName = $('#txtNumRowEnName').val();

            // 重复性校验
            var isDuplicate = isDuplicateNumRow(enName);
            if (isDuplicate) {
               return;
            }

            // 插入的行HTML
            addNumRow(cnName, enName);

            // 清空
            clearNumRowEditArea();

            // 动态注册英文名提示事件
            registerEnNameTipEvent();
            break;
        case 'saveNumRow':
            if (element.attr('disabled')) {
                return;
            }

            var selectTd = $('table.number tr[data-selected="1"] td:first');
            if (selectTd.size() != 1) {
                return;
            }

            // 验证用户输入
            var pass = validInput(divValue.children('div:first'));
            if (!pass) {
                return;
            }

            var cnName = $('#txtNumRowCnName').val();
            var enName = $('#txtNumRowEnName').val();

            // 重复性校验
            var isDuplicate = isDuplicateNumRow(enName, true);
            if (isDuplicate) {
                return;
            }

            selectTd.text(cnName);
            selectTd.attr('data-enname', enName);

            clearNumRowEditArea();

            break;
        case 'delRow':
            if (element.parents('tr').attr('data-selected') == '1') {
                clearNumRowEditArea();
            }
            element.parents('tr').remove();
            break;
     }

     // 不是删除此行
     if (method != 'delRow' && rows.size() > 1) {
         var parentRow = element.parents('tr');
         if (parentRow.size() == 1 && parentRow.find('select').size() == 0) {
              parentRow.siblings('tr').attr('data-selected', '0').css('background-color', '');
              parentRow.attr('data-selected', '1').css('background-color', '#E3F1FA');

              // 标志此行为选中
              fillNumRowEditArea();
         }
     }
  });

  // 列表型报表区域事件绑定
  $('#divList').click(function(event) {

     var divList = $('#divList');
     var element = $(event.target || event.srcTarget);
     var method = element.attr('method');

     switch (method) {
        case 'checkbox':
            setValueRadio();
            break;
        case 'radio':
            if (element.attr('data-pre') == 'true') {
                element.attr('checked', false);
            }
            element.attr('data-pre', !!element.attr('checked'));
            setKeyCheckBox();
            break;
        case 'tdCheckBox':
            var chbox = element.children(':checkbox');
            if (!chbox.attr('disabled')) {
                chbox.attr('checked', !chbox.attr('checked'));
                setValueRadio();
            }
            break;
        case 'tdRadio':
            var radio = element.children(':radio');
            if (!radio.attr('disabled')) {
                radio.attr('checked', !radio.attr('checked'));
                radio.attr('data-pre', !!radio.attr('checked'));
                setKeyCheckBox();
            }
            break;
        case 'addFileCol':
            // 验证用户输入
            var pass = validInput($('#divList'));
            if (!pass) {
              return;
            }

            // 字段英文前缀
            var prefix = buildPrefix();

            // 用户填写值
            var cnName = $('#txtFileColCnName').val();
            var enName = $('#txtFileColEnName').val();
            var typeValue = $('#selectColType').val();
            var typeText = $('#selectColType option:selected').text();

            // 校验重复性
            var isDuplicate = isDuplicateFileRow(enName);
            if(isDuplicate){
              return;
            }

            addFileCol(cnName, enName, typeValue, typeText);
            clearFileRowEditArea();

            break;
        case 'delCol':
            var delRow = element.parents('tr');
            if (delRow.attr('data-selected') == '1') {
               clearFileRowEditArea();
            }
            delRow.remove();
            break;
        case 'saveFileCol':
            if (element.attr('disabled')) {
              return;
            }

            // 字段英文前缀
            var prefix = buildPrefix();

            // 验证用户输入
            var pass = validInput($('#divList'));
            if (!pass) {
                return;
            }

            // 用户填写值
            var cnName = $('#txtFileColCnName').val();
            var enName = $('#txtFileColEnName').val();
            var typeValue = $('#selectColType').val();
            var typeText = $('#selectColType option:selected').text();

            // 校验重复性
            var isDuplicate = isDuplicateFileRow(enName, true);
            if (isDuplicate) {
                return;
            }

            // 更新
            var selectedRow =  $('table.file tr[data-selected="1"]');
            var oldDataType = selectedRow.attr('data-type');

            selectedRow.attr('data-type', typeValue);
            selectedRow.attr('data-enName', enName);
            selectedRow.find('td').eq(2).text(cnName);
            selectedRow.find('td').eq(3).text(prefix + enName);
            selectedRow.find('td').eq(4).text(typeText);

            // 只有数字类型允许为value
            if (typeValue != oldDataType) {
                var radio = selectedRow.find(':radio');
                if (typeValue == 'bigint(20)') {
                    radio.removeAttr('disabled');
                }else{
                    radio.attr('checked', false);
                    radio.attr('disabled', 'disabled');
                }
                setValueRadio();
            }

            clearFileRowEditArea();
            break;
     }

     // 不是删除此行
     if (method != 'delCol' && $('table.file tr').size() > 1) {
         var parentRow = element.parents('tr');
         if (parentRow.size() == 1) {
              parentRow.siblings('tr').attr('data-selected', '0').css('background-color', '');
              parentRow.css('background-color', '#E3F1FA');
              // 标志此行为选中
              parentRow.attr('data-selected', '1');
              fillFileRowEditArea();
         }
     }
  });

});

// 更改报表类型（根据单选按钮）
function changeReportStyle() {
    // 0为数值型，1为列表型
    var reportType = $('[name="reportStyle"]:checked').val();
    
    var divValue = $('#divValue');
    var divList = $('#divList');
    if (reportType == '0') {
         divValue.slideDown();
         divList.hide();
    } else if (reportType == '1') {
        divList.slideDown();
        divValue.hide();
    }
}

// 数值型的行重复性校验
function isDuplicateNumRow(enName, exceptSelected) {
    var td = $('table.number td[data-enname="' + enName + '"]');
    var isDuplicate = td.size() == 1;
    if(isDuplicate && exceptSelected && td.parent().attr('data-selected') == '1'){
        isDuplicate = false;
    }

    var addDiv = $('[method="addRow"]').parents('div:first');
    addDiv.find('span[style="color:red;"]').remove(); 
    if (isDuplicate) {
        addDiv.append('<span style="color:red;">英文名重复，已经存在【' + enName + '】</span>');
    }
    return isDuplicate;
}

// 列表型的行重复性校验
function isDuplicateFileRow(enName, exceptSelected) {
    var tr = $('table.file tr[data-enname="' + enName + '"]');
    var isDuplicate = tr.size() == 1;
    if (isDuplicate && exceptSelected && tr.attr('data-selected') == '1') {
        isDuplicate = false;
    }

    var addDiv = $('[method="addFileCol"]').parents('div:first');
    addDiv.find('span[style="color:red;"]').remove(); 
    if (isDuplicate) {
        addDiv.append('<span style="color:red;">英文名重复，已经存在【' + enName + '】</span>');
    }
    return isDuplicate;
}

// 构建字段前缀
function buildPrefix() {
    var orgName = '';
    if ($('[name="selectOrgId"]').val()) {
        var reg = new RegExp('[[][^[,.]*]', 'g');
        orgName = $('[name="selectOrgId"] :selected').text();
        orgName = orgName.replace(reg, '');
    }

    var prefix = orgName + '_' + $('[name="txtEnName"]').val() + '_';
    return prefix;
}

// 更改前缀显示
function changePrefix() {
    var prefix = buildPrefix();
    $('#rowPrefix').show().text(prefix);
    $('#colPrefix').show().text(prefix);

    var numberRows = $('table.number tr');
    for (var i = 1; i < numberRows.size(); i++) {
        var td = numberRows.eq(i).find('td:first');
        if (td.attr('data-enname')) {
           td.attr('title', '英文名：' + prefix+td.attr('data-enname'));
        }
    }

    var fileRows = $('table.file tr'); 
    for (var i = 1; i < fileRows.size(); i++) {
        var enName = fileRows.eq(i).attr('data-enName');
        fileRows.eq(i).find('td').eq(3).text(prefix + enName);
    }

    // 动态注册英文名提示事件
    registerEnNameTipEvent();
}

 // 动态注册英文名提示事件
 function registerEnNameTipEvent() {
    // 英文名提示
    $('.tip-name').poshytip({
        className: 'tip-yellowsimple',
        showTimeout: 1,
        alignTo: 'target',
        alignX: 'right',
        alignY: 'middle',
        offsetY: -30,
        offsetX: 10,
     });
 }

 // 构建数值型报表的列信息
 function buildNumColumns() {
     var columns = new Array();
     var tdCols = $('table.number tr:first td');
     for (var i = 1; i < tdCols.size() - 1; i ++) {
         columns.push(tdCols.eq(i).attr('data-value'));
     }
     return columns;
 }

 // 构建数值型报表的行信息
 function buildNumRows() {
     var rows = new Array();
     var trs = $('table.number tr');
     for (var i = 1; i < trs.size(); i++) {
        var td = trs.eq(i).find('td:first'); 
        rows.push({
            name: td.attr('data-enname'),
            value: td.text()
        });
     }
     return rows;
 }

 // 构建列表型报表的列信息
 function buildFileColumns() {
     var columns = new Array();
     var trs = $('table.file tr');
     for (var i = 1; i < trs.size(); i++) {
         var kv = '';
         if (trs.eq(i).find(':checkbox:checked').size() == 1) {
             kv = 'key';
         }else if(trs.eq(i).find(':radio:checked').size() == 1) {
             kv = 'value';
         }

         columns.push({
            name: trs.eq(i).attr('data-enName'),
            value: trs.eq(i).children('td:eq(2)').text(),
            type: trs.eq(i).attr('data-type'),
            kv: kv
         });
     }
     return columns;
 }

 // 验证用户输入
function validInput(area) {
    var pass = true;

    // 提示用HTML 
    var tipHtml = '<span data-valid-msg="y" title="{0}" ' + 
        'style="background:url(\'/res/img/sys_icons.gif\') no-repeat 0px 2px;' +
        'padding:3px 17px 3px 0px;"></span></td>';

    // 非空校验
    (area || $('body')).find('[data-empty]').each(function() {
        var node = $(this);
        node.next('span[data-valid-msg="y"]').remove(); 
        
        if (!node.val()) {
           var tip = node.attr('data-empty') || '此项必填';
           node.after(tipHtml.replace('{0}', tip));
           pass = false;
        }
    });

    // 正则表达式校验
    (area || $('body')).find('[data-reg]').each(function() {

       var node = $(this);
       var regString = node.attr('data-reg');
       
       if (!regString) {
           return;
       }

       node.next('span[data-valid-msg="y"]').remove(); 

       var reg = new RegExp(regString, 'g');
       if (!reg.test(node.val())) {
          var tip = node.attr('data-reg-msg') || ('不符合规范：' + regString);
          node.after(tipHtml.replace('{0}', tip));
          pass = false;
       }
    });

    return pass;
}

// 业务逻辑验证
function validLogic() {
    var pass = true;

    // 是否有数值型或列表型数据
    var tip = '';
    if ($('[name="reportStyle"]:checked').val() == '0') {
       if ($('#divValue table tr').size() <= 1 || $('#divValue table tr:first td').size() <= 2) {
           tip = '数值型报表必须有行和列';
           pass = false;
       }
    } else {
       var trs = $('table.file tr');
       if (trs.size() <= 1) {
           tip = '列表型报表必须有列';
           pass = false;
       } else {
           var keyCount = trs.find(':checkbox:checked').size();
           var valueCount = trs.find(':radio:checked').size();
           if (valueCount > 1) {
              tip = 'Value只能有一个';
              pass = false;
           }

           if ((keyCount > 0 && valueCount <=0) || (keyCount <= 0 && valueCount == 1)) {
              tip = 'Key和Value不能单独出现';
              pass = false;
           }
       }
    }
    $('#btnSubmit').next().text(tip);

    return pass;
}

// 数值型：清空编辑区域
function clearNumRowEditArea() {
   $('#txtNumRowCnName').val('');
   $('#txtNumRowEnName').val('');

   // 取消选中行 
   $('table.number tr[data-selected="1"]').attr('data-selected', '0')
       .css('background-color', '');
   $('#divValue [method="saveNumRow"]').attr('disabled', 'disabled');
}

// 数值型：根据选中行填充编辑
function fillNumRowEditArea() {
    var selectedTd = $('table.number tr[data-selected="1"] td:first');
    if (selectedTd.size() != 1) {
        return;
    }

    var cnName = selectedTd.text();
    var enName = selectedTd.attr('data-enname');

    $('#txtNumRowCnName').val(cnName);
    $('#txtNumRowEnName').val(enName);

    // 启用保存按钮
    $('#divValue [method="saveNumRow"]').removeAttr('disabled');
}

// 清空编辑区域
function clearFileRowEditArea() {
   $('#txtFileColCnName').val('');
   $('#txtFileColEnName').val('');
   $('#selectColType option:selected').remove('seleceted').
       siblings(':first').attr('selected', 'selected');

   // 取消选中行 
   $('table.file tr[data-selected="1"]').attr('data-selected', '0').css('background-color', '');
   $('#divList [method="saveFileCol"]').attr('disabled', 'disabled');
}

// 根据选中行填充编辑
function fillFileRowEditArea() {
     var selectedRow = $('table.file tr[data-selected="1"]');
     if (selectedRow.size() != 1) {
         return;
     }

     var selectType = $('#selectColType');
     var tds = selectedRow.children('td');
     var cnName = tds.eq(2).text();
     var enName = selectedRow.attr('data-enName');
     var colTypeValue = selectedRow.attr('data-type');

     $('#txtFileColCnName').val(cnName);
     $('#txtFileColEnName').val(enName);
     if (selectType.find('option:selected').val() != colTypeValue) {
         selectType.find('option:selected').removeAttr('selected');
         selectType.find('[value="' + colTypeValue  + '"]').attr('selected','selected');
     }

     // 启用保存按钮
     $('#divList [method="saveFileCol"]').removeAttr('disabled');
}

// 设置CheckBox的可用状态
function setKeyCheckBox() {
    $('table.file :radio').each(function() {
        // 选中则禁用key
        var checkboxValue = $(this).parent().prev().children(':checkbox'); 
        if ($(this).attr('checked')) {
            checkboxValue.attr('disabled', 'disabled');
        } else {
            checkboxValue.removeAttr('disabled');
        }
    });
}

// 英文名输入
function enNameKeyUp(element) {
    var currentValue = element.val();
    var oldValue = element.attr('data-old') ? element.attr('data-old') : '';
    var reg = new RegExp('^[A-Z,a-z,\\d]+$', 'g');
    if (currentValue.length > oldValue.length) {
        var addWord = currentValue.substr(oldValue.length, currentValue.length - oldValue.length);
        if (!reg.test(addWord)) {
            element.val(oldValue);
        }
    }
    element.attr('data-old', element.val());
}

// 设置value状态
function setValueRadio() {
    $('table.file :checkbox').each(function() {
                                     
    // 选中则禁用value
    var radioValue = $(this).parent().next().children(':radio'); 
    if ($(this).attr('checked')) {
        radioValue.attr('disabled', 'disabled');
    } else {
        var dataType = $(this).parents('tr:first').attr('data-type');
        if (dataType == 'bigint(20)') { 
            radioValue.removeAttr('disabled');
        }
     }
   });
}

// 编辑时初始化页面 
function initEditPage() {
    var reportId = parseInt($('input[name="reportId"]').val(), 10);
    if (reportId <= 0) {
        return;
    }

    // 进度提示
    showLoadingMessage('常初始化编辑页面……');
    $.ajax({
        type: 'GET',
        url: '?m=StaticReport&a=Add&f=getReport&id=' + reportId + '&from=pb',
        dataType: 'json',
        success: function(data, textStatus) {
            hideLoadingMessage();
            if (data.status) {
                renderReport(data.result);
            } else {
                alert('获取报表失败：' + data.message);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            hideLoadingMessage();
            alert('系统出现异常，获取报表失败，请联系管理员');
        }
    });
}

/**
 * 呈现编辑页面（填充数据）
 * @param{object} 报表的json形式
 */
function renderReport(report) {
    $('span.tip-desc').text('编辑报表');
    $('input[name="txtCnName"]').val(report.reportChineseName);
    $('input[name="txtEnName"]').attr('disabled', 'disabled').val(report.reportEnglishName);

    var selectOrg = $('select[name="selectOrgId"]').attr('disabled', 'disabled');
    selectOrg.find('option[value="' + report.orgid + '"]').attr('selected', 'selected');
    
    $('select[name="selectCategory"] option[value="' + report.category + '"]').attr('selected', 'selected');
    $('textarea[name="areaComment"]').text(report.comment);

    var prefix = buildPrefix();
    $('#rowPrefix').show().text(prefix);
    $('#colPrefix').show().text(prefix);

    if (report.type == 0) {
        $('#numStyle').attr('checked', 'checked');
        renderNumTable(report);
    } else {
        $('#fileStyle').attr('checked', 'checked');
        $('#selectColType').parent().hide();
        $('a[method="addFileCol"]').hide();
        $('#txtFileColEnName').attr('disabled', 'disabled');
        changeReportStyle();
        renderFileTable(report);
    }

    $('input[name="reportStyle"]').attr('disabled', 'disabled');
    $('#helpLink').show();
}

/**
 * 呈现列表型报表
 * @param{object} 报表的json形式
 */
function renderFileTable(report) {
    for (var i = 0, item; item = report.reportItems[i]; i++) {
        var typeText = $('#selectColType option[value="' + item.type + '"]').text();
        addFileCol(item.chineseName, item.englishName, item.type, typeText, item.kv, true);
    }
}

/**
 * 添加列表型的列
 * @param{string} 列的中文名
 * @param{string} 列的英文名（创建表时字段名）
 * @param{string} 列的类型（创建表示字段类型）
 * @param{string} 列的类型的中文名
 * @param{bool} 是否允许删除
 */
function addFileCol(cnName, enName, typeValue, typeText, kv, noDelete) {
    // 字段英文前缀
    var prefix = buildPrefix();

    // 拼装的行的HTML
    var htmlArray = new Array();
    htmlArray.push('<tr data-enName="' + enName  + '" data-type="' + typeValue  + '">');

    // key
    htmlArray.push('<td method="tdCheckBox"><input method="checkbox" type="checkbox" ');
    if (noDelete) {
        htmlArray.push('disabled="disabled" ');
    }
    if (kv == 'key') {
        htmlArray.push('checked="checked"');
    }
    htmlArray.push('></td>');

    // value
    htmlArray.push('<td method="tdRadio"><input method="radio" name="radioFileValue" type="radio" ');
    if (noDelete || typeValue != 'bigint(20)') {
        htmlArray.push('disabled="disabled" ');
    }
    if (kv == 'value') {
        htmlArray.push('checked="checked"');
    }
    htmlArray.push('></td>');

    htmlArray.push('<td>' + cnName + '</td>');
    htmlArray.push('<td>' + prefix + enName + '</td>');
    htmlArray.push('<td>' + typeText + '</td>');
    if (noDelete) {
        htmlArray.push('<td><a title="不许删除" class="btn btn-mini btn-danger disabled">');
        htmlArray.push('<i class="icon-remove icon-white"></i></a></td>');
    } else {
        htmlArray.push('<td><a title="删除此行" method="delCol" class="btn btn-mini btn-danger">');
        htmlArray.push('<i class="icon-remove icon-white"></i></a></td>');
    }
    $('table.file').append(htmlArray.join(''));
}

/**
 * 呈现值类型的table
 * @param{object} 报表的json形式
 */
function renderNumTable(report) {
    var tds = $('table.number tr:first').find('td');
    for (var i = 1; i < tds.size() - 1; i++) {
        deleteNumCol(tds.eq(i));
    }

    // 添加列
    var selectCols =$('#divValue select');
    for (var i = 0, item; item = report.valueColumnCode[i]; i++) {
        selectCols.find('option[value="' + item + '"]').attr('selected', 'selected');
        addNumCol();
    }

    // 添加行
    for (var i = 0, item; item = report.reportItems[i]; i++) {
        addNumRow(item.chineseName, item.englishName);
    }
    // 动态注册英文名提示事件
    registerEnNameTipEvent();
}

/**
 * 增加数值型报表的行
 * @param{string} 行中文名
 * @param{string} 行英文名
 */
function addNumRow(cnName, enName) {
    var rows = $('#divValue').find('table.number tr');
    var colCount = rows.eq(0).find('td').size();

    var prefix = buildPrefix();
    var tipEnName = '英文名：' + prefix + enName;

    // 插入的行HTML
    var rowsHtmlArray = new Array();
    rowsHtmlArray.push('<tr><td class="head tip-name" title="' + tipEnName + 
         '" data-enname="' + enName  + '">' + cnName  + '</td>')
    for(var i = 1; i < colCount - 1; i ++){
       rowsHtmlArray.push('<td></td>');
    }
    rowsHtmlArray.push('<td style="text-align:right;"><a title="删除此行" ' + 
        'method="delRow" class="btn btn-mini btn-danger">' +
        '<i method="delRow" class="icon-remove icon-white"></i></a></td>');
    rowsHtmlArray.push('</tr>');

    // 插入
    rows.eq(rows.size() - 1).after(rowsHtmlArray.join(''));
}

/**
 * 删除值类型的列
 * @param{object} 要删除的列td元素
 */
function deleteNumCol(delCol) {
    var divValue = $('#divValue')
    var rows = divValue.find('table.number tr');

    // 添加下拉框中的html
    var delOrder = parseInt(delCol.attr('data-order'), 10);
    var delOptionHtml='<option value="' + delCol.attr('data-value') + 
        '" data-new="' + delCol.attr('data-new') + '" data-order="' + 
        delOrder + '">' + delCol.find('span').text() + '</option>';

    // 插入位置
    var insertIndex = 0;
    var options = divValue.find('select option'); 
    for (var i = 1; i < options.size(); i++) {
        var tmpOrder = parseInt(options.eq(i).attr('data-order'), 10);
        if (tmpOrder < delOrder) {
           insertIndex = i;
        } else {
           break;
        }
    }

    // 插入
    options.eq(insertIndex).after(delOptionHtml);

    // 删除
    delCol.remove();
    for (var i = 1; i < rows.size(); i++) {
       rows.eq(i).find('td').eq(1).remove();
    }
    
    var tdEditArea = rows.last().find('td:last');
    var colspan = parseInt(tdEditArea.attr('colspan'), 10);
    tdEditArea.attr('colspan', colspan - 1);
}

/**
 * 增加值类型的列（根据下拉框）
 */
function addNumCol() {
    var divValue = $('#divValue')
    var rows = divValue.find('table.number tr');

    // 取得选择的列
    var selectedCol = divValue.find('select option:selected');
    var text = selectedCol.text();
    var value = selectedCol.val();

    // 拼接列html
    var newHeadHtml = '<td data-value="' + value + '" class="head"><span>' + text + 
        '</span><a title="删除此列" method="delCol" class="btn btn-mini btn-danger">' +
        '<i method="delCol" class="icon-remove icon-white"></i></a>';

    // 插入列
    rows.eq(0).find('td:last').before(newHeadHtml);
    for (var i = 1; i < rows.size(); i++) {
        rows.eq(i).find('td:last').before('<td></td>');
    }

    // 从下拉框中删除
    selectedCol.remove();
}
