dataColDef = [{
    'sWidth': '25%',
    'aTargets': [1],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a href="?m=Job&a=Create&f=dimensionTable&from=view&tableId=' + oData[0] + '">' + sData + '</a>');
    }
},
{
    'sWidth': '25%',
    'aTargets': [2]
}]; (function() {
    changeParams = function(aoData) {
        var params = $('#advancedSearchForm').serializeArray();
        showLoadingMessage('正在加载数据...');
        $.each(params,
        function(i, n) {
            aoData.push(n);
        });
    }
    myTableDraw = function() {
        dimensionListTable.$('tr').find('td:eq(0)').addClass('hd');
        hideLoadingMessage();
    }

    $(document).ready(function() {
        $('#jobTooltip').tooltip({
            'placement': 'bottom'
        });
        $('#dimensionlisttable th:eq(0)').addClass('hd');
        $('#advancedSearchBtn').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });
        $('#advancedSearchContainer .close').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });
        $('#searchBtn').click(function() {
            dimensionListTable.fnSort([1, 'asc']);
        });
    });
})();