(function() {
    $(document).ready(function() {
        var qid = $('#queueid').text();
        $.ajax({
            url: '?m=Queue&a=View&f=ajaxFilter',
            data: {
                queueid: qid
            },
            dataType: 'json',
            type: 'post',
            success: function(data) {
                $.each(data,
                function(key, value) {
                    if (key == 'description') {
                        $('#' + key).html(value);
                        $('#' + key).attr('value', value);
                    } else if (key == 'type' || key == 'status') {
                        if (value == 1) {
                            $('#' + key).text('是');
                        } else if (value == 0) {
                            $('#' + key).text('否');
                        }
                    } else {
                        $('#' + key).html(value);
                    }
                })
            }
        });
        $('#queue_submit_btn').attr('href', '?m=Queue&a=Edit&queueid=' + qid);
    });
})();