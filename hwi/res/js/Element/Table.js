// 对原有参数修改：myAddData删除（改为返回值的成员函数）, fnHeaderCallback删除（因为没有引用并且原来直接调用了这个函数）, variable删除（改为函数返回值）, toolbar => toolbarSelector
//
// paramObj对象格式、参考值以及参数说明：
// {
//     elementId: 'tableid',     // 表的Dom id
//     sDom: 'tp',                // 用于定义DataTable布局的属性
//     type: 'checkbox',
//     colDef: [{...}, {...}],     // 用于定义aoColumnDefs属性
//     addDataFunName: 'myAddDataFunName', // 自定义的add data function名字
//     toolbarSelector: '#toolbar',
//     displayLength: 15,
//     toHideCol: [1,6],
//     aaData: [[...], [...]],  // 初始数据
//     ajaxSource: '?f=ajaxGetUDWColumns',
//     ajaxProp: 'data',        // ajax返回的数据字段名
//     fnServerData: fun,       // 用来请求服务器数据的函数(http://datatables.net/ref#fnServerData)
//     onchange: myOnChangeFun
// }
//
// 返回DataTable对象，并扩展一个biglogFnAddData函数
baiduBiglog.createDataTable = function(paramObj){
    var idSelector = "#" + paramObj.elementId;
    if ($(idSelector).hasClass('dataTable')) {
        return;
    }
    var init = false;
    var setting = {
        "sPaginationType": "full_numbers",
        "aLengthMenu": [[10, 15, 25, 50, 100, 200, -1], [10, 15, 25, 50, 100, 200, "全部"]],
        "bAutoWidth": false,
        "aaSorting": [],
        "fnDrawCallback": function( oSettings ) {
            var thNum = $(idSelector + " th").not('.hd').length; 
            $(idSelector + " .dataTables_empty").attr("colspan", thNum);
            $(idSelector).removeAttr("style");
        },
        "oLanguage": {
            "sLengthMenu": "每页_MENU_条",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoEmpty": "找到0条数据",
            "sInfoFiltered": "(数据表中共为 _MAX_ 条记录)",
            "sProcessing": "正在加载中...",
            "sSearch": "快速过滤",
            "oPaginate": {
                "sFirst":    "第一页",
                "sPrevious": " 上一页 ",
                "sNext":     " 下一页 ",
                "sLast":     " 最后一页 "
            }
        }
    };
    if (paramObj.displayLength) {
        setting.iDisplayLength = paramObj.displayLength;
    } else {
        setting.iDisplayLength = 15;
    }
    if (paramObj.sDom) {
        setting.sDom = 'R<"' + paramObj.elementId + '_toolbar datatable_customtoolbar ">' + paramObj.sDom;
    } else {
        setting.sDom = 'R<"' + paramObj.elementId + '_toolbar datatable_customtoolbar ">frtlip';
    }
    if (paramObj.colDef) {
        setting.aoColumnDefs = paramObj.colDef;
    } else if (paramObj.type == 'checkbox' || paramObj.type == 'radio') {
        setting.aoColumnDefs = [{ 
            'sWidth': "1px",
            'bSortable': false, 
            'aTargets': [ 0 ]
        }];
    }
    if (paramObj.type == 'checkbox') {
        setting.fnCreatedRow = function( nRow, aData, iDataIndex ) {
            $("<input type=checkbox />").appendTo($(nRow).children('td:eq(0)'));
        };
    } else if (paramObj.type == 'radio') {
        setting.fnCreatedRow = function( nRow, aData, iDataIndex ) {
            $("<input type=radio />").appendTo($(nRow).children('td:eq(0)'));
        };
    }
    if (paramObj.aaData) {
        setting.aaData = paramObj.aaData;
    }
    if (paramObj.ajaxSource) {
        setting.sAjaxSource = paramObj.ajaxSource;
    }
    if (paramObj.ajaxProp) {
        setting.sAjaxDataProp = paramObj.ajaxProp;
    }
    if (paramObj.fnServerData) {
        setting.fnServerData = paramObj.fnServerData;
    }


    var oTable = $(idSelector).dataTable(setting);
    if (paramObj.toHideCol) {
        $.each(paramObj.toHideCol, function(i, n){
            oTable.fnSetColumnVis(new Number(n), false);
            oTable.fnAdjustColumnSizing();
        });
    }
    if (paramObj.type) {
        $(idSelector +" th:eq(0)").attr("style", "width=1px");
        $(idSelector +" th:eq(0)").addClass("sorting_disabled control center");
    }
    oTable.biglogFnAddData = function(mData){
        oTable.fnClearTable();

        var addData = mData || [];
        if ((paramObj.type == "radio" || paramObj.type == "checkbox") && mData.length != 0){
            addData = [];
            $.each(mData, function(i, n){
                addData[i] = [""].concat(n);
            });
        }
        oTable.fnAddData(addData);
    }

    $(idSelector).click( function( e ) {
        if(!e.target) return false;
        var tr = $(e.target).closest("tr");
        if(tr.parent().is("thead")) {
            return;
        }
        if (tr.hasClass('row_selected') ) {
            $(idSelector + 'checkbox').attr("checked", false);
            tr.removeClass('row_selected');
            tr.find("input").attr("checked", false);
       } else if(paramObj.type == "checkbox") {
            $(idSelector + 'checkbox').attr("checked", false);
            tr.addClass('row_selected');
            tr.find("input").attr("checked", true);
        } else {
            $(idSelector + 'radio').attr("checked", false);
            oTable.$('tr.row_selected').find("input").attr("checked", false);
            oTable.$('tr.row_selected').removeClass('row_selected');
            tr.addClass('row_selected');
            tr.find("input").attr("checked", true);
       }
       if(jQuery.isFunction(paramObj.onChange)) {
            paramObj.onChange(oTable.$("tr.row_selected").length);    
       }
    });
    $('.' + paramObj.elementId + "_toolbar").append($(paramObj.toolbarSelector));
    $(idSelector + "radio").click(function(){
        oTable.$('tr.row_selected').find("input").attr("checked", false);
        oTable.$('tr.row_selected').removeClass('row_selected');
        if(jQuery.isFunction(paramObj.onChange)) {
            paramObj.onChange(oTable.$("tr.row_selected").length);    
        }
    });
    $(idSelector + "checkbox").click(function(){
        if($(this).attr("checked")){
            oTable.$('tr').addClass('row_selected');
            oTable.$('input').attr("checked", true);
        } else {
            oTable.$('tr').removeClass('row_selected');
            oTable.$('input').attr("checked", false);
        }
        if(jQuery.isFunction(paramObj.onChange)) {
            paramObj.onChange(oTable.$("tr.row_selected").length);    
        }
    });
     
    /* Add a click handler for the delete row */
    $('#delete').click( function() {
        var anSelected = fnGetSelected(oTable);
        if (anSelected.length !== 0) {
            oTable.fnDeleteRow(anSelected[0]);
        }
    } );
    /* Get the rows which are currently selected */
    function fnGetSelected(oTableLocal){
        return oTableLocal.$('tr.row_selected');
    }

    return oTable;
};
