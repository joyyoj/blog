dataColDef = [{
    'sWidth': '30%',
    'aTargets': [1],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a href="?m=Data&a=Create&f=factTable&from=view&tableId=' + oData[0] + '" target="_blank">' + sData + '</a>');
    }
},
{
    'sWidth': '55%',
    'aTargets': [2]
},
{
    'sWidth': '15%',
    'aTargets': [3]
}]; 

(function() {
    changeParams = function(aoData) {
        showLoadingMessage('正在加载数据...');
        if ($('#searchBtn').attr('disabled') == 'disabled') {
            var params = $('#advancedSearchForm').serializeArray();
            $.each(params, function(i, n) {
                aoData.push(n);
            });
            $.each(aoData, function(i, n) {
                if (n.name == 'sSearch') {
                    n.value = '';
                }
            });
            $('#searchBtn').attr('disabled', false);
        }
    }
    myTableDraw = function() {
        factListTable.$('tr').find('td:eq(0)').addClass('hd');
        hideLoadingMessage();
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
        realtimeVerifyForm($('#advancedSearchForm'));
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
            if (preSubmitVerifyForm('#advancedSearchForm') == false) {
                return;
            }
            $('#factlisttable_filter input').val('');
            $(this).attr('disabled', true);
            factListTable.fnSort([1, 'asc']);
        });
        $('#factlisttable_wrapper input').keyup(function() {
            $('.checkerrmsgItem').hide();
            $('#advancedSearchForm').get(0).reset();
        });
        $('input').keypress(function(e) {
            var keyCode = e.keyCode;
            if (keyCode == 13) {
                return false;
            }
        });
    });
})();
