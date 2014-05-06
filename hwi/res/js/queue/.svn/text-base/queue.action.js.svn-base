(function() {
    $(document).ready(function() {
        var url = '';
        $('#delete_queue_btn').live('click', function() {
            var qid = $(this).parent().parent().parent().find('td:eq(1)').text();
            $('#del_proj').modal('show');
            $('a[name="deleteConfirm"]').live('dblclick', function(event) {
                showErrMessage('请求已提交，如未能删除，请确认是否有关联任务.');
                $('#del_proj').modal('hide');
                return;
            }).on('click', function() {
                if (event.type == 'dblclick') {
                    showErrMessage('请求已提交，如未能删除，请确认是否有关联任务.');
                    $('#del_proj').modal('hide');
                    return;
                } else if (event.type != 'dblclick') {
                    $('#del_proj').modal('hide');
                    $.post('?m=Queue&a=Remove&f=removeQueue', {
                        'queueid': qid
                    }, function(ret) {
                        if (1 == ret) {
                            window.location.reload();
                            showMessage('删除成功！');
                        } else if (0 == ret) {
                            showErrMessage('删除失败！请确认是否有关联任务.');
                        }
                    }).error(function() {
                        showErrMessage('系统出现异常,请联系管理员');
                    });
                }
            });
        });

        $('#edit_queue_btn').live('click', function() {
            var qid = getQueueUrl(this);
            window.location.href = '?m=Queue&a=Edit&queueid=' + qid;
        });

    });

    function getQueueUrl(obj) {
        var parentNode = $(obj).parent().parent();
        var url = $('.qid-btn', parentNode).attr('href');
        var qid = getQueueId(url);
        return qid;
    }

    function getQueueId(url) {
        var tmp = new Array();
        tmp = url.split('queueid=');
        return tmp[1];
    }
})();
