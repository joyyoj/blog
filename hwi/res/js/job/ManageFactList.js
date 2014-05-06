dataColDef = [{
    'sWidth': '25%',
    'aTargets': [1],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a href="?m=Job&a=Create&f=factTable&from=view&tableId=' + oData[0] + '">' + sData + '</a>');
    }
},
{
    'sWidth': '25%',
    'aTargets': [2]
},
{
    'sWidth': '50%',
    'aTargets': [3]
}]; 
(function() {
    changeParams = function(aoData) {
        var params = $('#advancedSearchForm').serializeArray();
        showLoadingMessage('正在加载数据...');
        $.each(params, function(i, n) {
            aoData.push(n);
        });
    }
    myTableDraw = function() {
        factListTable.$('tr').find('td:eq(0)').addClass('hd');
        hideLoadingMessage();
    }

    $(document).ready(function() {
        $('#jobTooltip').tooltip({
            'placement': 'bottom'
        });
        $('#factlisttable th:eq(0)').addClass('hd');
        $('#advancedSearchBtn').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });
        $('#advancedSearchContainer .close').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });
        $('#searchBtn').click(function() {
            factListTable.fnSort([1, 'asc']);
        });
    });
})();