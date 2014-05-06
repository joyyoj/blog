/**
 * @author wangshouchuang@baidu.com 
 * @desc QEWI详细页数据展示
 */

var QewiDetailClient = Class.create();
Object.extend(QewiDetailClient.prototype, {
    name: 'QewiDetailClient',

    // 初始化
    initialize: function() {
        this.initializeData();
        this.initializeDOM();
        this.initializeEvent();
        this.render();
    },

    // 初始化数据
    initializeData: function() {
        this.dataTable = qewiDetailServer.dataTable;
    },

    // 初始化DOM元素
    initializeDOM: function() {
        this.dataTableDom = $('#dataTable');
    },

    // 初始化DOM事件
    initializeEvent: function() {
        $(window).unload(this.dispose.bind(this));
    },

    // 销毁DOM
    destroyDOM: function() {
        this.dataTableDom = null;
    },

    // 销毁事件
    destroyEvent: function() {
    },

    // 析构
    dispose: function() {
        this.destroyEvent();
        this.destroyDOM();
    },

    // 初始化页面UI
    render: function() {
        this.renderDataTable(this.dataTable);
    },

    // 渲染表格
    renderDataTable: function(dataTable) {
        if (!$.isArray(dataTable) || dataTable.length === 0) {
            return;
        }

        var titleHtml = this.buildTitleHtml(dataTable.shift());
        this.dataTableDom.append(titleHtml);
        var tableSetting = {
            bAutoWidth: true,
            bScrollCollapse: true,
            sPaginationType: "full_numbers",
            iDisplayLength: 10,
            aLengthMenu: [[10, 15, 25, 50, 100, 200, -1], [10, 15, 25, 50, 100, 200, "全部"]],
            aaData: dataTable,
            aaSorting: [],
            sDom: 'R<"schemaDetail_toolbar datatable_customtoolbar ">frtlip',
            oLanguage: {
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

        this.dataTableDom.dataTable(tableSetting);
    },

    // 构建表格头
    buildTitleHtml: function(titleRow) {
        var html = [];
        html.push('<thead>');
        for (var i = 0, len = titleRow.length; i < len; i++) {
            html.push('<th>');
            html.push(titleRow[i]);
            html.push('</th>');
        }
        html.push('</thead>');
        return html.join('');
    }
});

// 初始化绑定事件
$(function() {
    var qewiDetailClient = new QewiDetailClient();
});
