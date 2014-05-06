dataColDef = [{
    'sWidth': '20px',
    'aTargets': [0]
},
{
    'sWidth': '300px',
    'aTargets': [1],
    'fnCreatedCell': function(nTd, sData, oData, iRow, iCol) {
        $(nTd).html('<a class="qid-btn" href="?m=Queue&a=View&queueid=' + oData[0] + '" target="_blank">' + sData + '</a>');
    }
},
{
    'sWidth': '20%',
    'aTargets': [2]
},
{
    'sWidth': '50px',
    'aTargets': [3]
},
{
    'sWidth': '100px',
    'aTargets': [4]
},
{
    'sWidth': '100px',
    'aTargets': [5]
}];

(function() {
    $(document).ready(function() {
        $('.tip-desc').poshytip({
            className: 'tip-yellowsimple',
            showTimeout: 1,
            alignTo: 'target',
            alignX: 'center',
            offsetY: 5,
            allowTipHover: true
        });
        $('#queuelisttable tr').live('mouseover', function() {
            if ($('#fastLinkDiv').length == 0) {
                $(this).children('td:eq(2)').append($('#fastLinkTemp').clone('true').attr('id', 'fastLinkDiv').show());
            } else {
                $(this).children('td:eq(2)').append($('#fastLinkDiv'));
            }
        });
        $('#queueTooltip').tooltip({
            'placement': 'bottom'
        });
    });
})();
