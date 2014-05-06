dataColDef = [{
    'sWidth': '10%',
    'aTargets': [0]
}];
$(document).ready(function() {

    loadStandard(standardUDWkeys, $('#UDWkeys'));

    loadStandard(standardLogkeys, $('#logkeys'));

    $('#backToPreBtn').click(function() {
        window.history.go( -1);
    });

    function loadStandard(data, obj) {
        var tempTable = $('<table class="table innertable"></table>');
        for (i in data) {
            var tempTr = $('<tr></tr>');
            tempTr.append('<td class="title" width="15%">' + i + '</td>');
            var tempTd = $('<td class="content"></td>');
            var tempInnerTable = $('<table class="table innertable"></table>');
            for (j = 0; j < data[i].length; j++) {
                tempInnerTable.append('<tr><td class="content">' + data[i][j] + '</td></tr>');
            }
            tempTd.append(tempInnerTable);
            tempTr.append(tempTd);
            tempTable.append(tempTr);
        }
        obj.append(tempTable);
    }
});