/**
 * 静态报表列表页的js，StaticReportList.html
 * @author wangshouchuang@baidu.com
 * @date 2013/03/01 09:58:00
 */

// 初始化绑定事件
$(function(){

  // 面包屑提示
  $('.tip-desc').poshytip({
     className: 'tip-yellowsimple',
     showTimeout: 1,
     alignTo: 'target',
     alignX: 'center',
     offsetY: 5,
     allowTipHover: true
  });

  $('#tableContent').mouseover(function(event) {
      var element = $(event.target || event.srcElement);

      var tr = null
      if (element.parent('tbody').size() == 1) {
         tr = element;
      } else {
         tr = element.parents('tr:first');
      }

      if (tr.size() == 1 && isThis(event, tr)) {
         tr.addClass('over');
      }
  });

  $('#tableContent').mouseout(function(event) {
      var element = $(event.target || event.srcElement);

      var tr = null
      if (element.parent('tbody').size() == 1) {
         tr = element;
      } else {
         tr = element.parents('tr:first');
      }

      if (tr.size() == 1 && isThis(event, tr)) {
         tr.removeClass('over');
      }
   });

  // 产品线
  $('#selectOrgid').change(function() {
      getReports();
  });

  // 应用类型
  $('#selectCategory').change(function() {
      getReports();
  });

  // 快速过滤
  $('#txtFilter').keyup(function(event) {
      var element = $(event.currentTarget);
      var oldValue = element.attr('data-oldValue');
      if (oldValue != element.val()) {
          element.attr('data-oldValue', element.val());
          getReports();
      }
  });

  // 每页n条
  $('#selectPageCount').change(function() {
       getReports();
   });

  // 分页
  $('#divPagination').click(function(event) {
      var element = $(event.target || event.srcElement);
      var pageNo = parseInt(element.attr('data-pageNo'), 10);
      if (pageNo > 0) {
          getReports(pageNo);
      }
  });

  // 呈现数据
  getReports();
});

/**
 * 获取报表信息集合
 * @param{number} 页码
 */
function getReports(pageNo) {
    var data = {};
    var pageNo = pageNo || 1;
    data['pageNo'] = pageNo;
    data['orgId'] = $('#selectOrgid').val();
    data['category'] = $('#selectCategory').val();
    data['pageSize'] = $('#selectPageCount').val();
    data['filterValue'] = $('#txtFilter').val();

    showLoadingMessage('正在加载数据...');
    $.ajax({
       type: 'POST',
       url: '?m=StaticReport&a=List&f=ajaxFilter&from=pb',
       dataType: 'JSON',
       data: data,
       success: function(data, textStatus) {
           hideLoadingMessage();
           if (data.status) {
               renderReports(pageNo, data.result);
           } else {
               alert(data.message);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           hideLoadingMessage();
           alert('系统发生异常，请联系管理员。');
       }
    });
}

/**
 * 程序报表（绘制Table表格）
 * @param {number} 当前页码
 * @queryObject {object} 数据对象
 */
function renderReports(pageNo, queryObject) {
    var htmlArray = new Array();

     // 没有数据
    if (queryObject.reportListCnt <= 0) {
        htmlArray.push('<tr><td colspan="5" style="text-align:center;">对不起，查询不到相关数据</td></tr>');
    } else if ($.isArray(queryObject.reportList) && queryObject.reportList.length > 0) {
        var userName = $('#userName').val();
        for (var i = 0, report; report = queryObject.reportList[i]; i++) {
            //var authOperationType = queryObject.authReportList[report.reportid];
            var styleClass = ((i + 1) % 2 == 0) ? 'even' : 'odd';
            var commentLength = report.comment.length;
            htmlArray.push('<tr class="' + styleClass + '">');
            htmlArray.push('<td style="width:40%;">');
            //if (authOperationType == 1 || authOperationType == 3) {
            if (true) {
                htmlArray.push('<a href="?m=StaticReport&a=View&id=' + report.reportid + '" target="_blank">');
                htmlArray.push(report.reportName  + '</a>');
            } else {
                htmlArray.push(report.reportName);
            }
            htmlArray.push('</td>');
            htmlArray.push('<td style="width:205px;">'+ report.orgid + '</td>');
            htmlArray.push('<td style="width:75px;">'+ report.category + '</td>');
            htmlArray.push('<td style="width:150px;">' + report.creator + '</td>');

            // 操作
            htmlArray.push('<td style="width:80px;">');

            var userName = $('#userName').val();
            var canEdit = userName == 'wangshouchuang' || userName == 'lixi05' || userName == 'xubaoqiang' || userName == 'lining07' || userName == 'zhushengyun';
            if (canEdit) {
                htmlArray.push('<a href="#" class="removeBtn" reportid="' + report.reportid + '">删除</a>');
            }
            // 权限
            //if (authOperationType == 2 || authOperationType == 3) {
            if (userName == report.creator || canEdit) {
                htmlArray.push('&nbsp;<a href="?m=StaticReport&a=Add&id=' + report.reportid + '">编辑</a>');
            } else {
                htmlArray.push('没权限');
            }
            htmlArray.push('</td>');
            htmlArray.push('</tr>');
        }
    } else {
        htmlArray.push('<tr><td colspan="5" style="text-align:center;">');
        htmlArray.push('对不起，查询结果不一致，请联系开发者</td></tr>');
    }

    // 呈现查询结果
    $('#tableContent').find('tbody').html(htmlArray.join(''));

    // 删除报表
    $('.removeBtn').click(function() {
        if (!confirm('确定删除吗？报表数据将被清空，不可恢复。')) {
            return;
        }
        var reportid = $(this).attr('reportid');
        $.post('?m=StaticReport&a=List&f=removeReport', {'reportid': reportid}, function(ret) {
            if (ret.status != true) {
                alert(ret.message);
                return;
            } else {
                alert('删除成功，请停止相关任务');
                getReports();
            }
            }, 'json').error(function() {
                alert('系统出现异常，请联系管理员');
            });
    });

    // 呈现页数提示
    renderPageCountTip(pageNo, queryObject.reportListCnt);

    // 呈现分页栏
    renderPagination(pageNo, queryObject.reportListCnt);
}

/**
 * 呈现页数下拉框
 * @param{number} 当前页码
 * @param{number} 总条数
 */
function renderPageCountTip(pageNo, totalCount) {
    var pageSize = parseInt($('#selectPageCount').val(), 10);
    var begin = (pageNo - 1) * pageSize + 1;
    var end = pageNo * pageSize;
    end = end < totalCount ? end : totalCount;

    var tip = '';
    if (end <= 0) {
       tip = '找到0条数据';
    } else {
       tip = '当前显示'+ begin + '到' + end + '条，共' + totalCount + '条记录';
    }

    $('#selectPageCountTip').text(tip);
}

/**
 * 呈现分页栏
 * @param{number} 当前页码
 * @param{number} 总条数
 */
function renderPagination(pageNo, totalCount) {
    var pageSize = parseInt($('#selectPageCount').val(), 10);
    var pageCount= Math.ceil(totalCount / pageSize);

    var htmlArray = new Array();

    if (pageNo <= 1) {
        htmlArray.push('<a data-pageNo="0" class="paginate_button_disabled">第一页</a>');
        htmlArray.push('<a data-pageNo="0" class="paginate_button_disabled">上一页</a>');
    } else {
        htmlArray.push('<a data-pageNo="1">第一页</a>');
        htmlArray.push('<a data-pageNo="'+ (pageNo - 1)  + '">上一页</a>');
    }

    // 已当前页为中心显示5个页码
    var showPages = [pageNo];
    for (var i = 1; i < 5; i++) {
        if (pageNo - i >= 1) {
            showPages.unshift(pageNo - i);
        }
        if (pageNo + i <= pageCount) {
            showPages.push(pageNo + i);
        }
        if (showPages.length == 5) {
            break;
        }
    }

    for (var i = 0; i < showPages.length; i++) {
        if (showPages[i] == pageNo) {
            htmlArray.push('<a data-pageNo="' + showPages[i] + '" class="paginate_button_disabled">' + showPages[i] + '</a>');
        } else {
            htmlArray.push('<a data-pageNo="' + showPages[i] + '">' + showPages[i] + '</a>');
        }
    }

    if (pageCount == 0 || pageCount == pageNo) {
        htmlArray.push('<a data-pageNo="0" class="paginate_button_disabled">下一页</a>');
        htmlArray.push('<a data-pageNo="0" class="paginate_button_disabled">最后一页</a>');
    } else {
        htmlArray.push('<a data-pageNo="' + (pageNo + 1) + '">下一页</a>');
        htmlArray.push('<a data-pageNo="' + pageCount + '">最后一页</a>');
    }

    // 呈现
    $('#divPagination').html(htmlArray.join(''));
}
