dataColDef = [{
    'sWidth': '30%',
    'aTargets': [2]
},
{
    'sWidth': '20%',
    'aTargets': [3]
},
{
    'sWidth': '20%',
    'aTargets': [5]
},
{
    'sWidth': '30%',
    'aTargets': [6]
}]; 

(function() {
    changeParams = function(aoData) {
        showLoadingMessage('正在加载数据...');
    }
    myTableDraw = function(setting) {
        if ($('#datastatus td:eq(2)').length != 0) {
            $('#datastatus tr').find('td:eq(0),td:eq(1),td:eq(4),td:eq(5)').addClass('hd');
        }
        hideLoadingMessage();
    }
})();

$(document).ready(function() {
    $('#tableDetail').find('td').eq(1).hide();
    $('#tableDetail').find('td').eq(3).hide();
    $('#navback').click(function() {
        window.history.go( -1);
    });
    $('#datastatus tr').find('th:eq(0),th:eq(4),th:eq(1),th:eq(5)').addClass('hd');
    $('#advancedsearchBtn').addClass('hd');
    $('#dataQualityBtn').click(function() {
        nTr = dataStatusTable.$('tr.row_selected');
        if (nTr.find('td:eq(2)').length == 0) {
            showErrMessage('请先选择一行');
            return;
        }
        url = '?m=Quality&a=Instance&dataid=' + 
			$('#tableDetail tr:eq(1) td:eq(1)').text() + 
			'&instanceid=' + 
			nTr.find('td:eq(0)').text() + 
			'&type=' + 
			nTr.find('td:eq(1)').text();
        window.location = url;
    });
    $('#adsreset').click(function() {
        $('#adsform').each(function() {
            this.reset();
        });
    });
    $('#adsclose').click(function() {
        $('#advancedsearchcontainer').css('display', 'none');
    });
});