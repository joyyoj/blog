(function() {
    var url = '';
    $('#delete_queue_btn').live('click', function() {
        var parentNode = $(this).parent().parent();
        url = $('.qid-btn', parentNode).attr('href');
        var qid = getQueueId(url);
        $.post('?m=Queue&a=Remove&f=removeQueue', {
            queueid: qid
        }, function() {
            window.location.reload();
        }, 'json');

    });

    function getQueueId(url) {
        var tmp = new Array();
        tmp = url.split('queueid=');
        return tmp[1];
    }
})();